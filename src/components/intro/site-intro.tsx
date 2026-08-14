"use client";

import { BrainCircuit, ChevronsRight, Code2, Gauge, Terminal, Workflow } from "lucide-react";
import { motion, type Variants } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type RefObject,
} from "react";

import { Logo } from "@/components/layout/logo";
import { HERO } from "@/content/home";

import { BeanIcon, CheeseIcon, CowIcon } from "./regional-icons";

/**
 * Precisa bater com a chave usada em `intro-boot-script.tsx` — é o mesmo
 * contrato (data de hoje em `localStorage`), só que quem escreve é este
 * componente (só ele sabe que a intro realmente tocou), e quem lê primeiro,
 * antes da hidratação, é o script.
 */
const STORAGE_KEY = "uaidea:intro-last-seen";

/** Overlay some sozinho depois desse tanto de tempo, mesmo sem interação. */
const AUTO_LEAVE_MS = 6600;
const LEAVE_DURATION = 0.6;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Quando o "UAIdea" montado por chip vira embaralhado (segundos, desde o início da reprodução). */
const SCRAMBLE_START = 3.4;
/** Quanto tempo o embaralhado leva pra decifrar de volta em "UAIdea", da esquerda pra direita. */
const SCRAMBLE_DURATION = 0.9;
const SCRAMBLE_CHARS = "01#$%&*+=/<>ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Phase = "pending" | "playing" | "leave" | "done";

interface FlightOffset {
  x: number;
  y: number;
}

interface ChipSpec {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  from: FlightOffset;
  delay: number;
}

/** Grão de feijão, queijo, boi e código — o repertório mineiro que "constrói" U, A e I. */
const REGIONAL_CHIPS: { u: ChipSpec; a: ChipSpec; i: ChipSpec; bean: ChipSpec } = {
  u: { label: "Código", Icon: Terminal, from: { x: -132, y: -74 }, delay: 0.35 },
  a: { label: "Queijo", Icon: CheeseIcon, from: { x: 122, y: -92 }, delay: 0.5 },
  i: { label: "Boi", Icon: CowIcon, from: { x: -104, y: 92 }, delay: 0.65 },
  bean: { label: "Feijão", Icon: BeanIcon, from: { x: 96, y: -108 }, delay: 0.85 },
};

/** IA, automação, gestão e desenvolvimento — chegam de outro jeito e grudam no "UAI". */
const TECH_CHIPS: ChipSpec[] = [
  { label: "IA", Icon: BrainCircuit, from: { x: 6, y: -134 }, delay: 1.9 },
  { label: "Automação", Icon: Workflow, from: { x: 124, y: 58 }, delay: 2.05 },
  { label: "Gestão", Icon: Gauge, from: { x: -74, y: 96 }, delay: 2.2 },
  { label: "Desenvolvimento", Icon: Code2, from: { x: 84, y: -88 }, delay: 2.35 },
];

const BEAN_DOT_DELAY = 1.3;

/**
 * O grupo (montagem por chip + embaralhado, mais abaixo) segura até
 * SCRAMBLE_START + SCRAMBLE_DURATION + folga, depois some pro logo real
 * assumir. Duração e `times` recalculados sempre que os tempos acima mudam.
 */
const GROUP_FADE_START = SCRAMBLE_START + SCRAMBLE_DURATION + 0.25;
const GROUP_TOTAL_DURATION = GROUP_FADE_START + 0.4;

const groupVariants: Variants = {
  rest: { opacity: 1 },
  in: {
    opacity: [1, 1, 0],
    // `ease` precisa ser um array com uma entrada por segmento — um valor
    // único faz o motion redistribuir os keyframes por conta própria e
    // ignorar `times`, o que quebrava o "segura e só depois some".
    transition: {
      duration: GROUP_TOTAL_DURATION,
      times: [0, GROUP_FADE_START / GROUP_TOTAL_DURATION, 1],
      ease: ["linear", "easeOut"],
    },
  },
};

const logoVariants: Variants = {
  rest: { opacity: 0, scale: 0.92 },
  in: {
    opacity: 1,
    scale: 1,
    transition: { delay: GROUP_FADE_START + 0.1, duration: 0.55, ease: EASE_OUT },
  },
};

const STATUS_ROW_DELAY = GROUP_FADE_START + 0.1 + 0.55 + 0.05;

