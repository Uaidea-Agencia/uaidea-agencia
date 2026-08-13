export const ROUTES = {
  home: "/",
  posicionamento: "/#posicionamento",
  servicos: "/#servicos",
  tecnologia: "/#tecnologia",
  metodo: "/#metodo",
  cases: "/#cases",
  diferencial: "/#diferencial",
  contato: "/#contato",
  projetos: "/projetos",
  projeto: (slug: string) => `/projetos/${slug}` as const,
  email: "mailto:uaideamg@gmail.com",
  instagram: "https://instagram.com/uaidea.agencia",
} as const;
export type RouteKey = keyof typeof ROUTES;
