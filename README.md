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
