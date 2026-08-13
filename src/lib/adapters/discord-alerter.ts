import "server-only";

import type { AlertMessage, Alerter } from "@/lib/ports/alerter";
const DISCORD_CONTENT_LIMIT = 1900;
export class DiscordAlerter implements Alerter {
  async notify(message: AlertMessage): Promise<void> {
    const url = process.env.DISCORD_WEBHOOK_URL;
    if (!url) {
      throw new Error("DISCORD_WEBHOOK_URL precisa estar definida (.env.local).");
    }
    const lines = Object.entries(message.details)
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
      .map(([key, value]) => `**${key}:** ${value}`);
    const content = [`🚨 **${message.title}**`, ...lines]
      .join("\n")
      .slice(0, DISCORD_CONTENT_LIMIT);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error(`Webhook do Discord respondeu ${String(response.status)}`);
    }
  }
}
