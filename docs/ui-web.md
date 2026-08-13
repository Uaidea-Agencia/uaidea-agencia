# UAIdea — Camada de UI web

⚠ **Nada aqui vem do manual de marca.** São extensões desta implementação, criadas para cobrir o que o manual não trata (movimento, raio, gradiente, ícone, imagem). Podem ser discutidas e alteradas.

A hierarquia é: `marca.md` é lei · este arquivo é padrão do repositório · o resto é decisão de quem estiver construindo.

## Extensão tipográfica

O manual define **Montserrat + Poppins e proíbe substituição**. Isso continua valendo para títulos, texto corrido e interface.

Uma **terceira família é permitida como voz editorial pontual**, desde que não substitua nenhuma das duas:

| Papel              | Família                                                                                           | Onde pode aparecer                                                          | Onde não pode                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Editorial / ênfase | Serifada de contraste alto — sugestão: **Instrument Serif** ou **Newsreader**, ambas Google Fonts | Uma palavra dentro de um H1/H2, em itálico. Máximo **um momento por seção** | Texto corrido, botões, nav, labels, mais de uma palavra por título |
| Técnico / dado     | Monoespaçada — sugestão: **JetBrains Mono** ou **Geist Mono**                                     | Rótulos numerados (`01 —`), tags técnicas, números de contador, timestamps  | Qualquer texto que o visitante precise ler para entender a oferta  |

Regras: no máximo **três famílias no site inteiro** · a serifada nunca aparece em `p1` (a ênfase é tipográfica, não cromática — o manual é explícito nisso) · em mobile a serifada mantém o corpo proporcional, não vira decoração ilegível.

Se essa extensão for recusada pela direção de arte, o fallback é itálico de Montserrat — permitido, desde que seja o itálico real da família, nunca oblíquo sintético.

**Status na v2:** nenhuma seção usa a família serifada ainda — `src/app/layout.tsx` só carrega Montserrat, Poppins e JetBrains Mono via `next/font/google`. A proposta segue de pé para quando houver um momento editorial que peça esse destaque; até lá, não é preciso escolher entre Instrument Serif e Newsreader.

## Gradiente

O manual não menciona gradiente. Padrão adotado:

- **Fundo grande de seção** (o único caso que conta para o teto de página): sempre `p5 → p4` ou `p5 → #000`, ângulo entre 135° e 180° — radial equivalente (`p4 → p5` "caindo" a partir do topo, como o `.cta-gradient`) também vale, desde que a dupla de cor seja essa. Nunca com um roxo vibrante (`p1`–`p3`) como parada. Máximo **duas ocorrências na página inteira** nesta categoria.
- **Nunca em texto**, nunca em ícone, nunca em borda.
- **Glow / halo** (luz difusa atrás de um objeto ou canto de seção — `.hero-glow`, `.hero-glow-soft`, `.hero-orb`): pode usar `p1`–`p3` como fonte de luz — é justamente o ponto, simular luz roxa, não pintar uma superfície. Duas variantes, tetos diferentes:
  - **Glow que segue o cursor** (`.hero-glow`, `.hero-glow-soft`): opacidade ≤ 20%.
  - **Glow fixo de canto** (`.hero-orb`): opacidade ≤ 50%. Continua proibido como brilho de card ou de texto — é elemento de cena de fundo, não decoração de componente de UI.
  - Não conta para o teto de duas ocorrências de "fundo grande" acima — é categoria própria.
- **Gradiente de card** (ex.: variantes de `ProjectCard`): permitido usar `p3 → p5` ou `p4 → p5`, ângulo 150°, como fundo do card inteiro — é a mesma lógica do glow de canto aplicada a um componente, não a "gradiente roxo genérico de startup" que a regra original queria evitar, porque a cor vibrante nunca é parada isolada, sempre desliza para `p5`. Um card não conta para o teto de página; o teto aqui é **não introduzir uma terceira dupla de cor** além dessas duas sem atualizar esta lista.
- Textura de grade (linhas 1px em passo de 48–64px, usada no herói e na seção Tecnologia) não é gradiente de cor — é padrão repetitivo — e fica fora de todas as contagens acima.

Isso existe para impedir o "gradiente roxo genérico de startup": a restrição de cor vibrante vale para onde ela realmente parece pintura de fundo (seção inteira); em glow e card, o roxo vibrante é a própria luz, então a regra é opacidade/paleta fechada, não proibição de cor.

## Raio, borda, elevação

| Token         | Valor | Uso                     |
| ------------- | ----- | ----------------------- |
| `radius-sm`   | 4px   | Tags, chips, campos     |
| `radius-md`   | 8px   | Botões, cards           |
| `radius-lg`   | 16px  | Blocos grandes, mockups |
| `radius-full` | 999px | Toggles, avatares, pill |

Bordas: 1px `c3` em fundo claro, 1px branco a 10% de opacidade em fundo escuro.
**Sombra: não usar.** Profundidade se resolve por contraste de fundo (`c1` × `c2`, `p5` × `p4`), não por drop-shadow. Sem glassmorphism.

⚠ **Divergência de nomes com o código (`globals.css`):** a implementação usa cinco tokens, não quatro, e `radius-lg` **não** vale 16px lá — vale 8px, igual a `radius-md`. Quem carrega os 16px de "blocos grandes, mockups" é um token extra chamado `radius-xl`:

