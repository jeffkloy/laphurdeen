/** Prova orderen - the vocabulary drill. Pure logic; DOM wiring in
 *  render.ts. Questions are generated from lesson vocabulary the learner
 *  has already unlocked, so every word here is canon by construction. */

import type { Lesson, Question, VocabItem } from "./types";

/** Fisher-Yates; shuffles in place and returns the array. */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Vocabulary of the lessons `passed` admits, deduplicated by word. */
export function drillPool(lessons: Lesson[], passed: (slug: string) => boolean): VocabItem[] {
  const seen = new Set<string>();
  const pool: VocabItem[] = [];
  for (const l of lessons) {
    if (!passed(l.slug)) continue;
    for (const v of l.vocab) {
      if (!seen.has(v.lp)) {
        seen.add(v.lp);
        pool.push(v);
      }
    }
  }
  return pool;
}

/** Up to `count` choice questions, each quizzing one pool word, lp→en or
 *  en→lp at the flip of the rng. Register doublets share an exact gloss,
 *  so distractors matching the asked word's gloss or spelling are excluded -
 *  one right answer, always. The correct option sits first, like authored
 *  quizzes; render.ts shuffles the display order. */
export function buildDrill(pool: VocabItem[], count = 10, rng: () => number = Math.random): Question[] {
  const questions: Question[] = [];
  for (const item of shuffle([...pool], rng).slice(0, count)) {
    const lpToEn = rng() < 0.5;
    const texts = pool
      .filter((d) => d.lp !== item.lp && d.en !== item.en)
      .map((d) => (lpToEn ? d.en : d.lp));
    const distractors = shuffle([...new Set(texts)], rng).slice(0, 3);
    if (distractors.length === 0) continue; // pool too small or all doublets
    questions.push({
      type: "choice",
      prompt: lpToEn
        ? `What does <i lang="lp">${item.lp}</i> mean?`
        : `Which is the Laphurdi for <strong>${item.en}</strong>?`,
      options: [lpToEn ? item.en : item.lp, ...distractors],
      answer: 0,
      explain: `<i lang="lp">${item.lp}</i> - ${item.en}.${item.note ? ` ${item.note}` : ""}`,
      lpOptions: !lpToEn,
    });
  }
  return questions;
}
