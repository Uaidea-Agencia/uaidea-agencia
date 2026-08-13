import { ROUTES } from "@/config/routes";

/**
 * Copy da home, centralizada — revisão de texto não deve exigir caça ao
 * JSX. Fonte: LP aprovada (Claude Design), com os ajustes combinados na
 * auditoria (Prompt 1): nomes de serviço alinhados a docs/empresa.md,
 * números do terminal da seção Tecnologia suavizados pra não parecer dado
 * de cliente real (nenhum client existe ainda — regra 9 do CLAUDE.md).
 */

export interface Cta {
  label: string;
  href: string;
}

export const HERO = {
  eyebrow: "Marketing · Design · Tecnologia",
  headlineLines: ["Marketing para", "quem mede o"],
  headlineAccent: "resultado,",
  headlineSub: "não o alcance.",
  body: "Estratégia, design e tecnologia trabalhando na mesma mesa. A gente entra pelo negócio, não pela pauta do mês. Enquanto o número não muda, o trabalho não terminou.",
  primaryCta: { label: "Quero um diagnóstico", href: ROUTES.contato } satisfies Cta,
  secondaryCta: { label: "Ver como trabalhamos →", href: ROUTES.servicos } satisfies Cta,
};

export const DISCIPLINES = [
  "Estratégia",
  "Design",
  "Tráfego pago",
  "Desenvolvimento web",
  "IA e automação",
  "Dados",
];

export const POSITIONING = {
  label: "01 — Posicionamento",
  marketRow: {
    tag: "O mercado",
    lines: ["Mudou o canal, mudou o algoritmo,", "mudou o comportamento."],
  },
  agencyRow: {
    tag: "A agência",
    before: "Continua vendendo ",
    accent: "pacote de posts",
    after: " e chamando isso de estratégia.",
  },
  answer: {
    tag: "A UAIdea",
    paragraphs: [
      "A gente não começa perguntando quantos posts você quer por mês. Começa perguntando de onde vem seu faturamento, quanto custa um cliente e o que trava o próximo degrau.",
      "Só depois disso existe campanha, site, criativo ou automação. Execução sem essa conversa é ruído caro.",
    ],
  },
  compare: {
    common: {
      heading: "O jeito comum",
      items: [
        "Entrega tarefa e mede entrega.",
        "Criativo bonito, oferta indefinida.",
        "Relatório de alcance no fim do mês.",
        "Site feito por um, tráfego por outro.",
        "Tecnologia terceirizada, dados perdidos.",
      ],
    },
    uaidea: {
      heading: "O jeito UAIdea",
      items: [
        "Define o número antes de definir a peça.",
        "Oferta primeiro, criativo depois.",
        "Leitura de funil, não de vaidade.",
        "Página, campanha e medição no mesmo time.",
        "Automação e dado dentro da operação.",
      ],
    },
  },
};

export interface ServiceItem {
  idx: string;
  title: string;
  desc: string;
}

export const SERVICES = {
  label: "02 — O que fazemos",
  heading: "Cinco frentes, um plano só.",
  intro:
    "Nenhuma delas é vendida solta. Elas existem porque uma sustenta a outra — e porque o resultado mora exatamente na costura entre elas.",
  items: [
    {
      idx: "01",
      title: "Estratégia",
      desc: "Diagnóstico, posicionamento, oferta e a definição do número que a operação inteira persegue.",
    },
    {
      idx: "02",
      title: "Design",
      desc: "Identidade, sistema visual e peça que comunica antes de agradar. Consistência em todo ponto de contato.",
    },
    {
      idx: "03",
      title: "Tráfego pago",
      desc: "Verba onde existe intenção de compra. Campanha, criativo e página tratados como uma coisa só.",
    },
    {
      idx: "04",
      title: "Tecnologia",
      desc: "Site, landing page e sistema que carregam, convertem e podem ser mantidos por quem fica depois da entrega.",
    },
    {
      idx: "05",
      title: "IA e automação",
      desc: "Rotina que roda sozinha: atendimento, qualificação, follow-up e relatório. Menos tarefa manual, mais tempo de decisão.",
    },
  ] satisfies ServiceItem[],
};

export interface TerminalLine {
  text: string;
  kind: "prompt" | "dim" | "ok";
  cursor?: boolean;
}

export interface TechTile {
  name: string;
  desc: string;
}

