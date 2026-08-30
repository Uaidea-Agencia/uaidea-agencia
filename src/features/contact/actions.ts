"use server";

import { headers } from "next/headers";

import { SITE } from "@/config/site";
import { alerter, mailer, mailerLabel } from "@/lib/container";
import { isRateLimited, rateLimit } from "@/lib/rate-limit";

import type { ContactActionState } from "./types";

import {
  buildConfirmationEmail,
  buildConsentReceiptEmail,
  buildLeadEmail,
} from "./email-templates";
import { findProfaneField } from "./profanity";
import { isRecentDuplicate, rememberSubmission } from "./recent-submissions";
import { contactSchema, type ContactInput } from "./schema";
const MIN_FILL_TIME_MS = 3000;
type ContactParseError = Extract<
  ReturnType<typeof contactSchema.safeParse>,
  { success: false }
>["error"];
/** Primeiro erro de cada campo, no formato que o formulário consome. */
function firstErrorPerField(error: ContactParseError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
/**
 * Camadas anti-abuso que só fazem sentido depois do conteúdo validado:
 * duplicata do mesmo envio e teto sustentado por IP (hora/dia). A rajada
 * de 3/min e o honeypot ficam antes, no corpo da action.
 *
 * Devolve o estado a retornar quando alguma camada barra, ou `null` pra
 * seguir com o envio. Duplicata volta como `success` de propósito — não é
 * erro do visitante, e não faz sentido reenviar os dois e-mails.
 */
function checkSustainedAbuse(ip: string, data: ContactInput): ContactActionState | null {
  if (isRecentDuplicate([ip, data.email, data.mensagem])) {
    console.info(
      "[contact] duplicata recente (mesmo IP + e-mail + mensagem em < 5 min) — retorna sucesso sem reenviar",
    );
    return { status: "success" };
  }
  // No máximo 6 envios por hora e 15 por dia do mesmo IP. Barra quem fica
  // remandando o formulário o dia todo sem cair no limite de 1 minuto — e
  // segura a cota de envio do Gmail (500/dia na conta gratuita).
  const perHour = rateLimit("contact:hour", ip, { windowMs: 3_600_000, max: 6 });
  const perDay = rateLimit("contact:day", ip, { windowMs: 86_400_000, max: 15 });
  if (perHour.limited || perDay.limited) {
    console.warn(
      `[contact] teto sustentado por IP atingido (hora: ${perHour.limited}, dia: ${perDay.limited})`,
    );
    return {
      status: "error",
      message: `Você já enviou várias mensagens hoje. Se for urgente, escreve direto pra ${SITE.contact.email}.`,
    };
  }
  return null;
}
/**
 * Alerta é sempre "melhor esforço": uma falha ao notificar (webhook fora do
 * ar, env não configurada) nunca pode derrubar a resposta pro visitante —
 * só loga à parte. Centralizado aqui pra não repetir o try/catch em cada
 * ponto que dispara um alerta.
 */
async function notifyBestEffort(logLabel: string, message: Parameters<typeof alerter.notify>[0]) {
  try {
    await alerter.notify(message);
  } catch (alertError) {
    console.error(`[contact] falha ao notificar ${logLabel}`, alertError);
  }
}
/**
 * Contexto de request pra enriquecer alerta — só dado que o Next já recebe
 * de graça via header, sem cookie, sem serviço externo, sem script de
 * tracking no client. Localização vem de `x-vercel-ip-*`, preenchido pelo
 * edge da própria Vercel; não existe em `npm run dev` local, por isso os
 * campos ficam `undefined` (o `DiscordAlerter` já filtra valor vazio).
 */
/**
 * `x-forwarded-for` só é confiável atrás de um proxy que sabe o IP real do
 * visitante — em produção (Vercel) é a borda quem preenche. Em `npm run
 * dev` local, atrás de outro tipo de proxy (túnel de porta, preview do
 * editor), já apareceu esse header preenchido com placeholder tipo "1" em
 * vez de IP — provavelmente um hop count ou valor sintético de quem está
 * na frente, não do Next. Sem essa checagem, isso vazava pro alerta como
 * se fosse IP de verdade (e, pior, virava a chave do rate limit — várias
 * pessoas diferentes cairiam no mesmo balde "1").
 */
function isPlausibleIp(value: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value) || value.includes(":");
}
function getRequestContext(headersList: Awaited<ReturnType<typeof headers>>) {
  const rawIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip")?.trim() ??
    "";
  const ip = rawIp && isPlausibleIp(rawIp) ? rawIp : "unknown";
  const userAgent = headersList.get("user-agent") ?? undefined;
  const referer = headersList.get("referer") ?? undefined;
  const rawCity = headersList.get("x-vercel-ip-city");
  const location =
    [
      rawCity ? decodeURIComponent(rawCity) : undefined,
      headersList.get("x-vercel-ip-country-region"),
      headersList.get("x-vercel-ip-country"),
    ]
      .filter(Boolean)
      .join(", ") || undefined;
  return { ip, userAgent, referer, location };
}
export async function submitContactAction(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  console.info(`[contact] submit recebido — mailer: ${mailerLabel}`);
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    console.warn("[contact] honeypot 'website' preenchido — descartado como bot, retorna sucesso");
    return { status: "success" };
  }
  const startedAt = Number(formData.get("startedAt"));
  const fillDelta = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || fillDelta < MIN_FILL_TIME_MS) {
    console.warn(
      `[contact] descartado pelo tempo mínimo de preenchimento — ${
        Number.isFinite(startedAt) ? `${fillDelta}ms < ${MIN_FILL_TIME_MS}ms` : "startedAt ausente"
      }, retorna sucesso`,
    );
    return { status: "success" };
  }
  const headersList = await headers();
  const { ip, userAgent, referer, location } = getRequestContext(headersList);
  if (isRateLimited(ip)) {
    console.warn("[contact] rate-limit de rajada (3/min por IP) atingido");
    return {
      status: "error",
      message: "Muitas tentativas em pouco tempo. Espera um minuto e tenta de novo.",
    };
  }
  const parsed = contactSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    telefone: formData.get("telefone") ?? undefined,
    empresa: formData.get("empresa") ?? undefined,
    servico: formData.get("servico"),
    mensagem: formData.get("mensagem"),
    consentimento: formData.get("consentimento") === "on",
  });
  if (!parsed.success) {
    console.warn("[contact] validação falhou", firstErrorPerField(parsed.error));
    return {
      status: "error",
      message: "Confira os campos destacados.",
      fieldErrors: firstErrorPerField(parsed.error),
    };
  }
  const data = parsed.data;

  const sustainedAbuse = checkSustainedAbuse(ip, data);
  if (sustainedAbuse) {
    return sustainedAbuse;
  }

  const profaneField = findProfaneField(data);
  if (profaneField) {
    // Não deixa passar pro e-mail, mas quem cuida do formulário precisa
    // saber que alguém tentou — mesmo canal de alerta usado pra falha de
    // envio, pra não depender de ninguém acompanhar log ao vivo.
    await notifyBestEffort("alerta de linguagem imprópria", {
      title: "Formulário de contato bloqueado por linguagem imprópria",
      details: {
        Campo: profaneField,
        Nome: data.nome,
        "E-mail": data.email,
        Telefone: data.telefone,
        Empresa: data.empresa,
        Serviço: data.servico,
        Mensagem: data.mensagem,
        IP: ip,
        Localização: location,
        "User-Agent": userAgent,
        Referer: referer,
      },
    });
    return {
      status: "error",
      message: "Sua mensagem contém linguagem imprópria. Ajusta o texto e manda de novo.",
      fieldErrors: { [profaneField]: "Revise o texto — parece ter linguagem imprópria." },
    };
  }
  try {
    console.info(`[contact] enviando lead + confirmação via ${mailerLabel}`);
    await mailer.send(buildLeadEmail(data));
    console.info("[contact] lead enviado");
    await mailer.send(buildConfirmationEmail(data));
    console.info("[contact] confirmação enviada");
    // Só agora a digital vale — reenvio idêntico nos próximos 5 min é
    // duplicata; falha acima não grava nada, pra não engolir o retry.
    rememberSubmission([ip, data.email, data.mensagem]);
  } catch (error) {
    console.error("[contact] falha ao enviar e-mail", error);
    // O visitante já vê o erro (toast + mailto abaixo), mas quem precisa
    // saber de verdade é a agência — sem isso, um lead perdido só aparece
    // no log da Vercel, que ninguém fica olhando. Canal separado do Gmail
    // de propósito: se o Gmail é o que falhou, avisar por e-mail não ajuda.
    await notifyBestEffort("alerta de e-mail", {
      title: "Falha ao enviar e-mail do formulário de contato",
      details: {
        Nome: data.nome,
        "E-mail": data.email,
        Telefone: data.telefone,
        Empresa: data.empresa,
        Serviço: data.servico,
        Mensagem: data.mensagem,
        Erro: error instanceof Error ? error.message : String(error),
        IP: ip,
        Localização: location,
        "User-Agent": userAgent,
        Referer: referer,
      },
    });
    return {
      status: "error",
      message: `Não deu pra enviar agora pelo site. Manda direto pra ${SITE.contact.email}.`,
    };
  }

  // Comprovante de consentimento (LGPD) pro e-mail do visitante — melhor
  // esforço. O lead e a confirmação já saíram e a digital anti-duplicata já
  // foi gravada; se só o comprovante falhar, avisa a agência pra reenviar à
  // mão, sem transformar um envio que deu certo em erro pro visitante.
  try {
    await mailer.send(buildConsentReceiptEmail(data, { acceptedAt: new Date(), ip, userAgent }));
    console.info("[contact] comprovante de consentimento enviado");
  } catch (error) {
    console.error("[contact] falha ao enviar comprovante de consentimento", error);
    await notifyBestEffort("comprovante de consentimento", {
      title: "Falha ao enviar comprovante de consentimento do formulário",
      details: {
        Nome: data.nome,
        "E-mail": data.email,
        Serviço: data.servico,
        Erro: error instanceof Error ? error.message : String(error),
        IP: ip,
        Localização: location,
      },
    });
  }

  return { status: "success" };
}
