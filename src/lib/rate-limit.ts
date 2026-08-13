import "server-only";
const WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 3;
const hits = new Map<string, number[]>();
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}
