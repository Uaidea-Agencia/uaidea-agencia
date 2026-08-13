import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getPlaiceholder } from "plaiceholder";

import type { ProjectRepository } from "@/lib/ports/project-repository";
import type { Project, ProjectFilter, ProjectMedia } from "@/types/project";

import { type ProjectFile, projectFileSchema } from "./project-schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** youtube.com/watch?v=<id> tem thumbnail em URL previsível — sem chamada de rede. */
function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

async function enrichMedia(
  media: ProjectFile["midia"][number],
  slug: string,
): Promise<ProjectMedia> {
  if (media.type === "video") {
    return {
      ...media,
      thumbnail:
        media.thumbnail ?? (media.provider === "youtube" ? youtubeThumbnail(media.id) : undefined),
    };
  }

  const absolutePath = path.join(PUBLIC_DIR, media.src);
  let buffer: Buffer;
  try {
    buffer = await readFile(absolutePath);
  } catch {
    throw new Error(
      `content/projects/${slug}.json: imagem "${media.src}" não existe em public${media.src}. ` +
        `Confira o campo "src" ou adicione o arquivo.`,
    );
  }

  const { base64 } = await getPlaiceholder(buffer);
  return { ...media, blurDataURL: base64 };
}

async function loadProjectFile(fileName: string): Promise<Project> {
  const raw = await readFile(path.join(CONTENT_DIR, fileName), "utf-8");

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (cause) {
    throw new Error(`content/projects/${fileName}: JSON inválido — confira vírgulas e aspas.`, {
      cause,
    });
  }

  const parsed = projectFileSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `content/projects/${fileName}: dados inválidos.\n${parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
  }

  const midia = await Promise.all(
    parsed.data.midia.map((item) => enrichMedia(item, parsed.data.slug)),
  );

  return { ...parsed.data, midia };
}

// Módulo carregado uma vez por processo de build/dev — cache simples em
// memória, sem custo de reprocessar plaiceholder a cada list()/findBySlug().
let cache: Promise<Project[]> | null = null;

function loadAllProjects(): Promise<Project[]> {
  cache ??= (async () => {
    const fileNames = (await readdir(CONTENT_DIR)).filter((name) => name.endsWith(".json"));
    const projects = await Promise.all(fileNames.map(loadProjectFile));
    return projects.sort((a, b) => a.ordem - b.ordem);
  })();

  return cache;
}

/**
 * Lê content/projects/*.json. Arquivo inválido lança na leitura — em
 * `next build` isso derruba o build (o comportamento pedido), não
 * silencia um projeto quebrado em produção.
 *
 * Trocar por banco: implementar ProjectRepository de novo (ex.:
 * PrismaProjectRepository) e apontar lib/container.ts pra ela. Nenhum
 * componente importa esta classe diretamente.
 */
export class FileProjectRepository implements ProjectRepository {
  async list(filter?: ProjectFilter): Promise<Project[]> {
    const all = await loadAllProjects();
    return all.filter((project) => {
      if (filter?.categoria && project.categoria !== filter.categoria) return false;
      if (filter?.destaque !== undefined && project.destaque !== filter.destaque) return false;
      return true;
    });
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const all = await loadAllProjects();
    return all.find((project) => project.slug === slug) ?? null;
  }
}
