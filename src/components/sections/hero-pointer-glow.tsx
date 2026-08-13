"use client";

import { useEffect } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
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
