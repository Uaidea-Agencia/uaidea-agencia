# UAIdea — Camada de UI web

⚠ **Nada aqui vem do manual de marca.** São extensões desta implementação, criadas para cobrir o que o manual não trata (movimento, raio, gradiente, ícone, imagem). Podem ser discutidas e alteradas.

A hierarquia é: `marca.md` é lei · este arquivo é padrão do repositório · o resto é decisão de quem estiver construindo.

## Extensão tipográfica

O manual define **Montserrat + Poppins e proíbe substituição**. Isso continua valendo para títulos, texto corrido e interface.

Uma **terceira família é permitida como voz editorial pontual**, desde que não substitua nenhuma das duas:

| Papel | Família | Onde pode aparecer | Onde não pode |
|---|---|---|---|
| Editorial / ênfase | Serifada de contraste alto — sugestão: **Instrument Serif** ou **Newsreader**, ambas Google Fonts | Uma palavra dentro de um H1/H2, em itálico. Máximo **um momento por seção** | Texto corrido, botões, nav, labels, mais de uma palavra por título |
| Técnico / dado | Monoespaçada — sugestão: **JetBrains Mono** ou **Geist Mono** | Rótulos numerados (`01 —`), tags técnicas, números de contador, timestamps | Qualquer texto que o visitante precise ler para entender a oferta |

Regras: no máximo **três famílias no site inteiro** · a serifada nunca aparece em `p1` (a ênfase é tipográfica, não cromática — o manual é explícito nisso) · em mobile a serifada mantém o corpo proporcional, não vira decoração ilegível.

Se essa extensão for recusada pela direção de arte, o fallback é itálico de Montserrat — permitido, desde que seja o itálico real da família, nunca oblíquo sintético.

## Gradiente

O manual não menciona gradiente. Padrão adotado:

- Permitido em **áreas grandes de fundo**, sempre `p5 → p4` ou `p5 → #000`, ângulo entre 135° e 180°.
- **Nunca em texto**, nunca em ícone, nunca em borda, nunca com um roxo vibrante (`p1`–`p3`) como parada.
- Máximo **duas ocorrências na página inteira**.
- Glow / halo: só como luz difusa por trás de objeto, opacidade ≤ 20%. Nunca como brilho de card.

Isso existe para impedir o "gradiente roxo genérico de startup". Se a página tem gradiente em mais de duas seções, está errada.

## Raio, borda, elevação

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 4px | Tags, chips, campos |
| `radius-md` | 8px | Botões, cards |
| `radius-lg` | 16px | Blocos grandes, mockups |
| `radius-full` | 999px | Toggles, avatares, pill |

Bordas: 1px `c3` em fundo claro, 1px branco a 10% de opacidade em fundo escuro.
**Sombra: não usar.** Profundidade se resolve por contraste de fundo (`c1` × `c2`, `p5` × `p4`), não por drop-shadow. Sem glassmorphism.

## Movimento

| Token | Valor |
|---|---|
| `duration-fast` | 150ms — hover, foco, mudança de estado |
| `duration-base` | 300ms — transição de componente |
| `duration-slow` | 600ms — reveal de seção |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` — padrão de entrada |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` — movimento contínuo |

Princípios: animar apenas `transform` e `opacity` · deslocamento de entrada máximo 24px · stagger de 60–80ms entre itens de uma lista · nada que atrase o conteúdo do herói (LCP não pode depender de JS).

**`prefers-reduced-motion: reduce` é obrigatório.** Com ele ativo: sem parallax, sem scroll horizontal, sem contador animado, sem cursor customizado, sem texto entrando letra a letra — tudo aparece no estado final. Isso não é opcional e não é degradação: é a versão acessível da mesma página.

Cursor customizado e hover magnético: permitidos apenas como camada extra sobre um alvo real de 44×44px que funcione com teclado. Se a interação só existir no mouse, não existe.

## Ícones

Traço, não preenchimento. Peso 1.5px, corpo 24px, cantos arredondados. Biblioteca única em todo o site — sugestão **Lucide** (combina com a geometria de Montserrat/Poppins).

Ícone é apoio, nunca protagonista: não usar ícone em cada item de lista, não usar ícone decorativo colorido em `p1`, não montar seção de serviços com um ícone por card.

## Imagem

O repertório da marca (visto no carrossel) é: **objeto sobre fundo escuro profundo, iluminação lateral roxa, alto contraste, sem pessoa em foto de banco de imagem.**

- Preferir objeto 3D, render, textura, macro ou captura de interface a foto de equipe genérica.
- Se usar fotografia, aplicar tratamento: dessaturar e reintroduzir roxo nas sombras, para a imagem pertencer ao sistema.
- Nunca stock de "pessoas sorrindo em reunião".
- Toda imagem carrega `alt` descritivo em pt-BR. Decorativa vai com `alt=""`.

## Layout

Container 1200px, 12 colunas, gutter 24px. Padding vertical de seção 96px desktop / 64px mobile.

Ritmo de contraste da página espelha o do carrossel: **claro → escuro → escuro → claro → escuro → escuro**. A virada para claro marca a passagem de problema para solução — é a mesma inversão do card 04/06 e não deve ser gasta em outro ponto.
