/** LEXICON.tsv parser and lookup indexes.
 *  The TSV at the repo root is the single source of truth (see tools/lexicon.py). */

export type Pos =
  | "n" | "v" | "adj" | "adv" | "prep" | "conj" | "pron" | "num" | "det" | "interj";

export interface Entry {
  word: string;
  pos: Pos;
  gender: "c" | "n" | "";
  forms: Record<string, string>;
  english: string;
  domain: string;
  register: "" | "everyday" | "high";
  notes: string;
}

export interface EnglishSense {
  entry: Entry;
  /** Position of this variant within the entry's gloss (0 = primary sense). */
  rank: number;
  /** The gloss segment carried a parenthetical qualifier - "fish (v.)". */
  qualified: boolean;
  /** How many senses the entry's whole gloss lists ("time, occurrence" = 2). */
  senses: number;
}

/** Common English words whose lexicon gloss uses a near-synonym.
 *  Entries whose word later gets a direct gloss go dead silently - prune them
 *  when the SYN badge stops appearing (ocean and street already graduated). */
const EN_FALLBACK_SYNONYMS: Record<string, string> = {
  little: "small",
  large: "big",
  talk: "speak",
};

/** The synonym a lookup for this English word would silently fall back to,
 *  so the pipeline can say so on the token instead of rewriting quietly. */
export function synonymFallback(english: string): string | undefined {
  return EN_FALLBACK_SYNONYMS[english.toLowerCase()];
}

export class Lexicon {
  entries: Entry[] = [];
  byWord = new Map<string, Entry>();
  /** english variant (lowercased, may contain spaces) → candidate entries */
  byEnglish = new Map<string, EnglishSense[]>();
  /** longest multi-word English key, in words (for greedy phrase matching) */
  maxEnglishPhraseLen = 1;

  constructor(tsv: string) {
    const lines = tsv.split(/\r?\n/).filter((l) => l.length > 0);
    const header = lines[0].split("\t");
    const col = (name: string) => header.indexOf(name);
    const iWord = col("word"), iPos = col("pos"), iGender = col("gender"),
      iForms = col("forms"), iEnglish = col("english"), iDomain = col("domain"),
      iRegister = col("register"), iNotes = col("notes");

    for (const line of lines.slice(1)) {
      const f = line.split("\t");
      const forms: Record<string, string> = {};
      if (f[iForms]) {
        for (const part of f[iForms].split(",")) {
          const [k, v] = part.split("=").map((s) => s.trim());
          if (k && v) forms[k] = v;
        }
      }
      const entry: Entry = {
        word: f[iWord],
        pos: f[iPos] as Pos,
        gender: (f[iGender] ?? "") as Entry["gender"],
        forms,
        english: f[iEnglish] ?? "",
        domain: f[iDomain] ?? "",
        register: (f[iRegister] ?? "") as Entry["register"],
        notes: f[iNotes] ?? "",
      };
      this.entries.push(entry);
      this.byWord.set(entry.word.toLowerCase(), entry);
    }

    for (const entry of this.entries) {
      for (const v of glossVariants(entry)) {
        const list = this.byEnglish.get(v.key) ?? [];
        list.push({ entry, rank: v.rank, qualified: v.qualified, senses: v.senses });
        this.byEnglish.set(v.key, list);
        const words = v.key.split(" ").length;
        if (words > this.maxEnglishPhraseLen) this.maxEnglishPhraseLen = words;
      }
    }
    for (const list of this.byEnglish.values()) list.sort(compareSenses);
  }

  lookup(word: string): Entry | undefined {
    return this.byWord.get(word.toLowerCase());
  }

  /** Best Laphurdi entry for an English word/phrase, optionally filtered by pos. */
  fromEnglish(english: string, pos?: Pos | Pos[]): Entry | undefined {
    return this.candidates(english, pos)[0];
  }

