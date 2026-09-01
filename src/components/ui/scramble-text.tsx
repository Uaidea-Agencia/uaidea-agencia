"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Ver docs/ui-web.md → Movimento: duration-slow (reveal de seção) e stagger
// 60–80ms são os tokens de referência; a curva abaixo aproxima o ease-out
// cubic-bezier(0.22, 1, 0.36, 1) já usado em `Reveal`.
const DURATION_MS = 600;
const FRAME_INTERVAL_MS = 32;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function scrambleAt(text: string, revealCount: number) {
  return text
    .split("")
    .map((char, index) => (char === " " || index < revealCount ? char : randomChar()))
    .join("");
}

interface ScrambleTextProps {
  /** Texto final — sempre em pt-BR, vindo de `config/nav.ts`. */
  text: string;
  /** Passa a `true` no momento em que o item deve embaralhar e se ajustar. */
  active: boolean;
  /** Atraso em ms antes de começar — usar múltiplo de ~70ms para stagger entre itens. */
  delay?: number;
  className?: string;
}

/**
 * Efeito "letras embaralhadas se ajustando" usado na abertura do menu mobile.
 * Com `prefers-reduced-motion`, mostra o texto final direto (obrigatório —
 * ver docs/ui-web.md → Movimento).
 */
export function ScrambleText({ text, active, delay = 0, className }: ScrambleTextProps) {
  const reduceMotion = useReducedMotion();
  const showScramble = active && !reduceMotion;
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!showScramble) {
      return;
    }

    let frame = 0;
    let startTimestamp: number | null = null;
    let lastFrameAt = 0;

    function tick(timestamp: number) {
      startTimestamp ??= timestamp + delay;
      const elapsed = timestamp - startTimestamp;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const revealCount = Math.floor(easeOutCubic(progress) * text.length);
      if (timestamp - lastFrameAt >= FRAME_INTERVAL_MS || progress >= 1) {
        lastFrameAt = timestamp;
        setDisplay(revealCount >= text.length ? text : scrambleAt(text, revealCount));
      }
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setDisplay(text);
    };
  }, [showScramble, text, delay]);

  return (
    <span className={className}>
      <span aria-hidden="true">{showScramble ? display : text}</span>
      {/* Nome acessível estável — nunca expõe o texto embaralhado a leitores de tela. */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
