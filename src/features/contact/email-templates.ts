import type { EmailMessage } from "@/lib/ports/mailer";

import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

import type { ContactInput } from "./schema";
const COLOR = {
  p1: "#A600FF",
  p4: "#410064",
  p5: "#1B002A",
  c1: "#F7F7F7",
  c9: "#404040",
};
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function wrapEmailShell(bodyHtml: string): string {
  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:${COLOR.c1};font-family:Arial,Helvetica,sans-serif;color:${COLOR.c9};">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="margin:0 0 24px;font-size:20px;font-weight:800;letter-spacing:-0.01em;color:${COLOR.p1};">
        UAIdea<span style="color:${COLOR.p5};">Agência</span>
      </p>
      ${bodyHtml}
    </div>
  </body>
</html>`;
}
function formatPhone(digits: string | undefined): string {
  if (!digits) return "—";
  return digits.length === 11
    ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    : `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
}
export function buildLeadEmail(data: ContactInput): EmailMessage {
  const rows: [string, string][] = [
    ["Nome", data.nome],
    ["E-mail", data.email],
    ["Telefone", formatPhone(data.telefone)],
    ["Empresa", data.empresa ?? "—"],
    ["Serviço de interesse", data.servico],
  ];
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#707070;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const html = wrapEmailShell(`
    <h1 style="font-size:18px;margin:0 0 16px;">Novo lead pelo site</h1>
    <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px;">${rowsHtml}</table>
    <p style="font-size:13px;color:#707070;margin:0 0 4px;">Mensagem</p>
    <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;background:${COLOR.c1};border:1px solid #DEDEDE;border-radius:8px;padding:16px;">${escapeHtml(data.mensagem)}</p>
  `);
  const text = [
    "Novo lead pelo site",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensagem:",
    data.mensagem,
  ].join("\n");
  return {
    to: SITE.contact.email,
    subject: `[LEAD SITE] ${data.nome} — ${data.servico}`,
    html,
    text,
    replyTo: data.email,
    priority: "high",
  };
}
export function buildConfirmationEmail(data: ContactInput): EmailMessage {
  const firstName = data.nome.trim().split(/\s+/)[0] ?? data.nome;
  const html = wrapEmailShell(`
    <h1 style="font-size:20px;margin:0 0 16px;color:${COLOR.p5};">Recebemos sua mensagem, ${escapeHtml(firstName)}.</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
      A gente lê com calma e volta com um próximo passo real pra ${escapeHtml(data.servico).toLowerCase()} —
      não com um roteiro pronto de agência.
    </p>
    <p style="font-size:13px;color:#707070;margin:0 0 4px;">O que você mandou</p>
    <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;background:${COLOR.c1};border:1px solid #DEDEDE;border-radius:8px;padding:16px;margin:0 0 20px;">${escapeHtml(data.mensagem)}</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 4px;">
      Se for urgente, é só responder este e-mail ou chamar no Instagram
      <a href="${ROUTES.instagram}" style="color:${COLOR.p1};">${escapeHtml(SITE.contact.instagramHandle)}</a>.
    </p>
  `);
  const text = [
    `Recebemos sua mensagem, ${firstName}.`,
    "",
    `A gente lê com calma e volta com um próximo passo real pra ${data.servico.toLowerCase()} — não com um roteiro pronto de agência.`,
    "",
    "O que você mandou:",
    data.mensagem,
    "",
    `Se for urgente, é só responder este e-mail ou chamar no Instagram ${SITE.contact.instagramHandle}.`,
  ].join("\n");
  return {
    to: data.email,
    subject: "Recebemos sua mensagem — UAIdea Agência",
    html,
    text,
  };
}
