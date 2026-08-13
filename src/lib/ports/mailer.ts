export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  priority?: "high";
}
export interface Mailer {
  send(message: EmailMessage): Promise<void>;
}