const loadingTextVariants: Variants = {
  rest: { opacity: 0 },
  in: {
    opacity: [0, 1, 1, 0],
    transition: {
      delay: STATUS_ROW_DELAY,
      duration: 0.9,
      times: [0, 0.22, 0.7, 1],
      // Um `ease` único redistribui os keyframes por conta própria e ignora
      // `times` (visto isolando o bug com screenshots cronometrados) — cada
      // segmento pede sua própria curva pra `times` valer o que diz.
      ease: ["easeOut", "linear", "easeIn"],
    },
  },
};

const taglineVariants: Variants = {
  rest: { opacity: 0 },
  in: {
    opacity: [0, 0, 1],
    transition: {
      delay: STATUS_ROW_DELAY,
      duration: 1.1,
      times: [0, 0.75, 1],
      ease: ["linear", "easeOut"],
    },
  },
};

const progressVariants: Variants = {
  rest: { width: "0%" },
  in: { width: "100%", transition: { delay: STATUS_ROW_DELAY, duration: 0.85, ease: "easeInOut" } },
};

/** Fila embaralhada assume assim que os chips terminam de montar o "UAIdea" estático. */
const staticAssemblyVariants: Variants = {
  rest: { opacity: 1 },
  in: { opacity: 0, transition: { delay: SCRAMBLE_START, duration: 0.15, ease: "easeIn" } },
};

const scrambleWrapperVariants: Variants = {
  rest: { opacity: 0 },
  in: { opacity: 1, transition: { delay: SCRAMBLE_START, duration: 0.15, ease: "easeOut" } },
};

function letterVariants(fillDelay: number): Variants {
  return {
    rest: { opacity: 0.08 },
    in: { opacity: 1, transition: { delay: fillDelay, duration: 0.35, ease: EASE_OUT } },
  };
}

function chipVariants({ from, delay }: Pick<ChipSpec, "from" | "delay">): Variants {
  return {
    rest: { x: from.x, y: from.y, opacity: 0, scale: 0.5 },
    in: {
      x: [from.x, 0, 0],
      y: [from.y, 0, 0],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.3],
      transition: {
        delay,
        duration: 0.85,
        times: [0, 0.6, 1],
        ease: [EASE_OUT, "easeIn"],
      },
    },
  };
}

function Chip({ label, Icon, from, delay }: ChipSpec) {
  return (
    <motion.div
      aria-hidden="true"
      className="border-(--w)/15 bg-(--p4)/85 text-(--w) flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap uppercase"
      variants={chipVariants({ from, delay })}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </motion.div>
  );
}

function ChipAnchor({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{children}</div>
  );
}

interface LetterCellProps {
  letter: string;
  chip: ChipSpec;
  fillDelay: number;
  bean?: ChipSpec;
}

