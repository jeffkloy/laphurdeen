/** Provet — the quiz engine. Pure logic here; DOM wiring in render.ts. */

import type { Question } from "./types";

/** Normalize a typed answer: case, whitespace, and sentence punctuation
 *  should never cost a learner the point. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.!?«»""]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isTypedCorrect(accept: string[], input: string): boolean {
  const given = normalize(input);
  return given.length > 0 && accept.some((a) => normalize(a) === given);
}

export function checkAnswer(q: Question, answer: number | string): boolean {
  if (q.type === "choice") return typeof answer === "number" && answer === q.answer;
  return typeof answer === "string" && isTypedCorrect(q.accept, answer);
}

/** State machine for one quiz run: answer → (feedback) → next → summary. */
export class QuizRun {
  readonly questions: Question[];
  index = 0;
  correct = 0;
  /** Whether the current question has been answered (feedback showing). */
  answered = false;
  lastCorrect = false;

  constructor(questions: Question[]) {
    this.questions = questions;
  }

  get current(): Question {
    return this.questions[this.index];
  }

  get finished(): boolean {
    return this.index >= this.questions.length;
  }

  /** Submit an answer for the current question. Returns whether it was right.
   *  Ignored (returns last result) if already answered — no double scoring. */
  submit(answer: number | string): boolean {
    if (this.finished || this.answered) return this.lastCorrect;
    this.lastCorrect = checkAnswer(this.current, answer);
    if (this.lastCorrect) this.correct++;
    this.answered = true;
    return this.lastCorrect;
  }

  next(): void {
    if (!this.answered) return;
    this.index++;
    this.answered = false;
  }
}
