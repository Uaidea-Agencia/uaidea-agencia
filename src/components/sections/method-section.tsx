import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { METHOD } from "@/content/home";

import { MethodRecapButton } from "./method-recap-button";
export function MethodSection() {
  return (
    <section id="metodo" className="bg-background text-foreground">
      <Container className="py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <Reveal className="lg:sticky lg:top-26">
            <SectionLabel tone="light" className="mb-8">
              {METHOD.label}
            </SectionLabel>
            <h2 className="mb-6 max-w-[16ch] text-(--p5) text-[clamp(1.875rem,4.6vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase">
              {METHOD.heading}
            </h2>
            <p className="max-w-[40ch] text-lg text-(--c9)">{METHOD.intro}</p>
          </Reveal>

          <MethodRecapButton />

          <ol className="border-(--c3) border-t">
            {METHOD.steps.map((step, index) => (
              <Reveal
                as="li"
                index={index}
                key={step.num}
                className="border-(--c3) grid grid-cols-[56px_1fr] gap-7 border-b py-8"
              >
                <span
                  className={
                    step.active
                      ? "text-primary text-4xl leading-none font-extrabold"
                      : "text-(--c7) text-4xl leading-none font-extrabold"
                  }
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="text-(--p5) mb-2.5 text-2xl leading-snug font-semibold">
                    {step.title}
                  </h3>
                  <p className="max-w-[52ch] text-(--c9)">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
