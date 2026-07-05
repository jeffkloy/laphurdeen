import { describe, expect, it } from "vitest";
import tsv from "../../../../LEXICON.tsv?raw";
import { Translator } from "./translate";

const tr = new Translator(tsv);
const laEn = (s: string) => tr.translate(s, "la-en").text;
const enLa = (s: string) => tr.translate(s, "en-la").text;

describe("lexicon", () => {
  it("loads every row of LEXICON.tsv", () => {
    expect(tr.lexicon.entries.length).toBeGreaterThan(1200);
  });
  it("carries the irregular verb forms", () => {
    expect(tr.lexicon.lookup("vera")?.forms).toMatchObject({
      pres: "er", past: "var", perf: "vart",
    });
  });
});

describe("morphology: nouns", () => {
  const n = (w: string) => tr.lexicon.lookup(w)!;
  it("suffixes the definite article", () => {
    expect(tr.morph.nounForm(n("stad"), { definite: true })).toBe("staden");
    expect(tr.morph.nounForm(n("hus"), { definite: true })).toBe("huset");
  });
  it("pluralizes with -er and definite plural -eren", () => {
    expect(tr.morph.nounForm(n("stad"), { plural: true })).toBe("stader");
    expect(tr.morph.nounForm(n("stad"), { plural: true, definite: true })).toBe("staderen");
  });
  it("respects the irregular heritage plural kronur", () => {
    expect(tr.morph.nounForm(n("krona"), { plural: true })).toBe("kronur");
  });
});

describe("morphology: verbs", () => {
  const v = (w: string) => tr.lexicon.lookup(w)!;
  it("conjugates regular verbs for tense only", () => {
    expect(tr.morph.verbForm(v("spreka"), "pres")).toBe("sprekar");
    expect(tr.morph.verbForm(v("spreka"), "past")).toBe("sprekade");
    expect(tr.morph.verbForm(v("spreka"), "perf")).toBe("sprekat");
  });
  it("uses lexicon forms for the closed irregular list", () => {
    expect(tr.morph.verbForm(v("vera"), "pres")).toBe("er");
    expect(tr.morph.verbForm(v("gaa"), "past")).toBe("gik");
    expect(tr.morph.verbForm(v("se"), "perf")).toBe("seet");
  });
});

describe("morphology: analysis", () => {
  it("prefers exact headwords over suffix readings", () => {
    expect(tr.morph.analyze("vatter")[0].entry.word).toBe("vatter");
    expect(tr.morph.analyze("morgen")[0].entry.word).toBe("morgen");
  });
  it("reads suffixed articles", () => {
    const a = tr.morph.analyze("staden")[0];
    expect(a.entry.word).toBe("stad");
    expect(a.noun?.definite).toBe(true);
  });
  it("reads irregular verb forms", () => {
    expect(tr.morph.analyze("stod")[0].entry.word).toBe("staa");
    expect(tr.morph.analyze("kom")[0].entry.word).toBe("komma");
  });
  it("reads lexicalized compounds directly", () => {
    const a = tr.morph.analyze("Helsaministeriet")[0];
    expect(a.entry.word).toBe("helsaministerie");
    expect(a.noun?.definite).toBe(true);
  });
  it("splits unknown compounds at a known headword", () => {
    const a = tr.morph.analyze("solhuset")[0];
    expect(a.entry.word).toBe("hus");
    expect(a.compoundModifiers?.[0].word).toBe("sol");
    expect(a.noun?.definite).toBe(true);
  });
});

describe("Laphurdi → English", () => {
  it("translates the reference sentences", () => {
    expect(laEn("Vi stemmar idag.")).toBe("We vote today.");
    expect(laEn("Idag stemmar folket.")).toBe("Today the people vote.");
    expect(laEn("Waar er staden?")).toBe("Where is the city?");
  });
  it("handles verb-first questions with do-support", () => {
    expect(laEn("Sprekar du Laphurdi?")).toBe("Do you speak Laphurdi?");
  });
  it("handles nit-negation with do-support", () => {
    expect(laEn("Ik sprekar nit Fransk.")).toBe("I do not speak French.");
  });
  it("handles the perfect with har", () => {
    expect(laEn("Ik har sprekat med henne.")).toBe("I have spoken with her.");
  });
  it("handles the future with skal", () => {
    expect(laEn("Vi skal bygga et ny hus.")).toBe("We will build a new house.");
  });
  it("keeps reflexive sik apart from ham", () => {
    expect(laEn("Han vaskar sik.")).toBe("He washes himself.");
    expect(laEn("Han vaskar ham.")).toBe("He washes him.");
  });
  it("translates the Preamble's first line", () => {
    expect(laEn(
      "Vi, folket av Laphurdeen, kom fri fra mange strander te bygga en nasjon waar ingen stod befor.",
    )).toBe(
      "We, the people of Laphurdeen, came free from many beaches to build a nation where none stood before.",
    );
  });
  it("agrees the English verb with the subject", () => {
    expect(laEn("Hen sprekar snabb.")).toBe("They speak fast.");
    expect(laEn("Hon werkar.")).toBe("She works.");
  });
  it("reads compounds", () => {
    expect(laEn("Hen werkar in Helsaministeriet.")).toBe("They work in the health ministry.");
  });
  it("renders the fossil greeting", () => {
    expect(laEn("Dank du.")).toBe("Thank you.");
  });
});

describe("English → Laphurdi", () => {
  it("translates the reference sentences", () => {
    expect(enLa("We are building a new nation.")).toBe("Vi byggar en ny nasjon.");
    expect(enLa("Where is the city?")).toBe("Waar er staden?");
    expect(enLa("We vote today.")).toBe("Vi stemmar idag.");
  });
  it("applies V2 after a fronted adverbial", () => {
    expect(enLa("Today the people vote.")).toBe("Idag stemmar folket.");
    expect(enLa("Today we vote.")).toBe("Idag stemmar vi.");
  });
  it("drops do-support in questions", () => {
    expect(enLa("Do you speak Laphurdi?")).toBe("Sprekar du Laphurdi?");
  });
  it("places nit after the verb", () => {
    expect(enLa("I don't speak French.")).toBe("Ik sprekar nit Fransk.");
  });
  it("builds the perfect with har", () => {
    expect(enLa("You have seen her.")).toBe("Du har seet henne.");
  });
  it("builds the future with skal", () => {
    expect(enLa("We will build a new house.")).toBe("Vi skal bygga et ny hus.");
  });
  it("fronts den/det/de before adjectives", () => {
    expect(enLa("the little boy")).toBe("Den liten pojk");
    expect(enLa("the many shores")).toBe("De mange strander");
    expect(enLa("the new house")).toBe("Det ny hus");
  });
  it("suffixes the article on bare definite nouns", () => {
    expect(enLa("the city is big")).toBe("Staden er stor");
    expect(enLa("the house")).toBe("Huset");
  });
  it("uses object pronoun forms after verbs and prepositions", () => {
    expect(enLa("with me")).toBe("Med mij");
    expect(enLa("He washes himself.")).toBe("Han vaskar sik.");
  });
  it("keeps the fossil greeting", () => {
    expect(enLa("Thank you.")).toBe("Dank du.");
  });
  it("prefers the everyday register and notes the doublet", () => {
    const { tokens } = tr.translate("The people vote.", "en-la");
    const verb = tokens.find((t) => t.pos === "v");
    expect(verb?.output).toBe("stemmar");
    expect(verb?.note).toContain("votera");
  });
});
