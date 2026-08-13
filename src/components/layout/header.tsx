"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { HEADER_CTA, MAIN_NAV, MOBILE_NAV } from "@/config/nav";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* bg-background/92, não /82: a versão translúcida original passava por
          baixo de 4.5:1 de contraste nos links quando o conteúdo escuro do
          herói ficava atrás (Lighthouse pegou 4.46:1 — Prompt 7). */}
      <header className="dark border-border bg-background/92 text-foreground sticky top-0 z-60 border-b backdrop-blur-md">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          {/* Espaço ao redor da assinatura ~ área de proteção (docs/marca.md). */}
          <Link href={ROUTES.home} className="-m-2 flex p-2">
            <Logo width={128} priority />
          </Link>

          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Principal">
            {MAIN_NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:text-foreground rounded-sm text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {link.label}
              </a>
            ))}
            <Button
              nativeButton={false}
              render={<a href={HEADER_CTA.href}>{HEADER_CTA.label}</a>}
            />
          </nav>

          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setIsMenuOpen(true);
            }}
            className="focus-visible:ring-ring flex size-11 flex-col items-center justify-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 md:hidden"
          >
            <span className="bg-foreground block h-0.5 w-5.5" />
            <span className="bg-foreground block h-0.5 w-5.5" />
          </button>
        </Container>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "dark bg-background text-foreground fixed inset-0 z-80 flex flex-col",
          isMenuOpen ? "flex" : "hidden",
        )}
      >
        <div className="border-border flex items-center justify-between border-b p-4">
          <Logo width={120} />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => {
              setIsMenuOpen(false);
            }}
            className="text-primary focus-visible:ring-ring flex size-11 items-center justify-center rounded-sm outline-none focus-visible:ring-2"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto p-6" aria-label="Principal">
          {MOBILE_NAV.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className="border-border text-foreground focus-visible:ring-ring flex min-h-14 items-center gap-4 border-b outline-none focus-visible:ring-2"
            >
              <span className="text-muted-foreground font-mono text-[11px] tracking-[0.14em]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl font-semibold">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="border-border border-t p-6">
          <Button
            className="w-full justify-center"
            nativeButton={false}
            render={<a href={HEADER_CTA.href}>{HEADER_CTA.label}</a>}
          />
          <p className="text-muted-foreground mt-4 text-center font-mono text-[11px] tracking-widest">
            {SITE.contact.email}
          </p>
        </div>
      </div>
    </>
  );
}
