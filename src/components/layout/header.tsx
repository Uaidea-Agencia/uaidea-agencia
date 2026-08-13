"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { HEADER_CTA, MAIN_NAV, MOBILE_NAV } from "@/config/nav";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
const SECTION_IDS = [...MAIN_NAV.map((link) => link.href.replace("/#", "")), "contato"];
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const reduceMotion = useReducedMotion();
  function handleLogoClick() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);
  return (
    <>
      <header className="dark border-border bg-background/82 text-foreground sticky top-0 z-60 border-b backdrop-blur-md">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href={ROUTES.home} onClick={handleLogoClick} className="-m-2 flex p-2">
            <Logo width={128} priority />
          </Link>

          <nav
            className="hidden items-center gap-[clamp(14px,2.2vw,28px)] min-[900px]:flex"
            aria-label="Principal"
          >
            {MAIN_NAV.map((link) => {
              const isActive = activeId === link.href.replace("/#", "");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "focus-visible:ring-ring focus-visible:text-foreground inline-flex items-center gap-2 rounded-sm text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive ? "text-foreground" : "text-(--c5) hover:text-foreground",
                  )}
                >
                  {link.label}

                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="bg-primary animate-pulse-soft size-1.5 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            <div className="relative">
              {activeId === "contato" && (
                <span
                  aria-hidden="true"
                  className="border-primary animate-pulse-soft pointer-events-none absolute -inset-1 rounded-[calc(var(--radius-lg)+4px)] border"
                />
              )}
              <Button
                nativeButton={false}
                render={<Link href={HEADER_CTA.href}>{HEADER_CTA.label}</Link>}
              />
            </div>
          </nav>

          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setIsMenuOpen(true);
            }}
            className="focus-visible:ring-ring flex size-11 flex-col items-center justify-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 min-[900px]:hidden"
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
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className="border-border text-foreground focus-visible:ring-ring flex min-h-14 items-center gap-4 border-b outline-none focus-visible:ring-2"
            >
              <span className="text-muted-foreground font-mono text-xs tracking-[0.14em]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl font-semibold">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-border border-t p-6">
          <Button
            size="block"
            nativeButton={false}
            render={
              <Link
                href={HEADER_CTA.href}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {HEADER_CTA.label}
              </Link>
            }
          />
          <p className="text-muted-foreground mt-4 text-center font-mono text-xs tracking-widest">
            {SITE.contact.email}
          </p>
        </div>
      </div>
    </>
  );
}
