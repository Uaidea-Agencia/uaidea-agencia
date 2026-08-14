import "server-only";
import {
  DataSet,
  pattern,
  RegExpMatcher,
  remapCharactersTransformer,
  resolveConfusablesTransformer,
  resolveLeetSpeakTransformer,
  toAsciiLowerCaseTransformer,
} from "obscenity";

/**
 * Qualquer pessoa pode preencher o formulário e escrever pra
 * uaideamg@gmail.com em nome de um visitante — os campos de texto livre
 * (nome, empresa, mensagem) viram e-mail de verdade, então passam por essa
 * triagem antes do envio.
 *
 * A primeira tentativa aqui foi `bad-words-br` (lib pt-BR "pronta"), mas o
 * casamento dela é substring sem borda de palavra: marcou "tráfego" e
 * "institucional" como palavrão (por causa de "feg" e "tit" soltos na lista)
 * e deixou passar "merda". Inutilizável pra um formulário que existe pra
 * captar lead, não pra bloquear cliente.
 *
 * `obscenity` (github.com/jo3-l/obscenity) resolve o casamento: âncora de
 * fronteira de palavra (`|palavra|`) e mapeamento de acento/leetspeak/
 * confusável ANTES de comparar. Mas ele não vem com lista em português —
 * quem entra com a lista de palavras somos nós.
 *
 * Segunda tentativa de achar lista pronta: `naughty-words` (projeto
 * LDNOOBW, o mesmo dicionário usado por `leo-profanity`). Também
 * descartado — o `pt.json` de lá lista "cerveja", "saco", "comer", "pau",
 * "inferno" e "amador" como palavrão (falso positivo caríssimo pra um
 * formulário de negócio) e, mais grave, trata termo neutro de orientação
 * sexual ("lésbica", "gay", "bissexual", "homossexual") como se fosse
 * ofensivo — errado tecnicamente e ofensivo de verdade se um lead LGBT+
 * fosse bloqueado por se identificar na mensagem. Não dá pra usar uma
 * lista pronta em português sem curadoria; as poucas entradas de lá que
 * eram inequívocas (colhões, esporra, cabrão, chochota, xana) foram
 * migradas a dedo pra baixo, o resto ficou de fora.
 *
 * "biscate" também entrou nessa primeira migração e foi removido de novo
 * na revisão seguinte: em pt-BR é tão comum como gíria pra "bico"/trabalho
 * freelance ("faço uns biscates de design", "quero formalizar meu
 * biscate") quanto como palavrão — e esse formulário existe justamente
 * pra receber esse tipo de lead. Testado e confirmado o falso positivo
 * antes de tirar da lista.
 *
 * A lista abaixo é nossa, com decisão deliberada de deixar de fora termo
 * ambíguo com uso comum e inofensivo em pt-BR ("rola", "pinto", "burro",
 * "cadela", "veado", "saco", "inferno", "comer", "biscate"), porque
 * bloquear um lead de verdade é pior do que deixar passar um palavrão
 * ocasional pro Discord.
 *
 * Exceção deliberada a essa régua: "gostosa"/"gostoso" soltos. Também tem
 * uso comercial inofensivo em pt-BR ("o site ficou gostoso de navegar",
 * "prato gostoso na campanha") e por padrão ficariam de fora pelo mesmo
 * motivo do "biscate" — mas aqui a decisão explícita foi inverter a régua:
 * entre bloquear ocasionalmente um elogio de produto e deixar passar
 * cantada/assédio pro Discord sem alerta, prefere-se bloquear. Se isso virar
 * incômodo real (lead legítimo barrado com frequência), a saída é whitelist
 * de colocação específica (`whitelistedTerms` do `obscenity`, ex.: "ficou
 * gostoso", "gostoso de usar"), não voltar a tirar o termo da lista.
 *
 * Conferido contra a enquete da Lista10 (lista10.org, +15 mil votos) sobre
 * os palavrões mais usados no Brasil: as 10 primeiras colocadas — caralho,
 * porra, puta que pariu, filho da puta, merda, vai tomar no cu, vai se
 * foder, viado, puta merda (já coberta por "puta" + "merda" soltos) e
 * cacete — já estavam todas na lista abaixo antes dessa conferência.
 */
const portugueseDataset = new DataSet<{ originalWord: string }>();

