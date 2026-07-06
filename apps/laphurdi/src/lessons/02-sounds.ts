import type { Lesson } from "../types";

export const sounds: Lesson = {
  slug: "sounds",
  titleLp: "Sej det rett!",
  titleEn: "Sound & spelling",
  tagline: "Five spellings to trust, one stress rule - and why Laphurdeen keeps its ph.",
  intro: [
    `Laphurdi uses the plain Latin alphabet with <strong>no accents</strong> -
     the First Spelling Reform saw to that. Learn five letter-pairs and one
     stress rule and you can pronounce anything the Commonwealth prints.`,
  ],
  sections: [
    {
      heading: "Five spellings to trust",
      body: [
        `Each of these always sounds the same way, in every word:`,
      ],
      table: {
        headers: ["spelling", "sound", "example", "meaning"],
        langs: ["", "", "lp", "en"],
        rows: [
          ["ij", "“ay” as in day (Dutch heritage)", "blij", "happy - say “blay”"],
          ["oe", "“oo” as in moon", "goed", "good - say “good”"],
          ["aa", "long “ah”", "maan", "moon - say “mahn”"],
          ["sj", "“sh”", "sju", "seven - say “shoo”"],
          ["k", "always hard, even before e or i", "kind", "child - say “kint”"],
        ],
      },
    },
    {
      heading: "Stress: start strong - unless France objects",
      body: [
        `Stress falls on the <strong>first syllable</strong>, the Germanic rule.
         The exception: French-heritage loans keep their final stress -
         <i lang="lp">famille</i> (fa-MIL), <i lang="lp">nasjon</i> (na-SJON),
         and the capital <i lang="lp">Lapentieur</i> (la-pen-TIEUR).`,
        `You can often spot such a loan by its shape: anything ending in
         <i lang="lp">-sjon</i> or <i lang="lp">-tet</i> arrived from French
         and is stressed at the end.`,
      ],
      examples: [
        { lp: "vatter, himmel, morgen", en: "water, sky, morning - all stressed on the first syllable" },
        { lp: "nasjon, universitet, famille", en: "nation, university, family - French loans, stressed at the end" },
      ],
    },
    {
      heading: "Why Laphurdeen keeps its ph",
      body: [
        `The Reform replaced etymological spellings with phonetic ones -
         <i lang="lp">frihed</i> (freedom), not <em>phrihed</em>. But
         <strong>proper names kept their heritage spellings</strong>. That is why
         the country writes <i lang="lp">Laphurdeen</i> and its language
         <i lang="lp">Laphurdi</i> with the old ⟨ph⟩, and why sunny
         <i lang="lp">Agaetisboro</i> keeps its un-Reformed ⟨ae⟩. A heritage
         spelling is a flag that says: this word is a name, and it is old.`,
      ],
      examples: [
        { lp: "Ik ser maanen over zeen.", en: "I see the moon over the sea.", note: "aa = “ah”, oe would be “oo” - read it aloud!" },
        { lp: "Kindet er blij.", en: "The child is happy.", note: "hard k, then “blay”." },
      ],
    },
  ],
  vocab: [
    { lp: "blij", en: "happy", note: "say “blay”" },
    { lp: "maan", en: "moon" },
    { lp: "sju", en: "seven", note: "say “shoo”" },
    { lp: "kind", en: "child", note: "hard k - “kint”" },
    { lp: "vatter", en: "water" },
    { lp: "zee", en: "sea" },
    { lp: "himmel", en: "sky" },
    { lp: "sol", en: "sun" },
    { lp: "famille", en: "family", note: "French loan - final stress" },
    { lp: "nasjon", en: "nation", note: "French loan - final stress" },
    { lp: "frihed", en: "freedom" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `How does <i lang="lp">blij</i> (happy) sound?`,
      options: ["“blay”", "“blee”", "“bly” as in fly", "“blidge”"],
      answer: 0,
      explain: `Dutch ⟨ij⟩ carries the “ay” of day - the same pair you will meet in <i lang="lp">mij</i> and <i lang="lp">dij</i>.`,
    },
    {
      type: "choice",
      prompt: `Which word sounds exactly like English <strong>“good”</strong>?`,
      options: ["goed", "gaad", "gud", "goud"],
      answer: 0,
      explain: `⟨oe⟩ = “oo” as in moon. The spelling is Dutch; the sound is plain English good.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `Where is the stress in <i lang="lp">nasjon</i>?`,
      options: [
        "On the last syllable - it is a French loan",
        "On the first syllable - the Germanic rule",
        "Both syllables equally",
        "It has no stress",
      ],
      answer: 0,
      explain: `French loans keep final stress: na-SJON - the ⟨-sjon⟩ ending gives it away.`,
    },
    {
      type: "choice",
      prompt: `Why does <i lang="lp">Laphurdeen</i> keep the ⟨ph⟩ the Reform abolished?`,
      options: [
        "Proper names kept their heritage spellings",
        "ph and f are different sounds in Laphurdi",
        "The Reform forgot it",
        "It is pronounced “p-h”",
      ],
      answer: 0,
      explain: `The Reform made spelling phonetic - <i lang="lp">frihed</i>, not phrihed - but names are monuments; they keep their old clothes.`,
    },
    {
      type: "choice",
      prompt: `How is the k in <i lang="lp">kind</i> (child) pronounced?`,
      options: [
        "Always hard - “kint”",
        "Soft before i - “chind”",
        "Like s - “sind”",
        "Silent",
      ],
      answer: 0,
      explain: `Laphurdi k is hard everywhere, even before e and i.`,
    },
    {
      type: "type",
      prompt: `Which two letters spell the “sh” sound, as in <i lang="lp">sju</i> (seven)?`,
      accept: ["sj"],
      explain: `⟨sj⟩ = “sh” - Swedish heritage. You will see it in <i lang="lp">nasjon</i> and every <i lang="lp">-sjon</i> loan.`,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">maan</i> (moon) rhymes best with…`,
      options: ["“barn” (long ah)", "“man”", "“moon”", "“main”"],
      answer: 0,
      explain: `Double ⟨aa⟩ is a long “ah” - “mahn”.`,
    },
    {
      type: "choice",
      prompt: `Which of these words is stressed on the <em>first</em> syllable?`,
      options: ["himmel", "nasjon", "famille", "universitet"],
      answer: 0,
      explain: `<i lang="lp">himmel</i> (sky) is home-grown Germanic stock; the other three wear the French coat and stress the end.`,
      lpOptions: true,
    },
  ],
};
