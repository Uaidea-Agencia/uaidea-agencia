import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Link } from "@/components/ui/link";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionLabel } from "@/components/ui/section-label";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { projectRepository } from "@/lib/container";
export const metadata: Metadata = {
  title: `Projetos — ${SITE.name}`,
  description:
    "Trabalhos da UAIdea Agência — cliente, problema, solução e resultado, com número real ou [ PENDENTE ] até a autorização chegar.",
};
export default async function ProjetosPage() {
  const projects = await projectRepository.list();
  return (
    <section className="dark bg-background text-foreground">
      <Container className="py-16 sm:py-24 lg:py-28">
        <Link href={ROUTES.home} variant="muted">
          ← Início
        </Link>

        <SectionLabel tone="dark" className="mb-8">
          Trabalhos
        </SectionLabel>
        <h1 className="mb-6 max-w-[18ch] text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase">
          Todos os projetos
        </h1>
        <p className="text-muted-foreground mb-16 max-w-[56ch] text-lg">
          Case só entra aqui com número real. Cliente, categoria, problema, solução e resultado
          entram quando houver autorização e dado auditável.
        </p>

        {projects.length === 0 ? (
          <p className="text-(--c6)">Nenhum projeto publicado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
