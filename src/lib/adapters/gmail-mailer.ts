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
      priority: message.priority,
    });
  }
}
