import type { Lesson } from "../types";

export const laphurdeen: Lesson = {
  slug: "laphurdeen",
  titleLp: "Lesa Laphurdeen",
  titleEn: "Reading Laphurdeen - the capstone",
  tagline: "The motto, the Preamble, and the four city names - everything you learned, in the nation's own words.",
  intro: [
    `You have the sounds, the nouns, the verbs, the pronouns, the word order,
     and both registers. Time to read the Commonwealth itself: its motto, the
     first line of its Constitution, and the names on its map.`,
  ],
  sections: [
    {
      heading: "The motto",
      body: [``],
      examples: [
        {
          lp: "Frihed, Velvard, Konsens.",
          en: "Freedom, Welfare, Consensus.",
          note: "three common-gender nouns - two built with -hed and -vard, one straight from Latin's French road",
        },
      ],
    },
    {
      heading: "The Preamble's first line",
      body: [
        `Every word of this sentence is now yours. Read it aloud - first
         syllable stress except <i lang="lp">nasjon</i>, and watch
         <i lang="lp">kom</i> and <i lang="lp">stod</i>, two strong pasts from
         Lesson 5's closed list:`,
      ],
      examples: [
        {
          lp: "Vi, folket av Laphurdeen, kom fri fra mange strander te bygga en nasjon waar ingen stod befor.",
          en: "We, the people of Laphurdeen, came freely from many shores to build a nation where none stood before.",
        },
      ],
      table: {
        caption: "word by word",
        headers: ["Laphurdi", "English", "the grammar at work"],
        langs: ["lp", "en", "en"],
        rows: [
          ["folket", "the people", "neuter folk + suffixed -et"],
          ["av", "of", "preposition"],
          ["kom", "came", "strong past of komma"],
          ["fri", "freely", "zero-marked adverb"],
          ["fra mange strander", "from many shores", "plural -er on strand"],
          ["te bygga", "to build", "te + infinitive"],
          ["waar", "where", "question word as relative"],
          ["ingen", "none, nobody", "pronoun"],
          ["stod", "stood", "strong past of staa - the verb that forced itself onto the closed list"],
        ],
      },
    },
    {
      heading: "The names on the map",
      body: [
        `Place names keep their heritage spellings - the ⟨ph⟩ of
         <i lang="lp">Laphurdeen</i>, the ⟨ae⟩ of
         <i lang="lp">Agaetisboro</i> - and each one is a small story:`,
      ],
      table: {
        caption: "four cities, four etymologies",
        headers: ["name", "means", "the story"],
        langs: ["lp", "en", "en"],
        rows: [
          ["Laphurdeen", "“The Anchorage”", "La Fjärde → Laphurde + archaic definite -een - where the Charter fleet dropped anchor"],
          ["Lapentieur", "“place of slopes”", "French la pente + Old Charter -ieur; the fog-brushed capital"],
          ["Darcambria", "“the amber curve”", "dar (amber) + cambria (curve) - the great curved harbour"],
          ["Agaetisboro", "“Alright-town”", "old agaet (“alright”) + genitive -is + Charter -boro; the fishers' one-word verdict on the sunny south"],
        ],
      },
    },
    {
      heading: "Civic Laphurdi: reading the state",
      body: [
        `The words of self-government, most of them built with machinery you
         now recognise:`,
      ],
      examples: [
        { lp: "Grundlojen", en: "the Constitution - grund (foundation) + loj (law, from loi) + -en" },
        { lp: "Folkskameren", en: "the Commons - literally “the People's Chamber”" },
        { lp: "Senaten", en: "the Senate" },
        { lp: "Ledminister", en: "Lead Minister - the Commonwealth has no president, no king" },
        { lp: "Idag stemmar folket.", en: "Today the people vote. - V2 to the last" },
      ],
    },
    {
      heading: "Og nu?",
      body: [
        `The anthem is <i lang="lp">Sang av de Mange Strander</i> - Song of the
         Many Shores; its four verses arrive from the four founding shores, and
         its chorus unites them in Laphurdi. Read the full grammar in
         LAPHURDI.md, browse all 2,000+ words in the lexicon, or open
         Oversettaren and translate for yourself.
         <i lang="lp">Adjuu - og velkom te Laphurdeen!</i>`,
      ],
    },
  ],
  vocab: [
    { lp: "folk / folket", en: "people / the people" },
    { lp: "nasjon", en: "nation" },
    { lp: "strand / strander", en: "shore / shores" },
    { lp: "frihed", en: "freedom" },
    { lp: "velvard", en: "welfare" },
    { lp: "konsens", en: "consensus" },
    { lp: "loj / lojer", en: "law / laws" },
    { lp: "rekt", en: "a right", note: "rekteren = the rights" },
    { lp: "skatt", en: "tax" },
    { lp: "ingen", en: "none, nobody" },
    { lp: "fra", en: "from" },
    { lp: "befor", en: "before" },
    { lp: "hamn", en: "harbour" },
    { lp: "anker", en: "anchor" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `The national motto <i lang="lp">Frihed, Velvard, Konsens</i> translates as…`,
      options: [
        "Freedom, Welfare, Consensus",
        "Liberty, Wealth, Agreement",
        "Freedom, Courage, Wisdom",
        "Peace, Welfare, Consensus",
      ],
      answer: 0,
      explain: `Three nouns, no verbs, no king - very Laphurdeen.`,
    },
    {
      type: "choice",
      prompt: `In the Preamble, <i lang="lp">kom</i> is the past of…`,
      options: ["komma", "kunna", "kommensera", "doa"],
      answer: 0,
      explain: `Strong past from the closed sixteen: <i lang="lp">komma → kom</i>.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `And <i lang="lp">stod</i> (stood) is the past of which infinitive?`,
      accept: ["staa"],
      explain: `The Preamble's <i lang="lp">stod</i> is the very word that forced <i lang="lp">staa</i> onto the irregular list.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Laphurdeen</i> literally means…`,
      options: ["“The Anchorage”", "“Many Shores”", "“The Amber Curve”", "“New France”"],
      answer: 0,
      explain: `<i lang="lp">Laphurde</i> (the anchorage-bay, from La Fjärde) + archaic definite <i lang="lp">-een</i>.`,
    },
    {
      type: "choice",
      prompt: `Why do Laphurdeen and Agaetisboro keep ⟨ph⟩ and ⟨ae⟩ despite the Reform?`,
      options: [
        "Proper names kept their heritage spellings",
        "Those letters have special sounds",
        "The Reform never reached the south",
        "Tourism boards insisted",
      ],
      answer: 0,
      explain: `Heritage spellings mark names as old - the Reform respelled words, not monuments.`,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Grundlojen</i> - the Constitution - breaks into…`,
      options: [
        "grund (foundation) + loj (law) + -en (the)",
        "grundlo + jen",
        "grund + lojen, a French loan",
        "It is a heritage name with no parts",
      ],
      answer: 0,
      explain: `“The foundation-law” - a head-final compound wearing the suffixed article, like half the state's vocabulary.`,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Folkskameren</i> is literally…`,
      options: ["“the People's Chamber”", "“the Folk Camera”", "“the Chamber of Cameras”", "“the Common House”"],
      answer: 0,
      explain: `folk + linking -s- + kamer + -en: the Commons, built by Lesson 9's compound rule.`,
    },
    {
      type: "type",
      prompt: `Type the Laphurdi for <strong>“the people”</strong> - the Preamble's second word.`,
      accept: ["folket"],
      explain: `Neuter <i lang="lp">folk</i> + -et. <i lang="lp">Vi, folket av Laphurdeen…</i>`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">…en nasjon waar ingen stod befor</i> - what does <i lang="lp">ingen</i> mean?`,
      options: ["none, nobody", "everyone", "the anchor", "always"],
      answer: 0,
      explain: `“…a nation where none stood before.” You have now read the founding sentence of the Commonwealth.`,
    },
    {
      type: "choice",
      prompt: `The national anthem is titled…`,
      options: [
        "Sang av de Mange Strander",
        "Sjanson av Laphurdeen",
        "Frihed og Velvard",
        "Et Teken ved Hamnen",
      ],
      answer: 0,
      explain: `“Song of the Many Shores” - and note <i lang="lp">de</i> doing its fronted-article work before <i lang="lp">mange strander</i>.`,
      lpOptions: true,
    },
  ],
};
