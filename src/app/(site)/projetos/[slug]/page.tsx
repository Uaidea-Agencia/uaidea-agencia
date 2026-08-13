import type { Metadata } from "next";

import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Link } from "@/components/ui/link";
import { SectionLabel } from "@/components/ui/section-label";
import { VideoFacade } from "@/components/ui/video-facade";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { projectRepository } from "@/lib/container";
interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}
export async function generateStaticParams() {
  const projects = await projectRepository.list();
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectRepository.findBySlug(slug);
  if (!project) {
    return {};
  }
  return {
    title: `${project.cliente} — ${SITE.name}`,
    description: project.resumo,
  };
}
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await projectRepository.findBySlug(slug);
  if (!project) {
    notFound();
  }
  return (
    <section className="dark bg-background text-foreground">
      <Container className="py-16 sm:py-24 lg:py-28">
        <Link href={ROUTES.projetos} variant="muted">
          ← Todos os projetos
        </Link>

        <SectionLabel tone="dark" className="mb-4">
          {`${project.categoria} · ${project.ano}`}
        </SectionLabel>
        <h1 className="mb-6 max-w-[20ch] text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase">
          {project.cliente}
        </h1>
        <p className="text-muted-foreground mb-16 max-w-[62ch] text-lg text-balance">
          {project.resumo}
        </p>

        {project.midia.length > 0 && (
          <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {project.midia.map((media, index) =>
              media.type === "image" ? (
                <div
                  key={media.src}
                  className="border-border relative aspect-16/10 overflow-hidden rounded-xl border first:sm:col-span-2"
                >
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    placeholder={media.blurDataURL ? "blur" : "empty"}
                    blurDataURL={media.blurDataURL}
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ) : (
                <VideoFacade
                  key={media.id}
                  video={media}
                  className="border-border aspect-16/10 w-full rounded-xl border first:sm:col-span-2"
                />
              ),
            )}
          </div>
        )}

        <div className="border-border grid grid-cols-1 gap-10 border-t pt-12 sm:grid-cols-3">
          <div>
            <h2 className="text-muted-foreground mb-3 font-mono text-xs tracking-[0.14em] uppercase">
              Problema
            </h2>
            <p className="text-balance">{project.problema}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground mb-3 font-mono text-xs tracking-[0.14em] uppercase">
              Solução
            </h2>
            <p className="text-balance">{project.solucao}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground mb-3 font-mono text-xs tracking-[0.14em] uppercase">
              Resultado
            </h2>
            <p className="text-balance">{project.resultado ?? "[ PENDENTE ]"}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
