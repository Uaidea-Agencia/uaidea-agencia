"use server";

import { headers } from "next/headers";

import { SITE } from "@/config/site";
import { alerter, mailer } from "@/lib/container";
import { isRateLimited } from "@/lib/rate-limit";

import type { ContactActionState } from "./types";

import { buildConfirmationEmail, buildLeadEmail } from "./email-templates";
import { contactSchema } from "./schema";
const MIN_FILL_TIME_MS = 3000;
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
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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
  try {
    await mailer.send(buildLeadEmail(data));
    await mailer.send(buildConfirmationEmail(data));
  } catch (error) {
    console.error("[contact] falha ao enviar e-mail", error);
    // O visitante já vê o erro (toast + mailto abaixo), mas quem precisa
    // saber de verdade é a agência — sem isso, um lead perdido só aparece
    // no log da Vercel, que ninguém fica olhando. Canal separado do Gmail
    // de propósito: se o Gmail é o que falhou, avisar por e-mail não ajuda.
    try {
      await alerter.notify({
        title: "Falha ao enviar e-mail do formulário de contato",
        details: {
          Nome: data.nome,
          "E-mail": data.email,
          Telefone: data.telefone,
          Empresa: data.empresa,
          Serviço: data.servico,
          Mensagem: data.mensagem,
          Erro: error instanceof Error ? error.message : String(error),
        },
      });
    } catch (alertError) {
      console.error("[contact] falha ao notificar alerta de e-mail", alertError);
    }
    return {
      status: "error",
      message: `Não deu pra enviar agora pelo site. Manda direto pra ${SITE.contact.email}.`,
    };
  }
  return { status: "success" };
}
