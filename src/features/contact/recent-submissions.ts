import "server-only";

/**
 * Anti-duplicata do formulário de contato: guarda uma digital curta de
 * cada envio **que virou e-mail** (IP + e-mail + mensagem) e ignora
 * repetição do mesmo conteúdo dentro de poucos minutos. Cobre
 * duplo-clique, retry automático do navegador e replay ingênuo de um POST
 * capturado — sem depender de JS no cliente.
 *
 * A digital só é gravada depois do envio dar certo (`rememberSubmission`),
 * nunca no meio da tentativa — assim uma falha transitória do mailer não
 * "engole" o reenvio legítimo do visitante.
 *
 * Em memória, por instância (mesma limitação de `rate-limit.ts`). Perder a
 * digital num cold start só reabre a janela de repetição por alguns
 * minutos — risco baixo o suficiente pra não valer armazenamento externo.
 */

const WINDOW_MS = 5 * 60_000;
const SWEEP_EVERY_CALLS = 200;

/** digital -> timestamp do último envio que virou e-mail com aquele conteúdo */
const seen = new Map<string, number>();
let callsSinceSweep = 0;

function fingerprint(parts: readonly string[]): string {
  // Hash não-criptográfico (FNV-1a) — só pra não guardar e-mail/texto cru
  // em memória e manter a chave curta. Não é segredo, é deduplicação.
  const raw = parts.join(" ").toLowerCase().replace(/\s+/g, " ").trim();
  let hash = 0x811c9dc5;
  for (const ch of raw) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * `true` se este exato conteúdo já virou e-mail há menos de 5 min — nesse
 * caso quem chamou deve tratar como sucesso silencioso e não reenviar.
 * Não grava nada; só consulta.
 */
export function isRecentDuplicate(parts: readonly string[]): boolean {
  const now = Date.now();

  if (++callsSinceSweep >= SWEEP_EVERY_CALLS) {
    callsSinceSweep = 0;
    for (const [key, ts] of seen) {
      if (now - ts >= WINDOW_MS) {
        seen.delete(key);
      }
    }
  }

  const previous = seen.get(fingerprint(parts));
  return previous !== undefined && now - previous < WINDOW_MS;
}

/** Registra que este conteúdo acabou de virar e-mail — chamar após o envio dar certo. */
export function rememberSubmission(parts: readonly string[]): void {
  seen.set(fingerprint(parts), Date.now());
}
