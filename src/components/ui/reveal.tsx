"use client";

import type { ComponentPropsWithoutRef, ComponentType } from "react";

import { motion, type Variants } from "motion/react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
const DURATION_SLOW = 0.6;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STAGGER_STEP = 0.07;
const MAX_STAGGER_INDEX = 5;
const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  a: motion.a,
} as const;
type MotionTag = keyof typeof MOTION_TAGS;
type RevealProps<T extends MotionTag> = {
  as?: T;
  index?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "index">;
export function Reveal<T extends MotionTag = "div">({
  index = 0,
  as,
  className,
  children,
  ...props
}: RevealProps<T>) {
  const reduceMotion = useReducedMotion();
  const Component = MOTION_TAGS[as ?? "div"] as ComponentType<Record<string, unknown>>;
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
