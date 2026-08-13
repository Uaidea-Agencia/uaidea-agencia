"use client";

import type { ComponentPropsWithoutRef, ComponentType } from "react";

import { motion, type Variants } from "motion/react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

// docs/ui-web.md — duration-slow (reveal de seção) + ease-out padrão de
// entrada. Deslocamento máximo de 24px, só transform e opacity.
const DURATION_SLOW = 0.6;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STAGGER_STEP = 0.07; // 60–80ms entre itens de uma lista
const MAX_STAGGER_INDEX = 5;

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Componentes motion.* são estáveis (a lib já memoiza internamente) — só
// os tags HTML que os componentes de seção realmente usam com `as`.
// Criar via motion.create() dentro do render violaria
// react-hooks/static-components (remonta a árvore a cada render).
const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  a: motion.a,
} as const;

type MotionTag = keyof typeof MOTION_TAGS;

type RevealProps<T extends MotionTag> = {
  /** Elemento HTML a renderizar — default div, mas aceita li/a. */
  as?: T;
  /** Índice do item numa lista, para o stagger de 60–80ms (cap em 5). */
  index?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "index">;

/**
 * Wrapper de reveal-on-scroll para tudo abaixo da dobra — porta o
 * IntersectionObserver de support.js pro Motion. Único ponto que decide
 * "anima ou não" via useReducedMotion: com reduced motion ativo, o
 * conteúdo nasce direto no estado final, sem classe escondida nem salto.
 *
 * Não usar no herói — o herói é Server Component e anima só via CSS
 * (ver src/app/globals.css), porque LCP não pode depender de JS.
 */
export function Reveal<T extends MotionTag = "div">({
  index = 0,
  as,
  className,
  children,
  ...props
}: RevealProps<T>) {
  const reduceMotion = useReducedMotion();
  // MOTION_TAGS é uma união de três componentes com props diferentes entre
  // si (motion.a tem href, motion.li não) — o JSX não consegue checar essa
  // união contra o spread genérico de `props`. Cast local e explícito só
  // pra essa linha; a API pública (RevealProps<T>) continua com o tipo
  // certo por elemento pra quem chama <Reveal as="..." />.
  const Component = MOTION_TAGS[as ?? "div"] as ComponentType<Record<string, unknown>>;

  // Com reduced motion, `visible` é aplicado via `animate` — incondicional,
  // não depende do IntersectionObserver do `whileInView` ter disparado.
  // Sem isso, um usuário que pula direto pra uma seção (leitor de tela,
  // busca na página) podia ver o conteúdo em branco até rolar a página.
  return (
    <Component
      className={className}
      variants={variants}
      initial={reduceMotion ? "visible" : "hidden"}
      animate={reduceMotion ? "visible" : undefined}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "0px 0px -12% 0px", amount: 0.08 }}
      transition={{
        duration: reduceMotion ? 0 : DURATION_SLOW,
        ease: EASE_OUT,
        delay: reduceMotion ? 0 : Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
