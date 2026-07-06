import type { Lesson } from "../types";

export const order: Lesson = {
  slug: "order",
  titleLp: "Idag Stemmar Vi",
  titleEn: "Word order",
  tagline: "The verb comes second — whatever comes first.",
  intro: [
    `Laphurdi main clauses follow the <strong>V2 rule</strong>, inherited from
     Dutch and Swedish: the verb is the second element of the sentence, no
     matter what stands first. Master this one habit and your Laphurdi stops
     sounding foreign.`,
  ],
  sections: [
    {
      heading: "Verb second, always second",
      body: [
        `Start with the subject or start with the time — the verb holds
         position two either way. English speakers: resist the urge to write
         <em>Idag vi stemmar</em>. The verb must slide forward:`,
      ],
      examples: [
        { lp: "Vi stemmar idag.", en: "We vote today." },
        { lp: "Idag stemmar vi.", en: "Today we vote — verb still second!" },
        { lp: "In staden werkar hon.", en: "In the city, she works.", note: "a whole phrase can be the first element — the verb still comes next" },
      ],
    },
    {
      heading: "Saying no: nit after the verb",
      body: [
        `Negation is <i lang="lp">nit</i>, and it follows the verb:`,
      ],
      examples: [
        { lp: "Ik sprekar nit Fransk.", en: "I don't speak French." },
        { lp: "Hen er nit hier.", en: "They (sg.) are not here." },
        { lp: "Vi har nit seet maanen.", en: "We haven't seen the moon.", note: "nit follows har, the finite verb" },
      ],
    },
    {
      heading: "Asking: verb first",
      body: [
        `Yes/no questions put the verb first. Question-word questions put the
         question word first — and then, faithful to V2, the verb comes second:`,
      ],
      table: {
        caption: "the six question words",
        headers: ["Laphurdi", "English"],
        langs: ["lp", "en"],
        rows: [
          ["wat", "what"],
          ["wie", "who"],
          ["wen", "when"],
          ["waar", "where"],
          ["hoe", "how"],
          ["warfor", "why"],
        ],
      },
      examples: [
        { lp: "Sprekar du Laphurdi?", en: "Do you speak Laphurdi?" },
        { lp: "Er du blij?", en: "Are you happy?" },
        { lp: "Waar er staden?", en: "Where is the city?" },
        { lp: "Warfor lernar du Laphurdi?", en: "Why are you learning Laphurdi?" },
      ],
    },
    {
      heading: "That: the relativizer dat",
      body: [
        `Relative clauses hang on <i lang="lp">dat</i> — one word for who,
         which, and that:`,
      ],
      examples: [
        { lp: "pojken dat druknade", en: "the boy that drowned — the grammar book's own grim example" },
        { lp: "staden dat vi lievar", en: "the city that we love" },
      ],
    },
  ],
  vocab: [
    { lp: "wat", en: "what" },
    { lp: "wie", en: "who" },
    { lp: "wen", en: "when" },
    { lp: "waar", en: "where" },
    { lp: "hoe", en: "how" },
    { lp: "warfor", en: "why" },
    { lp: "dat", en: "that (relativizer)" },
    { lp: "nit", en: "not", note: "after the verb" },
    { lp: "og", en: "and" },
    { lp: "el", en: "or" },
    { lp: "in / on / med / for / av / te", en: "in / on / with / for / of–from / to" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `Which is correct Laphurdi for <strong>“Today we vote”</strong>?`,
      options: ["Idag stemmar vi", "Idag vi stemmar", "Stemmar idag vi", "Vi idag stemmar"],
      answer: 0,
      explain: `<i lang="lp">Idag</i> takes slot one, so the verb must take slot two: <i lang="lp">Idag stemmar vi</i>.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `Where does <i lang="lp">nit</i> go?`,
      options: ["After the verb", "Before the verb", "At the end of the sentence", "Anywhere"],
      answer: 0,
      explain: `<i lang="lp">Ik sprekar nit Fransk</i> — verb, then nit.`,
    },
    {
      type: "type",
      prompt: `Turn <i lang="lp">Du sprekar Laphurdi</i> into a <strong>question</strong>.`,
      accept: ["sprekar du laphurdi"],
      explain: `Verb first: <i lang="lp">Sprekar du Laphurdi?</i>`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Waar er staden?</i> asks…`,
      options: ["Where the city is", "What the city is called", "When the city was built", "Whether the city is big"],
      answer: 0,
      explain: `<i lang="lp">waar</i> = where — and note the verb <i lang="lp">er</i> sitting obediently in second position.`,
    },
    {
      type: "choice",
      prompt: `Which question word means <strong>“why”</strong>?`,
      options: ["warfor", "waar", "wen", "hoe"],
      answer: 0,
      explain: `<i lang="lp">warfor</i> — literally “what-for”, a very Germanic move.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">pojken dat druknade</i> — what does <i lang="lp">dat</i> do here?`,
      options: [
        "It introduces a relative clause: “the boy that drowned”",
        "It is the neuter article",
        "It negates the verb",
        "It marks a question",
      ],
      answer: 0,
      explain: `One relativizer for everything: who, which, that — all <i lang="lp">dat</i>.`,
    },
    {
      type: "type",
      prompt: `Translate: <strong>“I don't speak French.”</strong>`,
      accept: ["ik sprekar nit fransk"],
      explain: `<i lang="lp">Ik sprekar nit Fransk</i> — the sentence every polite tourist learns second.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `A sentence starts with <i lang="lp">In staden…</i> (“In the city…”). What comes next?`,
      options: [
        "The verb — a fronted phrase counts as slot one",
        "The subject, always",
        "nit",
        "A comma, then anything",
      ],
      answer: 0,
      explain: `<i lang="lp">In staden werkar hon.</i> The first “slot” can be a whole phrase; the verb still claims second position.`,
    },
  ],
};
