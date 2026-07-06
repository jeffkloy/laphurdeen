/** THE CANON GATE: every Laphurdi token the course presents as true must be
 *  justified by LEXICON.tsv (headword, listed form, regular inflection,
 *  proper name, or compound of justified parts). This is what keeps the
 *  course from teaching words the Commonwealth never coined. */

import { describe, expect, it } from "vitest";
import tsv from "../../../../LEXICON.tsv?raw";
import { lessons } from "../lessons";
import { Canon, lpStrings, tokenize } from "./canon";

const canon = new Canon(tsv);

describe("canon validator sanity", () => {
  it("accepts headwords, inflections, compounds, and names", () => {
    for (const good of [
      "stad", "staden", "stader", "staderen", "folkets",
      "sprekar", "sprekade", "sprekat", "sprek",
      "er", "var", "gik", "stod", "seet",
      "storer", "storest", "husje",
      "Laphurdeen", "Laphurdikursen", "Folkskameren", "Helsaministeriet", "stadshus",
      "zeen", "ferjen", "kronur",
    ]) {
      expect(canon.isJustified(good), good).toBe(true);
    }
  });
  it("rejects forms the Reform never made", () => {
    for (const bad of ["husen", "kinden", "stadar", "gaade", "phrihed", "sprekarar"]) {
      expect(canon.isJustified(bad), bad).toBe(false);
    }
  });
});

describe("every Laphurdi token in the course is canon", () => {
  for (const lesson of lessons) {
    it(lesson.slug, () => {
      const failures: string[] = [];
      for (const { where, text } of lpStrings(lesson)) {
        for (const token of tokenize(text)) {
          if (!canon.isJustified(token)) failures.push(`${where}: “${token}” in “${text}”`);
        }
      }
      expect(failures, failures.join("\n")).toEqual([]);
    });
  }
});
