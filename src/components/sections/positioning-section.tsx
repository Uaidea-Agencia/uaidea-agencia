import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { POSITIONING } from "@/content/home";

export function PositioningSection() {
  return (
    <section id="posicionamento" className="bg-background text-foreground">
      <Container className="py-16 sm:py-24 lg:py-28">
        <Reveal as="div" className="mb-14">
          <SectionLabel tone="light">{POSITIONING.label}</SectionLabel>
        </Reveal>

        <div className="border-(--c3)">
          <Reveal
            index={0}
            className="grid grid-cols-1 items-baseline gap-3 border-t border-(--c3) py-9 sm:grid-cols-[240px_1fr] sm:gap-10"
          >
            <span className="font-mono text-xs tracking-[0.14em] text-(--c8) uppercase">
              {POSITIONING.marketRow.tag}
            </span>
            <h2 className="max-w-[18ch] text-balance text-(--p5) text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.02em] uppercase">
              {POSITIONING.marketRow.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal
            index={1}
            className="grid grid-cols-1 items-baseline gap-3 border-t border-(--c3) py-9 sm:grid-cols-[240px_1fr] sm:gap-10"
          >
            <span className="font-mono text-xs tracking-[0.14em] text-(--c8) uppercase">
              {POSITIONING.agencyRow.tag}
            </span>
            <h2 className="max-w-[18ch] text-balance text-(--p5) text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.02em] uppercase">
              {POSITIONING.agencyRow.before}
              <span className="text-primary">{POSITIONING.agencyRow.accent}</span>
              {POSITIONING.agencyRow.after}
            </h2>
          </Reveal>

          <Reveal
            index={2}
            className="grid grid-cols-1 items-start gap-3 border-t border-b border-(--c3) py-9 sm:grid-cols-[240px_1fr] sm:gap-10"
          >
            <span className="font-mono text-xs tracking-[0.14em] text-(--c8) uppercase">
              {POSITIONING.answer.tag}
            </span>
            <div>
              {POSITIONING.answer.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-5 max-w-[62ch] text-balance text-lg text-(--c9)">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-(--c2) p-9">
            <p className="mb-6 font-mono text-xs tracking-[0.14em] text-(--c8) uppercase">
              {POSITIONING.compare.common.heading}
            </p>
            <ul className="flex flex-col gap-3.5 text-(--c8)">
              {POSITIONING.compare.common.items.map((item) => (
                <li key={item} className="text-sm leading-normal">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="dark bg-background text-foreground rounded-lg p-9">
            <p className="text-primary mb-6 font-mono text-xs tracking-[0.14em] uppercase">
              {POSITIONING.compare.uaidea.heading}
            </p>
            <ul className="text-foreground flex flex-col gap-3.5">
              {POSITIONING.compare.uaidea.items.map((item) => (
                <li key={item} className="text-sm leading-normal">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
