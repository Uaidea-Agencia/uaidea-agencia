import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { FOOTER_NAV } from "@/config/nav";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { FOOTER_CONTENT } from "@/content/home";

export function Footer() {
  return (
    <footer className="dark text-foreground bg-(--c12)">
      <Container className="pt-14 pb-8 sm:pt-18">
        <div className="border-border grid grid-cols-1 gap-10 border-b pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={ROUTES.home} className="-m-2 mb-4 inline-flex p-2">
              <Logo width={132} />
            </Link>
            <p className="text-muted-foreground max-w-[30ch] text-sm font-light">
              {FOOTER_CONTENT.brandLine}
            </p>
          </div>

          <div>
            <h2 className="text-foreground mb-5 font-mono text-[11px] tracking-[0.14em] uppercase">
              {FOOTER_NAV.frentes.title}
            </h2>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.frentes.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors outline-none focus-visible:ring-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-foreground mb-5 font-mono text-[11px] tracking-[0.14em] uppercase">
              {FOOTER_NAV.agencia.title}
            </h2>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.agencia.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors outline-none focus-visible:ring-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-foreground mb-5 font-mono text-[11px] tracking-[0.14em] uppercase">
              Contato
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={ROUTES.email}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-2"
                >
                  {SITE.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.instagram}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-2"
                >
                  {SITE.contact.instagramHandle}
                </a>
              </li>
              <li className="text-muted-foreground">{FOOTER_CONTENT.pending.whatsapp}</li>
              <li className="text-muted-foreground">{FOOTER_CONTENT.pending.address}</li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap justify-between gap-4 pt-7 font-mono text-[11px] tracking-[0.08em]">
          <span>{FOOTER_CONTENT.pending.cnpj}</span>
          <span>{FOOTER_CONTENT.copyright}</span>
        </div>
      </Container>
    </footer>
  );
}
