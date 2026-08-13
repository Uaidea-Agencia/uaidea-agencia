import Image from "next/image";

import { SITE } from "@/config/site";

// Proporção real do arquivo oficial (1008×272) — docs/marca.md proíbe
// distorcer a assinatura, então a altura sempre deriva da largura.
const ASPECT_RATIO = 1008 / 272;

interface LogoProps {
  /** Largura em px. Mínimo de marca: 110px (digital). */
  width?: number;
  className?: string;
  /** Só a ocorrência acima da dobra (header) deve ser priority. */
  priority?: boolean;
}

/**
 * Assinatura horizontal — monocromática branca, único arquivo aprovado
 * para fundo escuro (docs/marca.md). Vem de public/, não de assets/: só
 * o Next serve estático a partir daí.
 */
export function Logo({ width = 128, className, priority = false }: LogoProps) {
  return (
    <Image
      src="/logo-mono-branca.png"
      alt={SITE.name}
      width={width}
      height={Math.round(width / ASPECT_RATIO)}
      className={className}
      priority={priority}
    />
  );
}
