import type { EmailMessage } from "@/lib/ports/mailer";

import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

import { CONSENT_STATEMENT, type ContactInput } from "./schema";
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
function renderRows(rows: readonly (readonly [string, string])[]): string {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#707070;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:600;word-break:break-word;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-size:14px;margin:0 0 8px;">${body}</table>`;
}
function sectionLabel(text: string): string {
  return `<p style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#707070;margin:28px 0 10px;">${text}</p>`;
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
/**
 * Contexto do momento do aceite — só o que a Server Action já tem em mãos
 * pelo request, sem cookie nem tracking. `ip` e `userAgent` podem faltar em
 * `npm run dev` local; o comprovante registra "não identificado" nesse caso.
 */
export interface ConsentReceiptMeta {
  acceptedAt: Date;
  ip?: string;
  userAgent?: string;
}
/**
 * Comprovante formal do consentimento que o visitante deu ao marcar a
 * caixinha e enviar o formulário. Vai pro e-mail dele, separado da
 * confirmação, pra servir de registro arquivável do aceite (LGPD, art. 8º).
 *
 * Dados institucionais que ainda não existem (CNPJ, endereço, encarregado,
 * política de privacidade) entram como `[ PENDENTE ]` visível — regra 9 do
 * CLAUDE.md: não inventar conteúdo institucional.
 */
export function buildConsentReceiptEmail(
  data: ContactInput,
  meta: ConsentReceiptMeta,
): EmailMessage {
  const acceptedAtLabel = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(meta.acceptedAt);
  const ipLabel = meta.ip && meta.ip !== "unknown" ? meta.ip : "não identificado";
  const uaLabel = meta.userAgent ?? "não identificado";

  const titularRows: [string, string][] = [
    ["Nome", data.nome],
    ["E-mail", data.email],
    ["Telefone", formatPhone(data.telefone)],
    ["Empresa", data.empresa ?? "—"],
  ];
  const controladorRows: [string, string][] = [
    ["Razão social", "UAIdea Agência"],
    ["CNPJ", "[ PENDENTE ]"],
    ["Endereço", "[ PENDENTE ]"],
    ["E-mail", SITE.contact.email],
    ["Instagram", SITE.contact.instagramHandle],
    ["Encarregado (DPO)", "[ PENDENTE ]"],
  ];
  const registroRows: [string, string][] = [
    ["Data e hora", `${acceptedAtLabel} (horário de Brasília)`],
    ["Endereço IP", ipLabel],
    ["Navegador", uaLabel],
  ];

  const rights = [
    "confirmação de que a UAIdea trata seus dados e acesso a esses dados",
    "correção de dados incompletos, inexatos ou desatualizados",
    "anonimização, bloqueio ou eliminação de dados desnecessários ou tratados fora da lei",
    "portabilidade e eliminação dos dados tratados com base neste consentimento",
    "informação sobre com quem a UAIdea compartilhou seus dados e sobre a consequência de negar o consentimento",
    "revogação do consentimento a qualquer momento",
  ];
  const rightsHtml = rights
    .map((item) => `<li style="margin:0 0 6px;">${escapeHtml(item)}</li>`)
    .join("");

  const html = wrapEmailShell(`
    <h1 style="font-size:20px;margin:0 0 12px;color:${COLOR.p5};">Comprovante de consentimento</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 4px;">
      Este documento registra o consentimento que você forneceu ao enviar o formulário de
      contato do site da UAIdea Agência. Guarde-o para seus registros.
    </p>

    ${sectionLabel("Quem forneceu o consentimento")}
    ${renderRows(titularRows)}

    ${sectionLabel("O que foi aceito")}
    <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
      No envio do formulário, você marcou de forma ativa a declaração abaixo. A caixa não vinha
      pré-marcada.
    </p>
    <p style="font-size:15px;line-height:1.6;font-style:italic;background:${COLOR.c1};border-left:3px solid ${COLOR.p1};border-radius:4px;padding:12px 16px;margin:0 0 8px;">
      ${escapeHtml(CONSENT_STATEMENT)}
    </p>

    ${sectionLabel("Controlador dos dados")}
    ${renderRows(controladorRows)}

    ${sectionLabel("Dados tratados e finalidade")}
    <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
      A UAIdea trata os dados que você informou no formulário — nome, e-mail, telefone e empresa
      (quando preenchidos), serviço de interesse e o conteúdo da mensagem — além da data e hora
      do envio, do endereço IP e da identificação do navegador registrados neste aceite.
    </p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
      <strong>Finalidade:</strong> responder ao seu contato e conduzir as tratativas sobre o
      serviço de interesse indicado (${escapeHtml(data.servico)}).
    </p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
      <strong>Base legal:</strong> consentimento do titular, conforme o art. 7º, inciso I, da
      Lei nº 13.709/2018 (LGPD).
    </p>

    ${sectionLabel("Compartilhamento e retenção")}
    <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
      Compartilhamento de dados com terceiros e prazo de guarda:
      [ PENDENTE — a política de privacidade da UAIdea ainda não foi publicada ].
    </p>

    ${sectionLabel("Seus direitos (art. 18 da LGPD)")}
    <ul style="font-size:14px;line-height:1.6;margin:0 0 8px;padding-left:20px;">${rightsHtml}</ul>

    ${sectionLabel("Como revogar o consentimento")}
    <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
      Responda a este e-mail ou escreva para
      <a href="mailto:${SITE.contact.email}" style="color:${COLOR.p1};">${escapeHtml(SITE.contact.email)}</a>
      pedindo a revogação. A revogação não afeta a legalidade do tratamento feito antes do pedido.
    </p>

    ${sectionLabel("Registro técnico do aceite")}
    ${renderRows(registroRows)}

    <p style="font-size:12px;line-height:1.55;color:#707070;margin:28px 0 0;">
      Documento gerado automaticamente pelo site da UAIdea Agência. Dúvidas sobre seus dados:
      ${escapeHtml(SITE.contact.email)}.
    </p>
  `);

  const text = [
    "COMPROVANTE DE CONSENTIMENTO — UAIdea Agência",
    "",
    "Este documento registra o consentimento que você forneceu ao enviar o formulário de contato do site da UAIdea Agência. Guarde-o para seus registros.",
    "",
    "QUEM FORNECEU O CONSENTIMENTO",
    ...titularRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "O QUE FOI ACEITO",
    "No envio do formulário, você marcou de forma ativa a declaração abaixo. A caixa não vinha pré-marcada.",
    `«${CONSENT_STATEMENT}»`,
    "",
    "CONTROLADOR DOS DADOS",
    ...controladorRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "DADOS TRATADOS E FINALIDADE",
    "A UAIdea trata os dados que você informou no formulário — nome, e-mail, telefone e empresa (quando preenchidos), serviço de interesse e o conteúdo da mensagem — além da data e hora do envio, do endereço IP e da identificação do navegador registrados neste aceite.",
    `Finalidade: responder ao seu contato e conduzir as tratativas sobre o serviço de interesse indicado (${data.servico}).`,
    "Base legal: consentimento do titular, conforme o art. 7º, inciso I, da Lei nº 13.709/2018 (LGPD).",
    "",
    "COMPARTILHAMENTO E RETENÇÃO",
    "Compartilhamento de dados com terceiros e prazo de guarda: [ PENDENTE — a política de privacidade da UAIdea ainda não foi publicada ].",
    "",
    "SEUS DIREITOS (ART. 18 DA LGPD)",
    ...rights.map((item) => `- ${item}`),
    "",
    "COMO REVOGAR O CONSENTIMENTO",
    `Responda a este e-mail ou escreva para ${SITE.contact.email} pedindo a revogação. A revogação não afeta a legalidade do tratamento feito antes do pedido.`,
    "",
    "REGISTRO TÉCNICO DO ACEITE",
    ...registroRows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Documento gerado automaticamente pelo site da UAIdea Agência. Dúvidas sobre seus dados: ${SITE.contact.email}.`,
  ].join("\n");

  return {
    to: data.email,
    subject: "Comprovante de consentimento — UAIdea Agência",
    html,
    text,
  };
}
