import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { ROUTES } from "@/config/routes";
import { CASES } from "@/content/home";
import { projectRepository } from "@/lib/container";

import { CasesRotator } from "./cases-rotator";
export async function CasesSection() {
  const projects = await projectRepository.list({ destaque: true });
  return (
    <section id="cases" className="dark bg-background text-foreground">
      <Container className="py-16 sm:py-24 lg:py-28">
        <Reveal className="mb-14 flex flex-wrap items-baseline justify-between gap-8">
          <div>
            <SectionLabel tone="dark" className="mb-2">
              {CASES.label}
            </SectionLabel>
            <h2 className="max-w-[16ch] text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase">
              {CASES.heading}
            </h2>
          </div>
          <p className="text-(--c6) max-w-[36ch] text-base">{CASES.desc}</p>
        </Reveal>

        <div className="hidden min-[700px]:block">
          <CasesRotator projects={projects} />
        </div>

        <Reveal index={1} className="min-[700px]:hidden">
          <Button
            size="block"
            nativeButton={false}
            render={<Link href={ROUTES.projetos}>Ver todos os projetos →</Link>}
          />
        </Reveal>

        <Reveal
          index={2}
          className="border-(--w)/12 bg-(--w)/12 mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4"
        >
          {CASES.stats.map((stat) => (
            <div key={stat.label} className="bg-background px-7 py-9">
              <p className="text-(--base) mb-3 text-4xl font-extrabold">{stat.value}</p>
              <p className="text-(--c6) font-mono text-xs tracking-[0.14em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal index={3} className="mt-10 hidden text-center min-[700px]:block">
          <Link href={ROUTES.projetos} variant="outline">
            Ver todos os projetos →
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