| Token no código | Valor | Bate com a linha da tabela acima                                                   |
| --------------- | ----- | ---------------------------------------------------------------------------------- |
| `--radius-sm`   | 4px   | `radius-sm` ✅                                                                     |
| `--radius-md`   | 8px   | `radius-md` ✅                                                                     |
| `--radius-lg`   | 8px   | ⚠️ deveria ser 16px pela tabela; no código é igual a `radius-md`                   |
| `--radius-xl`   | 16px  | é este que corresponde a "blocos grandes, mockups" — a tabela não previa esse nome |
| `--radius-full` | 999px | `radius-full` ✅                                                                   |

Pra quem for escrever CSS/Tailwind daqui pra frente: use `--radius-xl` (ou a classe `rounded-xl`) quando quiser os 16px de "blocos grandes, mockups" descritos nesta tabela — `rounded-lg` no código de hoje só entrega 8px. Alinhar o nome (renomear o token no CSS ou reescrever esta tabela para cinco níveis) é decisão de quem mexer em design system a seguir; até lá, esta nota é a referência de qual token faz o quê.

## Movimento

| Token           | Valor                                                 |
| --------------- | ----------------------------------------------------- |
| `duration-fast` | 150ms — hover, foco, mudança de estado                |
| `duration-base` | 300ms — transição de componente                       |
| `duration-slow` | 600ms — reveal de seção                               |
| `ease-out`      | `cubic-bezier(0.22, 1, 0.36, 1)` — padrão de entrada  |
| `ease-in-out`   | `cubic-bezier(0.65, 0, 0.35, 1)` — movimento contínuo |

Princípios: animar apenas `transform` e `opacity` · deslocamento de entrada máximo 24px · stagger de 60–80ms entre itens de uma lista · nada que atrase o conteúdo do herói (LCP não pode depender de JS).

**`prefers-reduced-motion: reduce` é obrigatório.** Com ele ativo: sem parallax, sem scroll horizontal, sem contador animado, sem cursor customizado, sem texto entrando letra a letra — tudo aparece no estado final. Isso não é opcional e não é degradação: é a versão acessível da mesma página.

Cursor customizado e hover magnético: permitidos apenas como camada extra sobre um alvo real de 44×44px que funcione com teclado. Se a interação só existir no mouse, não existe.

**Implementado:** `src/hooks/use-reduced-motion.ts` expõe o hook que os componentes interativos consultam (ex.: `Header` usa `reduceMotion` pra trocar `scrollTo({ behavior: "smooth" })` por `"auto"`). Ao adicionar uma seção nova com movimento, reaproveite esse hook em vez de checar a media query direto — mantém o comportamento consistente em todo o site.

## Ícones

Traço, não preenchimento. Peso 1.5px, corpo 24px, cantos arredondados. Biblioteca única em todo o site — sugestão **Lucide** (combina com a geometria de Montserrat/Poppins).

**Decidido:** Lucide é a biblioteca em uso (`lucide-react` no `package.json`, importado em `src/components/layout/header.tsx` e outros). Não introduzir uma segunda biblioteca de ícones.

Ícone é apoio, nunca protagonista: não usar ícone em cada item de lista, não usar ícone decorativo colorido em `p1`, não montar seção de serviços com um ícone por card.

## Imagem

O repertório da marca (visto no carrossel) é: **objeto sobre fundo escuro profundo, iluminação lateral roxa, alto contraste, sem pessoa em foto de banco de imagem.**

- Preferir objeto 3D, render, textura, macro ou captura de interface a foto de equipe genérica.
- Se usar fotografia, aplicar tratamento: dessaturar e reintroduzir roxo nas sombras, para a imagem pertencer ao sistema.
- Nunca stock de "pessoas sorrindo em reunião".
- Toda imagem carrega `alt` descritivo em pt-BR. Decorativa vai com `alt=""`.

**Status na v2:** a home ainda não usa nenhuma fotografia ou imagem de marca — as seções institucionais são só tipografia, ícone e UI (grade, glow, terminal simulado). `next/image` só entra hoje em `ProjectCard` e `VideoFacade`, ligados ao portfólio (`content/projects/`), onde cada projeto chega com seu próprio `alt` via `ProjectMedia`. Quando a home ganhar imagem de fato, as regras acima (objeto/render sobre fundo escuro, tratamento de fotografia) valem a partir desse primeiro caso — ainda não há precedente pra apontar.

## Layout

Container 1200px, 12 colunas, gutter 24px. Padding vertical de seção 96px desktop / 64px mobile. Confirmado em `src/components/layout/container.tsx` (`max-w-[1200px]`).

**Confirmado em 14/08/2026 — substitui a regra do carrossel de 6 cards.** A home cresceu para 9 seções e o ritmo oficial passou a ser a alternância claro/escuro a cada dobra (ou a cada duas, quando duas seções escuras seguidas fazem sentido de conteúdo), não mais "uma virada só". Ordem de referência, direto de `src/app/(site)/page.tsx`:

`Hero (escuro) → faixa de disciplinas (escura) → Posicionamento (claro) → Serviços (escuro) → Tecnologia (escuro, fundo p4) → Método (claro) → Trabalhos (escuro) → Diferencial (claro) → CTA final (escuro)`

Ou seja: **escuro, claro, escuro, escuro, claro, escuro, claro, escuro** — três viradas para claro. A função da virada deixou de ser exclusiva de "problema → solução" (não há espaço para isso numa página de 9 seções) e passou a marcar transição de assunto e dar respiro visual a cada uma ou duas dobras. Ao adicionar uma seção nova, siga essa cadência — não mais que duas seções escuras seguidas sem um respiro claro no meio, e vice-versa.
