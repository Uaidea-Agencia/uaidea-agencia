import { z } from "zod";
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
  consentimento: z.boolean().refine((value) => value, {
    message: "Precisamos do seu aceite pra poder responder",
  }),
});
export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFormValues = z.input<typeof contactSchema>;
