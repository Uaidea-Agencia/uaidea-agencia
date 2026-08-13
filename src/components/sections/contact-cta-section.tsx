import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTACT } from "@/content/home";
import { ContactDialog } from "@/features/contact/components/contact-dialog";

/**
 * CTA final — "Falar com a UAIdea →" abre o diálogo com formulário
 * (Prompt 6). O mailto não sumiu: é o próprio href do gatilho, fallback
 * real sem JS (ver ContactDialog).
 */
export function ContactCtaSection() {
  return (
    <section id="contato" className="dark cta-gradient text-foreground relative overflow-hidden">
      <div aria-hidden="true" className="cta-scanlines" />

      <Container className="relative py-24 text-center sm:py-28 lg:py-36">
        <Reveal>
          <SectionLabel tone="mid" className="mb-10">
            {CONTACT.label}
          </SectionLabel>
          <h2 className="text-foreground mx-auto mb-8 max-w-[15ch] text-[clamp(2.25rem,7.6vw,6rem)] leading-[0.98] font-extrabold tracking-[-0.03em] uppercase">
            {CONTACT.heading}
          </h2>
          <p className="text-muted-foreground mx-auto mb-12 max-w-[52ch] text-lg text-balance">
            {CONTACT.body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-7">
            <ContactDialog label={CONTACT.primaryCta.label} mailtoHref={CONTACT.primaryCta.href} />
            <a
              href={CONTACT.instagram.href}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-base font-semibold tracking-[0.02em] underline decoration-1 underline-offset-4 outline-none focus-visible:ring-2"
            >
              {CONTACT.instagram.label}
            </a>
          </div>
          <p className="text-(--c6) mt-8 font-mono text-xs tracking-widest">
            {CONTACT.emailDisplay}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
