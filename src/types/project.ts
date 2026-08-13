export interface ProjectImage {
  type: "image";
  src: string;
  alt: string;
  blurDataURL?: string;
}
export interface ProjectVideo {
  type: "video";
  provider: "youtube" | "vimeo";
  id: string;
  title: string;
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
  resultado?: string;
  destaque: boolean;
  ordem: number;
  midia: ProjectMedia[];
}
export interface ProjectFilter {
  categoria?: string;
  destaque?: boolean;
}
