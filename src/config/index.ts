// Barrel de config — import único (`@/config`) para quem consome mais de
// um destes arquivos. Os caminhos diretos (`@/config/site`, etc.)
// continuam funcionando normalmente; isto é um atalho, não substituição.
export { BASES } from "./bases";
export type { NavLink } from "./nav";
export { FOOTER_NAV, HEADER_CTA, MAIN_NAV, MOBILE_NAV } from "./nav";
export type { RouteKey } from "./routes";
export { ROUTES } from "./routes";
export { SITE } from "./site";