const PT_BR_TERMS = [
  "porra",
  "caralho",
  "merda",
  "foda-se",
  "fodase",
  "foder",
  "buceta",
  "boceta",
  "xoxota",
  "cacete",
  "escroto",
  "escrota",
  "arrombado",
  "arrombada",
  "desgraçado",
  "desgraçada",
  "corno",
  "cornudo",
  "chifrudo",
  "babaca",
  "imbecil",
  "idiota",
  "retardado",
  "retardada",
  "vagabundo",
  "vagabunda",
  "vadia",
  "viado",
  "bicha",
  "boiola",
  "panaca",
  "otario",
  "otaria",
  "piranha",
  "bosta",
  "cagar",
  "putaria",
  "putinha",
  "transar",
  "boquete",
  "colhoes",
  "esporra",
  "cabrao",
  "cabroes", // plural irregular de "cabrão" — "[s]" no fim do padrão não cobre
  "chochota",
  "xana",
  "imbecis", // plural irregular de "imbecil" (não é "imbecils")
  "filho da puta",
  "puta que pariu",
  "vai se foder",
  "vai tomar no cu",
  "puta",
  "cu",

  // Elogio obsceno / assédio — quem preenche formulário de agência às
  // vezes manda cantada em vez de xingamento. "gata(o)", "linda(o)",
  // "delícia" e "sexy" ficam de fora de propósito: são elogio comercial
  // corriqueiro em pt-BR ("seu site ficou lindo", "a proposta ficou sexy",
  // "prato delicioso na campanha") e não tem versão dirigida a pessoa tão
  // comum quanto "gostosa"/"gostoso" pra justificar o risco.
  //
  // "gostosa"/"gostoso" SOLTOS estão na lista logo abaixo apesar da mesma
  // ambiguidade ("o site ficou gostoso de navegar") — decisão deliberada
  // de aceitar bloquear elogio de produto ocasional em troca de pegar
  // cantada sem depender de frase exata. Ver nota no comentário do topo do
  // arquivo antes de reverter isso.
  "gostosa",
  "gostoso",
  "nudes",
  "peladinha",
  "manda nudes",
  "manda foto pelada",
  "manda foto pelado",
  "quero te comer",
  "te quero pelada",
  "te quero pelado",
  "gostosona",
  "gostosao",
  "rabuda",
  "rabudo",
  "delicia de mulher",
  "delicia de homem",
  "oi gostosa",
  "oi gostoso",
] as const;

// Termos em inglês mais comuns — visitante também pode escrever em inglês.
// Deliberadamente um conjunto pequeno e inequívoco (não a lista inteira do
// preset `englishDataset`, que inclui termo mais ambíguo em contexto de
// negócio, ex.: "sex", "anal", "boob").
//
// Conferido contra o dataset de 17 palavras do WordTips (word.tips/
// us-states-curse-words-map, análise de tweet geolocalizado nos EUA):
// "fuck" e "shit" são de longe as mais usadas — já cobertas. Do resto do
// dataset, ficaram de fora "ass" (colide com "Ass:", assinatura formal em
// pt-BR — testado: "Ass: João da Silva" batia), "badass" (gíria de elogio
// em contexto criativo, "um design badass") e "bloody" (mais britânico que
// americano, e tem leitura literal "coberto de sangue"). O restante do
// dataset entrou. "motherfucker", "jackass" e "dumbass" são nossos, fora
// do dataset: sem eles, o "fuck"/"ass" isolado não pega a palavra composta
// (fronteira de palavra não bate no meio de "motherfucker").
const EN_TERMS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "cunt",
  "whore",
  "bastard",
  "dick",
  "pussy",
  "slut",
  "faggot",
  "nigger",
  "bullshit",
  "crap",
  "damn",
  "douche",
  "douchebag",
  "hell",
  "moron",
  "scum",
  "motherfucker",
  "jackass",
  "dumbass",
] as const;

for (const word of [...PT_BR_TERMS, ...EN_TERMS]) {
  portugueseDataset.addPhrase((phrase) =>
    // "[s]" no fim é opcional, pra cobrir plural regular sem precisar de uma
    // entrada por gênero/número — insulto costuma mirar "vocês", no plural
    // ("seus idiotas", "vagabundos"), não só a pessoa que preencheu o
    // formulário. Plural irregular (cabrão → cabrões, imbecil → imbecis)
    // não segue essa regra e tem entrada própria acima.
    phrase.setMetadata({ originalWord: word }).addPattern(pattern`|${word}[s]|`),
  );
}

const matcher = new RegExpMatcher({
  ...portugueseDataset.build(),
  blacklistMatcherTransformers: [
    resolveConfusablesTransformer(),
    // Acento pt-BR dobrado pro caractere base, pra "otário" bater com o
    // padrão "otario" (a lista acima é toda sem acento de propósito).
    remapCharactersTransformer({
      a: "áàâã",
      e: "éê",
      i: "í",
      o: "óôõ",
      u: "ú",
      c: "ç",
    }),
    resolveLeetSpeakTransformer(),
    toAsciiLowerCaseTransformer(),
  ],
});

const PROFANITY_FIELDS = ["nome", "empresa", "mensagem"] as const;

export type ProfanityField = (typeof PROFANITY_FIELDS)[number];

/**
 * Verifica os campos de texto livre do formulário de contato em ordem e
 * devolve o nome do primeiro campo com linguagem imprópria, ou `null` se
 * nenhum tiver.
 */
export function findProfaneField(
  data: Partial<Record<ProfanityField, string | undefined>>,
): ProfanityField | null {
  for (const field of PROFANITY_FIELDS) {
    const value = data[field];
    if (value && matcher.hasMatch(value)) {
      return field;
    }
  }
  return null;
}
