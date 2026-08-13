import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { ROUTES } from "@/config/routes";
import { SERVICES } from "@/content/home";
export function ServicesSection() {
  return (
    <section id="servicos" className="dark bg-background text-foreground">
      <Container className="pt-16 sm:pt-24 lg:pt-28">
        <Reveal>
          <SectionLabel tone="dark" className="mb-8">
            {SERVICES.label}
          </SectionLabel>
          <h2 className="mb-6 max-w-[18ch] text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase">
            {SERVICES.heading}
          </h2>
          <p className="text-muted-foreground mb-16 max-w-[56ch] text-lg">{SERVICES.intro}</p>
        </Reveal>
      </Container>

      <ul className="border-border border-t">
        {SERVICES.items.map((service, index) => (
          <li key={service.idx} className="border-border border-b">
            <Reveal
              as="a"
              index={index}
              href={ROUTES.contato}
              className="group hover:bg-secondary focus-visible:ring-ring flex flex-wrap items-center gap-4 px-6 py-7 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset sm:gap-7 sm:px-8 sm:py-9"
            >
              <span className="text-primary w-11 shrink-0 font-mono text-sm tracking-[0.14em]">
                {service.idx}
              </span>
              <span className="flex-1 text-[clamp(1.5rem,3.4vw,2.625rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase sm:min-w-60">
                {service.title}
              </span>
              <span className="text-muted-foreground max-[500px]:order-1 max-[500px]:basis-full flex-1 text-base leading-snug sm:min-w-80">
                {service.desc}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="text-muted-foreground group-hover:text-primary size-6 shrink-0 transition-colors"
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
