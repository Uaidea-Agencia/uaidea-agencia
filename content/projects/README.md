# Como adicionar um projeto ao portfólio

Não precisa saber programar pra fazer isso. São dois passos: colocar a(s)
imagem(ns) numa pasta e criar um arquivo de texto com os dados do projeto.

## Passo 1 — imagens

Crie uma pasta em `public/projects/` com o nome do projeto (sem espaço, sem
acento, sem letra maiúscula — ex.: `cliente-x-2026`) e coloque as imagens
dentro:

```
public/projects/cliente-x-2026/capa.jpg
public/projects/cliente-x-2026/tela-2.jpg
```

Formato JPG ou PNG, largura mínima recomendada 1200px. Não precisa
redimensionar nem comprimir — o site faz isso sozinho.

## Passo 2 — o arquivo de dados

Crie um arquivo `.json` em `content/projects/` — o **nome do arquivo não
precisa ser o mesmo do slug**, mas ajuda a manter organizado (ex.:
`cliente-x-2026.json`). Copie o modelo abaixo e preencha:

```json
{
  "slug": "cliente-x-2026",
  "cliente": "Nome do cliente",
  "categoria": "Branding / Web",
  "ano": 2026,
  "resumo": "Uma frase curta que resume o projeto.",
  "problema": "Qual era o problema do cliente antes da UAIdea.",
  "solucao": "O que a UAIdea fez.",
  "resultado": "[ PENDENTE ]",
  "destaque": true,
  "ordem": 1,
  "midia": [
    {
      "type": "image",
      "src": "/projects/cliente-x-2026/capa.jpg",
      "alt": "Descrição da imagem em português, pra quem usa leitor de tela"
    }
  ]
}
```

### O que cada campo significa

| Campo       | Obrigatório          | O que é                                                                                                                       |
| ----------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `slug`      | sim                  | Identificador na URL (`/projetos/slug`). Só letras minúsculas, número e hífen — igual ao nome da pasta de imagens.            |
| `cliente`   | sim                  | Nome do cliente.                                                                                                              |
| `categoria` | sim                  | Ex.: "Branding / Web", "Tráfego pago". Texto livre.                                                                           |
| `ano`       | sim                  | Ano do projeto.                                                                                                               |
| `resumo`    | sim                  | Frase curta — aparece no card da home e da listagem.                                                                          |
| `problema`  | sim                  | O que motivou o projeto.                                                                                                      |
| `solucao`   | sim                  | O que foi feito.                                                                                                              |
| `resultado` | não                  | **Só preencha com número real e autorizado pelo cliente.** Sem autorização, deixe `"[ PENDENTE ]"` — nunca invente um número. |
| `destaque`  | não (padrão `false`) | `true` mostra o projeto na home, na seção "Trabalhos".                                                                        |
| `ordem`     | sim                  | Número pra ordenar (1 aparece antes de 2).                                                                                    |
| `midia`     | não (padrão vazio)   | Lista de imagens e vídeos — ver abaixo.                                                                                       |

### Adicionando um vídeo

Vídeo **não é um arquivo aqui no repositório** — sobe pro YouTube (opção
"não listado") ou Vimeo, e só o ID entra no JSON:

```json
{
  "type": "video",
  "provider": "youtube",
  "id": "dQw4w9WgXcQ",
  "title": "Título curto do vídeo, descrevendo o que ele mostra"
}
```

O `id` do YouTube é o que vem depois de `v=` na URL do vídeo
(`youtube.com/watch?v=`**`dQw4w9WgXcQ`**). Do Vimeo é o número no fim da
URL (`vimeo.com/`**`123456789`**).

## Se der erro

Se algum campo estiver errado ou faltando (JSON com vírgula sobrando, campo
obrigatório vazio, imagem que não existe em `public/projects/...`), o site
**não builda** — o erro aparece explicando exatamente o que corrigir, com o
nome do arquivo. Isso é intencional: melhor quebrar aqui do que publicar o
site com um projeto malformado.

## O que nunca fazer

- Nunca inventar número em `resultado` sem autorização do cliente e dado
  auditável — use `"[ PENDENTE ]"`.
- Nunca subir vídeo como arquivo — sempre link de YouTube/Vimeo.
- Nunca editar `projeto-exemplo.json` pra virar um projeto real — crie um
  arquivo novo. `projeto-exemplo` existe só pra validar que o fluxo
  funciona.
