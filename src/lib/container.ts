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
export const mailer: Mailer =
  process.env.MAILER_DRY_RUN === "true" ? new ConsoleMailer() : new GmailMailer();
// Dispara quando o envio de e-mail falha de verdade (fora do dry-run) — canal
// independente do Gmail, pra falha de e-mail não virar falha de aviso também.
// Sem DISCORD_WEBHOOK_URL configurada, cai num no-op (só o log do servidor).
export const alerter: Alerter = process.env.DISCORD_WEBHOOK_URL
  ? new DiscordAlerter()
  : new NoopAlerter();
