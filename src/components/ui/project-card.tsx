import Image from "next/image";

import type { Project } from "@/types/project";

import { ROUTES } from "@/config/routes";

import { Reveal } from "./reveal";

const FALLBACK_GRADIENTS = [
  "linear-gradient(150deg, var(--p4), var(--p5))",
  "linear-gradient(150deg, var(--p3), var(--p5))",
];

interface ProjectCardProps {
  project: Project;
  index?: number;
}

/** Card de projeto — home (Cases) e /projetos usam o mesmo. */
export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cover = project.midia.find((item) => item.type === "image");

  return (
    <Reveal
      index={index}
      as="a"
      href={ROUTES.projeto(project.slug)}
      className="group relative block overflow-hidden rounded-xl p-0.5"
    >
      <div aria-hidden="true" className="case-card-beam animate-beam motion-reduce:animate-none" />
      <div className="bg-background relative overflow-hidden rounded-[calc(var(--radius-xl)-2px)]">
        <div
          className="relative flex aspect-16/10 items-center justify-center"
          style={!cover ? { background: FALLBACK_GRADIENTS[index % 2] } : undefined}
        >
          {cover && (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              placeholder={cover.blurDataURL ? "blur" : "empty"}
              blurDataURL={cover.blurDataURL}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-7">
          <div className="mb-3.5 flex items-baseline justify-between gap-4">
            <span className="text-(--base) text-xl font-bold uppercase">{project.cliente}</span>
            <span className="text-(--c6) font-mono text-[11px] tracking-[0.12em] uppercase">
              {project.categoria}
            </span>
          </div>
          <p className="text-(--c6) text-sm leading-normal">{project.resumo}</p>
        </div>
      </div>
    </Reveal>
  );
}
