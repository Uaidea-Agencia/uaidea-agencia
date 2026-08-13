import "server-only";

/**
 * Rate limit simples em memória, janela deslizante por chave (IP).
 *
 * ⚠️ Frágil em ambiente serverless: cada instância/cold start tem sua
 * própria memória, então o limite é "por instância", não global — em
 * picos de tráfego, várias instâncias sobem em paralelo e cada uma
 * conta do zero. Suficiente pra frear um bot óbvio batendo na Server
 * Action; não é proteção real contra abuso coordenado. Revisar com
 * Redis (Upstash) ou uma tabela no banco quando houver — aí o contador
 * passa a ser compartilhado entre instâncias.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);

  recent.push(now);
  hits.set(key, recent);

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}
