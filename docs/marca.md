# UAIdea — Identidade visual (web)

Fonte: `referencias/Manual_de_Marca_UAIdea_v1.0.pdf` (v1.0 · 08/2026), capítulos 01–03.

A marca opera com **dois conjuntos cromáticos**: um para Instagram e um para site. A escala neutra `C1–C12` é comum aos dois; os tokens `P1–P5` mudam. **Tudo neste arquivo é a calibração de site.** A de Instagram está no fim, só para consulta — nunca usar no código.

Itens marcados com ⚠ **não constam no manual** e são proposta técnica desta implementação. Podem ser alterados pela direção de arte, mas até lá valem como padrão do repositório.

## Paleta

### Marca

| Token | Hex | Função |
|---|---|---|
| `p1` | `#A600FF` | Roxo primário — destaques, links, CTAs |
| `p2` | `#9D10E7` | Apoio — hover, gradientes |
| `p3` | `#6D00A7` | Intermediário — botões, ícones |
| `p4` | `#410064` | Profundo — blocos e seções |
| `p5` | `#1B002A` | Quase preto — fundos e títulos |
| `base` | `#AD9EB5` | Lilás neutro — apoio e bordas |

### Escala neutra

| Token | Hex | Função |
|---|---|---|
| `c12` | `#000000` | Preto puro — uso pontual |
| `c11` | `#111111` | Fundo escuro alternativo |
| `c10` | `#2E2E2E` | Títulos sobre fundo claro |
| `c9` | `#404040` | Texto corrido |
| `c8` | `#595959` | Texto secundário |
| `c7` | `#707070` | Legendas |
| `c6` | `#9C9C9C` | Ícones inativos, placeholders |
| `c5` | `#B3B3B3` | Divisores fortes |
| `c4` | `#CCCCCC` | Bordas de campos |
| `c3` | `#DEDEDE` | Linhas e separadores |
| `c2` | `#EDEDED` | Fundo de blocos e cards |
| `c1` | `#F7F7F7` | Fundo de seção claro |
| `w` | `#EDEDED` | Branco institucional (off-white) |

### Proporção 60 / 30 / 10

- **60%** neutros `c1–c4` / `w` — sustentam a composição
- **30%** roxos profundos `p4–p5` — blocos de marca
- **10%** roxos vibrantes `p1–p3` — **só onde há decisão a tomar**: botões, links, chamadas

Regra prática: se uma seção tem mais de um elemento em `p1`, provavelmente está errada.

### Contraste

| Fundo | Texto | Status |
|---|---|---|
| `p5` `#1B002A` | branco / `c1` | ✅ padrão escuro |
| `p4` `#410064` | branco / `c1` | ✅ evitar corpo < 14px |
| `p1` `#A600FF` | branco | ⚠️ só em corpo grande ou bold |
| `c1` `#F7F7F7` | `p5` / `c9` / `c10` | ✅ padrão claro |
| `base` `#AD9EB5` | `p5` / `c11` | ⚠️ **nunca texto branco sobre base** |

## Tipografia

Duas geométricas sem serifa, ambas SIL OFL / Google Fonts.

- **Montserrat** — títulos e chamadas
- **Poppins** — texto corrido, formulários, botões, interface

### Escala desktop

| Nível | Família | Peso | Corpo | Entrelinha | Tracking |
|---|---|---|---|---|---|
| Display / H1 | Montserrat | ExtraBold 800 | 56–72px | 1.05 | −2% |
| H2 | Montserrat | Bold 700 | 36–44px | 1.15 | −1% |
| H3 | Montserrat | SemiBold 600 | 24–28px | 1.25 | 0 |
| Texto corrido | Poppins | Regular 400 | 16–18px | 1.60 | 0 |
| Texto de apoio | Poppins | Light 300 | 13–14px | 1.55 | 0 |
| Botão / CTA | Poppins | SemiBold 600 | 15–16px | 1.20 | +2% |
| Rótulo / label | Poppins | Medium 500 | 11–12px | 1.20 | +8% |

**Mobile:** reduzir títulos ~30%; texto corrido permanece 16px.
**Largura de linha:** 60–75 caracteres.

### Faça / Não faça

✅ Máximo três níveis tipográficos por seção · contraste por peso e corpo, nunca por cor · alinhamento à esquerda como padrão.

❌ Não substituir por fontes "parecidas" · não aplicar itálico artificial, condensação ou expansão · não usar caixa alta em parágrafos inteiros.

