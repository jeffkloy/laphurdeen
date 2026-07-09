import { describe, expect, it } from "vitest";
import { buildDrill, drillPool } from "../prova";
import type { Lesson, VocabItem } from "../types";

/** Deterministic rng so drill assertions are reproducible. */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const lessonsFixture = [
  { slug: "a", vocab: [{ lp: "stad", en: "city" }, { lp: "hamn", en: "harbour" }] },
  { slug: "b", vocab: [{ lp: "stad", en: "city" }, { lp: "tren", en: "train" }] },
] as unknown as Lesson[];

describe("drillPool", () => {
  it("collects vocab from passed lessons only, deduplicated", () => {
    expect(drillPool(lessonsFixture, () => true).map((v) => v.lp)).toEqual(["stad", "hamn", "tren"]);
    expect(drillPool(lessonsFixture, (s) => s === "b").map((v) => v.lp)).toEqual(["stad", "tren"]);
    expect(drillPool(lessonsFixture, () => false)).toEqual([]);
  });
});

// Includes a register doublet (werk/travalje share the gloss "work"):
// no drill question may ever offer two correct options.
const pool: VocabItem[] = [
  { lp: "werk", en: "work" },
  { lp: "travalje", en: "work" },
  { lp: "stad", en: "city" },
  { lp: "hamn", en: "harbour" },
  { lp: "tren", en: "train" },
  { lp: "ferje", en: "ferry" },
];

describe("buildDrill", () => {
  it("respects the requested count and the pool size", () => {
    expect(buildDrill(pool, 4, lcg(1)).length).toBe(4);
    expect(buildDrill(pool, 99, lcg(2)).length).toBe(pool.length);
  });

  it("builds questions with unique options and exactly one correct answer", () => {
    for (let seed = 1; seed <= 20; seed++) {
      for (const q of buildDrill(pool, 99, lcg(seed))) {
        if (q.type !== "choice") throw new Error("drill emits choice questions only");
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.answer).toBe(0);
        if (q.lpOptions) {
          // en→lp: no offered word may gloss to the asked English
          const asked = q.prompt.match(/<strong>(.+)<\/strong>/)![1];
          const correct = q.options.filter((o) => pool.some((v) => v.lp === o && v.en === asked));
          expect(correct, q.prompt).toEqual([q.options[0]]);
        } else {
          // lp→en: the asked word's gloss must appear exactly once
          const asked = q.prompt.match(/lang="lp">(.+)<\/i>/)![1];
          const gloss = pool.find((v) => v.lp === asked)!.en;
          expect(q.options.filter((o) => o === gloss), q.prompt).toEqual([q.options[0]]);
        }
      }
    }
  });

  it("survives a pool of nothing but doublets by emitting no broken questions", () => {
    const doublets: VocabItem[] = [
      { lp: "werk", en: "work" },
      { lp: "travalje", en: "work" },
    ];
    for (const q of buildDrill(doublets, 10, lcg(3))) {
      expect(q.type === "choice" && q.options.length).toBeGreaterThanOrEqual(2);
    }
  });
});