export const TECHNOLOGY = {
  label: "03 — Tecnologia",
  heading: "O mesmo marketing, com uma camada de máquina por cima.",
  body: "A parte criativa continua sendo humana. O que a tecnologia faz é tirar do humano tudo que ele faz pior: repetir, contar, cruzar, lembrar e responder às três da manhã.",
  tagline: "human creativity × machine intelligence",
  terminal: {
    label: "uaidea — stack",
    // Suaviza os números fabricados da versão original (41h/mês, 3 etapas)
    // pra não parecer dado de cliente real — nenhum client existe ainda.
    note: "Exemplo ilustrativo — não é case real",
    lines: [
      { kind: "prompt", text: "uaidea diagnóstico --cliente" },
      { kind: "dim", text: "→ lendo funil, verba e histórico…" },
      { kind: "ok", text: "gargalo: oferta indefinida" },
      { kind: "ok", text: "medição incompleta no funil" },
      { kind: "ok", text: "follow-up manual, sem padronização" },
      { kind: "prompt", text: "uaidea plano --aplicar", cursor: true },
    ] satisfies TerminalLine[],
  },
  tiles: [
    { name: "IA", desc: "Copy, triagem, resumo" },
    { name: "Automação", desc: "Fluxos e disparos" },
    { name: "Dados", desc: "Base única de leitura" },
    { name: "Web", desc: "Site e landing page" },
    { name: "Medição", desc: "Evento ponta a ponta" },
    { name: "CRM", desc: "Lead com histórico" },
    { name: "Anúncios", desc: "Meta e Google" },
    { name: "Análise", desc: "Decisão com número" },
    { name: "Desenvolvimento", desc: "Integração sob medida" },
  ] satisfies TechTile[],
};

export interface MethodStep {
  num: string;
  title: string;
  desc: string;
  active?: boolean;
}

export const METHOD = {
  label: "04 — Método",
  heading: "Cinco etapas. Nenhuma pulada.",
  intro:
    "A ordem importa mais que a velocidade. Quase todo trabalho que dá errado pulou uma das duas primeiras.",
  steps: [
    {
      num: "01",
      title: "Entender",
      desc: "Negócio, mercado, público e contexto. Margem, ticket, ciclo de venda e o que já foi tentado.",
    },
    {
      num: "02",
      title: "Pensar",
      desc: "Posicionamento, oferta e prioridade. O que atacar primeiro e, principalmente, o que não fazer agora.",
    },
    {
      num: "03",
      title: "Criar",
      desc: "Design, conteúdo, campanha e experiência — sempre a serviço do argumento definido na etapa anterior.",
    },
    {
      num: "04",
      title: "Construir",
      desc: "Site, sistema, automação e medição. Sem isso, não existe leitura confiável do que aconteceu.",
    },
    {
      num: "05",
      title: "Otimizar",
      desc: "Dado, teste e ajuste. É onde o trabalho deixa de ser projeto e vira operação de crescimento.",
      active: true,
    },
  ] satisfies MethodStep[],
};

// Os projetos em si (client, problema, solução, resultado...) vêm do
// portfólio real agora — ver content/projects/ e lib/container.ts
// (Prompt 5). Isto aqui é só a moldura da seção na home.
export const CASES = {
  label: "05 — Trabalhos",
  heading: "Case só entra aqui com número real.",
  desc: "A estrutura está pronta. Cliente, categoria, problema, solução e resultado entram quando houver autorização e dado auditável.",
  stats: [
    { value: "[ — ]", label: "Projetos" },
    { value: "[ — ]", label: "Clientes" },
    { value: "[ — ]", label: "Anos" },
    { value: "[ — ]", label: "Campanhas" },
  ],
};

export interface DifferentiatorItem {
  title: string;
  desc: string;
}

export const DIFFERENTIATORS = {
  label: "06 — Diferencial",
  heading: "Não somos só uma agência.",
  items: [
    {
      title: "Estratégia antes da execução",
      desc: "Proposta que começa com peça e prazo é orçamento, não plano.",
    },
    {
      title: "Tecnologia dentro da operação",
      desc: "Quem faz a campanha é quem mexe no site e na medição.",
    },
    {
      title: "Design como ferramenta de negócio",
      desc: "Estética que não sustenta argumento é decoração cara.",
    },
    {
      title: "Dado para decidir",
      desc: "Opinião entra na conversa depois do número, nunca antes.",
    },
    {
      title: "IA para acelerar",
      desc: "Ferramenta que devolve horas ao time, não que substitui critério.",
    },
    {
      title: "Resultado para crescer",
      desc: "Um post nunca é o objetivo final. É meio, e às vezes nem isso.",
    },
  ] satisfies DifferentiatorItem[],
};

export const CONTACT = {
  label: "07 — Vamos conversar",
  heading: "Seu problema não é falta de post.",
  body: "Manda o contexto do seu negócio. A gente devolve um diagnóstico com o que faríamos primeiro — e por quê. Sem custo e sem apresentação de 40 slides.",
  // CTA continua mailto até o Prompt 6 (diálogo com formulário).
  primaryCta: { label: "Falar com a UAIdea →", href: ROUTES.email } satisfies Cta,
  instagram: { label: "@uaidea.agencia", href: ROUTES.instagram } satisfies Cta,
  emailDisplay: "uaideamg@gmail.com",
};

export const FOOTER_CONTENT = {
  brandLine:
    "Marketing, design e tecnologia. Estratégia antes de execução, número antes de opinião.",
  pending: {
    whatsapp: "WhatsApp [ PENDENTE ]",
    address: "Endereço [ PENDENTE ]",
    cnpj: "CNPJ [ PENDENTE ]",
  },
  copyright: "© 2026 UAIdea Agência",
};
