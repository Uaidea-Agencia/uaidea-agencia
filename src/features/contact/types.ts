/**
 * Separado de actions.ts de propósito: um arquivo "use server" só pode
 * exportar funções async (Next.js) — ContactActionState (tipo) e
 * CONTACT_IDLE_STATE (objeto) quebrariam essa regra se ficassem lá.
 */
export interface ContactActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const CONTACT_IDLE_STATE: ContactActionState = { status: "idle" };
