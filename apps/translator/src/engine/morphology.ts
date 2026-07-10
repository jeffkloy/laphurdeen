/** Laphurdi morphology: inflection generation and surface-form analysis.
 *
 *  Grammar per LAPHURDI.md §3: suffixed definite article (-en/-et, pl. -er,
 *  def. pl. -eren), tense-only verbs (-ar/-ade/-at, 16 irregulars carried in
 *  LEXICON.tsv `forms`), zero-marked adverbs, -er/-est comparison.
 */
import type { Entry, Lexicon } from "./lexicon";

export type Tense = "inf" | "pres" | "past" | "perf";
export type Degree = "base" | "comp" | "sup";

export interface Analysis {
  entry: Entry;
  tags: string[];
  noun?: { plural: boolean; definite: boolean; diminutive?: boolean };
  verb?: { tense: Tense };
  adj?: { degree: Degree };
  /** Left-hand parts of a compound (Helsaministeriet → [helsa] + ministeriet). */
  compoundModifiers?: Entry[];
}

const VOWEL_FINAL = /[aeiou]$/;

/** The one suppletive adjective (§3), in one place: analysis and generation
 *  both read from here so the pair can never drift apart. */
export const LA_IRREGULAR_ADJ: Record<string, { comp: string; sup: string }> = {
  goed: { comp: "beter", sup: "best" },
};

export class Morphology {
  private lex: Lexicon;
  /** Irregular surface forms: er → vera(pres), kronur → krona(pl), beter → goed(comp)… */
  private formLookup = new Map<string, Analysis[]>();

  constructor(lex: Lexicon) {
    this.lex = lex;
    for (const entry of lex.entries) {
      if (entry.pos === "v") {
        const tenses: Array<[string, Tense]> = [
          ["pres", "pres"], ["past", "past"], ["perf", "perf"],
        ];
        for (const [key, tense] of tenses) {
          const form = entry.forms[key];
          if (form) this.addForm(form, { entry, tags: [tense.toUpperCase()], verb: { tense } });
        }
      }
      if (entry.pos === "n" && entry.forms.pl) {
        this.addForm(entry.forms.pl, {
          entry, tags: ["PL"], noun: { plural: true, definite: false },
        });
        this.addForm(entry.forms.pl + (VOWEL_FINAL.test(entry.forms.pl) ? "n" : "en"), {
          entry, tags: ["DEF", "PL"], noun: { plural: true, definite: true },
        });
      }
    }
    for (const [lemma, forms] of Object.entries(LA_IRREGULAR_ADJ)) {
      const entry = lex.lookup(lemma);
      if (!entry) continue;
      this.addForm(forms.comp, { entry, tags: ["COMP"], adj: { degree: "comp" } });
      this.addForm(forms.sup, { entry, tags: ["SUP"], adj: { degree: "sup" } });
    }
  }

  private addForm(surface: string, analysis: Analysis) {
    const key = surface.toLowerCase();
    const list = this.formLookup.get(key) ?? [];
    list.push(analysis);
    this.formLookup.set(key, list);
  }

  // ---- generation -------------------------------------------------------

  nounForm(entry: Entry, opts: { plural?: boolean; definite?: boolean }): string {
    const w = entry.word;
    if (opts.plural) {
      const pl = entry.forms.pl ?? (VOWEL_FINAL.test(w) ? w + "r" : w + "er");
      return opts.definite ? pl + (VOWEL_FINAL.test(pl) ? "n" : "en") : pl;
    }
    if (opts.definite) {
      const suffix = entry.gender === "n"
        ? (VOWEL_FINAL.test(w) ? "t" : "et")
        : (VOWEL_FINAL.test(w) ? "n" : "en");
      return w + suffix;
    }
    return w;
  }

  verbForm(entry: Entry, tense: Tense): string {
    if (tense === "inf") return entry.word;
    const irregular = entry.forms[tense];
    if (irregular) return irregular;
    // e.g. skola/moste have no perfect - fall back to the infinitive.
    if (tense === "perf" && Object.keys(entry.forms).length > 0) return entry.word;
    const stem = entry.word.slice(0, -1);
    return stem + { pres: "ar", past: "ade", perf: "at" }[tense];
  }

  adjForm(entry: Entry, degree: Degree): string {
    if (degree === "base") return entry.word;
    const irregular = LA_IRREGULAR_ADJ[entry.word];
    if (irregular) return degree === "comp" ? irregular.comp : irregular.sup;
    // Long adjectives and French loans compare with mer/mest (§3).
    if (/(ell|isk)$/.test(entry.word) || entry.word.length >= 8) {
      return (degree === "comp" ? "mer " : "mest ") + entry.word;
    }
    return entry.word + (degree === "comp" ? "er" : "est");
  }

  // ---- analysis ---------------------------------------------------------

