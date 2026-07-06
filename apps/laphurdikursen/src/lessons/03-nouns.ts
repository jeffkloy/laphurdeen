import type { Lesson } from "../types";

export const nouns: Lesson = {
  slug: "nouns",
  titleLp: "Staden og Huset",
  titleEn: "Nouns & articles",
  tagline: "Two genders, a “the” that glues onto the noun - and the country named by its own ending.",
  intro: [
    `Like Swedish, Laphurdi glues the word <em>the</em> onto the <em>end</em> of the
     noun. There are two genders to learn - <strong>common</strong> (en-words) and
     <strong>neuter</strong> (et-words) - and once you know which is which,
     everything else is mechanical.`,
  ],
  sections: [
    {
      heading: "The paradigm: en stad, et hus",
      body: [
        `Every noun follows one of these two rows. <i lang="lp">stad</i> (city) is
         common gender; <i lang="lp">hus</i> (house) is neuter:`,
      ],
      table: {
        caption: "the two genders",
        headers: ["", "a / an", "the", "plural", "the (plural)"],
        langs: ["en", "lp", "lp", "lp", "lp"],
        rows: [
          ["common", "en stad", "staden", "stader", "staderen"],
          ["neuter", "et hus", "huset", "huser", "huseren"],
        ],
      },
      examples: [
        { lp: "Staden er stor.", en: "The city is big." },
        { lp: "Huset er gammel.", en: "The house is old." },
        { lp: "Kindet sovar in huset.", en: "The child sleeps in the house.", note: "kind is an et-word: kindet, not kinden." },
      ],
    },
    {
      heading: "With an adjective, “the” moves out front",
      body: [
        `The suffixed article serves when the noun stands alone. Put an adjective
         in front, and the article jumps out front too (Danish-style):
         <i lang="lp">den</i> for en-words, <i lang="lp">det</i> for et-words,
         <i lang="lp">de</i> for plurals - and the noun goes back to its bare form.`,
      ],
      examples: [
        { lp: "pojken → den liten pojk", en: "the boy → the little boy" },
        { lp: "huset → det ny hus", en: "the house → the new house" },
        { lp: "Sang av de Mange Strander", en: "Song of the Many Shores - the anthem title, wearing this rule" },
      ],
    },
    {
      heading: "Possession: add -s to the definite form",
      body: [
        `Ownership takes <i lang="lp">-s</i> after the definite form - the same
         -s that built the possessive pronouns you will meet in Lesson 6:`,
      ],
      examples: [
        { lp: "folkets penger", en: "the people's money" },
        { lp: "statens skuld", en: "the state's debt" },
        { lp: "pojkens hund", en: "the boy's dog" },
      ],
    },
    {
      heading: "The country named by its own grammar",
      body: [
        `<i lang="lp">Laphurdeen</i> is <i lang="lp">Laphurde</i> - the
         anchorage-bay - plus the <em>archaic</em> definite ending
         <i lang="lp">-een</i>: the name literally means
         <strong>“The Anchorage.”</strong> Modern Laphurdi would say
         <i lang="lp">fjarden</i> (the bay); the country's name preserves the
         older shape of the very rule you just learned.`,
      ],
    },
  ],
  vocab: [
    { lp: "stad", en: "city", note: "common: staden" },
    { lp: "hus", en: "house", note: "neuter: huset" },
    { lp: "pojk", en: "boy" },
    { lp: "kind", en: "child", note: "neuter: kindet" },
    { lp: "hund", en: "dog" },
    { lp: "katt", en: "cat" },
    { lp: "bok", en: "book" },
    { lp: "folk", en: "people", note: "neuter: folket" },
    { lp: "peng", en: "money", note: "usually plural: penger" },
    { lp: "berg", en: "mountain", note: "common: bergen" },
    { lp: "strand", en: "beach, shore" },
    { lp: "fjard", en: "wide bay" },
  ],
  quiz: [
    {
      type: "type",
      prompt: `<i lang="lp">stad</i> is an en-word. Type <strong>“the city”</strong>.`,
      accept: ["staden"],
      explain: `Common gender suffixes -en: <i lang="lp">stad → staden</i>.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">hus</i> is an et-word. Which is <strong>“the house”</strong>?`,
      options: ["huset", "husen", "det hus", "husje"],
      answer: 0,
      explain: `Neuter takes -et. (<i lang="lp">husje</i> is “little house” - the diminutive, a different trick.)`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `What is the plural of <i lang="lp">stad</i>?`,
      options: ["stader", "stads", "staden", "stadar"],
      answer: 0,
      explain: `Plural -er for both genders: <i lang="lp">stader</i>, <i lang="lp">huser</i>.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `And <strong>“the cities”</strong> - definite plural?`,
      options: ["staderen", "stadseren", "de stader", "stadene"],
      answer: 0,
      explain: `Plural -er + definite -en = <i lang="lp">-eren</i>: staderen.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `How do you say <strong>“the little boy”</strong>?`,
      options: ["den liten pojk", "pojken liten", "liten pojken", "det liten pojk"],
      answer: 0,
      explain: `With an adjective the article moves out front - <i lang="lp">den</i> for an en-word - and the noun goes bare.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type <strong>“the people's money”</strong> (people = <i lang="lp">folk</i>, money = <i lang="lp">penger</i>).`,
      accept: ["folkets penger"],
      explain: `Definite <i lang="lp">folket</i> + genitive -s: <i lang="lp">folkets penger</i> - words you will meet again in the Grundlojen.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">kind</i> (child) is neuter. Which is right?`,
      options: ["kindet", "kinden", "den kind", "kinder"],
      answer: 0,
      explain: `Et-word → <i lang="lp">kindet</i>. Gender must be memorised word by word - the vocabulary lists mark it.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `The <i lang="lp">-een</i> at the end of Laphurdeen is…`,
      options: [
        "an archaic form of the suffixed “the”",
        "a plural ending",
        "a French diminutive",
        "the genitive -s in disguise",
      ],
      answer: 0,
      explain: `<i lang="lp">Laphurde + -een</i> = “The Anchorage” - the old definite ending, fossilised in the nation's name.`,
    },
  ],
};
