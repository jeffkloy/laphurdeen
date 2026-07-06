import type { Lesson } from "../types";

export const wordbuilding: Lesson = {
  slug: "wordbuilding",
  titleLp: "Ordbygging",
  titleEn: "Word-building",
  tagline: "The Reform fixed the machinery: a dozen affixes and head-final compounds build the whole lexicon.",
  intro: [
    `The First Spelling Reform fixed more than spellings — it fixed the
     <strong>machinery for making words</strong>. Every one of the lexicon's
     two thousand entries is built with the pieces on this page. Learn the
     affixes and you can often guess a word you have never seen.`,
  ],
  sections: [
    {
      heading: "The derivation toolkit",
      body: [``],
      table: {
        caption: "affixes fixed by the Reform",
        headers: ["affix", "makes", "from", "you get", "meaning"],
        langs: ["", "en", "lp", "lp", "en"],
        rows: [
          ["-hed", "abstract noun", "blij", "blijhed", "happiness"],
          ["-skap", "state or relationship", "vrend", "vrendskap", "friendship"],
          ["-are", "agent noun (gender-neutral)", "werka", "werkare", "worker"],
          ["-ing", "action noun", "bygga", "bygging", "construction"],
          ["-eri", "place of craft (neuter)", "baka", "bakeri", "bakery"],
          ["-ig", "adjective from noun", "smuts", "smutsig", "dirty"],
          ["-isk", "learned adjective", "—", "politisk", "political"],
          ["o-", "negation", "skyldig", "oskyldig", "innocent"],
          ["-a", "verb from noun", "fisk", "fiska", "to fish"],
          ["-je", "diminutive (neuter)", "hus", "husje", "little house"],
          ["-er", "inhabitant", "—", "Laphurdeener", "a Laphurdeener"],
        ],
      },
    },
    {
      heading: "Compounds: the head comes last",
      body: [
        `Two nouns snap together with the meaning-carrying head at the end —
         and some take a linking <i lang="lp">-s-</i>:`,
      ],
      examples: [
        { lp: "dom + stol → domstol", en: "judgment + chair → court" },
        { lp: "flyga + hamn → flyghamn", en: "fly + harbour → airport" },
        { lp: "stad + s + hus → stadshus", en: "city hall — with the linking -s-" },
        { lp: "folk + s + kamer → Folkskameren", en: "the People's Chamber — the Commons itself is built this way" },
        { lp: "Laphurdi + kurs → Laphurdikursen", en: "…and so is the name of this course." },
      ],
    },
    {
      heading: "One spelling reflex",
      body: [
        `When <i lang="lp">-a</i> makes a verb from a word with a short vowel,
         the final consonant doubles: <i lang="lp">drom</i> (dream) →
         <i lang="lp">dromma</i> (to dream), <i lang="lp">stem</i> (a vote) →
         <i lang="lp">stemma</i> (to vote).`,
      ],
    },
  ],
  vocab: [
    { lp: "frihed", en: "freedom", note: "fri + -hed" },
    { lp: "vrendskap", en: "friendship" },
    { lp: "werkare", en: "worker", note: "-are is gender-neutral" },
    { lp: "diktare", en: "poet", note: "dikta = compose poetry" },
    { lp: "bygging", en: "construction" },
    { lp: "bakeri", en: "bakery", note: "neuter: bakeriet" },
    { lp: "smutsig", en: "dirty" },
    { lp: "modig", en: "brave", note: "mod = courage" },
    { lp: "olik", en: "different", note: "o- + lik (alike)" },
    { lp: "oskyldig", en: "innocent" },
    { lp: "domstol", en: "court" },
    { lp: "flyghamn", en: "airport" },
    { lp: "Laphurdeener", en: "a Laphurdeener" },
  ],
  quiz: [
    {
      type: "type",
      prompt: `Build the word for <strong>“worker”</strong> from <i lang="lp">werka</i>.`,
      accept: ["werkare"],
      explain: `Verb + <i lang="lp">-are</i> = agent noun, gender-neutral by design.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<strong>“Happiness”</strong>, from <i lang="lp">blij</i>, is…`,
      options: ["blijhed", "blijskap", "blijing", "blijeri"],
      answer: 0,
      explain: `Adjective + <i lang="lp">-hed</i> = abstract noun: <i lang="lp">blijhed</i> — same build as <i lang="lp">frihed</i>.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `Where does <i lang="lp">baka</i> (to bake) happen professionally?`,
      options: ["bakeri", "bakhus", "bakskap", "baking"],
      answer: 0,
      explain: `<i lang="lp">-eri</i> marks the place of a craft — bakeri, fiskeri.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `The opposite of <i lang="lp">skyldig</i> (guilty)?`,
      options: ["oskyldig", "unskyldig", "nitskyldig", "skyldigo"],
      answer: 0,
      explain: `Negating <i lang="lp">o-</i>, as in <i lang="lp">olik</i> (different, un-alike).`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">husje</i> means…`,
      options: ["little house", "big house", "the house", "housing"],
      answer: 0,
      explain: `The affective diminutive <i lang="lp">-je</i>, straight from Dutch: husje, kindje.`,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">domstol</i> is dom (judgment) + stol (chair). Why does it mean “court” and not “chair-judgment”?`,
      options: [
        "Compounds are head-final — the last part carries the meaning",
        "It is an idiom with no rule",
        "dom is an adjective here",
        "French loans reverse the order",
      ],
      answer: 0,
      explain: `The head comes last: a domstol is a kind of stol — the seat where judgment sits.`,
    },
    {
      type: "type",
      prompt: `Make a <strong>verb</strong> from <i lang="lp">fisk</i> (fish).`,
      accept: ["fiska"],
      explain: `Noun + <i lang="lp">-a</i>: fiska. (Short-vowel words double the consonant: drom → dromma.)`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `Break down the name of this course, <i lang="lp">Laphurdikursen</i>.`,
      options: [
        "Laphurdi + kurs + -en: “the Laphurdi course”",
        "Laphurd + ikurs + -en",
        "Laphurdi + kursen, a French loan",
        "It is a heritage spelling with no parts",
      ],
      answer: 0,
      explain: `A head-final compound wearing the suffixed article — the same anatomy as <i lang="lp">Folkskameren</i>.`,
    },
    {
      type: "choice",
      prompt: `“To dream”, from <i lang="lp">drom</i>, is spelled…`,
      options: ["dromma", "droma", "dromme", "drommera"],
      answer: 0,
      explain: `Short vowel → the consonant doubles before -a: <i lang="lp">dromma</i>.`,
      lpOptions: true,
    },
  ],
};
