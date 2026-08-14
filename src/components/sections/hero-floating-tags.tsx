"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FloatingTag {
  label: string;
  top: string;
  right: string;
  entranceDelay: number;
  floatDelay: number;
  floatDuration: number;
}

/**
 * Rótulos vindos de `DISCIPLINES` (`@/content/home` — já aprovados, já no ar
 * na faixa animada) — nada de vocabulário novo só pra preencher espaço
 * decorativo do herói. Texto literal (não `DISCIPLINES[n]`) porque é um
 * subconjunto reordenado pro layout, e `noUncheckedIndexedAccess` tornaria o
 * acesso por índice mais confuso do que só repetir a palavra.
 */
const FLOATING_TAGS: FloatingTag[] = [
  {
    label: "Estratégia",
    top: "8%",
    right: "6%",
    entranceDelay: 0.15,
    floatDelay: 0,
    floatDuration: 4.2,
  },
  {
    label: "Desenvolvimento web",
    top: "24%",
    right: "30%",
    entranceDelay: 0.4,
    floatDelay: 0.5,
    floatDuration: 5.1,
  },
  {
    label: "Tráfego pago",
    top: "42%",
    right: "3%",
    entranceDelay: 0.65,
    floatDelay: 1,
    floatDuration: 4.6,
  },
  {
    label: "IA e automação",
    top: "4%",
    right: "44%",
    entranceDelay: 0.25,
    floatDelay: 0.2,
    floatDuration: 4.9,
  },
  {
    label: "Design",
    top: "58%",
    right: "16%",
    entranceDelay: 0.9,
    floatDelay: 1.4,
    floatDuration: 3.8,
  },
];

interface TagProps {
  tag: FloatingTag;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  reduceMotion: boolean;
}

function Tag({ tag, y, opacity, reduceMotion }: TagProps) {
  return (
    <motion.div
      className="absolute hidden xl:block"
      style={
        reduceMotion
          ? { top: tag.top, right: tag.right }
          : { top: tag.top, right: tag.right, y, opacity }
      }
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduceMotion ? 0 : tag.entranceDelay,
          duration: reduceMotion ? 0 : 0.7,
          ease: EASE_OUT,
        }}
      >
        <motion.span
          className="border-(--w)/15 bg-(--w)/5 text-(--w)/55 inline-block rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase backdrop-blur-sm"
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  delay: tag.floatDelay,
                  duration: tag.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          {tag.label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/**
 * Tags soltas no espaço vazio à direita do título — flutuam, sobem/descem
 * suave e continuamente, e ficam presas ao scroll do próprio herói: `y` e
 * `opacity` seguem `scrollYProgress` de 0 (topo do herói) a 1 (herói saiu de
 * cena, Posicionamento entrando), então elas afundam e somem exatamente
 * quando a seção termina, e voltam ao subir de volta pro topo.
 *
 * `reduceMotion`: nada de flutuação contínua nem parallax de scroll (regra
 * de `docs/ui-web.md`) — as tags aparecem paradas na posição final e saem de
 * cena só porque `#hero` (o pai) rola normalmente, sem transform extra.
 */
export function HeroFloatingTags() {
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div ref={wrapperRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {FLOATING_TAGS.map((tag) => (
        <Tag key={tag.label} tag={tag} y={y} opacity={opacity} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}
