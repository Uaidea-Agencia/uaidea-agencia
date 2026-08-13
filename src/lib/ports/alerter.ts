export interface AlertMessage {
  title: string;
  details: Record<string, string | undefined>;
}
export interface Alerter {
  notify(message: AlertMessage): Promise<void>;
}
