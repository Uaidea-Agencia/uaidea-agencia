import { cn } from "@/lib/utils";
const TONE_CLASSES = {
  light: "text-(--p3)",
  dark: "text-primary",
  mid: "text-(--w) opacity-70",
} as const;
interface SectionLabelProps {
  children: string;
  tone: keyof typeof TONE_CLASSES;
  className?: string;
}
export function SectionLabel({ children, tone, className }: SectionLabelProps) {
  return (
    <p
      className={cn("font-mono text-xs tracking-[0.14em] uppercase", TONE_CLASSES[tone], className)}
    >
      {children}
    </p>
  );
}
