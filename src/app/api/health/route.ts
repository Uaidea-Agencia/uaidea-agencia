import { rateLimit } from "@/lib/rate-limit";

// Checagem de uptime/deploy. Fica fora do alcance do proxy (o matcher pula
// /api), então carrega o próprio teto por IP e responde sem cache — um
// monitor de uptime bate a cada 30–300 s, bem abaixo de 60/min.
export function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown";

  if (rateLimit("health", ip, { windowMs: 60_000, max: 60 }).limited) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }

  return Response.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