## Logo

Logotipo sobre curvas contínuas, com uma **semente estilizada no lugar do ponto do "i"** — o elemento que representa a ideia. Cor institucional `#2F0D5A`, praticamente coincidente com o token P2 do conjunto Instagram (`#2D155A`).

Quatro arquivos oficiais em `referencias/`. Nenhuma outra versão pode ser criada ou derivada sem aprovação.

| Arquivo | Uso |
|---|---|
| `LOGO_UAI_SEM_FUNDO_PARA_POSTS.png` | **Preferencial.** Assinatura horizontal completa — header, rodapé, apresentações, e-mail |
| `LOGO_UAI_PERFIL_SEM_FUNDO_PNG.png` | Símbolo "uai" — favicon, avatar, selo, espaços quadrados |
| `LOGO_UAI_FUNDO_BRANCO_PERFIL.png` | Perfil sobre fundo branco |
| `LOGO_UAI_FUNDO_PRETO_PERFIL.png` | Perfil sobre fundo preto |

**Regra de fundo:** a versão colorida exige fundo claro (`c1`, `c2`, `w`, branco). Sobre `p4`, `p5`, `c10`–`c12` ou fotografia de baixa luminosidade, use **obrigatoriamente a monocromática branca**.

**Tamanho mínimo**

| Ativo | Digital | Impresso |
|---|---|---|
| Assinatura completa | 110px de largura (@1x) | 25 mm |
| Símbolo "uai" | 48px de largura | 12 mm |

Escala: 100% e 70% uso livre · 45% limite recomendado · 30% não utilizar.

⚠ **Área de proteção:** 1X em todos os lados, onde X = altura da semente sobre o "i". O manual registra isso como *proposta técnica a validar* — não constava nos materiais originais e pode ser ajustado pela direção de arte.

**Nunca:** distorcer, rotacionar ou alterar proporção · recolorir fora dos tokens · aplicar sombra, contorno ou degradê · usar a versão colorida sobre fundo escuro · posicionar sobre área de imagem poluída ou sem tom uniforme · recriar em outra fonte, ainda que semelhante.

## ⚠ Espaçamento e grid

**Não consta no manual.** Proposta desta implementação — consistente, mas ainda não aprovada pela direção de arte.

Base 8px. Escala: `4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
Padding vertical de seção: 96px desktop / 64px mobile. Container máximo 1200px, 12 colunas, gutter 24px.

## Paleta Instagram — só para consulta

**Nunca usar no código deste repositório.** Está aqui para evitar confusão entre os dois conjuntos e porque as peças de social usam esses valores.

| Token | Hex | Função |
|---|---|---|
| P1 Instagram | `#7C53B2` | Lilás de destaque |
| P2 Instagram | `#2D155A` | Roxo da assinatura |
| P3 Instagram | `#2C0975` | Roxo saturado de apoio |
| P4 Instagram | `#322B3B` | Cinza-arroxeado profundo |
| P5 Instagram | `#AD9EB5` | Lilás neutro |

A escala `C1–C12` e `W` é idêntica nos dois ambientes. Nas artes de feed, não aplicar o logotipo colorido sobre P2, P3 ou P4 — usar a monocromática branca.

## Pendências do manual

Registradas como espaço reservado no documento oficial. Não preencher por conta própria:

- [ ] Equivalências CMYK e Pantone para impressão
- [ ] Validação formal dos contrastes pelo critério WCAG 2.1 AA
- [ ] Confirmação da área de proteção de 1X
- [ ] Modelos de story, capa de destaques, post único e banner de site

## Tokens — copiar para o projeto

```css
:root {
  --p1:#A600FF; --p2:#9D10E7; --p3:#6D00A7; --p4:#410064; --p5:#1B002A;
  --base:#AD9EB5;
  --c12:#000000; --c11:#111111; --c10:#2E2E2E; --c9:#404040; --c8:#595959;
  --c7:#707070;  --c6:#9C9C9C;  --c5:#B3B3B3;  --c4:#CCCCCC; --c3:#DEDEDE;
  --c2:#EDEDED;  --c1:#F7F7F7;  --w:#EDEDED;

  --font-display: 'Montserrat', sans-serif;
  --font-body: 'Poppins', sans-serif;

  --space-1:4px;  --space-2:8px;  --space-3:16px; --space-4:24px;
  --space-5:32px; --space-6:48px; --space-7:64px; --space-8:96px; --space-9:128px;
}
```
