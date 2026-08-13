import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

/**
 * Layout default do site — Header + main + Footer. Futuras páginas
 * (/projetos etc.) herdam isso automaticamente por estarem no mesmo
 * route group, sem duplicar Header/Footer em cada uma.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
