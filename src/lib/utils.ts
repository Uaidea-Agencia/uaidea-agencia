import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge de classes Tailwind — usado pelos componentes shadcn/ui. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Exaustividade de `switch`/`if` em union types — erro de compilação se um caso for esquecido. */
export function assertNever(value: never): never {
  throw new Error(`Caso não tratado: ${JSON.stringify(value)}`);
}
