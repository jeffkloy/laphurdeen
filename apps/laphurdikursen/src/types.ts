/** Data model for Laphurdikursen.
 *
 *  Laphurdi text is always structurally marked so the canon audit
 *  (src/test/audit.test.ts) can find every token:
 *   - dedicated fields: Example.lp, VocabItem.lp, Lesson.titleLp,
 *     Table columns whose lang is "lp", quiz options/answers flagged lp
 *   - inside English prose (body, prompts, explanations): wrapped in
 *     markup carrying lang="lp", e.g. <i lang="lp">stad</i>.
 */

/** A Laphurdi sentence or phrase with its English gloss. */
export interface Example {
  lp: string;
  en: string;
  note?: string;
}

/** A grammar table. `langs` assigns a language per column: "lp" cells are
 *  canon-audited, "en" cells are glosses, "" cells are mixed/phonetic and
 *  exempt (used sparingly, e.g. pronunciation respellings). */
export interface Table {
  caption?: string;
  headers: string[];
  langs: ("lp" | "en" | "")[];
  rows: string[][];
}

/** One teaching section: heading, paragraphs (trusted HTML authored in this
 *  repo - never user input), optionally a table and example sentences. */
export interface Section {
  heading: string;
  body: string[];
  table?: Table;
  examples?: Example[];
}

/** A word to learn, shown in the lesson's Orden list. */
export interface VocabItem {
  lp: string;
  en: string;
  note?: string;
}

export type Question =
  | {
      type: "choice";
      prompt: string;
      options: string[];
      /** Index into options. */
      answer: number;
      explain: string;
      /** Options are Laphurdi words/phrases → audit them. */
      lpOptions?: boolean;
    }
  | {
      type: "type";
      prompt: string;
      /** Accepted answers, compared after normalization. */
      accept: string[];
      explain: string;
      placeholder?: string;
      /** Accepted answers are Laphurdi → audit them. */
      lpAnswer?: boolean;
    };

export interface Lesson {
  slug: string;
  titleEn: string;
  titleLp: string;
  /** One-line English teaser shown on the course home. */
  tagline: string;
  intro: string[];
  sections: Section[];
  vocab: VocabItem[];
  quiz: Question[];
}
