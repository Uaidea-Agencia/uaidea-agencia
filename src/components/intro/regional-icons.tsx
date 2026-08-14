/**
 * Ícones bespoke pro traço regional da intro (`site-intro.tsx`).
 *
 * Lucide (a biblioteca única de ícones do site — ver docs/ui-web.md) não tem
 * vaca, queijo ou grão de feijão. Estes três glifos existem só pra esse
 * momento narrativo pontual da intro; não viram um segundo sistema de ícone
 * de UI e não são reaproveitados fora daqui. Mesma régua de traço da Lucide:
 * 1.5px, sem preenchimento (exceto os pontinhos de olho/furo, detalhe comum
 * em ícones de traço), cantos arredondados.
 */
import type { ComponentPropsWithoutRef } from "react";

type IconProps = Omit<ComponentPropsWithoutRef<"svg">, "viewBox" | "fill">;

export function CowIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 6c-1-1.3-1-2.7 0-4M15 6c1-1.3 1-2.7 0-4" />
      <path d="M5 9 2.8 7.6M19 9l2.2-1.4" />
      <ellipse cx="12" cy="12" rx="6.5" ry="6" />
      <path d="M9 15.2c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.3 1.8-3 1.8-3-.8-3-1.8Z" />
      <circle cx="9.6" cy="10.8" r=".5" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="10.8" r=".5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CheeseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Bloco arredondado com furos, não cunha triangular — em 14px uma
          cunha lê como sinal de alerta antes de ler como queijo. */}
      <path d="M4 8.5c0-2 1.8-3.5 4-3.5h8c2.2 0 4 1.5 4 3.5v7c0 2-1.8 3.5-4 3.5H8c-2.2 0-4-1.5-4-3.5Z" />
      <circle cx="9.4" cy="9.6" r="1.2" />
      <circle cx="15" cy="13.4" r="1.4" />
      <circle cx="9" cy="15" r=".9" />
    </svg>
  );
}

export function BeanIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.5 5.8C4.8 7.8 3.5 11.5 5 14.8c1.5 3.3 5.3 5 8.7 3.6 3.4-1.4 5.1-5.2 3.6-8.6-1.1-2.5-3.3-4.2-5.7-4.5" />
      <path d="M8 15c1.3-2.3 3.6-4 6-4.8" />
    </svg>
  );
}
