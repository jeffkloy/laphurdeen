import type { Lesson } from "../types";

export const pronouns: Lesson = {
  slug: "pronouns",
  titleLp: "Ik og Du",
  titleEn: "Pronouns",
  tagline: "Say mij “may” and dij “day” — plus hen, the pronoun the Constitution is written in.",
  intro: [
    `Laphurdi pronouns come in three columns — subject, object, possessive —
     and two of them hide the prettiest sound-trick in the language: the Dutch
     ⟨ij⟩ spelling carrying the Swedish “ay” sound. Say <i lang="lp">mij</i>
     as “may” and <i lang="lp">dij</i> as “day”, exactly the
     <i lang="lp">blij</i> pattern from Lesson 2.`,
  ],
  sections: [
    {
      heading: "The full table",
      body: [``],
      table: {
        caption: "subject · object · possessive",
        headers: ["English", "subject", "object", "possessive"],
        langs: ["en", "lp", "lp", "lp"],
        rows: [
          ["I", "ik", "mij", "min"],
          ["you (sg.)", "du", "dij", "din"],
          ["he", "han", "ham", "hans"],
          ["she", "hon", "henne", "hons"],
          ["they (sg.)", "hen", "hen", "hens"],
          ["we", "vi", "os", "vaar"],
          ["you (pl.)", "ju", "ju", "jer"],
          ["they", "dei", "dem", "deis"],
        ],
      },
    },
    {
      heading: "Hen: the Constitution's pronoun",
      body: [
        `<i lang="lp">hen</i> (borrowed from Swedish) is the standard
         gender-neutral singular — used for non-binary people and whenever
         gender is simply unknown. The Laphurdi text of the Constitution is
         drafted with <i lang="lp">hen</i> throughout. Like English
         <em>you</em>, it refuses to change shape: subject and object are both
         <i lang="lp">hen</i>, and so is plural <i lang="lp">ju</i>.`,
      ],
      examples: [
        { lp: "Hen werkar in Helsaministeriet.", en: "They (sg.) work in the Health Ministry." },
        { lp: "Ik ser hen alle dager.", en: "I see them (sg.) every day." },
      ],
    },
    {
      heading: "Object forms go everywhere the action lands",
      body: [
        `Object forms follow verbs <strong>and every preposition</strong>:
         <i lang="lp">med mij, te dij, for os</i> — never <em>med ik</em>. And
         because the case is marked, you can front an object for emphasis
         without losing the plot:`,
      ],
      examples: [
        { lp: "Hon ser mij.", en: "She sees me." },
        { lp: "Kom med os!", en: "Come with us!" },
        { lp: "Henne ser ik alle dager.", en: "Her I see every day.", note: "object first, still unambiguous — the case does the work" },
      ],
    },
    {
      heading: "The mirror: sik",
      body: [
        `<i lang="lp">sik</i> is the third-person reflexive — the difference
         between washing yourself and washing somebody else. First and second
         persons just reuse their object forms:`,
      ],
      examples: [
        { lp: "Han vaskar sik.", en: "He washes himself." },
        { lp: "Han vaskar ham.", en: "He washes him (someone else)." },
        { lp: "Ik vaskar mij.", en: "I wash myself." },
      ],
    },
    {
      heading: "Possessives never inflect",
      body: [
        `One shape fits every noun, any gender, any number:
         <i lang="lp">min sinn, min hus, min vrender</i> — my mind, my house,
         my friends. (And now you can hear the fossil in
         <i lang="lp">Dank du</i>: regular grammar would demand
         <i lang="lp">dank dij</i>.)`,
      ],
    },
  ],
  vocab: [
    { lp: "ik / mij / min", en: "I / me / my" },
    { lp: "du / dij / din", en: "you / you / your (sg.)" },
    { lp: "han / ham / hans", en: "he / him / his" },
    { lp: "hon / henne / hons", en: "she / her / hers" },
    { lp: "hen / hen / hens", en: "they (sg.) — invariant" },
    { lp: "vi / os / vaar", en: "we / us / our" },
    { lp: "ju / ju / jer", en: "you (pl.) — invariant" },
    { lp: "dei / dem / deis", en: "they / them / theirs" },
    { lp: "sik", en: "himself / herself / themself", note: "third-person reflexive" },
    { lp: "vaska", en: "to wash" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `“She sees <strong>me</strong>” — which pronoun fills the gap? <i lang="lp">Hon ser ___</i>`,
      options: ["mij", "ik", "min", "mik"],
      answer: 0,
      explain: `The object form <i lang="lp">mij</i> — say “may”.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type <strong>“with us”</strong>.`,
      accept: ["med os"],
      explain: `Prepositions always take object forms: <i lang="lp">med os</i>, never med vi.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `How does <i lang="lp">mij</i> sound?`,
      options: ["“may”", "“me”", "“my”", "“midge”"],
      answer: 0,
      explain: `Dutch ⟨ij⟩ carrying the Swedish sound — the <i lang="lp">blij</i> pattern.`,
    },
    {
      type: "choice",
      prompt: `Which pronoun does the Laphurdi Constitution use for a person of unknown gender?`,
      options: ["hen", "han", "hon", "det"],
      answer: 0,
      explain: `<i lang="lp">hen</i> — gender-neutral, invariant, and constitutional.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Han vaskar sik</i> vs <i lang="lp">Han vaskar ham</i> — what changes?`,
      options: [
        "sik = washes himself; ham = washes someone else",
        "sik is more polite than ham",
        "sik is past tense",
        "Nothing — they are synonyms",
      ],
      answer: 0,
      explain: `<i lang="lp">sik</i> reflects back on the subject; <i lang="lp">ham</i> points at another man.`,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Henne ser ik alle dager</i> — why is this word order allowed?`,
      options: [
        "The object case makes fronting unambiguous",
        "It is a mistake the Commission tolerates",
        "Poetry only",
        "Because henne is a name",
      ],
      answer: 0,
      explain: `“Her I see every day” — <i lang="lp">henne</i> is visibly an object, so it can lead the sentence for emphasis.`,
    },
    {
      type: "type",
      prompt: `The possessive of <i lang="lp">vi</i> (we) — type <strong>“our”</strong>.`,
      accept: ["vaar"],
      explain: `<i lang="lp">vaar</i> — and like all possessives it never inflects: vaar stad, vaar hus.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `By regular grammar, the formal thank-you <i lang="lp">Dank du</i> should be…`,
      options: ["Dank dij", "Dank din", "Dank ju", "Danka du"],
      answer: 0,
      explain: `Thanks lands on an object — <i lang="lp">dij</i>. The fossil predates the paradigm and outranks it.`,
      lpOptions: true,
    },
  ],
};
