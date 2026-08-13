import { z } from "zod";

/**
 * Schema único do formulário de contato — importado pelo client
 * (react-hook-form + zodResolver) e pela Server Action
 * (features/contact/actions.ts). Validação no servidor não é opcional:
 * o cliente pode ser burlado.
 *
 * Honeypot e timestamp anti-bot ficam FORA deste schema de propósito —
 * não são campos que a pessoa preenche ou corrige, então não fazem
 * sentido no fluxo de validação/erro do react-hook-form. A Server Action
 * lê os dois direto do FormData antes de chegar aqui.
 */

// docs/empresa.md, tabela de Serviços — nunca adicionar opção sem
// confirmar lá primeiro (regra 7, CLAUDE.md).
export const SERVICE_OPTIONS = [
  "Tráfego pago",
  "Design gráfico",
  "Social media",
  "Desenvolvimento web",
  "Produtos web",
  "Estratégia",
  "IA e automação",
] as const;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export const contactSchema = z.object({
  nome: z.string().trim().min(2, "Escreva seu nome completo").max(120, "Nome muito longo"),
  email: z.email("E-mail inválido").trim(),
  telefone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? onlyDigits(value) : undefined))
    .refine((value) => !value || value.length === 10 || value.length === 11, {
      message: "Telefone inválido — DDD + número",
    }),
  empresa: z
    .string()
    .trim()
    .max(120, "Nome de empresa muito longo")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  servico: z.enum(SERVICE_OPTIONS, {
    message: "Escolha uma frente da lista",
  }),
  mensagem: z
    .string()
    .trim()
    .min(10, "Conte um pouco mais — mínimo 10 caracteres")
    .max(2000, "Mensagem muito longa"),
  // boolean, não literal(true): o default de um checkbox desmarcado é
  // false, e um tipo `true` literal obriga um cast feio no valor inicial
  // do formulário. O refine já garante que só `true` passa na validação.
  consentimento: z.boolean().refine((value) => value, {
    message: "Precisamos do seu aceite pra poder responder",
  }),
});

/** Formato validado (pós-transform) — o que a Server Action recebe. */
export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Formato do formulário (pré-transform) — o que o react-hook-form
 * gerencia. Difere de ContactInput porque telefone/empresa têm
 * `.transform()`: a entrada é `string | undefined` sempre presente
 * (campo controlado), a saída validada é opcional de verdade.
 */
export type ContactFormValues = z.input<typeof contactSchema>;
