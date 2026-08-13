import type { Project, ProjectFilter } from "@/types/project";

/**
 * Contrato do portfólio. Hoje resolvido por FileProjectRepository
 * (lib/adapters/file-project-repository.ts); quando houver banco,
 * PrismaProjectRepository implementa o mesmo contrato e a troca é uma
 * linha em lib/container.ts. Nenhum componente importa o adapter direto.
 */
export interface ProjectRepository {
  list(filter?: ProjectFilter): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
}
