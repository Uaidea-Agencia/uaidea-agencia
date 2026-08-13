# UAIdea Agência — Site Institucional

Repositório do site institucional da UAIdea Agência.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Motion (framer-motion) · Deploy na Vercel
**Idioma:** todo conteúdo visível em pt-BR.

---

## Contexto obrigatório

Leia e siga estes arquivos antes de qualquer entrega de UI, copy ou design:

- Quem é a empresa, serviços e posicionamento: @docs/empresa.md
- Identidade visual, tokens e tipografia (**lei**): @docs/marca.md
- Movimento, gradiente, raio, ícone, imagem (**padrão do repo**): @docs/ui-web.md
- Tom de voz e regras de copy: @docs/tom-de-voz.md

Referências de mercado (consultar só quando pedido): `docs/referencias.md`
Arquivos originais de marca (logos, manual em PDF): `docs/referencias/`

---

## Regras inegociáveis

1. **Nunca invente cor, fonte, peso ou espaçamento.** Todo valor visual sai de `docs/marca.md`. Se algo não estiver lá, pergunte — não improvise.
2. **Use a paleta de site, nunca a de Instagram.** A marca tem dois conjuntos cromáticos com tokens de mesmo nome e valores diferentes. `P1` no site é `#A600FF`; no Instagram é `#7C53B2`. Só o de site vale aqui.
3. **Nunca use hex solto no código.** Sempre via token CSS/Tailwind (`--p1`, `bg-p5`, etc.).
4. **Distinga lei de proposta.** `docs/marca.md` sem ⚠ é manual de marca: não se negocia. Itens com ⚠ e todo o `docs/ui-web.md` são propostas desta implementação — podem ser discutidos, mas na ausência de decisão nova valem como padrão.
5. **Copy sempre em pt-BR**, validada contra `docs/tom-de-voz.md`. Sem "revolucionário", "soluções inovadoras" e afins.
6. **Não altere a assinatura da marca.** Nada de recolorir, distorcer, adicionar sombra ou recriar em outra fonte. Sobre fundo escuro, sempre a versão monocromática branca.
7. **Não amplie o escopo de serviços.** Só as frentes listadas em `docs/empresa.md` podem aparecer no site. Não inclua IA, automação, CRM, tracking, analytics ou data science sem confirmação — vender capacidade não confirmada é pior que parecer pequeno.
8. **`prefers-reduced-motion` é obrigatório** em toda animação. Ver `docs/ui-web.md`.
9. **Nada de conteúdo institucional inventado.** Missão, visão, valores, cases, números, depoimentos, telefone e CNPJ ainda não estão definidos — use `[ PENDENTE ]` como placeholder visível em vez de escrever ficção. E-mail e Instagram estão confirmados em `docs/empresa.md`.

## Padrões técnicos

- Mobile-first. Breakpoints Tailwind padrão.
- Acessibilidade: alvo WCAG 2.1 AA. Contraste mínimo 4.5:1 em texto corrido; foco visível em todo elemento interativo; HTML semântico antes de `div`.
- Performance: imagens via `next/image`, fontes via `next/font` (self-hosted, sem CDN externa).
- Orientação a conversão: toda seção longa termina com um caminho de ação claro. Um CTA primário por dobra.
- Componentes em `src/components/`, seções de página em `src/components/sections/`.

## Fluxo de trabalho

- Antes de criar uma seção nova, verifique se já existe componente equivalente.
- Ao propor mais de uma alternativa de layout ou copy, justifique a recomendação em 2–3 linhas.
- Commits em pt-BR, no imperativo: `adiciona seção de serviços`.

### Onde vivem as docs de marca/contexto

`docs/empresa.md`, `docs/marca.md`, `docs/ui-web.md` e `docs/tom-de-voz.md` só existem aqui — dentro deste repositório, versionadas no GitHub junto com o código. Não há mais cópia paralela em Google Drive ou pasta local: aquele fluxo foi descontinuado a partir de 14/08/2026. Isso muda a forma de editar essas docs:

- Qualquer atualização de posicionamento, decisão de marca ou padrão de UI é feita direto nos arquivos de `docs/`, neste repositório — nunca num documento externo pra "depois trazer pra cá".
- Quando o código diverge do que a doc descreve (uma cor, um espaçamento, um componente que já resolveu um ⚠ de forma diferente da proposta), a doc é quem está desatualizada — corrija-a como parte do mesmo PR que mudou o comportamento, não depois.
- `docs/marca.md` sem ⚠ continua sendo lei (regra 4 acima) — "documentar o que o código já faz" não é justificativa pra mudar cor, fonte, peso ou espaçamento sem aprovação. Isso vale só para os itens marcados com ⚠ e para `docs/ui-web.md` inteiro, que são padrão do repositório e podem ser realinhados quando a implementação e a doc destoam.
- Os arquivos originais de marca (logos, manual em PDF) continuam em `docs/referencias/` — isso não muda; só o texto vivo das docs deixou de ter uma cópia fora do Git.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
