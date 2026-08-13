import "server-only";

import type { EmailMessage, Mailer } from "@/lib/ports/mailer";

/**
 * Mailer de desenvolvimento — não envia nada de verdade, só imprime no
 * terminal. Ativado com MAILER_DRY_RUN=true (ver .env.example e README).
 * Existe exatamente pra testar o formulário de contato sem gastar cota
 * do Gmail nem precisar de credencial nenhuma configurada.
 */
export class ConsoleMailer implements Mailer {
  // Sem await de verdade — só console.log. O método continua Promise<void>
  // porque implementa Mailer (a interface é assíncrona pensando no
  // GmailMailer real, que faz I/O de rede).
  send(message: EmailMessage): Promise<void> {
    console.log(
      [
        "\n─── [MAILER_DRY_RUN] e-mail não enviado, só simulado ───",
        `Para: ${message.to}`,
        message.replyTo ? `Reply-To: ${message.replyTo}` : null,
        `Assunto: ${message.subject}`,
        message.priority ? `Prioridade: ${message.priority}` : null,
        "",
        message.text,
        "──────────────────────────────────────────────────────\n",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    return Promise.resolve();
  }
}
