import "server-only";

import type { Mailer } from "@/lib/ports/mailer";
import type { ProjectRepository } from "@/lib/ports/project-repository";

import { ConsoleMailer } from "@/lib/adapters/console-mailer";
import { FileProjectRepository } from "@/lib/adapters/file-project-repository";
import { GmailMailer } from "@/lib/adapters/gmail-mailer";

/**
 * Composition root — único lugar do projeto que conhece as implementações
 * concretas dos ports em `lib/ports/`.
 *
 * Nenhum componente ou Server Action deve importar um adapter de
 * `lib/adapters/` diretamente; sempre resolver por aqui. Trocar de
 * implementação (arquivo → Prisma, Gmail → Resend) vira uma linha aqui,
 * não uma reescrita.
 *
 * Quando o banco chegar:
 *   export const projectRepository: ProjectRepository = new PrismaProjectRepository();
 */
export const projectRepository: ProjectRepository = new FileProjectRepository();

/**
 * MAILER_DRY_RUN=true troca pro ConsoleMailer — imprime o e-mail no
 * terminal em vez de enviar. É como testar o formulário de contato
 * inteiro sem credencial de Gmail nenhuma configurada (ver README).
 *
 * Quando trocar por Resend ou SES:
 *   export const mailer: Mailer = new ResendMailer();
 */
export const mailer: Mailer =
  process.env.MAILER_DRY_RUN === "true" ? new ConsoleMailer() : new GmailMailer();
