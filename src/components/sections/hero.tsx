import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { HERO } from "@/content/home";

import { HeroPointerGlow } from "./hero-pointer-glow";
const HEADLINE_LINE_COUNT = HERO.headlineLines.length + 2;
export function Hero() {
  return (
    <section id="hero" className="dark bg-background text-foreground relative overflow-hidden">
      <HeroPointerGlow />

      <div aria-hidden="true" className="hero-grid" />
      <div aria-hidden="true" className="hero-glow" />
      <div aria-hidden="true" className="hero-glow-soft" />
      <div aria-hidden="true" className="hero-orb" />

      <Container className="relative pt-[clamp(4rem,8vw,6rem)] pb-24">
        <div
          className="animate-hero-in mb-8 flex items-center gap-3.5"
          style={{ animationDelay: "0ms" }}
        >
          <span aria-hidden="true" className="bg-primary animate-pulse-soft size-2 rounded-full" />
          <span className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
            {HERO.eyebrow}
          </span>
        </div>

        <h1 className="mb-8 max-w-[16ch] text-balance text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.02em] uppercase">
          {HERO.headlineLines.map((line, index) => (
            <span
              key={line}
              className="animate-hero-in block"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {line}
            </span>
          ))}
          <span
            className="text-primary animate-hero-in block"
            style={{ animationDelay: `${HERO.headlineLines.length * 70}ms` }}
          >
            {HERO.headlineAccent}
          </span>
          <span
            className="text-muted-foreground animate-hero-in mt-4 block font-mono text-[0.42em] font-normal tracking-[-0.01em] normal-case"
            style={{ animationDelay: `${(HERO.headlineLines.length + 1) * 70}ms` }}
          >
            {HERO.headlineSub}
          </span>
        </h1>

        <div
          className="animate-hero-in border-border grid grid-cols-1 items-end gap-10 border-t pt-10 sm:grid-cols-[minmax(300px,1fr)_auto]"
          style={{ animationDelay: `${HEADLINE_LINE_COUNT * 70}ms` }}
        >
          <p className="text-muted-foreground max-w-[52ch] text-lg text-balance">{HERO.body}</p>
          <div className="flex flex-wrap items-center gap-7">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={HERO.primaryCta.href}>{HERO.primaryCta.label}</Link>}
            />
            <Link href={HERO.secondaryCta.href} variant="underline">
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
