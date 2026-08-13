import "server-only";

import type { AlertMessage, Alerter } from "@/lib/ports/alerter";
export class NoopAlerter implements Alerter {
  notify(_message: AlertMessage): Promise<void> {
    return Promise.resolve();
  }
}
