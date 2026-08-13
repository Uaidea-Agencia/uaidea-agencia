import type { Project, ProjectFilter } from "@/types/project";
export interface ProjectRepository {
  list(filter?: ProjectFilter): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
}
