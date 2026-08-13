import { ROUTES } from "@/config/routes";
type StaticRoute = Extract<(typeof ROUTES)[keyof typeof ROUTES], string>;
export interface NavLink {
  label: string;
  href: StaticRoute;
}
export const MAIN_NAV: NavLink[] = [
  { label: "Posicionamento", href: ROUTES.posicionamento },
  { label: "O que fazemos", href: ROUTES.servicos },
  { label: "Tecnologia", href: ROUTES.tecnologia },
  { label: "Método", href: ROUTES.metodo },
  { label: "Trabalhos", href: ROUTES.cases },
  { label: "Diferencial", href: ROUTES.diferencial },
];
export const HEADER_CTA: NavLink = {
  label: "Falar com a gente",
  href: ROUTES.contato,
};
export const MOBILE_NAV: NavLink[] = MAIN_NAV;
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
