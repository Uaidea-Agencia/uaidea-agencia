import "server-only";

import type { EmailMessage, Mailer } from "@/lib/ports/mailer";
export class ConsoleMailer implements Mailer {
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
