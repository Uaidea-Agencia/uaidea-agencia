"use server";

import { headers } from "next/headers";

import { SITE } from "@/config/site";
import { alerter, mailer } from "@/lib/container";
import { isRateLimited } from "@/lib/rate-limit";

import type { ContactActionState } from "./types";

import { buildConfirmationEmail, buildLeadEmail } from "./email-templates";
import { findProfaneField } from "./profanity";
import { contactSchema } from "./schema";
const MIN_FILL_TIME_MS = 3000;
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
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success" };
  }
  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return { status: "success" };
  }
  const headersList = await headers();
  const { ip, userAgent, referer, location } = getRequestContext(headersList);
  if (isRateLimited(ip)) {
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
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: "error", message: "Confira os campos destacados.", fieldErrors };
  }
  const data = parsed.data;
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
    await mailer.send(buildLeadEmail(data));
    await mailer.send(buildConfirmationEmail(data));
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
  return { status: "success" };
}
