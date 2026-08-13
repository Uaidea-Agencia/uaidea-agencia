import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { DIFFERENTIATORS } from "@/content/home";

export function DifferentiatorsSection() {
  return (
    <section id="diferencial" className="bg-background text-foreground">
      <Container className="py-16 sm:py-24 lg:py-28">
        <Reveal>
          <SectionLabel tone="light" className="mb-8">
            {DIFFERENTIATORS.label}
          </SectionLabel>
          <h2 className="text-(--p5) mb-16 max-w-[14ch] text-[clamp(2.125rem,7vw,5.25rem)] leading-none font-extrabold tracking-[-0.03em]">
            {DIFFERENTIATORS.heading}
          </h2>
        </Reveal>

        <ul className="border-(--c3) grid grid-cols-1 border-t sm:grid-cols-2 sm:gap-x-16 lg:grid-cols-3">
          {DIFFERENTIATORS.items.map((item, index) => (
            <Reveal as="li" index={index} key={item.title} className="border-(--c3) border-b py-8">
              <h3 className="text-(--p5) mb-2.5 text-2xl font-semibold">{item.title}</h3>
              <p className="max-w-[46ch] text-(--c9)">{item.desc}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
