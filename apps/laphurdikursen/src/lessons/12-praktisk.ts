import type { Lesson } from "../types";

export const praktisk: Lesson = {
  slug: "praktisk",
  titleLp: "Praktisk Laphurdi",
  titleEn: "Practical Laphurdi - out and about",
  tagline: "Ask your way, order at the harbour, and pay exactly the price you see.",
  intro: [
    `Eleven lessons of grammar deserve a payoff: a day out. This lesson is a
     phrasebook with the Constitution in its pocket - because in Laphurdeen,
     what you pay, how you travel, and being helped in either language are not
     customs but <em>rights</em>. Every pattern here is one you already know;
     now it buys lunch.`,
  ],
  sections: [
    {
      heading: "Asking your way",
      body: [
        `The question words from Lesson 7 do the heavy lifting:
         <i lang="lp">waar</i> (where), <i lang="lp">wen</i> (when), and
         <i lang="lp">hoe</i> (how). Put the verb right after them - the same
         verb-first habit as <i lang="lp">Sprekar du Laphurdi?</i> - and you
         can ask for anything in the Commonwealth:`,
      ],
      examples: [
        { lp: "Waar er hamnen?", en: "Where is the harbour?" },
        { lp: "Waar er toaletten?", en: "Where is the toilet?" },
        { lp: "Wen gaar ferjen?", en: "When does the ferry leave?" },
        { lp: "Hoe mykke kostar det?", en: "How much does it cost?", note: "mykke = much/very - hoe mykke = how much." },
        { lp: "Kan du hjelpa, asjeblie?", en: "Can you help, please?" },
        { lp: "Vent hier, asjeblie.", en: "Wait here, please.", note: "vent - the bare-stem imperative from Lesson 4." },
      ],
    },
    {
      heading: "The price you see - buying and paying",
      body: [
        `Money in Laphurdeen comes with two constitutional promises. First,
         Article 35(4): the sales tax is <em>inside</em> every displayed
         price - the number on the menu is the number you pay, always.
         Second, Article 38: the krona is pegged at
         <strong>Kr. 100 = € 1</strong>, permanently. So the whole exchange
         office fits in three words: <i lang="lp">dela med hundra</i>.`,
      ],
      examples: [
        { lp: "Prisen du ser er alle prisen.", en: "The price you see is the whole price.", note: "Straight off the tourist board - and Art. 35(4)." },
        { lp: "Hoe mykke kostar biljeten?", en: "How much does the ticket cost?" },
        { lp: "Det kostar trihundra kronur.", en: "It costs three hundred kronur.", note: "Kr. 300 = € 3. Kronur - the heritage plural from Lesson 8." },
        { lp: "En kafe og en lunsj, asjeblie.", en: "A coffee and a lunch, please." },
        { lp: "Ik vil betala.", en: "I want to pay.", note: "vil - the irregular present of vilja, from Lesson 5." },
        { lp: "Dela med hundra.", en: "Divide by a hundred.", note: "Kronur to euros, in your head, every time." },
      ],
    },
    {
      heading: "Getting around - no car needed",
      body: [
        `Article 14 makes public transport a right: frequent, safe, affordable,
         open to all, with fares capped by law - and on an island commonwealth
         that promise floats. Trains, trams, and the ferries between the
         islands are all one network. The tourist card says it best:
         <i lang="lp">Du behovar ingen bil</i>.`,
      ],
      examples: [
        { lp: "Du behovar ingen bil.", en: "You don't need a car." },
        { lp: "Trenen kommar ofta.", en: "The train comes often." },
        { lp: "En biljet te Lapentieur, asjeblie.", en: "A ticket to Lapentieur, please." },
        { lp: "Ferjeren er oek med.", en: "The ferries are included too.", note: "oek = also - the same sentence stands on the national landing page." },
        { lp: "Er det billig? Ja, mykke billig.", en: "Is it cheap? Yes, very cheap." },
      ],
    },
  ],
  vocab: [
    { lp: "hamn", en: "harbour" },
    { lp: "toalett", en: "toilet" },
    { lp: "biljet", en: "ticket", note: "French billet, respelled by the Reform" },
    { lp: "tren", en: "train" },
    { lp: "ferje", en: "ferry" },
    { lp: "bil", en: "car" },
    { lp: "pris", en: "price" },
    { lp: "kosta", en: "to cost" },
    { lp: "betala", en: "to pay" },
    { lp: "kopa", en: "to buy" },
    { lp: "billig", en: "cheap, affordable" },
    { lp: "ofta", en: "often" },
    { lp: "mykke", en: "much, very", note: "hoe mykke = how much; mykke billig = very cheap" },
    { lp: "hjelpa", en: "to help" },
    { lp: "venta", en: "to wait" },
  ],
  quiz: [
    {
      type: "choice",
      prompt: `You need the toilet at the harbour station. What do you ask?`,
      options: ["Waar er toaletten?", "Wen er toaletten?", "Waar kostar toaletten?", "Hoe er toaletten du?"],
      answer: 0,
      explain: `<i lang="lp">Waar er …?</i> - where is…? The one pattern that finds everything: <i lang="lp">Waar er hamnen?</i>`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Type the Laphurdi for <strong>“How much does it cost?”</strong>`,
      accept: ["hoe mykke kostar det"],
      explain: `<i lang="lp">Hoe mykke</i> = how much, and the verb comes straight after - question order from Lesson 7.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `A cafe menu in Agaetisboro says <strong>Kr. 450</strong>. What do you hand over?`,
      options: [
        "Kr. 450 - the sales tax is already inside every displayed price",
        "Kr. 450 plus sales tax added at the till",
        "Kr. 495 including the standard service charge",
        "It depends on the province you are in",
      ],
      answer: 0,
      explain: `Article 35(4) of the Grundlojen: tax lives inside every price that is shown or spoken. The menu number is the paying number - nationwide.`,
    },
    {
      type: "type",
      prompt: `Order <strong>“a coffee and a lunch, please.”</strong>`,
      accept: ["en kafe og en lunsj asjeblie"],
      explain: `<i lang="lp">En kafe og en lunsj, asjeblie.</i> Commas and full stops never cost you the point - only the words do.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Dela med hundra</i> is the traveller's arithmetic. Why does it work?`,
      options: [
        "Kr. 100 = € 1, fixed by the Constitution - divide by a hundred for euros",
        "All prices are quoted in round hundreds",
        "The krona floats against the euro, but hundred is close enough",
        "Sales tax is exactly one percent",
      ],
      answer: 0,
      explain: `Article 38 pegs the krona at one hundred to the euro, permanently. Kr.&nbsp;450 for lunch is € 4.50 - divide by a hundred.`,
    },
    {
      type: "choice",
      prompt: `Which sentence promises you can skip the rental car?`,
      options: ["Du behovar ingen bil.", "Du betalar ingen bil.", "Du behovar en bil.", "Ingen bil, ingen du."],
      answer: 0,
      explain: `<i lang="lp">Du behovar ingen bil</i> - you need no car. Article 14 makes frequent, affordable public transport a right.`,
      lpOptions: true,
    },
    {
      type: "type",
      prompt: `Ask for <strong>“a ticket to Lapentieur, please.”</strong>`,
      accept: ["en biljet te lapentieur asjeblie"],
      explain: `<i lang="lp">Biljet</i> - French <em>billet</em> in Reform spelling, like <i lang="lp">kwestion</i> for question.`,
      lpAnswer: true,
    },
    {
      type: "choice",
      prompt: `<i lang="lp">Ferjeren er oek med</i> tells you…`,
      options: [
        "The ferries are part of the public transport network too",
        "The ferry is running late",
        "Ferries cost extra",
        "The ferry carries cars only",
      ],
      answer: 0,
      explain: `<i lang="lp">oek med</i> - also included. On an island commonwealth, Article 14's transport right sails as well as it rides.`,
    },
    {
      type: "choice",
      prompt: `It is late and you are lost. Which opener is the polite one?`,
      options: ["Kan du hjelpa, asjeblie?", "Du! Hier! Nu!", "Betala du hier?", "Waar du er hjelpa?"],
      answer: 0,
      explain: `<i lang="lp">Kan du hjelpa, asjeblie?</i> - can you help, please? <i lang="lp">Asjeblie</i> smooths every ask, exactly as it did in Lesson 1.`,
      lpOptions: true,
    },
  ],
};
