import { z } from "zod";
const imageSchema = z.object({
  type: z.literal("image"),
  src: z
    .string()
    .startsWith(
      "/projects/",
      'imagem deve estar em public/projects/<slug>/ e src começar com "/projects/"',
    ),
  alt: z.string().min(1, "toda imagem precisa de alt em pt-BR"),
});
const videoSchema = z.object({
  type: z.literal("video"),
  provider: z.enum(["youtube", "vimeo"]),
  id: z.string().min(1),
  title: z.string().min(1),
  thumbnail: z.string().optional(),
});
const mediaSchema = z.discriminatedUnion("type", [imageSchema, videoSchema]);
export const projectFileSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug deve ser kebab-case (ex.: nome-do-cliente)"),
  cliente: z.string().min(1),
  categoria: z.string().min(1),
  ano: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  resumo: z.string().min(1),
  problema: z.string().min(1),
  solucao: z.string().min(1),
  resultado: z.string().min(1).optional(),
  destaque: z.boolean().default(false),
  ordem: z.number().int(),
  midia: z.array(mediaSchema).default([]),
});
export type ProjectFile = z.infer<typeof projectFileSchema>;
