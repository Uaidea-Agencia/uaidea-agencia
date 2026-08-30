import type { MetadataRoute } from "next";

/**
 * Serve `/robots.txt`. Libera o conteúdo pra indexação e fecha só o que
 * não é conteúdo (rotas de API) — menos superfície pra crawler significa
 * menos requisição à toa contra a cota da Vercel. O `proxy.ts` já assume
 * que este arquivo existe (o matcher exclui `robots.txt`).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
  };
}
