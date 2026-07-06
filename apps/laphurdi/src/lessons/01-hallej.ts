import type { Lesson } from "../types";

export const hallej: Lesson = {
  slug: "hallej",
  titleLp: "Hallej!",
  titleEn: "Hello! Your first words",
  tagline: "Greetings, thanks, and the two words no traveller can do without.",
  intro: [
    `Laphurdi is the national language of the Commonwealth of Laphurdeen — a blend
     of English, Dutch, Swedish, and French that grew up on the docks of the
     anchorage-bay and was standardised by the First Spelling Reform. You will
     meet the grammar soon enough. First: the words people actually say to you.`,
  ],
  sections: [
    {
      heading: "Greetings around the clock",
      body: [
        `The all-purpose greeting is <i lang="lp">Hallej!</i> — it works on the
         harbour, in the ministry, and everywhere between. For the time of day,
         Laphurdi pairs <i lang="lp">goed</i> (good — Dutch spelling, say
         <em>"good"</em>) with the moment:`,
      ],
      examples: [
        { lp: "Hallej!", en: "Hello!" },
        { lp: "Goed morgen.", en: "Good morning." },
        { lp: "Goed natt.", en: "Good night." },
        { lp: "Adjuu!", en: "Goodbye!" },
        { lp: "Velkom te Laphurdeen!", en: "Welcome to Laphurdeen!", note: "te = to — you will use this little word constantly." },
      ],
    },
    {
      heading: "Being polite: two thank-yous",
      body: [
        `Laphurdi keeps two words for <em>thank you</em>, one from each side of its
         family. <i lang="lp">Mersi!</i> is the everyday thanks — quick, warm,
         French-born. <i lang="lp">Dank du</i> is the formal one, and it hides a
         story: by regular grammar it should be <i lang="lp">dank dij</i> (you will
         learn why in Lesson 6), but the phrase froze before the rules settled.
         It is Laphurdeen's "methinks" — a fossil everyone still says.`,
      ],
      examples: [
        { lp: "Mersi!", en: "Thanks! (everyday)" },
        { lp: "Dank du.", en: "Thank you. (formal — the famous fossil)" },
        { lp: "Asjeblie.", en: "Please." },
        { lp: "Ja. / Nej.", en: "Yes. / No." },
      ],
    },
    {
      heading: "Your first full sentences",
      body: [
        `Three sentences worth memorising whole — the grammar inside them
         (verb endings, word order, negation) is exactly what Lessons 4 and 7
         will unpack:`,
      ],
      examples: [
        { lp: "Sprekar du Laphurdi?", en: "Do you speak Laphurdi?" },
        { lp: "Ik sprekar en liten Laphurdi.", en: "I speak a little Laphurdi." },
        { lp: "Ik sprekar nit Fransk.", en: "I don't speak French.", note: "nit = not — it follows the verb." },
      ],
    },
  ],
  vocab: [
    { lp: "hallej", en: "hello" },
    { lp: "goed", en: "good", note: "say “good” — Dutch oe" },
    { lp: "morgen", en: "morning" },
    { lp: "natt", en: "night" },
    { lp: "adjuu", en: "goodbye" },
    { lp: "velkom", en: "welcome" },
    { lp: "te", en: "to" },
    { lp: "mersi", en: "thanks (everyday)" },
    { lp: "dank", en: "thanks (formal)" },
    { lp: "asjeblie", en: "please" },
    { lp: "ja", en: "yes" },
    { lp: "nej", en: "no" },
    { lp: "spreka", en: "to speak" },
    { lp: "nit", en: "not" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `A dockworker waves at you in Fiskarhamnen. What do you call back?`,
      options: ["Hallej!", "Adjuu!", "Asjeblie.", "Nej."],
      answer: 0,
      explain: `<i lang="lp">Hallej!</i> is the all-purpose hello. <i lang="lp">Adjuu!</i> would be walking away.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type the Laphurdi for <strong>“Good morning.”</strong>`,
      accept: ["goed morgen"],
      explain: `<i lang="lp">Goed</i> keeps its Dutch spelling but sounds like English “good”.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `Which thank-you is the <em>everyday</em> one?`,
      options: ["Mersi!", "Dank du."],
      answer: 0,
      explain: `<i lang="lp">Mersi</i> is the quick everyday thanks; <i lang="lp">Dank du</i> is formal.`,
      lpOptions: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Dank du</i> breaks a rule of Laphurdi grammar. Why is it allowed?`,
      options: [
        "It is a fossil — the phrase froze before the pronoun rules settled",
        "du is always correct after dank",
        "The Language Commission voted to change the grammar",
        "It is a French loan",
      ],
      answer: 0,
      explain: `Regular syntax would give <i lang="lp">dank dij</i>. The greeting is older than the rule — Laphurdeen's “methinks”.`,
    },
    {
      type: "choice",
      prompt: `What does <i lang="lp">Velkom te Laphurdeen!</i> mean?`,
      options: [
        "Welcome to Laphurdeen!",
        "Goodbye from Laphurdeen!",
        "Do you live in Laphurdeen?",
        "Good morning, Laphurdeen!",
      ],
      answer: 0,
      explain: `<i lang="lp">te</i> = to. You will see it on every harbour sign in the Commonwealth.`,
    },
    {
      type: "type",
      prompt: `Type the Laphurdi word for <strong>“yes”</strong>.`,
      accept: ["ja"],
      explain: `<i lang="lp">Ja</i> — though in Darcambria you may hear the dialect's <em>wi</em>, from French oui.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Sprekar du Laphurdi?</i> means…`,
      options: [
        "Do you speak Laphurdi?",
        "I speak Laphurdi.",
        "You speak Laphurdi well.",
        "Where is Laphurdi spoken?",
      ],
      answer: 0,
      explain: `Questions put the verb first — <i lang="lp">sprekar du…?</i> Lesson 7 makes this official.`,
    },
    {
      type: "choice",
      prompt: `How would you say <strong>“please”</strong> when asking for directions?`,
      options: ["Asjeblie", "Mersi", "Velkom", "Ja"],
      answer: 0,
      explain: `<i lang="lp">Asjeblie</i> — straight off the Dutch docks (alsjeblieft), trimmed by the pidgin.`,
      lpOptions: true,
    },
  ],
};
