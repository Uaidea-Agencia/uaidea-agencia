# UAIdea Agência — Site institucional

Next.js (App Router) + TypeScript + Tailwind CSS + Motion. Ver `CLAUDE.md` e `docs/` para
identidade visual, tom de voz e regras do projeto.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha os valores — ver seção "Formulário de contato" abaixo
npm run dev
```

- `npm run lint` / `npm run typecheck` / `npm run build` — mesma checagem do CI e dos hooks
  de commit/push (ver `.husky/`).
- `content/projects/README.md` — como adicionar um projeto ao portfólio sem mexer em código.

## Formulário de contato

O diálogo "Falar com a UAIdea" (`src/features/contact/`) envia dois e-mails por Nodemailer
sobre SMTP do Gmail: um pra agência (o lead) e uma confirmação pro visitante. A implementação
concreta fica em `src/lib/adapters/gmail-mailer.ts`, resolvida via `src/lib/container.ts` —
trocar por outro provedor (Resend, SES) é implementar `Mailer` de novo e mudar uma linha lá,
não reescrever a Server Action.

### Testando localmente sem enviar e-mail de verdade

Em `.env.local`, defina:

```
MAILER_DRY_RUN=true
```

Com isso, `lib/container.ts` troca o `GmailMailer` por um `ConsoleMailer`
(`src/lib/adapters/console-mailer.ts`): nenhum e-mail sai, os dois (lead + confirmação)
são impressos no terminal onde `npm run dev` está rodando. Dá pra testar o fluxo inteiro —
validação, honeypot, tempo mínimo de preenchimento, rate limit, os dois textos de e-mail —
sem `GMAIL_USER`/`GMAIL_APP_PASSWORD` configurados e sem gastar cota do Gmail. **Nunca deixar
`MAILER_DRY_RUN=true` em produção** — o site pareceria funcionar, mas nenhum lead chegaria.

Pra testar o envio de verdade em dev, remova/comente essa variável e preencha as credenciais
reais abaixo.

### Credenciais do Gmail (`GMAIL_USER` / `GMAIL_APP_PASSWORD`)

A conta precisa de **verificação em duas etapas ativa**. Com isso ligado:

1. Acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
2. Gere uma senha de app (nome sugerido: "UAIdea site").
3. Cole o valor gerado (16 caracteres, sem espaço) em `GMAIL_APP_PASSWORD` — **não é a senha
   normal da conta**.
4. `GMAIL_USER` é o endereço completo (`uaideamg@gmail.com`).

Nunca commitar essas credenciais — `.env.local`/`.env` estão no `.gitignore`; só
`.env.example` (vazio) vai pro repositório.

Conta gratuita do Gmail: até 500 destinatários/dia — suficiente pro volume de um formulário
de site. Se o volume crescer ou a entregabilidade piorar, trocar de adapter resolve sem tocar
no resto do fluxo.

### Destacar o lead no Gmail

Os headers de prioridade (`Importance: high`, `X-Priority: 1`, `X-MSMail-Priority: High`) no
e-mail de lead são só uma sugestão ao cliente de e-mail — **o Gmail costuma ignorá-los na
exibição de mensagens recebidas.** O jeito confiável de não perder um lead é um filtro,
configurado uma vez:

1. No Gmail da agência, abra **Configurações → Ver todas as configurações → Filtros e
   endereços bloqueados → Criar novo filtro**.
2. Em "Assunto", coloque `[LEAD SITE]`.
3. Em "Criar filtro", marque:
   - **Marcar sempre como importante**
   - **Aplicar marcador** (crie um marcador tipo "Leads site")
   - **Nunca enviar para spam**
4. Salvar.

Dois minutos, feito uma vez, e todo lead do site chega marcado e rotulado — independente do
que o cliente de e-mail decidir fazer com os headers de prioridade.

### Alerta quando o envio falha de verdade

Se `mailer.send` falhar fora do dry-run (senha de app errada, 2FA desativada, cota do Gmail
estourada etc.), o visitante já vê um toast de erro e a sugestão de mandar por `mailto:` — mas
isso depende de alguém notar e reenviar manualmente. A agência, sozinha, só saberia da falha
olhando o log da Vercel, que ninguém fica acompanhando ao vivo. Por isso a Server Action
também chama `alerter.notify` (`src/lib/ports/alerter.ts`) no `catch`, com os dados do lead e
o erro.

Implementação padrão: `src/lib/adapters/discord-alerter.ts`, via webhook do Discord — canal
escolhido de propósito por não depender do Gmail (se o problema for o Gmail, um alerta por
e-mail não ajudaria).

1. No Discord, crie um canal (ou use um existente) só pra alertas do site.
2. **Configurações do canal → Integrações → Webhooks → Novo Webhook.**
3. Copie a "URL do Webhook" e cole em `DISCORD_WEBHOOK_URL` no `.env.local`.

Sem essa variável definida, `lib/container.ts` usa `NoopAlerter`
(`src/lib/adapters/noop-alerter.ts`) — nenhum aviso extra é disparado, só o `console.error`
de sempre. Uma falha ao notificar (ex.: webhook inválido) também nunca derruba a resposta
pro visitante — é logada à parte e ignorada.

### Filtro de linguagem imprópria

Qualquer pessoa pode preencher o formulário e mandar e-mail em nome de um visitante pra
`uaideamg@gmail.com` — os campos de texto livre (nome, empresa, mensagem) passam por uma
triagem de palavrão antes do envio (`src/features/contact/profanity.ts`). Se algum campo for
sinalizado: o visitante vê um erro pedindo pra revisar o texto (nada é enviado) e a agência
recebe um alerta no Discord, mesmo canal usado pra falha de e-mail.

Usa a lib [`obscenity`](https://github.com/jo3-l/obscenity), que casa palavra com fronteira
(`|palavra|`) — não substring solta — pra não marcar "tráfego" ou "institucional" como
palavrão. A lista de termos em português é curada à mão dentro do próprio arquivo; pra
adicionar ou remover uma palavra, edite o array `PT_BR_TERMS` (ou `EN_TERMS`, pro inglês) ali.
Termo ambíguo com uso comum e inofensivo em pt-BR (ex.: "rola", "pinto", "burro") foi deixado
de fora de propósito — bloquear um lead de verdade é pior do que deixar passar um palavrão
ocasional pro Discord.

## Segurança e limites de uso

Camadas para proteger o site e, principalmente, a **cota da Vercel** (invocação de função,
otimização de imagem) e a **cota de envio do Gmail** (500/dia na conta gratuita). Tudo o que
guarda contador está **em memória, por instância** — cobre o abuso comum (um IP martelando a
mesma instância quente) e some a cada cold start. Para um teto forte e coordenado entre
instâncias, trocar o armazenamento por Vercel KV / Upstash Redis mantendo a mesma assinatura
de `src/lib/rate-limit.ts` (mesma ideia dos adapters de mailer/alerter).

### Teto global de requisições (`src/proxy.ts`)

Cada IP pode fazer até **120 requisições de página por minuto** (só `GET`/`HEAD`); acima
disso o proxy responde `429` com `Retry-After` **sem renderizar a rota** — nenhuma invocação
de função. É o freio contra "segurar F5" / script de reload em loop. Ajustável por env
(`PROXY_RATE_LIMIT_RPM`), desligável com `PROXY_RATE_LIMIT_DISABLED=1` (nunca em produção).
Ver `.env.example`.

**Load balancing** não é código: a Vercel já distribui o tráfego entre instâncias
automaticamente. O que segura a cota é servir página estática do CDN (as páginas deste site
são estáticas) e barrar abuso antes de virar função — o teto acima.

### Formulário de contato (`src/features/contact/actions.ts`)

Camadas em ordem, da mais barata pra mais cara:

1. **Honeypot** + **tempo mínimo de preenchimento** (3 s) — bot ingênuo cai fora sem erro.
2. **Rajada:** 3 envios / minuto por IP.
3. **Anti-duplicata:** mesmo conteúdo (IP + e-mail + mensagem) em até 5 min é tratado como
   sucesso e não reenvia os dois e-mails — cobre duplo-clique, retry do navegador e replay
   ingênuo de um POST (`src/features/contact/recent-submissions.ts`).
4. **Teto sustentado:** 6 envios / hora e 15 / dia por IP — barra quem fica remandando o
   formulário o dia todo sem cair no limite de 1 minuto, e segura a cota do Gmail.
5. **Filtro de linguagem imprópria** (seção acima).

Quem passa do teto vê uma mensagem pedindo pra escrever direto pra `uaideamg@gmail.com`.

### Cabeçalhos de resposta (`next.config.ts`)

`headers()` aplica em todas as rotas: `X-Content-Type-Options: nosniff`, `X-Frame-Options:
DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (câmera, mic,
geolocalização e browsing-topics desligados) e `X-DNS-Prefetch-Control: on`. Só em produção
(inclui preview da Vercel): `Strict-Transport-Security` (2 anos, `preload`) e uma
**Content-Security-Policy**.

A CSP fecha `frame-ancestors`, `object-src` e `base-uri`, e restringe imagem, iframe, fonte e
conexão às origens que o site realmente usa (thumb de vídeo do YouTube/Vimeo, iframe de
player). `script-src`/`style-src` ainda com `'unsafe-inline'` por causa do script inline
`beforeInteractive` da intro e do estilo inline do Motion — endurecer com nonce é o próximo
passo. Como `next dev` não roda a CSP (HMR usa `eval`), **valide num preview da Vercel** antes
de mandar pra produção; se algo quebrar, trocar o header por `Content-Security-Policy-Report-Only`
enquanto ajusta.

Também em `next.config.ts`: `poweredByHeader: false` (não expõe a versão do Next) e
`serverActions.bodySizeLimit: "64kb"` (corta o teto padrão de 1 MB de POST de Server Action).

### Outros

- `src/app/robots.ts` — libera o conteúdo e bloqueia `/api/` pra crawler.
- `src/app/api/health/route.ts` — teto próprio de 60/min por IP e `Cache-Control: no-store`
  (fica fora do alcance do proxy).
