/**
 * Metadados institucionais do site.
 *
 * Fonte da verdade: docs/empresa.md. Nada aqui deve ser editado sem
 * conferir lá primeiro — campos ainda não confirmados ficam `null` e a UI
 * que os consumir deve renderizar `[ PENDENTE ]` visível, nunca omitir ou
 * inventar um valor (regra 9 do CLAUDE.md).
 */
export const SITE = {
  name: "UAIdea Agência",
  shortName: "UAIdea",
  tagline: null, // manifesto / posicionamento em uma frase — pendente
  description: "Agência de marketing digital que une estratégia, criação e tecnologia.",
  locale: "pt-BR",

  contact: {
    email: "uaideamg@gmail.com",
    instagramHandle: "@uaidea.agencia",
    instagramUrl: "https://instagram.com/uaidea.agencia",
    whatsapp: null, // pendente — docs/empresa.md
  },

  legal: {
    cnpj: null, // pendente
    address: null, // pendente
  },

  // Preenchido quando o domínio final for definido (docs/empresa.md).
  url: null,
} as const;
