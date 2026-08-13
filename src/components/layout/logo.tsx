import Image from "next/image";

import { SITE } from "@/config/site";
const ASPECT_RATIO = 1008 / 272;
interface LogoProps {
  width?: number;
  className?: string;
  priority?: boolean;
}
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
