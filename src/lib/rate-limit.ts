import "server-only";

/**
 * Limitador de taxa por janela deslizante, em memória e por instância.
 *
 * Cada instância serverless da Vercel tem o seu próprio `Map` — não há
 * estado compartilhado entre elas nem sobrevivência a cold start. Na
 * prática isso cobre o caso comum (um mesmo IP repetindo request na
 * mesma instância quente). Para bloqueio forte e coordenado entre
 * instâncias, trocar o armazenamento por Vercel KV / Upstash Redis
 * mantendo esta mesma assinatura (mesma ideia dos adapters de
 * mailer/alerter em `src/lib`).
 *
 * O `proxy.ts` NÃO importa este módulo de propósito: a doc do Next avisa
 * que o proxy pode rodar isolado do código de render ("should not rely on
 * shared modules or globals"), então ele carrega a própria cópia mínima
 * da mesma lógica.
 */

export interface RateLimitRule {
  /** Tamanho da janela deslizante, em milissegundos. */
  windowMs: number;
  /** Máximo de hits tolerados dentro da janela. */
  max: number;
}

export interface RateLimitResult {
  /** `true` quando o hit atual passou do teto — quem chamou deve barrar. */
  limited: boolean;
  /** Hits que ainda cabem na janela (0 quando `limited`). */
  remaining: number;
  /** Espera sugerida, em ms, até um slot liberar (0 quando não limitado). */
  retryAfterMs: number;
}

/** bucket -> (chave -> timestamps dos hits recentes) */
const buckets = new Map<string, Map<string, number[]>>();

// Faxina periódica: sem isso, um IP que bateu uma vez e sumiu (crawler,
// scan de porta) ficaria ocupando memória pra sempre.
const SWEEP_EVERY_CALLS = 500;
const MAX_TRACKED_AGE_MS = 86_400_000; // 24 h — maior janela que usamos
let callsSinceSweep = 0;

function sweep(now: number): void {
  for (const [bucketName, entries] of buckets) {
    for (const [key, timestamps] of entries) {
      const alive = timestamps.filter((t) => now - t < MAX_TRACKED_AGE_MS);
      if (alive.length === 0) {
        entries.delete(key);
      } else if (alive.length !== timestamps.length) {
        entries.set(key, alive);
      }
    }
    if (entries.size === 0) {
      buckets.delete(bucketName);
    }
  }
}

/**
 * Registra um hit de `key` no `bucket` e diz se ele estourou a `rule`.
 * Sempre conta o hit atual (mesma semântica do `isRateLimited` original).
 */
export function rateLimit(bucket: string, key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();

  if (++callsSinceSweep >= SWEEP_EVERY_CALLS) {
    callsSinceSweep = 0;
    sweep(now);
  }

  let entries = buckets.get(bucket);
  if (!entries) {
    entries = new Map<string, number[]>();
    buckets.set(bucket, entries);
  }

  const recent = (entries.get(key) ?? []).filter((t) => now - t < rule.windowMs);
  recent.push(now);
  entries.set(key, recent);

  const limited = recent.length > rule.max;
  const oldest = recent[0] ?? now;
  return {
    limited,
    remaining: Math.max(0, rule.max - recent.length),
    retryAfterMs: limited ? Math.max(0, rule.windowMs - (now - oldest)) : 0,
  };
}

/**
 * Verificação de rajada do formulário de contato: no máximo 3 envios por
 * minuto por IP. Mantida como função própria porque é o contrato que
 * `submitContactAction` já usa.
 */
export function isRateLimited(key: string): boolean {
  return rateLimit("contact:burst", key, { windowMs: 60_000, max: 3 }).limited;
}
