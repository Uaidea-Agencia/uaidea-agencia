import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy — só em produção. Em dev o Next usa `eval` e
 * websocket pro HMR, que uma CSP estrita quebraria.
 *
 * `script-src`/`style-src` ainda com `'unsafe-inline'`: o site tem um
 * script inline `beforeInteractive` (intro-boot-script) e o Motion aplica
 * estilo inline. Endurecer isso com nonce é o próximo passo — precisa
 * gerar o nonce no proxy e propagar. Mesmo sem nonce, esta CSP já fecha
 * `frame-ancestors`, `object-src` e `base-uri`, e restringe de onde vêm
 * imagem, iframe, fonte e conexão. Testar num preview da Vercel antes de
 * ir pra produção (preview roda com NODE_ENV=production, então exercita a
 * CSP; `next dev` não).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com https://i.vimeocdn.com",
  "font-src 'self'",
  "connect-src 'self'",
  // iframe de vídeo do portfólio (VideoFacade) — só carrega no clique.
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Não anunciar a versão do Next em todo response.
  poweredByHeader: false,

  images: {
    // Thumbnails de vídeo do portfólio (VideoFacade) — YouTube/Vimeo,
    // nunca o vídeo em si (docs de mídia do Prompt 5).
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },

  experimental: {
    serverActions: {
      // O formulário de contato manda ~4 KB. Cortar o teto padrão de 1 MB
      // fecha a porta pra POST gigante de Server Action (consumo de CPU e
      // memória à toa, vetor de DoS). 64 KB dá folga pro overhead de
      // multipart sem deixar passar payload absurdo.
      bodySizeLimit: "64kb",
    },
  },

  headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
