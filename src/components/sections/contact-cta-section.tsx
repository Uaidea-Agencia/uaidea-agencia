import { Container } from "@/components/layout/container";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTACT } from "@/content/home";
import { ContactDialog } from "@/features/contact/components/contact-dialog";
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
            <Link href={CONTACT.instagram.href} variant="underline">
              {CONTACT.instagram.label}
            </Link>
          </div>
          <p className="text-(--c6) mt-8 font-mono text-xs tracking-widest">
            {CONTACT.emailDisplay}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
