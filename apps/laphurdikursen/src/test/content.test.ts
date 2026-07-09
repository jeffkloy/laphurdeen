import { describe, expect, it } from "vitest";
import { lessons } from "../lessons";

describe("course shape", () => {
  it("has twelve lessons with unique slugs", () => {
    expect(lessons.length).toBe(12);
    expect(new Set(lessons.map((l) => l.slug)).size).toBe(12);
  });

  it("gives every lesson a Laphurdi title, sections, vocabulary, and an intro", () => {
    for (const l of lessons) {
      expect(l.titleLp.length, l.slug).toBeGreaterThan(0);
      expect(l.titleEn.length, l.slug).toBeGreaterThan(0);
      expect(l.sections.length, l.slug).toBeGreaterThanOrEqual(2);
      expect(l.vocab.length, l.slug).toBeGreaterThanOrEqual(8);
      expect(l.intro.length, l.slug).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("quizzes", () => {
  it("gives every lesson at least 8 questions with explanations", () => {
    for (const l of lessons) {
      expect(l.quiz.length, l.slug).toBeGreaterThanOrEqual(8);
      for (const q of l.quiz) expect(q.explain.length, `${l.slug}: ${q.prompt}`).toBeGreaterThan(0);
    }
  });

  it("keeps every choice answer in range with unique options", () => {
    for (const l of lessons) {
      for (const q of l.quiz) {
        if (q.type !== "choice") continue;
        expect(q.options.length, `${l.slug}: ${q.prompt}`).toBeGreaterThanOrEqual(2);
        expect(q.answer, `${l.slug}: ${q.prompt}`).toBeGreaterThanOrEqual(0);
        expect(q.answer, `${l.slug}: ${q.prompt}`).toBeLessThan(q.options.length);
        expect(new Set(q.options).size, `${l.slug}: ${q.prompt}`).toBe(q.options.length);
      }
    }
  });

  it("gives every typed question at least one non-empty accepted answer", () => {
    for (const l of lessons) {
      for (const q of l.quiz) {
        if (q.type !== "type") continue;
        expect(q.accept.length, `${l.slug}: ${q.prompt}`).toBeGreaterThanOrEqual(1);
        for (const a of q.accept) expect(a.trim().length, `${l.slug}: ${q.prompt}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps table rows aligned with their headers and language spec", () => {
    for (const l of lessons) {
      for (const s of l.sections) {
        if (!s.table) continue;
        expect(s.table.langs.length, `${l.slug}: ${s.heading}`).toBe(s.table.headers.length);
        for (const row of s.table.rows) {
          expect(row.length, `${l.slug}: ${s.heading}`).toBe(s.table.headers.length);
        }
      }
    }
  });
});
