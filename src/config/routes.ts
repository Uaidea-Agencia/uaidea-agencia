/**
 * Fonte única de rotas e âncoras do site.
 *
 * Nenhum `href` literal deve aparecer em JSX — sempre importar `ROUTES`
 * daqui. Como as chaves derivam de `as const`, um link para uma rota que
 * deixou de existir vira erro de compilação em vez de 404 em produção.
 */
export const ROUTES = {
  home: "/",

  // Âncoras da home — a ordem aqui reflete a ordem narrativa das seções
  // (ver docs/ui-web.md e docs/tom-de-voz.md).
  posicionamento: "/#posicionamento",
  servicos: "/#servicos",
  tecnologia: "/#tecnologia",
  metodo: "/#metodo",
  cases: "/#cases",
  diferencial: "/#diferencial",
  contato: "/#contato",

  // Portfólio (Prompt 5).
  projetos: "/projetos",
  projeto: (slug: string) => `/projetos/${slug}` as const,

  // Contato externo — confirmados em docs/empresa.md.
  email: "mailto:uaideamg@gmail.com",
  instagram: "https://instagram.com/uaidea.agencia",
} as const;

export type RouteKey = keyof typeof ROUTES;
