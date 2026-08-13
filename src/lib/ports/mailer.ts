export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Pra "responder direto do Gmail" ir pro e-mail do lead, não pra caixa da agência. */
  replyTo?: string;
  /**
   * Sinaliza prioridade ao cliente de e-mail (Importance/X-Priority). É só
   * sugestão — o Gmail costuma ignorar isso na exibição. O jeito confiável
   * de destacar o lead é um filtro no Gmail da agência (ver README).
   */
  priority?: "high";
}

/**
 * Contrato de envio de e-mail. Hoje resolvido por GmailMailer
 * (lib/adapters/gmail-mailer.ts, Nodemailer sobre SMTP do Gmail); trocar
 * por Resend ou SES é um novo adapter implementando isto, não uma
 * reescrita da Server Action.
 */
export interface Mailer {
  send(message: EmailMessage): Promise<void>;
}
