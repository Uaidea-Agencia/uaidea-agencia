/**
 * URLs base do site, agrupadas por domínio de uso — mesma ideia do
 * bases.ts de outros projetos da casa (agrupar por domínio, ler de env),
 * adaptada ao formato de config já usado neste repositório (objeto
 * `as const`, sem client próprio).
 *
 * Toda env tem fallback de desenvolvimento, então o build nunca quebra
 * por variável ausente — em produção a env real deve estar setada (ver
 * .env.example).
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  // Vercel expõe o domínio do deploy sem protocolo — cobre preview e
  // produção quando a env pública ainda não foi configurada no projeto.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}
function joinPath(base: string, path: string): string {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
const siteUrl = resolveSiteUrl();
export const BASES = {
  // Origem pública do site — canonical, metadataBase, sitemap, og:image.
  site: {
    url: siteUrl,
    path: (path: string) => joinPath(siteUrl, path),
  },
  // Rotas internas em src/app/api. Só faz sentido como URL absoluta
  // quando algo fora do próprio Next precisa chamar essas rotas
  // (webhook de terceiro, teste externo) — dentro da aplicação, chame a
  // lógica direto, sem fetch para si mesmo.
  api: {
    url: joinPath(siteUrl, "/api"),
    path: (path: string) => joinPath(siteUrl, joinPath("/api", path)),
  },
} as const;
