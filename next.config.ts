import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Thumbnails de vídeo do portfólio (VideoFacade) — YouTube/Vimeo,
    // nunca o vídeo em si (docs de mídia do Prompt 5).
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },
};

export default nextConfig;