  /** All readings of a Laphurdi surface form, most confident first. */
  analyze(surface: string, depth = 0): Analysis[] {
    const w = surface.toLowerCase();
    const out: Analysis[] = [];

    const exact = this.lex.lookup(w);
    if (exact) {
      const base: Analysis = { entry: exact, tags: [] };
      if (exact.pos === "v") base.verb = { tense: "inf" };
      if (exact.pos === "n") base.noun = { plural: false, definite: false };
      if (exact.pos === "adj") base.adj = { degree: "base" };
      out.push(base);
    }

    out.push(...(this.formLookup.get(w) ?? []));

    const nounLemma = (lemma: string, gender?: Entry["gender"]) => {
      const e = this.lex.lookup(lemma);
      return e && e.pos === "n" && (!gender || e.gender === gender) ? e : undefined;
    };
    const verbLemma = (stem: string) => {
      const e = this.lex.lookup(stem + "a");
      // Only regular verbs analyze via suffixes; irregulars carry explicit forms.
      return e && e.pos === "v" && Object.keys(e.forms).length === 0 ? e : undefined;
    };
    const adjLemma = (lemma: string) => {
      const e = this.lex.lookup(lemma);
      return e && e.pos === "adj" ? e : undefined;
    };

    if (w.length >= 4) {
      let e: Entry | undefined;
      if (w.endsWith("eren") && (e = nounLemma(w.slice(0, -4)))) {
        out.push({ entry: e, tags: ["DEF", "PL"], noun: { plural: true, definite: true } });
      }
      if (w.endsWith("ade") && (e = verbLemma(w.slice(0, -3)))) {
        out.push({ entry: e, tags: ["PAST"], verb: { tense: "past" } });
      }
      if (w.endsWith("ar") && (e = verbLemma(w.slice(0, -2)))) {
        out.push({ entry: e, tags: ["PRES"], verb: { tense: "pres" } });
      }
      if (w.endsWith("at") && (e = verbLemma(w.slice(0, -2)))) {
        out.push({ entry: e, tags: ["PERF"], verb: { tense: "perf" } });
      }
      if (w.endsWith("en") && (e = nounLemma(w.slice(0, -2), "c"))) {
        out.push({ entry: e, tags: ["DEF"], noun: { plural: false, definite: true } });
      }
      if (w.endsWith("et") && (e = nounLemma(w.slice(0, -2), "n"))) {
        out.push({ entry: e, tags: ["DEF"], noun: { plural: false, definite: true } });
      }
      if (w.endsWith("n") && (e = nounLemma(w.slice(0, -1), "c")) &&
          VOWEL_FINAL.test(e.word)) {
        out.push({ entry: e, tags: ["DEF"], noun: { plural: false, definite: true } });
      }
      if (w.endsWith("t") && (e = nounLemma(w.slice(0, -1), "n")) &&
          VOWEL_FINAL.test(e.word)) {
        out.push({ entry: e, tags: ["DEF"], noun: { plural: false, definite: true } });
      }
      if (w.endsWith("er") && (e = nounLemma(w.slice(0, -2)))) {
        out.push({ entry: e, tags: ["PL"], noun: { plural: true, definite: false } });
      }
      if (w.endsWith("r") && (e = nounLemma(w.slice(0, -1))) && VOWEL_FINAL.test(e.word)) {
        out.push({ entry: e, tags: ["PL"], noun: { plural: true, definite: false } });
      }
      if (w.endsWith("er") && (e = adjLemma(w.slice(0, -2)))) {
        out.push({ entry: e, tags: ["COMP"], adj: { degree: "comp" } });
      }
      if (w.endsWith("est") && (e = adjLemma(w.slice(0, -3)))) {
        out.push({ entry: e, tags: ["SUP"], adj: { degree: "sup" } });
      }
      if (w.endsWith("je") && (e = nounLemma(w.slice(0, -2)))) {
        out.push({
          entry: e, tags: ["DIM"],
          noun: { plural: false, definite: false, diminutive: true },
        });
      }
    }

    // Compound fallback: left headword (+ optional linking -s-) + analyzable head.
    if (out.length === 0 && depth < 2 && w.length >= 6) {
      for (let i = 3; i <= w.length - 3; i++) {
        const left = this.lex.lookup(w.slice(0, i));
        if (!left || !["n", "v", "adj"].includes(left.pos)) continue;
        for (const rest of [w.slice(i), w.slice(i).replace(/^s/, "")]) {
          if (rest.length < 3) continue;
          const heads = this.analyze(rest, depth + 1).filter((a) => a.entry.pos === "n");
          if (heads.length > 0) {
            const head = heads[0];
            out.push({
              ...head,
              tags: ["COMPOUND", ...head.tags],
              compoundModifiers: [left, ...(head.compoundModifiers ?? [])],
            });
            break;
          }
        }
        if (out.length > 0) break;
      }
    }

    return out;
  }
}
