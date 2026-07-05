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
}

/** Common English words whose lexicon gloss uses a near-synonym. */
const EN_FALLBACK_SYNONYMS: Record<string, string> = {
  little: "small",
  large: "big",
  talk: "speak",
  ocean: "sea",
  street: "road",
};

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
      for (const [variant, rank] of glossVariants(entry)) {
        const list = this.byEnglish.get(variant) ?? [];
        list.push({ entry, rank });
        this.byEnglish.set(variant, list);
        const words = variant.split(" ").length;
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
    const key = english.toLowerCase();
    const senses = this.byEnglish.get(key) ??
      (EN_FALLBACK_SYNONYMS[key] ? this.byEnglish.get(EN_FALLBACK_SYNONYMS[key]) : undefined);
    if (!senses) return undefined;
    if (!pos) return senses[0].entry;
    const wanted = Array.isArray(pos) ? pos : [pos];
    return senses.find((s) => wanted.includes(s.entry.pos))?.entry;
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

/** First gloss variant, parentheticals stripped — the display gloss. */
export function primaryGloss(entry: Entry): string {
  // Proper nouns whose gloss is descriptive render as themselves
  // ("Laphurdi", not "the Laphurdi language") — but Fransk still says "French".
  if (/^[A-Z]/.test(entry.word) &&
      entry.english.toLowerCase().includes(entry.word.toLowerCase())) {
    return entry.word;
  }
  const first = entry.english.split(/[;,]/)[0].replace(/\([^)]*\)/g, "").trim();
  return stripGlossArticle(first, entry.pos);
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

/** English lookup keys for an entry: split on , and ; strip (...) and lead articles. */
function glossVariants(entry: Entry): Array<[string, number]> {
  const out: Array<[string, number]> = [];
  const seen = new Set<string>();
  const push = (v: string, rank: number) => {
    const key = v.toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push([key, rank]);
    }
  };
  entry.english.split(/[;,]/).forEach((raw, rank) => {
    const cleaned = raw.replace(/\([^)]*\)/g, "").trim();
    if (!cleaned) return;
    push(cleaned, rank);
    push(stripGlossArticle(cleaned, entry.pos), rank);
  });
  // Proper nouns are findable by their own name ("Laphurdi" → Laphurdi).
  if (/^[A-Z]/.test(entry.word)) push(entry.word, 0);
  return out;
}

/** Everyday register beats high; then primary senses beat secondary ones. */
function compareSenses(a: EnglishSense, b: EnglishSense): number {
  const reg = (e: Entry) => (e.register === "high" ? 1 : 0);
  return reg(a.entry) - reg(b.entry) || a.rank - b.rank ||
    a.entry.word.length - b.entry.word.length;
}
