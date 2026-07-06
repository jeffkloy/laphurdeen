import type { Lesson } from "../types";

export const irregulars: Lesson = {
  slug: "irregulars",
  titleLp: "Vera og Hava",
  titleEn: "The sixteen irregulars",
  tagline: "A closed list, fixed forever - ten strong verbs, two forced by canon, four modals.",
  intro: [
    `Every language hides its oldest verbs in irregular shapes. Laphurdi caged
     them: exactly <strong>sixteen</strong> verbs are irregular, the list is
     closed, and every other verb - past, present, and future coinages alike -
     is regular forever. Learn this table and you have finished the hardest
     memorisation in the language.`,
  ],
  sections: [
    {
      heading: "The closed list of sixteen",
      body: [
        `Ten strong verbs were fixed by design; <i lang="lp">hava</i> and
         <i lang="lp">staa</i> were forced in by canon texts (the perfect
         auxiliary <i lang="lp">har</i>; the Preamble's <i lang="lp">stod</i>);
         and the four modals are irregular in every source language, so they
         stayed irregular here:`,
      ],
      table: {
        caption: "all sixteen - the complete list",
        headers: ["infinitive", "present", "past", "perfect", "English"],
        langs: ["lp", "lp", "lp", "lp", "en"],
        rows: [
          ["vera", "er", "var", "har vart", "be"],
          ["hava", "har", "hadde", "har havt", "have"],
          ["gaa", "gaar", "gik", "har gaat", "go"],
          ["staa", "staar", "stod", "har stat", "stand"],
          ["komma", "kommar", "kom", "har kommat", "come"],
          ["se", "ser", "saag", "har seet", "see"],
          ["doa", "doar", "dede", "har doat", "do, make"],
          ["ta", "tar", "tok", "har tat", "take"],
          ["geva", "gevar", "gav", "har gevat", "give"],
          ["faa", "faar", "fik", "har faat", "get"],
          ["seja", "sejar", "sa", "har sejt", "say"],
          ["veta", "vet", "viste", "har vetat", "know"],
          ["kunna", "kan", "kunde", "har kunnat", "can"],
          ["vilja", "vil", "vilde", "har vilt", "want, will"],
          ["skola", "skal", "skulle", "-", "shall"],
          ["moste", "moste", "moste", "-", "must"],
        ],
      },
    },
    {
      heading: "The workhorses: er, har, and the modals",
      body: [
        `Three of these sixteen do half the talking in any conversation:
         <i lang="lp">er</i> (is/am/are), <i lang="lp">har</i> (has/have - and
         the engine of every perfect tense), and the modals, which take a bare
         infinitive after them:`,
      ],
      examples: [
        { lp: "Ik er blij.", en: "I am happy." },
        { lp: "Vi var on stranden.", en: "We were on the beach." },
        { lp: "Han har seet havet.", en: "He has seen the sea." },
        { lp: "Kan du simma?", en: "Can you swim?" },
        { lp: "Du moste lesa boken.", en: "You must read the book." },
        { lp: "Ik vil eta nu.", en: "I want to eat now." },
      ],
    },
    {
      heading: "The fence around the cage",
      body: [
        `The Reform even regularized <em>prefixed</em> verbs: bare
         <i lang="lp">komma</i> keeps its old past <i lang="lp">kom</i>, but
         <i lang="lp">ankomma</i> (arrive) conjugates like any regular verb -
         <i lang="lp">ankommade</i>, never <em>ankom</em>. New verbs must end in
         unstressed <i lang="lp">-a</i> and stay regular; the sixteen are a
         museum, not a model.`,
      ],
      examples: [
        { lp: "Hon gik hem.", en: "She went home.", note: "gaa → gik: strong past" },
        { lp: "Ferjen ankommade idag.", en: "The ferry arrived today.", note: "ankomma stays regular: ankommade" },
      ],
    },
  ],
  vocab: [
    { lp: "vera", en: "to be", note: "er · var · har vart" },
    { lp: "hava", en: "to have", note: "har · hadde · har havt" },
    { lp: "gaa", en: "to go", note: "gaar · gik" },
    { lp: "staa", en: "to stand", note: "staar · stod" },
    { lp: "komma", en: "to come", note: "kommar · kom" },
    { lp: "se", en: "to see", note: "ser · saag · har seet" },
    { lp: "doa", en: "to do, make", note: "doar · dede · har doat" },
    { lp: "ta", en: "to take", note: "tar · tok" },
    { lp: "geva", en: "to give", note: "gevar · gav" },
    { lp: "faa", en: "to get", note: "faar · fik" },
    { lp: "seja", en: "to say", note: "sejar · sa · har sejt" },
    { lp: "veta", en: "to know", note: "vet · viste" },
    { lp: "kunna", en: "can", note: "kan · kunde" },
    { lp: "vilja", en: "want, will", note: "vil · vilde" },
    { lp: "skola", en: "shall", note: "skal · skulle" },
    { lp: "moste", en: "must", note: "one shape for every tense" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `Present tense of <i lang="lp">vera</i> (to be)?`,
      options: ["er", "verar", "var", "vart"],
      answer: 0,
      explain: `<i lang="lp">Ik er, du er, vi er</i> - one form, and it is <i lang="lp">er</i>.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type the <strong>past</strong> of <i lang="lp">gaa</i> (to go).`,
      accept: ["gik"],
      explain: `<i lang="lp">Hon gik hem</i> - she went home.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `“He has seen” is…`,
      options: ["han har seet", "han har saag", "han seer", "han har seat"],
      answer: 0,
      explain: `Perfect of <i lang="lp">se</i>: har <i lang="lp">seet</i>. The past <i lang="lp">saag</i> never follows har.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `The past of <i lang="lp">seja</i> (to say) is famously short. Type it.`,
      accept: ["sa"],
      explain: `<i lang="lp">sa</i> - two letters. <i lang="lp">Hon sa nej.</i>`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `Which verb is <em>NOT</em> on the closed list of sixteen?`,
      options: ["werka", "veta", "doa", "moste"],
      answer: 0,
      explain: `<i lang="lp">werka</i> is regular like every verb outside the sixteen - werkar, werkade, har werkat.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Du moste lesa boken</i> means…`,
      options: [
        "You must read the book",
        "You may read the book",
        "You read the book yesterday",
        "You are reading the book",
      ],
      answer: 0,
      explain: `<i lang="lp">moste</i> = must; like all modals it takes the bare infinitive: <i lang="lp">moste lesa</i>.`,
    },
    {
      type: "choice",
      prompt: `Bare <i lang="lp">komma</i> has past <i lang="lp">kom</i>. What is the past of prefixed <i lang="lp">ankomma</i>?`,
      options: ["ankommade", "ankom", "ankommat", "har ankommen"],
      answer: 0,
      explain: `The Reform regularized every prefixed verb - the irregular sixteen are a museum, not a model.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `Why are <i lang="lp">hava</i> and <i lang="lp">staa</i> on the list at all?`,
      options: [
        "Canon texts forced them - the auxiliary har and the Preamble's stod",
        "They are French loans",
        "All two-syllable verbs are irregular",
        "The Language Commission likes round numbers",
      ],
      answer: 0,
      explain: `The perfect needs <i lang="lp">har</i>, and the Preamble says <i lang="lp">stod</i> - canon made them irregular, and the list closed at sixteen.`,
    },
  ],
};
