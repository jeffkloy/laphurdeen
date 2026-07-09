import { describe, expect, it } from "vitest";
import { checkAnswer, isTypedCorrect, normalize, QuizRun } from "../quiz";
import type { Question } from "../types";

describe("normalize", () => {
  it("forgives case, whitespace, and sentence punctuation", () => {
    expect(normalize("  Goed   Morgen. ")).toBe("goed morgen");
    expect(normalize("Sprekar du Laphurdi?")).toBe("sprekar du laphurdi");
    expect(normalize("«Agaet.»")).toBe("agaet");
  });
  it("does not forgive different words", () => {
    expect(normalize("staden")).not.toBe(normalize("stader"));
  });
  it("forgives commas - Ja, ik sprekar costs no point", () => {
    expect(isTypedCorrect(["ja ik sprekar laphurdi"], "Ja, ik sprekar Laphurdi!")).toBe(true);
    expect(isTypedCorrect(["en bier asjeblie"], "En bier, asjeblie.")).toBe(true);
  });
});

describe("isTypedCorrect", () => {
  it("accepts any listed answer, normalized", () => {
    expect(isTypedCorrect(["goed morgen"], "Goed morgen!")).toBe(true);
    expect(isTypedCorrect(["staden"], " STADEN ")).toBe(true);
    expect(isTypedCorrect(["staden"], "stader")).toBe(false);
  });
  it("rejects empty input even against odd accept lists", () => {
    expect(isTypedCorrect(["ja"], "   ")).toBe(false);
  });
});

const choice: Question = {
  type: "choice",
  prompt: "?",
  options: ["a", "b", "c", "d"],
  answer: 2,
  explain: "",
};
const typed: Question = {
  type: "type",
  prompt: "?",
  accept: ["staden"],
  explain: "",
};

describe("checkAnswer", () => {
  it("checks choice by index and type by text", () => {
    expect(checkAnswer(choice, 2)).toBe(true);
    expect(checkAnswer(choice, 0)).toBe(false);
    expect(checkAnswer(typed, "Staden")).toBe(true);
    expect(checkAnswer(typed, 2)).toBe(false);
  });
});

describe("QuizRun", () => {
  it("walks answer → next → summary and counts correct answers", () => {
    const run = new QuizRun([choice, typed]);
    expect(run.finished).toBe(false);
    expect(run.submit(2)).toBe(true);
    run.next();
    expect(run.submit("wrong")).toBe(false);
    run.next();
    expect(run.finished).toBe(true);
    expect(run.correct).toBe(1);
  });

  it("never scores the same question twice", () => {
    const run = new QuizRun([choice]);
    run.submit(2);
    run.submit(2);
    run.submit(2);
    expect(run.correct).toBe(1);
  });

  it("does not advance before an answer", () => {
    const run = new QuizRun([choice, typed]);
    run.next();
    expect(run.index).toBe(0);
  });

  it("remembers which questions were missed", () => {
    const run = new QuizRun([choice, typed, choice]);
    run.submit(0); // wrong
    run.next();
    run.submit("staden"); // right
    run.next();
    run.submit(2); // right
    expect(run.missed).toEqual([0]);
  });
});
