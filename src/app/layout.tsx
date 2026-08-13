import type { Metadata } from "next";

import { JetBrains_Mono, Montserrat, Poppins } from "next/font/google";

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
  weight: ["400", "500"],
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
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
