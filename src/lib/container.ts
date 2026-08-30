import "server-only";

import type { Alerter } from "@/lib/ports/alerter";
import type { Mailer } from "@/lib/ports/mailer";
import type { ProjectRepository } from "@/lib/ports/project-repository";

import { ConsoleMailer } from "@/lib/adapters/console-mailer";
import { DiscordAlerter } from "@/lib/adapters/discord-alerter";
import { FileProjectRepository } from "@/lib/adapters/file-project-repository";
import { GmailMailer } from "@/lib/adapters/gmail-mailer";
import { NoopAlerter } from "@/lib/adapters/noop-alerter";
export const projectRepository: ProjectRepository = new FileProjectRepository();

/**
 * `MAILER_DRY_RUN=true` troca o envio real pelo `ConsoleMailer` (só loga no
 * terminal) — recurso de dev, e é o valor que o `.env.example` traz.
 *
 * Num deploy de **produção** na Vercel (`VERCEL_ENV === "production"`) a flag
 * é ignorada de propósito: já aconteceu de ela ficar ligada no painel e o
 * formulário "funcionar" (toast de sucesso) sem mandar e-mail nenhum — lead,
 * confirmação e comprovante de consentimento sumindo sem erro nem alerta.
 * Em produção o envio é sempre o `GmailMailer`; se faltar credencial ele
 * estoura no primeiro envio (erro visível pro visitante + alerta no Discord),
 * que é um modo de falha bem melhor do que engolir o lead.
 *
 * Preview da Vercel e `next dev` continuam respeitando a flag normalmente.
 */
function resolveMailer(): { instance: Mailer; label: string } {
  const dryRun = process.env.MAILER_DRY_RUN === "true";
  if (dryRun && process.env.VERCEL_ENV === "production") {
    console.error(
      "[mailer] MAILER_DRY_RUN=true ignorado em produção (Vercel) — usando GmailMailer. " +
        "Remova essa variável do ambiente de Production no painel da Vercel.",
    );
    return { instance: new GmailMailer(), label: "GmailMailer (MAILER_DRY_RUN ignorado)" };
  }
  return dryRun
    ? { instance: new ConsoleMailer(), label: "ConsoleMailer (MAILER_DRY_RUN)" }
    : { instance: new GmailMailer(), label: "GmailMailer" };
}

const resolvedMailer = resolveMailer();
export const mailer: Mailer = resolvedMailer.instance;
/** Nome legível do adapter de e-mail em uso — pra logar no fluxo de contato. */
export const mailerLabel = resolvedMailer.label;
// Loga uma vez por cold start — deixa explícito no log da Vercel qual adapter
// está no ar, pra um "não chegou e-mail" não virar caça ao tesouro de novo.
console.info(`[mailer] adapter ativo: ${resolvedMailer.label}`);
// Dispara quando o envio de e-mail falha de verdade (fora do dry-run) — canal
// independente do Gmail, pra falha de e-mail não virar falha de aviso também.
// Sem DISCORD_WEBHOOK_URL configurada, cai num no-op (só o log do servidor).
export const alerter: Alerter = process.env.DISCORD_WEBHOOK_URL
  ? new DiscordAlerter()
  : new NoopAlerter();
