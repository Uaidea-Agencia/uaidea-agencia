import { ROUTES } from "@/config/routes";

// Só as rotas estáticas (string) — exclui `projeto`, que é uma função
// (slug) => string, não um link de navegação direto.
type StaticRoute = Extract<(typeof ROUTES)[keyof typeof ROUTES], string>;

export interface NavLink {
  label: string;
  href: StaticRoute;
}

/** Header desktop — ordem narrativa da home. */
export const MAIN_NAV: NavLink[] = [
  { label: "Posicionamento", href: ROUTES.posicionamento },
  { label: "O que fazemos", href: ROUTES.servicos },
  { label: "Tecnologia", href: ROUTES.tecnologia },
  { label: "Método", href: ROUTES.metodo },
];

/** CTA fixo do header, fora da navegação principal. */
export const HEADER_CTA: NavLink = {
  label: "Falar com a gente",
  href: ROUTES.contato,
};

/** Menu mobile — mesma ordem do header + Trabalhos, numerado no design. */
export const MOBILE_NAV: NavLink[] = [...MAIN_NAV, { label: "Trabalhos", href: ROUTES.cases }];

/** Colunas do rodapé. */
export const FOOTER_NAV = {
  frentes: {
    title: "Frentes",
    links: [{ label: "Ver todas", href: ROUTES.servicos }] satisfies NavLink[],
  },
  agencia: {
    title: "Agência",
    links: [
      { label: "Posicionamento", href: ROUTES.posicionamento },
      { label: "Método", href: ROUTES.metodo },
      { label: "Trabalhos", href: ROUTES.cases },
      { label: "Diferencial", href: ROUTES.diferencial },
    ] satisfies NavLink[],
  },
} as const;
