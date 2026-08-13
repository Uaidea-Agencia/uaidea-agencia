import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

/**
 * Camada de proxy — roda no servidor antes de qualquer rota renderizar,
 * para todo request que bater no matcher abaixo.
 *
 * No Next.js 16 este arquivo substitui o antigo `middleware.ts`: o
 * convention file foi renomeado de `middleware` para `proxy` (mesma API,
 * export renomeado). Ver node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 *
 * O site ainda não tem login, então esta função hoje não bloqueia nada —
 * só existe a infraestrutura (matcher, leitura de cookie de sessão,
 * redirecionamento com retorno) pronta para quando houver autenticação.
 *
 * Para ativar quando o login existir:
 * 1. Trocar SESSION_COOKIE_NAME pelo nome real do cookie de sessão.
 * 2. Listar os prefixos a proteger em PROTECTED_PREFIXES (ex.: ["/admin"]).
 * 3. Criar a rota de login em src/config/routes.ts e trocar o
 *    placeholder LOGIN_PATH abaixo pela ROUTES real.
 *
 * Importante (Next.js 16): o proxy não é a única linha de defesa — Server
 * Actions são tratadas como POST na própria rota onde são chamadas, então
 * um matcher que exclui um caminho também pula as Server Actions daquele
 * caminho. Sempre validar sessão/autorização dentro de cada Server Action
 * protegida também, nunca só aqui.
 */
const SESSION_COOKIE_NAME = "uaidea.session";
const PROTECTED_PREFIXES: readonly string[] = [];
const LOGIN_PATH = "/login";
export function proxy(request: NextRequest) {
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
