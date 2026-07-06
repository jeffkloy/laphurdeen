import type { Lesson } from "../types";

export const verbs: Lesson = {
  slug: "verbs",
  titleLp: "Vi Sprekar",
  titleEn: "Regular verbs",
  tagline: "No person endings, ever - one form per tense, the same for I, you, she, we, and they.",
  intro: [
    `Here is Laphurdi's great gift to the learner, inherited from Swedish:
     verbs conjugate for <strong>tense only</strong>. <i lang="lp">Ik sprekar,
     du sprekar, vi sprekar</i> - one form for everyone. Learn five endings and
     you can use every regular verb in the language.`,
  ],
  sections: [
    {
      heading: "The whole system, on one verb",
      body: [
        `Every regular verb ends in unstressed <i lang="lp">-a</i> and follows
         <i lang="lp">spreka</i> (to speak) exactly:`,
      ],
      table: {
        caption: "spreka - to speak",
        headers: ["tense", "form", "example"],
        langs: ["en", "en", "lp"],
        rows: [
          ["infinitive", "-a", "spreka"],
          ["present", "-ar", "ik sprekar"],
          ["past", "-ade", "ik sprekade"],
          ["perfect", "har + -at", "ik har sprekat"],
          ["future", "skal + infinitive", "ik skal spreka"],
          ["imperative", "bare stem", "sprek!"],
        ],
      },
    },
    {
      heading: "The same form for everyone",
      body: [
        `Person never changes the verb. Watch <i lang="lp">werka</i> (to work)
         refuse to budge:`,
      ],
      examples: [
        { lp: "Ik werkar in staden.", en: "I work in the city." },
        { lp: "Hen werkar in Helsaministeriet.", en: "They (sg.) work in the Health Ministry." },
        { lp: "Vi werkar alltid.", en: "We always work." },
      ],
    },
    {
      heading: "Past, perfect, future",
      body: [
        `The past adds <i lang="lp">-ade</i>; the perfect uses
         <i lang="lp">har</i> plus <i lang="lp">-at</i>; the future borrows the
         modal <i lang="lp">skal</i>:`,
      ],
      examples: [
        { lp: "Vi byggar en ny nasjon.", en: "We are building a new nation.", note: "the Preamble's favourite verb" },
        { lp: "Ik lernade Laphurdi in skolen.", en: "I learned Laphurdi in school." },
        { lp: "Hon har werkat idag.", en: "She has worked today." },
        { lp: "Folket skal stemma imorgen.", en: "The people will vote tomorrow." },
      ],
    },
    {
      heading: "Orders: the bare stem",
      body: [
        `The imperative is the verb stripped to its stem - short, clear,
         and very Laphurdeener:`,
      ],
      examples: [
        { lp: "Sprek!", en: "Speak!" },
        { lp: "Kom hem!", en: "Come home!" },
        { lp: "Sov nu!", en: "Sleep now!" },
      ],
    },
  ],
  vocab: [
    { lp: "spreka", en: "to speak" },
    { lp: "werka", en: "to work" },
    { lp: "leva", en: "to live" },
    { lp: "bygga", en: "to build" },
    { lp: "lerna", en: "to learn" },
    { lp: "stemma", en: "to vote" },
    { lp: "sova", en: "to sleep" },
    { lp: "eta", en: "to eat" },
    { lp: "drika", en: "to drink" },
    { lp: "idag", en: "today" },
    { lp: "imorgen", en: "tomorrow" },
    { lp: "nu", en: "now" },
    { lp: "alltid", en: "always" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `Present tense of <i lang="lp">werka</i> (to work)?`,
      options: ["werkar", "werkade", "werkat", "werk"],
      answer: 0,
      explain: `Present = stem + <i lang="lp">-ar</i>, for every person alike.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type the <strong>past tense</strong> of <i lang="lp">bygga</i> (to build).`,
      accept: ["byggade"],
      explain: `Past = stem + <i lang="lp">-ade</i>: byggade.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `“She has learned” is…`,
      options: ["hon har lernat", "hon har lernade", "hon lernar", "hon skal lerna"],
      answer: 0,
      explain: `Perfect = <i lang="lp">har</i> + supine <i lang="lp">-at</i>.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `And <strong>“we will speak”</strong>?`,
      options: ["vi skal spreka", "vi sprekar skal", "vi skal sprekar", "vi sprekade"],
      answer: 0,
      explain: `Future = <i lang="lp">skal</i> + infinitive - the verb stays in its -a form.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Give the order: <strong>“Sleep!”</strong> (from <i lang="lp">sova</i>)`,
      accept: ["sov"],
      explain: `Imperative = bare stem: <i lang="lp">Sov nu!</i>`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `How many different <em>present-tense</em> forms does a Laphurdi verb have across ik, du, hon, vi, dei?`,
      options: ["One", "Two", "Three", "Six"],
      answer: 0,
      explain: `Exactly one. Person endings do not exist - Swedish's great simplification, adopted whole.`,
    },
    {
      type: "type",
      prompt: `Translate: <strong>“The people will vote tomorrow.”</strong> (people = folket, vote = stemma)`,
      accept: ["folket skal stemma imorgen"],
      explain: `<i lang="lp">Folket skal stemma imorgen</i> - a sentence heard before every referendum in the Commonwealth.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `The Reform regularized prefixed verbs. The past of <i lang="lp">ankomma</i> (arrive) is therefore…`,
      options: ["ankommade", "ankom", "ankommat", "ankwam"],
      answer: 0,
      explain: `Prefixed verbs are regular - <i lang="lp">ankommade</i> - even though bare <i lang="lp">komma</i> keeps its irregular past <i lang="lp">kom</i>. Lesson 5 explains.`,
      lpOptions: true,
    },
  ],
};
