/**
 * Tipos de domínio do portfólio — não sabem nada sobre arquivo, banco ou
 * zod. O adapter (lib/adapters/file-project-repository.ts) é quem
 * traduz o formato de armazenamento pra isto aqui.
 */

export interface ProjectImage {
  type: "image";
  /** Caminho em public/, ex.: /projects/<slug>/capa.jpg */
  src: string;
  alt: string;
  /** Gerado pelo adapter na leitura — nunca vem do arquivo de conteúdo. */
  blurDataURL?: string;
}

export interface ProjectVideo {
  type: "video";
  provider: "youtube" | "vimeo";
  id: string;
  title: string;
  /** Thumbnail explícita; se ausente e provider="youtube", o adapter deriva uma. */
  thumbnail?: string;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export interface Project {
  slug: string;
  cliente: string;
  categoria: string;
  ano: number;
  resumo: string;
  problema: string;
  solucao: string;
  /** String livre — nunca uma métrica inventada (regra 9, CLAUDE.md). */
  resultado?: string;
  destaque: boolean;
  ordem: number;
  midia: ProjectMedia[];
}

export interface ProjectFilter {
  categoria?: string;
  destaque?: boolean;
}