  /** All candidate entries for an English word/phrase, best first. */
  candidates(english: string, pos?: Pos | Pos[]): Entry[] {
    const key = english.toLowerCase();
    const senses = this.byEnglish.get(key) ??
      (EN_FALLBACK_SYNONYMS[key] ? this.byEnglish.get(EN_FALLBACK_SYNONYMS[key]) : undefined);
    if (!senses) return [];
    if (!pos) return senses.map((s) => s.entry);
    const wanted = Array.isArray(pos) ? pos : [pos];
    return senses.filter((s) => wanted.includes(s.entry.pos)).map((s) => s.entry);
  }

  /** The other half of a register doublet (e.g. stemma ↔ votera), if any. */
  doubletOf(entry: Entry): Entry | undefined {
    if (!entry.register) return undefined;
    const senses = this.byEnglish.get(primaryGloss(entry).toLowerCase()) ?? [];
    return senses.find(
      (s) => s.entry !== entry && s.entry.register && s.entry.register !== entry.register,
    )?.entry;
  }
}

/** Split a gloss on , and ; - but not inside parentheses. */
function splitGloss(english: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < english.length; i++) {
    const ch = english[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if ((ch === "," || ch === ";") && depth === 0) {
      out.push(english.slice(start, i));
      start = i + 1;
    }
  }
  out.push(english.slice(start));
  return out;
}

/** First gloss variant, parentheticals stripped - the display gloss. */
export function primaryGloss(entry: Entry): string {
  // Proper nouns whose gloss is descriptive render as themselves
  // ("Laphurdi", not "the Laphurdi language") - but Fransk still says "French".
  if (/^[A-Z]/.test(entry.word) &&
      entry.english.toLowerCase().includes(entry.word.toLowerCase())) {
    return entry.word;
  }
  const first = splitGloss(entry.english)[0].replace(/\([^)]*\)/g, "").trim();
  return stripGlossArticle(first, entry.pos);
}

/** All of an entry's gloss bases, cleaned and article-stripped, in rank order. */
export function glossBases(entry: Entry): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const seg of splitGloss(entry.english)) {
    const cleaned = stripGlossArticle(
      seg.replace(/\([^)]*\)/g, "").trim(), entry.pos,
    );
    const key = cleaned.toLowerCase();
    if (cleaned && !seen.has(key)) {
      seen.add(key);
      out.push(cleaned);
    }
  }
  return out;
}

function stripGlossArticle(variant: string, pos: Pos): string {
  if (pos === "v" && variant.startsWith("to ")) return variant.slice(3);
  if (pos === "n") {
    for (const art of ["a ", "an ", "the "]) {
      if (variant.startsWith(art) && variant.length > art.length) {
        return variant.slice(art.length);
      }
    }
  }
  return variant;
}

interface Variant {
  key: string;
  rank: number;
  qualified: boolean;
  senses: number;
}

/** English lookup keys for an entry: split on , and ; strip (...) and lead articles. */
function glossVariants(entry: Entry): Variant[] {
  const out: Variant[] = [];
  const seen = new Set<string>();
  const segments = splitGloss(entry.english);
  const senses = segments.filter((s) => s.replace(/\([^)]*\)/g, "").trim()).length;
  const push = (v: string, rank: number, qualified: boolean) => {
    const key = v.toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push({ key, rank, qualified, senses });
    }
  };
  segments.forEach((raw, rank) => {
    const cleaned = raw.replace(/\([^)]*\)/g, "").trim();
    if (!cleaned) return;
    const qualified = raw.includes("(");
    push(cleaned, rank, qualified);
    push(stripGlossArticle(cleaned, entry.pos), rank, qualified);
  });
  // Proper nouns are findable by their own name ("Laphurdi" → Laphurdi).
  if (/^[A-Z]/.test(entry.word)) push(entry.word, 0, false);
  return out;
}

/** Everyday register beats high; primary senses beat secondary ones; a bare
 *  gloss beats a qualified one ("time" over "time (occurrence)"); a dedicated
 *  word beats a polysemous one ("tid: time" over "mal: time, occurrence"). */
function compareSenses(a: EnglishSense, b: EnglishSense): number {
  const reg = (e: Entry) => (e.register === "high" ? 1 : 0);
  return reg(a.entry) - reg(b.entry) || a.rank - b.rank ||
    Number(a.qualified) - Number(b.qualified) || a.senses - b.senses ||
    a.entry.word.length - b.entry.word.length;
}
