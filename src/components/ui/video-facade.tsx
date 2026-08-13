"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { ProjectVideo } from "@/types/project";

const EMBED_URL: Record<ProjectVideo["provider"], (id: string) => string> = {
  // *-nocookie / dnt=1: sem cookie de rastreio antes do clique do usuário.
  youtube: (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
  vimeo: (id) => `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`,
};

interface VideoFacadeProps {
  video: ProjectVideo;
  className?: string;
}

/**
 * Vídeo carregado por facade: thumbnail estática até o clique, iframe só
 * monta depois. O player (YouTube/Vimeo) é pesado — sem isso ele entra
 * no orçamento de LCP mesmo fora da dobra (docs empresa.md / Prompt 5).
 */
export function VideoFacade({ video, className }: VideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        className={className}
        src={EMBED_URL[video.provider](video.id)}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setIsPlaying(true);
      }}
      aria-label={`Reproduzir vídeo: ${video.title}`}
      className={`group focus-visible:ring-ring relative flex items-center justify-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      {video.thumbnail ? (
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden="true" className="bg-secondary absolute inset-0" />
      )}
      <span
        aria-hidden="true"
        className="bg-primary group-hover:bg-(--p2) text-primary-foreground relative flex size-16 items-center justify-center rounded-full transition-colors"
      >
        <Play className="ml-1 size-6" fill="currentColor" />
      </span>
    </button>
  );
}
