"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => {
    mql.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// No servidor não existe matchMedia — assume "sem preferência" até hidratar.
// Isso nunca deixa o usuário com reduced-motion preso num estado animado:
// as animações que dependem deste hook (reveal-on-scroll, glow do mouse) só
// rodam em componentes client abaixo da dobra, então chegam sempre já
// hidratadas antes de entrarem em viewport. O que realmente precisa
// funcionar sem JS (o herói) usa CSS puro com a media query diretamente,
// não este hook — ver src/app/globals.css.
function getServerSnapshot() {
  return false;
}

/**
 * Hook único de `prefers-reduced-motion`, usado por todo componente
 * animado (docs/ui-web.md: obrigatório, não é degradação — é a versão
 * acessível da mesma página).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
