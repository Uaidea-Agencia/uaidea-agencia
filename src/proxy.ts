import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

/**
 * Camada de proxy — roda no servidor antes de qualquer rota renderizar,
 * para todo request que bater no matcher abaixo.
 *
 * Duas responsabilidades hoje:
 *
 * 1. **Teto global de requisições por IP** (anti-"segurar F5"): impede que
 *    um mesmo cliente recarregando a página em loop vire uma enxurrada de
 *    invocação de função na Vercel. É um teto grosso — navegação humana
 *    normal (com prefetch de RSC e tudo) não chega perto. Estado em
 *    memória, por instância (ver nota mais abaixo).
 *
 * 2. **Esqueleto de autenticação** para quando existir área logada — hoje
 *    não bloqueia nada (`PROTECTED_PREFIXES` vazio).
 *
 * Sobre "load balancing": não há o que implementar aqui. A Vercel já
 * distribui o tráfego entre instâncias serverless/edge automaticamente. O
 * que dá pra fazer em código é (a) servir página **estática** do CDN em
 * vez de função — as páginas deste site são estáticas — e (b) barrar
 * abuso antes de virar invocação de função, que é o item 1.
 *
 * Sobre o estado em memória: cada instância da Vercel tem o seu próprio
 * contador, que zera a cada cold start. Cobre o caso comum (um IP
 * martelando a mesma instância quente). Para um teto forte e coordenado
 * entre instâncias, trocar `hits` por Vercel KV / Upstash Redis. A doc do
 * Next desaconselha o proxy depender de módulo compartilhado com o app
 * ("should not rely on shared modules or globals"), por isso o limitador
 * vive aqui, isolado, e não reusa `src/lib/rate-limit.ts`.
 *
 * No Next.js 16 este arquivo substitui o antigo `middleware.ts`: o
 * convention file foi renomeado de `middleware` para `proxy` (mesma API,
 * export renomeado). Ver node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 *
 * Importante (Next.js 16): o proxy não é a única linha de defesa — Server
 * Actions são tratadas como POST na própria rota onde são chamadas, então
 * um matcher que exclui um caminho também pula as Server Actions daquele
 * caminho. Sempre validar sessão/autorização dentro de cada Server Action
 * protegida também, nunca só aqui.
 */

// --- Teto global de requisições por IP -----------------------------------

/** Requisições de página toleradas por IP dentro da janela. */
const RATE_LIMIT_MAX = Number(process.env.PROXY_RATE_LIMIT_RPM) || 120;
const RATE_LIMIT_WINDOW_MS = 60_000;
/** `PROXY_RATE_LIMIT_DISABLED=1` desliga o teto (teste de carga próprio, debug). */
const RATE_LIMIT_DISABLED = process.env.PROXY_RATE_LIMIT_DISABLED === "1";

/** IP -> timestamps das requisições recentes (janela deslizante). */
const hits = new Map<string, number[]>();
let callsSinceSweep = 0;

/**
 * `x-forwarded-for` só é confiável atrás de um proxy que preenche o IP
 * real — em produção é a borda da Vercel. Túnel de porta / preview de
 * editor já mandaram valores sintéticos ("1") nesse header; sem esta
 * checagem, clientes diferentes cairiam no mesmo balde. Se não der pra
 * identificar o IP, o teto é ignorado (fail-open) — melhor não limitar do
 * que limitar todo mundo junto.
 */
function isPlausibleIp(value: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value) || value.includes(":");
}

function clientIp(request: NextRequest): string | null {
  const raw =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "";
  return raw !== "" && isPlausibleIp(raw) ? raw : null;
}

/** Registra o request de `ip` e diz se ele passou do teto na janela. */
function overRateLimit(ip: string): boolean {
  const now = Date.now();

  // Faxina barata: a cada 500 chamadas, descarta IPs inativos há > 1 janela.
  if (++callsSinceSweep >= 500) {
    callsSinceSweep = 0;
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

// --- Autenticação (esqueleto, inativo) ----------------------------------

const SESSION_COOKIE_NAME = "uaidea.session";
const PROTECTED_PREFIXES: readonly string[] = [];
const LOGIN_PATH = "/login";

export function proxy(request: NextRequest) {
  // Só recarregar página conta pro teto. Server Actions (POST) têm limite
  // próprio dentro da action, com mensagem melhor pro visitante.
  if (
    !RATE_LIMIT_DISABLED &&
    (request.method === "GET" || request.method === "HEAD") &&
    !request.nextUrl.pathname.startsWith("/_next/data")
  ) {
    const ip = clientIp(request);
    if (ip && overRateLimit(ip)) {
      return new NextResponse("Muitas requisições em pouco tempo. Aguarde um instante.", {
        status: 429,
        headers: {
          "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1000),
          "Cache-Control": "no-store",
        },
      });
    }
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) {
    return NextResponse.next();
  }
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (hasSession) {
    return NextResponse.next();
  }
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
export const config = {
  // Nunca roda em api, assets estáticos ou arquivos de metadata — só em
  // rotas de página.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
