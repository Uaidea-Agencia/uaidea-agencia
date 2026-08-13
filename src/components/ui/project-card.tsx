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
export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cover = project.midia.find((item) => item.type === "image");
  return (
    <Reveal
      index={index}
      as="a"
      href={ROUTES.projeto(project.slug)}
      className="group relative block overflow-hidden rounded-xl p-0.5"
    >
      <div
        aria-hidden="true"
        className="case-card-beam animate-beam"
        style={index % 2 === 1 ? { animationDelay: "-2.7s" } : undefined}
      />
      <div className="bg-background relative overflow-hidden rounded-[calc(var(--radius-xl)-2px)] border-2">
        <div
          className="relative flex aspect-16/10 items-center justify-center"
          style={!cover ? { background: FALLBACK_GRADIENTS[index % 2] } : undefined}
        >
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              placeholder={cover.blurDataURL ? "blur" : "empty"}
              blurDataURL={cover.blurDataURL}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="font-mono text-xs tracking-[0.14em] text-(--w)/45 uppercase">
              imagem do projeto
            </span>
          )}
        </div>
        <div className="p-7">
          <div className="mb-3.5 flex items-baseline justify-between gap-4">
            <span className="text-(--base) text-lg font-bold uppercase sm:text-xl">
              {project.cliente}
            </span>
            <span className="text-(--c6) font-mono text-xs tracking-[0.12em] uppercase">
              {project.categoria}
            </span>
          </div>
          <p className="text-(--c6) text-sm leading-normal">{project.resumo}</p>

          <dl className="border-border mt-5 flex flex-col gap-1 border-t pt-4">
            {(
              [
                ["Problema", project.problema],
                ["Solução", project.solucao],
                ["Resultado", project.resultado ?? "[ PENDENTE ]"],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex gap-1.5 text-xs leading-relaxed">
                <dt className="text-muted-foreground shrink-0">{label} ·</dt>
                <dd className="text-(--c6) truncate">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Reveal>
  );
}
