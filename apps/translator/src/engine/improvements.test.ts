/** Tests for the 2026-07-06 improvements batch (see
 *  docs/superpowers/specs/2026-07-06-translator-improvements-design.md)
 *  plus previously-untested engine paths. */
import { describe, expect, it } from "vitest";
import tsv from "../../../../LEXICON.tsv?raw";
import { Translator } from "./translate";

const tr = new Translator(tsv);
const la = (s: string, opts?: Parameters<Translator["translate"]>[2]) =>
  tr.translate(s, "en-lp", opts);
const en = (s: string, opts?: Parameters<Translator["translate"]>[2]) =>
  tr.translate(s, "lp-en", opts);

describe("canon gate integration (la→en)", () => {
  it("marks analyzable words as canon-legal", () => {
    const tok = en("Folket stemmar.").tokens.find((t) => t.source === "Folket")!;
    expect(tok.canonLegal).toBe(true);
  });
  it("flags an illegal inflection as nit canon", () => {
    const tok = en("husen").tokens.find((t) => t.source === "husen")!;
    expect(tok.unknown).toBe(true);
    expect(tok.canonLegal).toBe(false);
    expect(tok.note).toMatch(/canon gate/);
  });
  it("flags gibberish as nit canon", () => {
    const tok = en("blorp").tokens.find((t) => t.source === "blorp")!;
    expect(tok.canonLegal).toBe(false);
  });
  it("whitelisted proper names are canon-legal", () => {
    const tok = en("Vi kom fra Laphurdeen.").tokens
      .find((t) => t.source === "Laphurdeen")!;
    expect(tok.canonLegal).toBe(true);
  });
  it("does not mark en→la tokens", () => {
    const tok = la("We vote.").tokens.find((t) => t.source === "We")!;
    expect(tok.canonLegal).toBeUndefined();
  });
});

describe("register preference", () => {
  it("defaults to the everyday half of a doublet", () => {
    expect(la("They help.").text).toMatch(/hjelpar/i);
  });
  it("prefers the high half when asked", () => {
    expect(la("They help.", { register: "high" }).text).toMatch(/assisterar/i);
  });
  it("a user pick still beats the register preference", () => {
    const out = la("They help.", {
      register: "high", overrides: { help: "hjelpa" },
    });
    expect(out.text).toMatch(/hjelpar/i);
  });
});

describe("the path to hen", () => {
  it("they → dei with hen offered as an alternative", () => {
    const tok = la("They sing.").tokens.find((t) => t.source === "They")!;
    expect(tok.output).toBe("dei");
    expect(tok.alternatives?.some((a) => a.pick === "hen")).toBe(true);
  });
  it("an override picks hen, with the note and PICKED", () => {
    const tok = la("They sing.", { overrides: { they: "hen" } }).tokens
      .find((t) => t.source === "They")!;
    expect(tok.output).toBe("hen");
    expect(tok.tags).toContain("PICKED");
    expect(tok.note).toMatch(/gender-neutral/);
  });
  it("their → deis with hens offered", () => {
    const tok = la("Their ship.").tokens.find((t) => t.source === "Their")!;
    expect(tok.output).toBe("deis");
    expect(tok.alternatives?.some((a) => a.pick === "hens")).toBe(true);
  });
});

describe("synonym fallback transparency", () => {
  it("notes the redirect instead of rewriting silently", () => {
    const tok = la("a large house").tokens.find((t) => t.source === "large")!;
    expect(tok.output).toBe("stor");
    expect(tok.tags).toContain("SYN");
    expect(tok.note).toMatch(/via synonym: big/);
  });
  it("direct hits carry no synonym note", () => {
    const tok = la("the sea").tokens.find((t) => t.source === "sea")!;
    expect(tok.tags).not.toContain("SYN");
  });
  it("ocean graduated to a direct word (hav) - no fallback", () => {
    const tok = la("the ocean").tokens.find((t) => t.source === "ocean")!;
    expect(tok.output).toMatch(/^hav/);
    expect(tok.tags).not.toContain("SYN");
  });
});

describe("modals beyond will (one table, both directions)", () => {
  it("can → kunna", () => expect(la("She can swim.").text).toMatch(/kan simma/i));
  it("may → kunna", () => expect(la("You may go.").text).toMatch(/kan gaa/i));
  it("must → moste", () => expect(la("They must vote.").text).toMatch(/moste stemma/i));
  it("kunna renders back as can", () => {
    expect(en("Ik kan simma.").text).toMatch(/can swim/i);
  });
  it("moste renders back as must", () => {
    expect(en("Vi moste gaa.").text).toMatch(/must go/i);
  });
});

describe("contractions", () => {
  it("i'm → ik er", () => expect(la("I'm here.").text).toMatch(/^Ik er/i));
  it("can't → kan nit", () => expect(la("I can't swim.").text).toMatch(/kan nit simma/i));
  it("it's → det er", () => expect(la("It's a ship.").text).toMatch(/det er et skip/i));
});

describe("previously untested grammar paths", () => {
  it("past progressive → simple past", () => {
    expect(la("We were building a nation.").text).toMatch(/byggade/i);
  });
  it("comparative en→la", () => {
    expect(la("a bigger house").text).toMatch(/storer hus/i);
  });
  it("comparative la→en", () => {
    expect(en("Huset er storer.").text).toMatch(/bigger/i);
  });
  it("possessive my → min", () => {
    expect(la("my house").text).toMatch(/min hus/i);
  });
  it("her + noun disambiguates to hons", () => {
    const tok = la("her ship").tokens.find((t) => t.source === "her")!;
    expect(tok.output).toBe("hons");
    expect(tok.tags).toContain("POSS");
  });
  it("wh-question with do-support", () => {
    expect(la("Where do you live?").text).toMatch(/levar du/i);
  });
  it("det + finite verb renders as it", () => {
    expect(en("Det regnar.").text).toMatch(/^It rains/i);
  });
  it("a → an before a vowel", () => {
    expect(en("en iland").text).toMatch(/an island/i);
  });
  it("diminutive -je renders as little", () => {
    expect(en("husje").text).toMatch(/little house/i);
  });
  it("numbers pass through", () => {
    const tok = en("Vi har 3 skip.").tokens.find((t) => t.source === "3")!;
    expect(tok.tags).toContain("NUM");
    expect(tok.output).toBe("3");
  });
  it("unknown English words pass through tagged", () => {
    const tok = la("blorp").tokens.find((t) => t.source === "blorp")!;
    expect(tok.unknown).toBe(true);
  });
});

describe("round-trip stability", () => {
  const sentences = [
    "Sprekar du Laphurdi?",
    "Idag stemmar folket.",
    "Ik har sprekat med henne.",
  ];
  for (const s of sentences) {
    it(`la→en→la→en is a fixed point for "${s}"`, () => {
      const en1 = en(s).text;
      const la1 = la(en1).text;
      expect(en(la1).text).toBe(en1);
    });
  }
});