function LetterCell({ letter, chip, fillDelay, bean }: LetterCellProps) {
  return (
    <div className="relative">
      <motion.span
        aria-hidden="true"
        className="text-(--w) block font-mono text-[clamp(2.75rem,9vw,5.5rem)] leading-none font-bold"
        variants={letterVariants(fillDelay)}
      >
        {letter}
      </motion.span>

      <ChipAnchor>
        <Chip {...chip} />
      </ChipAnchor>

      {bean && (
        <div className="absolute top-0 left-1/2 h-[0.6em] w-[0.4em] -translate-x-1/2 translate-y-[-1.7em]">
          <div className="absolute inset-0 flex items-center justify-center">
            <Chip {...bean} />
          </div>
          <motion.div
            aria-hidden="true"
            className="bg-primary animate-pulse-soft absolute inset-0 rounded-[45%]"
            style={{ rotate: -12 }}
            variants={{
              rest: { opacity: 0, scale: 0.3 },
              in: {
                opacity: 1,
                scale: 1,
                transition: { delay: BEAN_DOT_DELAY, duration: 0.5, ease: EASE_OUT },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

function DeaSlot() {
  return (
    <div className="relative ml-1 flex items-end sm:ml-2">
      <motion.span
        aria-hidden="true"
        className="text-(--w) block font-mono text-[clamp(2.75rem,9vw,5.5rem)] leading-none font-bold"
        variants={letterVariants(2.8)}
      >
        dea
      </motion.span>

      {TECH_CHIPS.map((chip) => (
        <ChipAnchor key={chip.label}>
          <Chip {...chip} />
        </ChipAnchor>
      ))}
    </div>
  );
}

interface ScrambleRevealProps {
  text: string;
  active: boolean;
  startDelay: number;
  duration: number;
  /** Índice do caractere que carrega o acento do grão (o "i" de UAIdea). */
  accentIndex?: number;
}

/**
 * Assume o lugar do "UAIdea" montado por chip e reescreve embaralhado —
 * decifra de volta pra "UAIdea" da esquerda pra direita, como um terminal
 * decodificando um valor.
 *
 * Os caracteres trocam via `textContent` direto no DOM (`requestAnimationFrame`
 * escrevendo em refs), não `useState` — a ~60fps por 0.9s isso é muita
 * escrita pra passar pelo reconciliador do React à toa; mesma lógica de
 * `hero-pointer-glow.tsx` pra `--mx/--my`. O primeiro render (servidor e
 * cliente) sempre mostra o texto certo, sem aleatoriedade — zero risco de
 * divergência de hidratação; embaralhar só acontece depois, via efeito.
 */
function ScrambleReveal({ text, active, startDelay, duration, accentIndex }: ScrambleRevealProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!active) {
      return;
    }
    let frameId = 0;
    const chars = text.split("");
    const startTimeout = window.setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min((now - start) / (duration * 1000), 1);
        const revealCount = Math.floor(progress * chars.length);
        chars.forEach((char, i) => {
          const el = charRefs.current[i];
          if (!el) {
            return;
          }
          el.textContent =
            i < revealCount
              ? char
              : (SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? char);
        });
        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        }
      }
      frameId = requestAnimationFrame(tick);
    }, startDelay * 1000);
    return () => {
      window.clearTimeout(startTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [active, text, startDelay, duration]);

  return (
    <span
      aria-hidden="true"
      className="text-(--w) block font-mono text-[clamp(2.75rem,9vw,5.5rem)] leading-none font-bold"
    >
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          ref={(el) => {
            charRefs.current[index] = el;
          }}
          className={index === accentIndex ? "relative inline-block" : undefined}
        >
          {char}
          {index === accentIndex && (
            <span
              aria-hidden="true"
              className="bg-primary animate-pulse-soft absolute top-0 left-1/2 h-[0.6em] w-[0.4em] rounded-[45%]"
              style={{ transform: "translate(-50%, -1.7em) rotate(-12deg)" }}
            />
          )}
        </span>
      ))}
    </span>
  );
}

