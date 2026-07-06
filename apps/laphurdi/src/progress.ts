/** Course progress, kept in localStorage. Fails soft: a corrupt or absent
 *  store reads as "no progress yet" - never throws. */

const KEY = "laphurdikursen.v1";

export interface LessonProgress {
  /** Best number of correct answers so far. */
  best: number;
  /** Question count at the time of the best run. */
  total: number;
  /** ISO date of the first passing run, once earned. */
  passedAt?: string;
}

export type Progress = Record<string, LessonProgress>;

/** A quiz is passed at 80 % or better. */
export const PASS_PERCENT = 80;

export function percent(p: { best: number; total: number }): number {
  return p.total === 0 ? 0 : Math.round((100 * p.best) / p.total);
}

export function isPassed(p: LessonProgress | undefined): boolean {
  return !!p && percent(p) >= PASS_PERCENT;
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const clean: Progress = {};
    for (const [slug, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        typeof v === "object" && v !== null &&
        typeof (v as LessonProgress).best === "number" &&
        typeof (v as LessonProgress).total === "number"
      ) {
        clean[slug] = v as LessonProgress;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

/** Record a finished quiz run; keeps the best run by percentage. */
export function recordResult(slug: string, correct: number, total: number): LessonProgress {
  const all = loadProgress();
  const prev = all[slug];
  const next: LessonProgress = { best: correct, total };
  if (prev && percent(prev) >= percent(next)) {
    next.best = prev.best;
    next.total = prev.total;
  }
  next.passedAt =
    prev?.passedAt ??
    (percent({ best: correct, total }) >= PASS_PERCENT ? new Date().toISOString() : undefined);
  if (next.passedAt === undefined) delete next.passedAt;
  all[slug] = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* private mode etc. - progress just won't persist */
  }
  return next;
}
