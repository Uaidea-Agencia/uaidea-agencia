"use server";

import { headers } from "next/headers";

import { SITE } from "@/config/site";
import { mailer } from "@/lib/container";
import { isRateLimited } from "@/lib/rate-limit";

import type { ContactActionState } from "./types";

import { buildConfirmationEmail, buildLeadEmail } from "./email-templates";
import { contactSchema } from "./schema";

const MIN_FILL_TIME_MS = 3000;

export async function submitContactAction(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Honeypot e tempo mínimo de preenchimento ficam fora do schema
  // público de propósito — não são campos que a pessoa vê ou corrige
  // (ver comentário em schema.ts). Bot pego aqui recebe "sucesso" de
  // propósito, pra não aprender a se adaptar.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success" };
  }

  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return { status: "success" };
  }

  // Rate limit simples por IP — ver lib/rate-limit.ts pras limitações em serverless.
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
    // Nunca stack trace pro cliente — log no servidor, mensagem genérica
    // e o mailto como saída.
    console.error("[contact] falha ao enviar e-mail", error);
    return {
      status: "error",
      message: `Não deu pra enviar agora pelo site. Manda direto pra ${SITE.contact.email}.`,
    };
  }

  return { status: "success" };
}