export function SiteIntro() {
  const [phase, setPhase] = useState<Phase>("pending");
  const decidedRef = useRef(false);
  const skipButtonRef: RefObject<HTMLButtonElement | null> = useRef(null);

  // Decide, uma vez, se a intro toca hoje. O script em `intro-boot-script.tsx`
  // já filtrou reduced-motion e escreveu (ou não) `data-intro="pending"` em
  // `<html>` antes da hidratação — aqui só lemos essa decisão.
  //
  // `decidedRef` existe por causa do StrictMode: em dev o React roda todo
  // efeito duas vezes de propósito, e ler+apagar o atributo não é idempotente
  // — na segunda passada ele já teria sumido e a intro pularia direto pra
  // "done". O guard garante que só a primeira execução conta.
  useEffect(() => {
    if (decidedRef.current) {
      return;
    }
    decidedRef.current = true;

    const pending = document.documentElement.dataset.intro === "pending";
    delete document.documentElement.dataset.intro;

    if (!pending) {
      // Decisão só existe depois de ler o atributo escrito pelo script de
      // boot, que não existe ainda no primeiro render (ver comentário acima).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }

    try {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      window.localStorage.setItem(STORAGE_KEY, today);
    } catch {
      // localStorage indisponível (aba anônima, storage cheio) — a intro
      // ainda toca hoje, só não fica marcada pra não repetir amanhã.
    }

    document.body.style.overflow = "hidden";
    document.getElementById("page-content")?.setAttribute("inert", "");
    setPhase("playing");
  }, []);

  // Some sozinho depois de AUTO_LEAVE_MS, a menos que o visitante já tenha pulado.
  useEffect(() => {
    if (phase !== "playing") {
      return;
    }
    const timeout = window.setTimeout(() => {
      setPhase("leave");
    }, AUTO_LEAVE_MS);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [phase]);

  // Manda o foco pro botão "Pular" assim que a intro entra em cena — o resto
  // da página está `inert`, então é o único destino possível; sem isso quem
  // navega por teclado/leitor de tela fica sem saber onde o foco está.
  useEffect(() => {
    if (phase === "playing") {
      skipButtonRef.current?.focus();
    }
  }, [phase]);

  // Esc pula a intro a qualquer momento durante a reprodução.
  useEffect(() => {
    if (phase !== "playing") {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPhase("leave");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase]);

  // Rede de segurança: garante que scroll e foco do resto do site voltam ao
  // normal mesmo se o componente desmontar de um jeito inesperado.
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.getElementById("page-content")?.removeAttribute("inert");
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Introdução UAIdea Agência"
      className={`site-intro dark bg-background text-foreground fixed inset-0 z-100 flex items-center justify-center overflow-hidden ${
        phase === "leave" ? "pointer-events-none" : ""
      }`}
      initial={{ opacity: 1 }}
      animate={phase === "leave" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: LEAVE_DURATION, ease: EASE_OUT }}
      onAnimationComplete={() => {
        if (phase === "leave") {
          document.body.style.overflow = "";
          document.getElementById("page-content")?.removeAttribute("inert");
          setPhase("done");
        }
      }}
      onClick={() => {
        if (phase === "playing") {
          setPhase("leave");
        }
      }}
    >
      <div aria-hidden="true" className="hero-grid" />
      <div aria-hidden="true" className="hero-glow-soft" />
      <div aria-hidden="true" className="hero-orb" />

      <p className="sr-only">
        Carregando o site da UAIdea Agência. Pressione Pular ou Esc para continuar imediatamente.
      </p>

      <motion.div
        className="relative flex flex-col items-center px-6 text-center"
        initial="rest"
        animate={phase === "pending" ? "rest" : "in"}
      >
        <motion.div className="relative flex items-end" variants={groupVariants}>
          <motion.div className="flex items-end" variants={staticAssemblyVariants}>
            <div className="flex items-end gap-1 sm:gap-2">
              <LetterCell letter="U" chip={REGIONAL_CHIPS.u} fillDelay={0.78} />
              <LetterCell letter="A" chip={REGIONAL_CHIPS.a} fillDelay={0.93} />
              <LetterCell
                letter="I"
                chip={REGIONAL_CHIPS.i}
                fillDelay={1.08}
                bean={REGIONAL_CHIPS.bean}
              />
            </div>
            <DeaSlot />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 flex items-end justify-center"
            variants={scrambleWrapperVariants}
          >
            <ScrambleReveal
              text="UAIdea"
              active={phase !== "pending"}
              startDelay={SCRAMBLE_START}
              duration={SCRAMBLE_DURATION}
              accentIndex={2}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          variants={logoVariants}
        >
          <Logo width={220} className="h-auto w-[clamp(160px,32vw,240px)]" />
        </motion.div>

        <div className="relative mt-9 h-5 w-full">
          <motion.p
            aria-hidden="true"
            className="text-(--c6) absolute inset-x-0 font-mono text-[11px] tracking-[0.14em] uppercase"
            variants={loadingTextVariants}
          >
            carregando<span className="animate-blink">_</span>
          </motion.p>
          <motion.p
            aria-hidden="true"
            className="text-(--c6) absolute inset-x-0 font-mono text-[11px] tracking-[0.14em] uppercase"
            variants={taglineVariants}
          >
            {HERO.eyebrow}
          </motion.p>
        </div>

        <div className="bg-(--p4) mt-3 h-0.5 w-40 overflow-hidden rounded-full">
          <motion.div className="bg-primary h-full" variants={progressVariants} />
        </div>
      </motion.div>

      {phase === "playing" && (
        <button
          ref={skipButtonRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setPhase("leave");
          }}
          className="border-(--w)/15 bg-(--w)/5 text-(--w)/70 hover:text-(--w) hover:border-(--w)/35 focus-visible:ring-ring absolute right-5 bottom-5 flex min-h-11 items-center gap-1.5 rounded-full border px-4 font-mono text-[11px] tracking-[0.08em] uppercase outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--p5) sm:right-8 sm:bottom-8"
        >
          Pular
          <ChevronsRight aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </motion.div>
  );
}
