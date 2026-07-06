import type { Lesson } from "../types";

export const numbers: Lesson = {
  slug: "numbers",
  titleLp: "En, Twe, Tri",
  titleEn: "Numbers & comparison",
  tagline: "Count to a million kronur, rank with ferste and andre, compare with -er and -est.",
  intro: [
    `Numbers, ordinals, and comparison share this lesson because Laphurdeeners
     use them together constantly — prices in <i lang="lp">kronur</i>, ferry
     departures in <i lang="lp">ferste</i> and <i lang="lp">andre</i>, and an
     island-dweller's firm opinions about which beach is
     <em>belaest</em>… no — <i lang="lp">mest bela</i>. Read on.`,
  ],
  sections: [
    {
      heading: "One to a million",
      body: [
        `The first ten, then the landmarks:`,
      ],
      table: {
        caption: "counting",
        headers: ["number", "Laphurdi"],
        langs: ["en", "lp"],
        rows: [
          ["1–5", "en · twe · tri · fyr · fem"],
          ["6–10", "seks · sju · akt · nien · tien"],
          ["11, 12, 16", "elva · tolv · seksten"],
          ["100", "hundra"],
          ["1 000", "tusen"],
          ["1 000 000", "million"],
        ],
      },
      examples: [
        {
          lp: "en million kronur",
          en: "one million kronur — the tax-free threshold every Laphurdeener learns to say",
          note: "krona keeps an irregular heritage plural: en krona, twe kronur — fixed by the Currency Act",
        },
        { lp: "Ik har twe katter og en hund.", en: "I have two cats and one dog." },
      ],
    },
    {
      heading: "Ordinals: ferste te tiende",
      body: [
        `First through tenth, ready for ferry timetables and constitutional
         articles alike:`,
      ],
      table: {
        headers: ["1st–5th", "6th–10th"],
        langs: ["lp", "lp"],
        rows: [
          ["ferste", "sekste"],
          ["andre", "sjunde"],
          ["tridde", "akte"],
          ["fyrde", "niende"],
          ["femte", "tiende"],
        ],
      },
    },
    {
      heading: "Comparison: -er and -est",
      body: [
        `Adjectives compare with <i lang="lp">-er</i> and <i lang="lp">-est</i> —
         <em>not</em> Swedish's -are, because in Laphurdi <i lang="lp">-are</i>
         builds agent nouns (<i lang="lp">werkare</i>, worker — Lesson 9). Long
         adjectives and French loans take <i lang="lp">mer / mest</i> instead,
         and one suppletive set survives:`,
      ],
      table: {
        caption: "three ways to compare",
        headers: ["positive", "comparative", "superlative", "English"],
        langs: ["lp", "lp", "lp", "en"],
        rows: [
          ["stor", "storer", "storest", "big — the regular pattern"],
          ["formell", "mer formell", "mest formell", "formal — French loan, takes mer/mest"],
          ["goed", "beter", "best", "good — the one suppletive set"],
        ],
      },
      examples: [
        { lp: "Darcambria er storer, men Agaetisboro er varmer.", en: "Darcambria is bigger, but Agaetisboro is warmer.", note: "men = but" },
      ],
    },
    {
      heading: "Adverbs: nothing to add",
      body: [
        `Laphurdi adverbs are zero-marked — the bare adjective does the job:`,
      ],
      examples: [
        { lp: "Hen sprekar snabb.", en: "They (sg.) speak fast." },
        { lp: "Hon simmar goed.", en: "She swims well." },
      ],
    },
  ],
  vocab: [
    { lp: "en · twe · tri · fyr · fem", en: "1 · 2 · 3 · 4 · 5" },
    { lp: "seks · sju · akt · nien · tien", en: "6 · 7 · 8 · 9 · 10" },
    { lp: "hundra", en: "hundred" },
    { lp: "tusen", en: "thousand" },
    { lp: "million", en: "million" },
    { lp: "krona", en: "krona (the currency)", note: "irregular plural: kronur" },
    { lp: "ferste", en: "first" },
    { lp: "andre", en: "second" },
    { lp: "tridde", en: "third" },
    { lp: "stor / storer / storest", en: "big / bigger / biggest" },
    { lp: "goed / beter / best", en: "good / better / best" },
    { lp: "snabb", en: "fast" },
    { lp: "men", en: "but" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `Which is <strong>seven</strong>?`,
      options: ["sju", "sekste", "tolv", "nien"],
      answer: 0,
      explain: `<i lang="lp">sju</i> — say “shoo”, the ⟨sj⟩ rule from Lesson 2.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type the Laphurdi for <strong>three</strong>.`,
      accept: ["tri"],
      explain: `<i lang="lp">en, twe, tri</i> — one, two, three.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `The famous tax-free threshold is…`,
      options: ["en million kronur", "en million kronar", "et million kronur", "hundra tusen krona"],
      answer: 0,
      explain: `<i lang="lp">en million kronur</i> — with the irregular heritage plural the Currency Act made official.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<strong>“Third”</strong> is…`,
      options: ["tridde", "tri", "tredje", "trest"],
      answer: 0,
      explain: `<i lang="lp">ferste, andre, tridde</i> — first, second, third.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type the <strong>comparative</strong> of <i lang="lp">stor</i> (big).`,
      accept: ["storer"],
      explain: `-er / -est: <i lang="lp">stor, storer, storest</i>.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `Why is “more formal” <i lang="lp">mer formell</i> and not <em>formeller</em>?`,
      options: [
        "Long adjectives and French loans take mer/mest",
        "formell is a noun",
        "-er is reserved for numbers",
        "It is — formeller is fine",
      ],
      answer: 0,
      explain: `The French coat keeps its own tailoring: <i lang="lp">mer formell, mest formell</i>.`,
    },
    {
      type: "choice",
      prompt: `The superlative of <i lang="lp">goed</i> is…`,
      options: ["best", "goedest", "mest goed", "beter"],
      answer: 0,
      explain: `The one suppletive set: <i lang="lp">goed, beter, best</i>.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Hen sprekar snabb</i> — where is the adverb ending?`,
      options: [
        "There is none — adverbs are zero-marked",
        "Missing; it should be snabbt",
        "Missing; it should be snabblig",
        "snabb is a verb here",
      ],
      answer: 0,
      explain: `The bare adjective serves as the adverb. Nothing to add, nothing to forget.`,
    },
  ],
};
