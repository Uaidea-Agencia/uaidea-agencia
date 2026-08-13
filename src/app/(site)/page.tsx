import { CasesSection } from "@/components/sections/cases-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { DifferentiatorsSection } from "@/components/sections/differentiators-section";
import { DisciplineMarquee } from "@/components/sections/discipline-marquee";
import { Hero } from "@/components/sections/hero";
import { MethodSection } from "@/components/sections/method-section";
import { PositioningSection } from "@/components/sections/positioning-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TechnologySection } from "@/components/sections/technology-section";

// Ordem narrativa (docs/ui-web.md, "Layout"): claro → escuro → escuro →
// claro → escuro → escuro, espelhando o carrossel institucional.
export default function HomePage() {
  return (
    <>
      <Hero />
      <DisciplineMarquee />
      <PositioningSection />
      <ServicesSection />
      <TechnologySection />
      <MethodSection />
      <CasesSection />
      <DifferentiatorsSection />
      <ContactCtaSection />
    </>
  );
}
