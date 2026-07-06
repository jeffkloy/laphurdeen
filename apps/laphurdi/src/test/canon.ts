/** The canon validator: is a Laphurdi token justified by LEXICON.tsv?
 *
 *  A token is accepted when it is a lexicon headword, a listed irregular
 *  form, a regular inflection per LAPHURDI.md §3 (verb -ar/-ade/-at and the
 *  bare-stem imperative; noun definite/plural/genitive; adjective -er/-est;
 *  the -je diminutive), a whitelisted proper name, or a head-final compound
 *  whose parts are themselves justified (with optional linking -s-).
 *
 *  Deliberately-wrong quiz distractors are NEVER fed to this validator —
 *  only text the course presents as true Laphurdi.
 */

interface Entry {
  word: string;
  pos: string;
  gender: string;
  forms: Record<string, string>;
}

/** Names and heritage words the lexicon does not list as headwords. */
const PROPER = new Set([
  "laphurdeen",
  "laphurdi",
  "laphurde",
  "lapentieur",
  "darcambria",
  "darcambrier",
  "agaetisboro",
  "agaet",
  "fjarde", // Old Charter "La Fjärde", cited without the accent
]);

const VOWEL = /[aeiou]$/;

export class Canon {
  /** every acceptable surface form, lowercased */
  private allowed = new Set<string>();
  /** headwords only — used as compound left-parts */
  private stems = new Set<string>();

  constructor(tsv: string) {
    const lines = tsv.split(/\r?\n/).filter((l) => l.length > 0);
    const header = lines[0].split("\t");
    const col = (name: string) => header.indexOf(name);
    const iWord = col("word"), iPos = col("pos"), iGender = col("gender"), iForms = col("forms");

    for (const line of lines.slice(1)) {
      const f = line.split("\t");
      const forms: Record<string, string> = {};
      if (f[iForms]) {
        for (const part of f[iForms].split(",")) {
          const [k, v] = part.split("=").map((s) => s.trim());
          if (k && v) forms[k] = v;
        }
      }
      this.addEntry({ word: f[iWord], pos: f[iPos], gender: f[iGender], forms });
    }
    for (const name of PROPER) {
      this.allowed.add(name);
      this.allowed.add(name + "s"); // genitive on names: Laphurdeens strander
      this.stems.add(name);
    }
  }

  private add(form: string): void {
    this.allowed.add(form.toLowerCase());
  }

  private addEntry(e: Entry): void {
    const w = e.word.toLowerCase();
    this.add(w);
    this.stems.add(w);
    for (const v of Object.values(e.forms)) for (const part of v.split(/\s+/)) this.add(part);

    if (e.pos === "n") {
      const defs: string[] = [];
      const defSuffix = (g: string) => (VOWEL.test(w) ? (g === "n" ? "t" : "n") : g === "n" ? "et" : "en");
      const genders = e.gender === "c" || e.gender === "n" ? [e.gender] : ["c", "n"];
      for (const g of genders) defs.push(w + defSuffix(g));
      const pluralStem = /[ae]$/.test(w) ? w.slice(0, -1) : w;
      const plural = e.forms.pl ? [e.forms.pl] : [pluralStem + "er"];
      const pluralDef = e.forms.pl ? [] : [pluralStem + "eren"];
      const diminutive = w + "je";
      for (const form of [w, ...defs, ...plural, ...pluralDef, diminutive]) {
        this.add(form);
        this.add(form + "s"); // genitive
      }
    } else if (e.pos === "v") {
      const regular = !e.forms.pres;
      if (w.endsWith("a") && w.length > 2) this.add(w.slice(0, -1)); // imperative: bare stem
      if (regular && w.endsWith("a")) {
        const stem = w.slice(0, -1);
        this.add(stem + "ar");
        this.add(stem + "ade");
        this.add(stem + "at");
      }
    } else if (e.pos === "adj") {
      this.add(w + "er");
      this.add(w + "est");
    }
  }

  /** Is this single token an acceptable Laphurdi surface form? */
  hasForm(token: string): boolean {
    return this.allowed.has(token.toLowerCase());
  }

  /** Full check: direct form, or head-final compound of justified parts.
   *  Both parts must be 3+ letters — otherwise the numeral "en" and the
   *  article "de" would launder wrong inflections like "husen". */
  isJustified(token: string): boolean {
    const t = token.toLowerCase();
    if (this.hasForm(t)) return true;
    // head-final compound: left part is a stem (or stem + linking s),
    // right part is any justified form (recursion allows 3-part compounds)
    for (let i = 3; i <= t.length - 3; i++) {
      const left = t.slice(0, i);
      const right = t.slice(i);
      if ((this.stems.has(left) || (left.endsWith("s") && this.stems.has(left.slice(0, -1)))) && this.isJustified(right)) {
        return true;
      }
    }
    return false;
  }
}

/* ------------------------- extracting the tokens ------------------------ */

const SKIP = /^\d|^[^a-zA-Z]*$/; // numbers, pure punctuation/symbols

/** Split a Laphurdi string (possibly with · / → + separators, quotes,
 *  sentence punctuation) into auditable word tokens. Affix citations like
 *  "-hed" and single letters (the linking -s-) are skipped. */
export function tokenize(lp: string): string[] {
  return lp
    .split(/[\s/·→+«»„""(),;:.!?…—–]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !t.startsWith("-") && !t.endsWith("-") && !SKIP.test(t));
}

/** Pull every string the course presents as true Laphurdi. */
export function lpStrings(lesson: unknown): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const l = lesson as {
    slug: string;
    titleLp: string;
    sections: {
      heading: string;
      examples?: { lp: string }[];
      table?: { langs: string[]; rows: string[][] };
    }[];
    vocab: { lp: string }[];
    quiz: (
      | { type: "choice"; options: string[]; answer: number; lpOptions?: boolean }
      | { type: "type"; accept: string[]; lpAnswer?: boolean }
    )[];
  };

  out.push({ where: `${l.slug}: titleLp`, text: l.titleLp });
  for (const s of l.sections) {
    for (const e of s.examples ?? []) out.push({ where: `${l.slug}: ${s.heading}`, text: e.lp });
    if (s.table) {
      s.table.langs.forEach((lang, i) => {
        if (lang !== "lp") return;
        for (const row of s.table!.rows) out.push({ where: `${l.slug}: table ${s.heading}`, text: row[i] });
      });
    }
  }
  for (const v of l.vocab) out.push({ where: `${l.slug}: vocab`, text: v.lp });
  for (const q of l.quiz) {
    if (q.type === "choice" && q.lpOptions) {
      // only the CORRECT option is canon; distractors may be deliberately wrong
      out.push({ where: `${l.slug}: quiz answer`, text: q.options[q.answer] });
    }
    if (q.type === "type" && q.lpAnswer) {
      for (const a of q.accept) out.push({ where: `${l.slug}: quiz accept`, text: a });
    }
  }
  // Laphurdi embedded in English prose, marked with lang="lp". The source
  // is JSON.stringify output, so unescape each fragment back to plain text.
  const json = JSON.stringify(lesson);
  for (const m of json.matchAll(/lang=\\"lp\\"[^>]*>([^<]+)</g)) {
    let text = m[1];
    try {
      text = JSON.parse(`"${text}"`) as string;
    } catch {
      /* keep the raw fragment */
    }
    out.push({ where: `${l.slug}: inline`, text });
  }
  return out;
}
