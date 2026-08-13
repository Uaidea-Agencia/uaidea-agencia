import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TECHNOLOGY } from "@/content/home";
const LINE_KIND_CLASS = {
  prompt: "text-primary",
  dim: "text-(--c6)",
  ok: "text-foreground",
} as const;
export function TechnologySection() {
  return (
    <section id="tecnologia" className="dark bg-(--p4) text-foreground relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--w)_5%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--w)_5%,transparent)_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <Container className="relative py-16 sm:py-24 lg:py-28">
        <Reveal>
          <SectionLabel tone="mid" className="mb-8">
            {TECHNOLOGY.label}
          </SectionLabel>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <Reveal index={1}>
            <h2 className="text-foreground mb-7 max-w-[16ch] text-[clamp(1.5rem,5vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.02em] uppercase">
              {TECHNOLOGY.heading}
            </h2>
            <p className="mb-6 max-w-[52ch] text-base text-balance text-(--c2)/85 sm:text-lg">
              {TECHNOLOGY.body}
            </p>
            <p className="max-w-[46ch] font-mono text-sm leading-relaxed text-(--base) sm:text-base">
              {TECHNOLOGY.tagline}
            </p>
          </Reveal>

          <Reveal index={2} className="bg-(--p5) overflow-hidden rounded-xl border border-(--w)/18">
            <div className="flex items-center gap-2 border-b border-(--w)/14 px-4.5 py-3.5">
              <span aria-hidden="true" className="bg-(--p3) size-2.5 rounded-full" />
              <span aria-hidden="true" className="bg-(--p4) size-2.5 rounded-full" />
              <span aria-hidden="true" className="bg-(--p4) size-2.5 rounded-full" />
              <span className="ml-2 font-mono text-xs tracking-widest text-(--c6)">
                {TECHNOLOGY.terminal.label}
              </span>
            </div>
            <div className="p-5.5 font-mono text-sm leading-loose">
              <p className="mb-2 text-(--c6) italic">{`// ${TECHNOLOGY.terminal.note}`}</p>
              {TECHNOLOGY.terminal.lines.map((line) => (
                <div key={line.text} className={LINE_KIND_CLASS[line.kind]}>
                  {line.kind === "prompt" && <span className="text-primary">$ </span>}
                  {line.kind === "ok" && <span className="text-foreground">✓ </span>}
                  {line.text}
                  {line.cursor && (
                    <span
                      aria-hidden="true"
                      className="bg-primary animate-blink ml-1.5 inline-block h-3.75 w-2 align-[-2px]"
                    />
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal
          index={3}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-(--w)/16 bg-(--w)/16 sm:grid-cols-3"
        >
          {TECHNOLOGY.tiles.map((tile) => (
            <div
              key={tile.name}
              className="hover:bg-(--p5) bg-(--p4) px-5.5 py-6.5 transition-colors [&:nth-child(odd):last-child]:col-span-2 [&:nth-child(odd):last-child]:text-center sm:[&:nth-child(odd):last-child]:col-span-1 sm:[&:nth-child(odd):last-child]:text-left"
            >
              <p className="text-foreground mb-2 font-mono text-sm tracking-[0.12em]">
                {tile.name}
              </p>
              <p className="text-muted-foreground text-sm leading-normal">{tile.desc}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
