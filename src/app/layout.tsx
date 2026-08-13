import type { Metadata } from "next";

import { JetBrains_Mono, Montserrat, Poppins } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/config/site";

import "./globals.css";

// Self-hosted via next/font — nada de CDN externa (docs técnicos, CLAUDE.md).
// Pesos batem com a escala de docs/marca.md: Montserrat cobre H1–H3
// (SemiBold/Bold/ExtraBold); Poppins cobre corpo, apoio, botão e rótulo
// (Light/Regular/Medium/SemiBold). "latin-ext" entra pelos acentos do pt-BR.
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

// Terceira família, papel "técnico/dado" de docs/ui-web.md: rótulos
// numerados, tags, contador, timestamp — nunca texto que o visitante
// precise ler pra entender a oferta.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE.locale}
      className={`${montserrat.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
