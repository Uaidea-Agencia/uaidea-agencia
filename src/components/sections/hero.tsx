import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HERO } from "@/content/home";

import { HeroPointerGlow } from "./hero-pointer-glow";

const HEADLINE_LINE_COUNT = HERO.headlineLines.length + 2; // + accent + sub

/**
 * Server Component — nada aqui depende de JS pra existir na página (LCP
 * não pode depender de JS, docs/ui-web.md). A entrada animada é CSS puro
 * (animate-hero-in, globals.css); o glow que segue o mouse é a única
 * parte client, isolada em HeroPointerGlow, e é puramente decorativa.
 */
export function Hero() {
  return (
    <section id="hero" className="dark bg-background text-foreground relative overflow-hidden">
      <HeroPointerGlow />

      <div aria-hidden="true" className="hero-grid" />
      <div aria-hidden="true" className="hero-glow" />
      <div aria-hidden="true" className="hero-glow-soft" />
      <div aria-hidden="true" className="hero-orb" />

      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div
          className="animate-hero-in motion-reduce:animate-none mb-10 flex items-center gap-3.5"
          style={{ animationDelay: "0ms" }}
        >
          <span
            aria-hidden="true"
            className="bg-primary animate-pulse-soft motion-reduce:animate-none size-2 rounded-full"
          />
          <span className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
            {HERO.eyebrow}
          </span>
        </div>

        <h1 className="mb-10 max-w-[16ch] text-balance text-[clamp(2.5rem,7.4vw,5.75rem)] leading-none font-extrabold tracking-[-0.03em] uppercase">
          {HERO.headlineLines.map((line, index) => (
            <span
              key={line}
              className="animate-hero-in motion-reduce:animate-none block"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {line}
            </span>
          ))}
          <span
            className="text-primary animate-hero-in motion-reduce:animate-none block"
            style={{ animationDelay: `${HERO.headlineLines.length * 70}ms` }}
          >
            {HERO.headlineAccent}
          </span>
          <span
            className="text-muted-foreground animate-hero-in motion-reduce:animate-none mt-4 block font-mono text-[0.42em] font-normal tracking-[-0.01em] normal-case"
            style={{ animationDelay: `${(HERO.headlineLines.length + 1) * 70}ms` }}
          >
            {HERO.headlineSub}
          </span>
        </h1>

        <div
          className="animate-hero-in motion-reduce:animate-none border-border grid grid-cols-1 items-end gap-10 border-t pt-10 sm:grid-cols-[minmax(300px,1fr)_auto]"
          style={{ animationDelay: `${HEADLINE_LINE_COUNT * 70}ms` }}
        >
          <p className="text-muted-foreground max-w-[52ch] text-lg text-balance">{HERO.body}</p>
          <div className="flex flex-wrap items-center gap-7">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={HERO.primaryCta.href}>{HERO.primaryCta.label}</a>}
            />
            <a
              href={HERO.secondaryCta.href}
              className="text-foreground focus-visible:ring-ring hover:border-primary border-b border-(--w)/30 text-base font-semibold tracking-[0.02em] outline-none transition-colors focus-visible:ring-2"
            >
              {HERO.secondaryCta.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
