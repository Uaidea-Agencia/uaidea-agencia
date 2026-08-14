import type { Metadata } from "next";

import { JetBrains_Mono, Montserrat, Poppins } from "next/font/google";

import { IntroBootScript } from "@/components/intro/intro-boot-script";
import { SiteIntro } from "@/components/intro/site-intro";
import { Toaster } from "@/components/ui/sonner";
import { BASES } from "@/config/bases";
import { SITE } from "@/config/site";

import "./globals.css";
const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  display: "swap",
});
const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  // 700 entrou só pra intro (site-intro.tsx) montar "UAIdea" em peso forte
  // sem recorrer a negrito sintético sobre uma fonte que não tem esse corte.
  weight: ["400", "500", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(BASES.site.url),
  title: SITE.name,
  description: SITE.description,
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE.locale}
      className={`${montserrat.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}
      // O script em IntroBootScript escreve `data-intro` neste elemento antes
      // da hidratação (mesma técnica do next-themes pra evitar flash) — sem
      // isso o React acusa divergência de atributo no <html> em todo load.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <IntroBootScript />
        {/* `flex flex-1 flex-col` replica aqui o que `body` fazia sozinho
            antes de existir esse wrapper — id só serve pra SiteIntro achar o
            resto do site e aplicar `inert` enquanto a intro está na tela. */}
        <div id="page-content" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteIntro />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
