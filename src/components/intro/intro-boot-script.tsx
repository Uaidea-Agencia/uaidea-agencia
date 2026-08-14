import Script from "next/script";

/**
 * Roda ANTES da hidratação, direto do HTML — nunca é importado nem chamado
 * como função normal. `IntroBootScript` só usa `.toString()` pra transformar
 * isto num `<script>` inline; escrever como função de verdade (em vez de
 * string crua) é só pra ganhar checagem de tipo e syntax highlight — o efeito
 * é o mesmo, o texto executado no navegador é este corpo aqui dentro.
 *
 * Por quê precisa ser inline e antes da hidratação: o servidor não sabe o que
 * tem no localStorage do visitante, então `SiteIntro` não pode decidir se a
 * intro toca no primeiro render sem ou (a) divergir do HTML do servidor (erro
 * de hidratação) ou (b) só decidir depois de montado, e aí pisca a home por
 * trás antes da intro cobrir a tela. `beforeInteractive` roda antes disso —
 * mesma técnica que o next-themes usa pra evitar flash de tema.
 *
 * `globals.css` (`html[data-intro="pending"] .site-intro`) é quem decide a
 * visibilidade inicial a partir do atributo que esta função escreve;
 * `SiteIntro` lê o atributo já montado, decide se toca a animação e limpa o
 * atributo em seguida.
 */
function bootIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const KEY = "uaidea:intro-last-seen";
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (window.localStorage.getItem(KEY) !== today) {
      document.documentElement.dataset.intro = "pending";
    }
  } catch {
    // localStorage indisponível (aba anônima, storage cheio) — sem intro hoje.
  }
}

export function IntroBootScript() {
  return (
    // A regra assume o modelo do Pages Router (_document.js); no App Router,
    // colocar `beforeInteractive` direto no root layout é o padrão
    // documentado pelo próprio Next para script que precisa rodar antes da
    // hidratação — ver node_modules/next/dist/docs/01-app/02-guides/scripts.md.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="uai-intro-boot" strategy="beforeInteractive">
      {`(${bootIntro.toString()})();`}
    </Script>
  );
}
