import type { Lesson } from "../types";

export const register: Lesson = {
  slug: "register",
  titleLp: "Spreka Formell",
  titleEn: "The high register",
  tagline: "A Germanic language wearing a French coat - ask like a friend or demandera like a minister.",
  intro: [
    `English keeps <em>ask</em> beside <em>inquire</em> and serves <em>cow</em>
     as <em>beef</em>. Laphurdi does exactly the same, on purpose: everyday
     words are Germanic, and the language of law, government, cuisine, and art
     arrived from French - adapted, letter by letter, by the Reform.`,
  ],
  sections: [
    {
      heading: "How French words were naturalised",
      body: [
        `The Reform admitted French vocabulary only after a strict makeover.
         Every rule below is mechanical - and no word may keep an accent:`,
      ],
      table: {
        caption: "the adaptation rules",
        headers: ["French shape", "becomes", "examples", "meaning"],
        langs: ["", "", "lp", "en"],
        rows: [
          ["-tion", "-sjon (final stress)", "nasjon · punisjon · navigasjon", "nation · punishment · navigation"],
          ["-té", "-tet", "universitet · majoritet · egalitet", "university · majority · equality"],
          ["verbs", "-era (fully regular)", "votera · assistera · kommensera", "vote · assist · commence"],
          ["ph", "f", "fysik · filosofi", "physics · philosophy"],
          ["ch", "sj", "masjin · sjef", "machine · cook"],
          ["qu", "kw", "kwestion · kwittens", "question · receipt"],
          ["soft c", "s", "sitron · desember", "lemon · December"],
        ],
      },
    },
    {
      heading: "The register doublets",
      body: [
        `Around forty everyday/formal pairs share one meaning and split the
         social world between them. The everyday word is for the harbour; the
         high word is for the courtroom, the menu, and the Senate floor:`,
      ],
      table: {
        caption: "everyday · high",
        headers: ["everyday", "high", "meaning"],
        langs: ["lp", "lp", "en"],
        rows: [
          ["hjelpa", "assistera", "to help"],
          ["fraga", "demandera", "to ask"],
          ["stemma", "votera", "to vote"],
          ["svara", "respondera", "to answer"],
          ["beginna", "kommensera", "to begin"],
          ["lera", "instruera", "to teach"],
          ["tal", "diskur", "speech"],
          ["sang", "sjanson", "song"],
        ],
      },
      examples: [
        { lp: "Kan du hjelpa mij?", en: "Can you help me? - on the dock" },
        { lp: "Kan du assistera mij?", en: "Might you assist me? - in the ministry" },
      ],
    },
    {
      heading: "On the plate",
      body: [
        `The cow/beef pattern, imported whole: the animal in the field is
         Germanic, the dish on the menu is French.`,
      ],
      table: {
        headers: ["in the field", "on the plate", "meaning"],
        langs: ["lp", "lp", "en"],
        rows: [
          ["ko", "boef", "cow → beef"],
          ["svin", "pork", "pig → pork"],
          ["faar", "moeton", "sheep → mutton"],
        ],
      },
    },
  ],
  vocab: [
    { lp: "hjelpa / assistera", en: "to help (everyday / high)" },
    { lp: "fraga / demandera", en: "to ask (everyday / high)" },
    { lp: "stemma / votera", en: "to vote (everyday / high)" },
    { lp: "svara / respondera", en: "to answer (everyday / high)" },
    { lp: "beginna / kommensera", en: "to begin (everyday / high)" },
    { lp: "lera / instruera", en: "to teach (everyday / high)" },
    { lp: "tal / diskur", en: "speech (everyday / high)" },
    { lp: "sang / sjanson", en: "song (everyday / high)" },
    { lp: "ko / boef", en: "cow / beef" },
    { lp: "svin / pork", en: "pig / pork" },
    { lp: "faar / moeton", en: "sheep / mutton" },
    { lp: "kwestion", en: "question", note: "qu → kw, per the Reform" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `A senator wants to say <strong>“help”</strong> on the record. Which verb?`,
      options: ["assistera", "hjelpa", "helpera", "aidera"],
      answer: 0,
      explain: `<i lang="lp">assistera</i> is the high doublet of <i lang="lp">hjelpa</i> - and conjugates perfectly regularly, like every -era verb.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `The everyday partner of <i lang="lp">votera</i> is…`,
      options: ["stemma", "fraga", "svara", "lera"],
      answer: 0,
      explain: `The people <i lang="lp">stemmar</i>; the chamber <i lang="lp">voterar</i>. Same act, different coat.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `French <em>question</em> entered Laphurdi as… (mind the Reform's spelling rules)`,
      accept: ["kwestion"],
      explain: `qu → kw: <i lang="lp">kwestion</i> - the word this course has been asking you all along.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `On a menu, <i lang="lp">faar</i> (sheep) becomes…`,
      options: ["moeton", "pork", "boef", "faarsjon"],
      answer: 0,
      explain: `Field Germanic, plate French: <i lang="lp">faar → moeton</i>, the cow/beef pattern.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `French <em>-tion</em> always becomes…`,
      options: ["-sjon, with final stress", "-tion, unchanged", "-sion, first stress", "-schon"],
      answer: 0,
      explain: `<i lang="lp">nasjon, navigasjon, punisjon</i> - and the stress stays French, on the end.`,
    },
    {
      type: "choice",
      prompt: `Why is there no accent in <i lang="lp">egalitet</i> (from égalité)?`,
      options: [
        "The Reform bans accents - -té becomes -tet",
        "Printers lost the accent keys",
        "Accents are only for names",
        "There is: it is written égalitet",
      ],
      answer: 0,
      explain: `Plain Latin alphabet, no accents, ever - <i lang="lp">universitet, majoritet, egalitet</i>.`,
    },
    {
      type: "type",
      prompt: `Give the <strong>high-register</strong> word for “to ask”.`,
      accept: ["demandera"],
      explain: `<i lang="lp">fraga</i> on the dock, <i lang="lp">demandera</i> in the courtroom.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `French <em>machine</em> was naturalised as…`,
      options: ["masjin", "machine", "makwin", "massin"],
      answer: 0,
      explain: `ch → sj: <i lang="lp">masjin</i> - say “ma-SHEEN”, stress still faithfully French.`,
      lpOptions: true,
    },
  ],
};
