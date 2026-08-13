import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

import type { EmailMessage, Mailer } from "@/lib/ports/mailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER e GMAIL_APP_PASSWORD precisam estar definidos (.env.local). " +
        "Senha de app do Google exige verificação em duas etapas ativa — ver README.",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

/**
 * Implementa Mailer com Nodemailer sobre SMTP do Gmail. Conta gratuita:
 * até 500 destinatários/dia — suficiente pro volume de um formulário de
 * site (ver docs técnicos do Prompt 6).
 */
export class GmailMailer implements Mailer {
  async send(message: EmailMessage): Promise<void> {
    const user = process.env.GMAIL_USER;
    await getTransporter().sendMail({
      from: `UAIdea Agência <${user}>`,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
      // Nodemailer traduz isso pra Importance/X-Priority/X-MSMail-Priority
      // automaticamente. É sugestão ao cliente de e-mail — o Gmail costuma
      // ignorar na exibição (ver README pro filtro que resolve de verdade).
      priority: message.priority,
    });
  }
}
