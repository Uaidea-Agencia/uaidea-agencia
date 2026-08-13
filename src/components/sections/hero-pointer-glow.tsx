"use client";

import { useEffect } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Não renderiza nada — só liga o glow do hero à posição do mouse,
 * atualizando --mx/--my no elemento #hero (docs/ui-web.md: hero-grid,
 * hero-glow e hero-glow-soft usam essas variáveis, com fallback 60%/40%
 * pra continuar válidas mesmo sem este componente rodar).
 *
 * Isolado do Hero (Server Component) de propósito: o conteúdo do herói
 * nunca depende deste componente pra existir na página. Com reduced
 * motion, o listener nem é anexado — o glow fica parado no fallback, que
 * já é um estado final válido.
 */
export function HeroPointerGlow() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const hero = document.getElementById("hero");
    if (!hero) {
      return;
    }

    // Arrow function, não function declaration: preserva o narrowing de
    // `hero` (TS não propaga o `if (!hero) return` acima para dentro de
    // uma function declaration aninhada).
    const handlePointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const mx = (((event.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const my = (((event.clientY - rect.top) / rect.height) * 100).toFixed(1);
      hero.style.setProperty("--mx", `${mx}%`);
      hero.style.setProperty("--my", `${my}%`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [reduceMotion]);

  return null;
}
