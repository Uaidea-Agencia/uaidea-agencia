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
