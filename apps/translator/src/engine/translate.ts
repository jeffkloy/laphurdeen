/** The translation engine: English ⇄ Laphurdi.
 *
 *  Rule-based, per-sentence: dictionary lookup via LEXICON.tsv plus the
 *  grammar of LAPHURDI.md - suffixed definite articles, tense-only verbs,
 *  V2 word order, nit-negation, and English do-support at the border.
 */
import { glossBases, Lexicon, primaryGloss, synonymFallback, type Entry, type Pos } from "./lexicon";
import { Morphology, type Analysis, type Degree, type Tense } from "./morphology";
import {
  analyzeEnVerb, enParticiple, enPast, enPlural, enPres3,
  EN_PLURAL_GLOSSES, singularizeEn,
} from "./english";
// The course app's canon validator - one validator for the whole repo, so the
// translator can badge tokens that would fail the audit gate.
import { Canon } from "../../../laphurdikursen/src/test/canon";

export type Direction = "en-lp" | "lp-en";

/** Another word the translator could have chosen for a token. */
export interface Alternative {
  /** Laphurdi headword. */
  word: string;
  /** English gloss for display. */
  gloss: string;
  pos: string;
  register: "" | "everyday" | "high";
  /** Value for `overrides[source.toLowerCase()]` to choose this instead. */
  pick: string;
}

export interface TokenResult {
  source: string;
  output: string;
  lemma?: string;
  gloss?: string;
  pos?: string;
  tags: string[];
  register?: "" | "everyday" | "high";
  note?: string;
  unknown?: boolean;
  punct?: boolean;
  alternatives?: Alternative[];
  /** la→en only: does this source token pass the canon gate? */
  canonLegal?: boolean;
}

export interface TranslateOptions {
  /** lowercased source token → preferred rendering: a Laphurdi headword for
   *  en→la, an English gloss for la→en (an Alternative's `pick` value). */
  overrides?: Record<string, string>;
  /** Register preference for en→la picks: bias toward the high half of the
   *  everyday/high doublets. Default is the lexicon's everyday-first ranking. */
  register?: "everyday" | "high";
}

export interface Translation {
  text: string;
  tokens: TokenResult[];
}

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

interface RawTok {
  text: string;
  isWord: boolean;
  /** set by question pre-pass: render as a verb with this tense */
  forceVerbTense?: Tense;
  /** set by question pre-pass: pronouns here take subject form */
  forceSubject?: boolean;
}

function tokenize(text: string): RawTok[][] {
  const sentences: RawTok[][] = [];
  let current: RawTok[] = [];
  const re = /[A-Za-z]+(?:'[A-Za-z]+)?|\d+(?:[.,]\d+)*|[^\sA-Za-z\d]/g;
  for (const m of text.matchAll(re)) {
    const t = m[0];
    const isWord = /[A-Za-z\d]/.test(t[0]);
    current.push({ text: t, isWord });
    if (!isWord && /[.!?]/.test(t)) {
      sentences.push(current);
      current = [];
    }
  }
  if (current.length > 0) sentences.push(current);
  return sentences;
}

function joinTokens(tokens: TokenResult[]): string {
  let out = "";
  let first = true;
  for (const t of tokens) {
    if (!t.output) continue;
    if (t.punct) {
      out += /^[([«]/.test(t.output) ? " " + t.output : t.output;
      continue;
    }
    let word = t.output;
    if (first) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
      first = false;
    }
    out += (out && !/[([«]$/.test(out) ? " " : "") + word;
  }
  return out.trim();
}

// ---------------------------------------------------------------------------
// Closed-class tables (LAPHURDI.md §3) - structure the flat lexicon can't hold.
// ---------------------------------------------------------------------------

const EN_TO_LA_PRONOUN: Record<string, { subj?: string; obj?: string; poss?: string }> = {
  i: { subj: "ik", obj: "mij" },
  me: { obj: "mij" },
  you: { subj: "du", obj: "dij" },
  he: { subj: "han" },
  him: { obj: "ham" },
  she: { subj: "hon" },
  her: { obj: "henne", poss: "hons" },
  it: { subj: "det", obj: "det" },
  we: { subj: "vi", obj: "os" },
  us: { obj: "os" },
  they: { subj: "dei" },
  them: { obj: "dem" },
  my: { poss: "min" },
  your: { poss: "din" },
  his: { poss: "hans" },
  their: { poss: "deis" },
  our: { poss: "vaar" },
  mine: { poss: "min" },
  yours: { poss: "din" },
  hers: { poss: "hons" },
  theirs: { poss: "deis" },
  ours: { poss: "vaar" },
  myself: { obj: "mij" },
  yourself: { obj: "dij" },
  himself: { obj: "sik" },
  herself: { obj: "sik" },
  itself: { obj: "sik" },
  themself: { obj: "sik" },
  themselves: { obj: "sik" },
  ourselves: { obj: "os" },
};

const CONTRACTIONS: Record<string, string[]> = {
  "don't": ["do", "not"], "doesn't": ["does", "not"], "didn't": ["did", "not"],
  "won't": ["will", "not"], "can't": ["can", "not"], "cannot": ["can", "not"],
  "isn't": ["is", "not"], "aren't": ["are", "not"], "wasn't": ["was", "not"],
  "weren't": ["were", "not"], "haven't": ["have", "not"], "hasn't": ["has", "not"],
  "hadn't": ["had", "not"], "mustn't": ["must", "not"], "shouldn't": ["should", "not"],
  "wouldn't": ["would", "not"], "couldn't": ["could", "not"],
  "i'm": ["i", "am"], "you're": ["you", "are"], "we're": ["we", "are"],
  "they're": ["they", "are"], "it's": ["it", "is"], "he's": ["he", "is"],
  "she's": ["she", "is"], "i'll": ["i", "will"], "you'll": ["you", "will"],
  "he'll": ["he", "will"], "she'll": ["she", "will"], "we'll": ["we", "will"],
  "they'll": ["they", "will"], "i've": ["i", "have"], "you've": ["you", "have"],
  "we've": ["we", "have"], "they've": ["they", "have"], "let's": ["let", "us"],
};

const LA_WH_WORDS = new Set(["wat", "wie", "wen", "waar", "hoe", "warfor"]);

/** One modal table drives both directions - the la→en render map and the
 *  en→la recognition map derive from it, so they can never drift apart. */
const MODALS: Array<{
  la: string;
  render: Partial<Record<Tense, string>>;
  /** English modal word → tense of the Laphurdi verb it becomes. */
  en: Record<string, Tense>;
}> = [
  { la: "kunna", render: { pres: "can", past: "could" },
    en: { can: "pres", could: "past", may: "pres" } },
  { la: "vilja", render: { pres: "want to", past: "wanted to" }, en: {} },
  { la: "skola", render: { pres: "will", past: "should" },
    en: { will: "pres", shall: "pres", would: "past", should: "past" } },
  { la: "moste", render: { pres: "must", past: "had to" }, en: { must: "pres" } },
];

const MODAL_RENDER: Record<string, Partial<Record<Tense, string>>> =
  Object.fromEntries(MODALS.map((m) => [m.la, m.render]));

const EN_MODAL: Record<string, [string, Tense]> = {};
for (const m of MODALS) {
  for (const [w, tense] of Object.entries(m.en)) EN_MODAL[w] = [m.la, tense];
}

/** Gender-neutral singular alternatives for the they-family: English cannot
 *  say which "they" is meant, so hen/hens ride along as alternative chips.
 *  The Constitution is drafted with hen throughout (LAPHURDI.md §Pronouns). */
const EN_PRONOUN_ALTS: Record<string, string[]> = {
  they: ["hen"], them: ["hen"], their: ["hens"], theirs: ["hens"],
};
const HEN_NOTE = "hen: the gender-neutral singular, as the Constitution is drafted";

// ---------------------------------------------------------------------------
// English comparison morphology
// ---------------------------------------------------------------------------

const EN_IRREGULAR_ADJ: Record<string, { base: string; degree: Degree }> = {
  better: { base: "good", degree: "comp" }, best: { base: "good", degree: "sup" },
  bigger: { base: "big", degree: "comp" }, biggest: { base: "big", degree: "sup" },
};

function analyzeEnAdj(w: string): Array<{ base: string; degree: Degree }> {
  const out: Array<{ base: string; degree: Degree }> = [];
  if (EN_IRREGULAR_ADJ[w]) out.push(EN_IRREGULAR_ADJ[w]);
  const push = (base: string, degree: Degree) => {
    if (base.length >= 2) out.push({ base, degree });
  };
  if (/ier$/.test(w)) push(w.slice(0, -3) + "y", "comp");
  if (/iest$/.test(w)) push(w.slice(0, -4) + "y", "sup");
  if (/est$/.test(w)) {
    push(w.slice(0, -3), "sup");
    push(w.slice(0, -3) + "e", "sup");
  }
  if (/er$/.test(w)) {
    push(w.slice(0, -2), "comp");
    push(w.slice(0, -2) + "e", "comp");
  }
  return out;
}

function enComparative(w: string, degree: Degree): string {
  if (degree === "base") return w;
  const irr: Record<string, [string, string]> = {
    good: ["better", "best"], bad: ["worse", "worst"], many: ["more", "most"],
    little: ["less", "least"], far: ["farther", "farthest"],
  };
  const pick = (pair: [string, string]) => (degree === "comp" ? pair[0] : pair[1]);
  if (irr[w]) return pick(irr[w]);
  if (w.length <= 6 && !w.includes(" ")) {
    if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + (degree === "comp" ? "ier" : "iest");
    if (/e$/.test(w)) return w + (degree === "comp" ? "r" : "st");
    if (/[^aeiouwxy][aeiou][bdgmnpt]$/.test(w)) {
      return w + w[w.length - 1] + (degree === "comp" ? "er" : "est");
    }
    return w + (degree === "comp" ? "er" : "est");
  }
  return (degree === "comp" ? "more " : "most ") + w;
}

// ---------------------------------------------------------------------------
// Translator
// ---------------------------------------------------------------------------

/** Working item for the Laphurdi→English pipeline. */
interface Item {
  src: string;
  punct: boolean;
  entry?: Entry;
  analysis?: Analysis;
  /** all readings, for the alternatives list */
  analyses?: Analysis[];
  /** user-picked English base, in place of the entry's primary gloss */
  glossBase?: string;
  picked?: boolean;
  tags: string[];
  unknown?: boolean;
  number?: boolean;
  finite?: boolean;
  consumed?: boolean;
  /** question do-support: render this finite verb as do/does/did */
  doAux?: boolean;
  /** question do-support: render this copy as the bare verb */
  bare?: boolean;
}

export class Translator {
  readonly lexicon: Lexicon;
  readonly morph: Morphology;
  readonly canon: Canon;
  /** Active user picks for the translation in progress (lowercased keys). */
  private overrides: Record<string, string> = {};
  /** Register preference for the translation in progress. */
  private register: "everyday" | "high" = "everyday";

  constructor(tsv: string) {
    this.lexicon = new Lexicon(tsv);
    this.morph = new Morphology(this.lexicon);
    this.canon = new Canon(tsv);
  }

  translate(text: string, dir: Direction, opts?: TranslateOptions): Translation {
    this.overrides = {};
    for (const [k, v] of Object.entries(opts?.overrides ?? {})) {
      this.overrides[k.toLowerCase()] = v;
    }
    this.register = opts?.register ?? "everyday";
    const tokens: TokenResult[] = [];
    const parts: string[] = [];
    for (const sentence of tokenize(text)) {
      const results = dir === "lp-en" ? this.lpToEn(sentence) : this.enToLp(sentence);
      tokens.push(...results);
      parts.push(joinTokens(results));
    }
    return { text: parts.join(" "), tokens };
  }

  /** Choose among candidate entries for an English word, honoring user picks
   *  and the register preference (a stable re-rank, so ties keep lexicon order). */
  private pickEn(source: string, english: string, pos?: Pos | Pos[]):
    { entry: Entry; alts: Entry[]; picked: boolean; synonym?: string } | undefined {
    let cands = this.lexicon.candidates(english, pos);
    if (cands.length === 0) return undefined;
    if (this.register === "high") {
      cands = [
        ...cands.filter((e) => e.register === "high"),
        ...cands.filter((e) => e.register !== "high"),
      ];
    }
    const want = this.overrides[source.toLowerCase()];
    const chosen = (want && cands.find((e) => e.word === want)) || cands[0];
    const synonym = this.lexicon.byEnglish.has(english.toLowerCase())
      ? undefined
      : synonymFallback(english);
    return {
      entry: chosen,
      alts: cands.filter((e) => e !== chosen),
      picked: chosen !== cands[0],
      synonym,
    };
  }

  private attachAlternatives(
    tok: TokenResult, pick: { alts: Entry[]; picked: boolean; synonym?: string },
  ) {
    if (pick.alts.length > 0) {
      tok.alternatives = pick.alts.map((e) => ({
        word: e.word, gloss: primaryGloss(e), pos: e.pos,
        register: e.register, pick: e.word,
      }));
    }
    if (pick.picked) tok.tags.push("PICKED");
    if (pick.synonym) {
      tok.tags.push("SYN");
      const note = `via synonym: ${pick.synonym}`;
      tok.note = tok.note ? `${tok.note} · ${note}` : note;
    }
  }

  // =========================================================================
  // Laphurdi → English
  // =========================================================================

  private lpToEn(sentence: RawTok[]): TokenResult[] {
    const isQuestion = sentence.some((t) => t.text === "?");
    const items: Item[] = sentence.map((t) => {
      const item: Item = { src: t.text, punct: !t.isWord, tags: [] };
      if (t.isWord && /^\d/.test(t.text)) {
        item.number = true;
        return item;
      }
      if (t.isWord) {
        const analyses = this.morph.analyze(t.text);
        if (analyses.length > 0) {
          item.analyses = analyses;
          this.chooseAnalysis(item, analyses[0]);
        } else {
          item.unknown = true;
        }
      }
      return item;
    });

    // Contextual re-pick: after en/et/den/det/de or a possessive, prefer a
    // nominal reading over a verbal one (e.g. "en stem").
    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1].entry;
      const cur = items[i];
      if (!prev || !cur.entry) continue;
      if (prev.pos === "det" || ["en", "et"].includes(prev.word)) {
        if (!["n", "adj"].includes(cur.entry.pos)) {
          const nominal = this.morph.analyze(cur.src)
            .find((a) => ["n", "adj"].includes(a.entry.pos));
          if (nominal) this.chooseAnalysis(cur, nominal);
        }
      }
    }

    // User picks beat both the default ranking and the contextual re-pick.
    for (const item of items) {
      if (item.punct || !item.analyses?.length) continue;
      const want = this.overrides[item.src.toLowerCase()];
      if (!want) continue;
      const wantKey = want.toLowerCase().trim();
      for (const a of item.analyses) {
        const base = glossBases(a.entry).find((g) => g.toLowerCase() === wantKey);
        if (!base) continue;
        if (a !== item.analysis) this.chooseAnalysis(item, a);
        item.glossBase = base;
        item.picked = a !== item.analyses[0] ||
          base.toLowerCase() !== primaryGloss(a.entry).toLowerCase();
        break;
      }
    }

    const wordAt = (from: number) =>
      items.findIndex((x, k) => k >= from && !x.punct && !x.consumed);

    // V2 un-inversion: [Adv] [V-fin] [Subject…] → [Adv] [Subject…] [V-fin]
    if (!isQuestion) {
      const a = wordAt(0);
      const b = a >= 0 ? wordAt(a + 1) : -1;
      if (a >= 0 && b >= 0 && items[a].entry?.pos === "adv" &&
          items[a].entry?.word !== "nit" && items[b].finite) {
        const end = this.subjectNpEnd(items, b + 1);
        if (end > b) {
          const [verb] = items.splice(b, 1);
          verb.tags.push("V2");
          items.splice(end, 0, verb);
        }
      }
    }

    // Question do-support: fronted lexical verb → do/does/did … + bare verb.
    if (isQuestion) {
      let v = wordAt(0);
      if (v >= 0 && items[v].entry && LA_WH_WORDS.has(items[v].entry!.word)) {
        v = wordAt(v + 1);
      }
      const verb = v >= 0 ? items[v] : undefined;
      if (verb?.finite && verb.entry!.pos === "v" &&
          !["vera", "hava"].includes(verb.entry!.word) &&
          !MODAL_RENDER[verb.entry!.word]) {
        const end = this.subjectNpEnd(items, v + 1);
        if (end > v) {
          verb.doAux = true;
          verb.tags.push("Q");
          const bare: Item = {
            src: verb.src, punct: false, entry: verb.entry,
            analysis: { entry: verb.entry!, tags: [], verb: { tense: "inf" } },
            glossBase: verb.glossBase, tags: ["Q"], bare: true,
          };
          items.splice(end + 1, 0, bare);
        }
      }
    }

    // Link har/hadde → following perfect, modal → following infinitive.
    const perfLinked = new Set<number>();
    const infLinked = new Set<number>();
    for (let i = 0; i < items.length; i++) {
      const e = items[i].entry;
      if (!e || !items[i].finite) continue;
      const window = items.slice(i + 1, i + 5);
      if (e.word === "hava") {
        const j = window.findIndex((x) => x.analysis?.verb?.tense === "perf");
        if (j >= 0) perfLinked.add(i + 1 + j);
      }
      if (MODAL_RENDER[e.word]) {
        const j = window.findIndex((x) => x.analysis?.verb?.tense === "inf");
        if (j >= 0) infLinked.add(i + 1 + j);
      }
    }

    // Render.
    const rendered: TokenResult[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.consumed) continue;
      if (item.punct) {
        rendered.push({ source: item.src, output: item.src, tags: [], punct: true });
        continue;
      }
      if (item.number) {
        rendered.push({ source: item.src, output: item.src, tags: ["NUM"] });
        continue;
      }
      // Every word token also faces the canon gate - the audit the rest of
      // the repo runs. Legal-but-untranslatable (proper names, novel
      // compounds) is a different verdict from not-a-word.
      const canonLegal = this.canon.isJustified(item.src);
      if (item.unknown || !item.entry || !item.analysis) {
        rendered.push({
          source: item.src, output: item.src, tags: ["UNKNOWN"],
          unknown: true, canonLegal,
          note: canonLegal
            ? "canon-legal (proper name or compound), but the Commission cannot render it"
            : "fails the canon gate - not a legal Laphurdi form",
        });
        continue;
      }

      // The fossil greeting: dank du → thank you.
      if (item.entry.word === "dank") {
        const nextIdx = wordAt(i + 1);
        if (nextIdx >= 0 && items[nextIdx].entry?.word === "du") {
          items[nextIdx].consumed = true;
          rendered.push({
            source: "dank du", output: "thank you", lemma: "dank", pos: "interj",
            tags: ["FOSSIL"],
            note: "the fossil greeting - regular syntax would give “dank dij”",
          });
          continue;
        }
      }

      const entry = item.entry;
      const a = item.analysis;
      const base = item.glossBase ?? primaryGloss(entry);
      const result: TokenResult = {
        source: item.src, output: "", lemma: entry.word,
        gloss: primaryGloss(entry), pos: entry.pos, tags: item.tags,
        register: entry.register, canonLegal,
      };
      this.attachDoubletNote(result, entry);
      this.attachLaAlternatives(result, item, base);

      switch (entry.pos) {
        case "v":
          result.output = this.renderLaVerb(items, i, perfLinked, infLinked);
          break;
        case "n":
          result.output = this.renderLaNoun(a, base);
          break;
        case "adj":
          result.output = enComparative(base, a.adj?.degree ?? "base");
          break;
        case "det": {
          const nextIdx = wordAt(i + 1);
          const next = nextIdx >= 0 ? items[nextIdx] : undefined;
          if (["den", "det"].includes(entry.word) && next?.finite) {
            result.output = "it"; // det regnar - "it rains"
          } else if (entry.word === "et") {
            result.output = "a";
          } else {
            result.output = base;
          }
          break;
        }
        case "num":
          if (entry.word === "en") {
            const nextIdx = wordAt(i + 1);
            const next = nextIdx >= 0 ? items[nextIdx]?.entry : undefined;
            result.output = next && ["n", "adj"].includes(next.pos) ? "a" : "one";
          } else {
            result.output = base;
          }
          break;
        case "pron":
          if (entry.word === "sik") {
            const subj = this.laSubjectOf(items, i);
            result.output = subj?.entry?.word === "han" ? "himself"
              : subj?.entry?.word === "hon" ? "herself" : "themselves";
          } else {
            result.output = base;
          }
          break;
        default:
          result.output = base;
      }

      // "a" → "an" before a vowel sound.
      if (result.output === "a") {
        const nextIdx = wordAt(i + 1);
        const next = nextIdx >= 0 ? items[nextIdx] : undefined;
        const nextGloss = next?.entry ? primaryGloss(next.entry) : next?.src;
        if (nextGloss && /^[aeiou]/i.test(nextGloss)) result.output = "an";
      }

      rendered.push(result);
    }
    return rendered;
  }

  /** Other readings of a Laphurdi token: sibling gloss senses and rival analyses. */
  private attachLaAlternatives(result: TokenResult, item: Item, usedBase: string) {
    const alts: Alternative[] = [];
    const seen = new Set([usedBase.toLowerCase()]);
    for (const an of item.analyses ?? []) {
      for (const g of glossBases(an.entry)) {
        const key = g.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        alts.push({
          word: an.entry.word, gloss: g, pos: an.entry.pos,
          register: an.entry.register, pick: g,
        });
      }
    }
    if (alts.length > 0) result.alternatives = alts;
    if (item.picked) result.tags.push("PICKED");
  }

  private chooseAnalysis(item: Item, a: Analysis) {
    item.analysis = a;
    item.entry = a.entry;
    item.tags = [...a.tags];
    const t = a.verb?.tense;
    item.finite = t === "pres" || t === "past";
  }

  /** Index of the last token of the subject NP starting at `from` (or -1). */
  private subjectNpEnd(items: Item[], from: number): number {
    let end = -1;
    for (let k = from; k < items.length; k++) {
      const it = items[k];
      if (it.punct || it.consumed) {
        if (end >= 0) break;
        continue;
      }
      const e = it.entry;
      if (!e) return end >= 0 ? end : k; // unknown word can stand as subject
      if (["det", "num", "adj"].includes(e.pos)) {
        end = k;
        continue;
      }
      if (["n", "pron"].includes(e.pos)) return k;
      break;
    }
    return end;
  }

  private renderLaNoun(a: Analysis, picked?: string): string {
    let base = picked ?? primaryGloss(a.entry);
    if (a.compoundModifiers) {
      base = a.compoundModifiers.map((m) => primaryGloss(m)).join(" ") + " " + base;
    }
    if (a.noun?.diminutive) base = "little " + base;
    if (a.noun?.plural && !EN_PLURAL_GLOSSES.has(base.split(" ").pop()!)) {
      const words = base.split(" ");
      words[words.length - 1] = enPlural(words[words.length - 1]);
      base = words.join(" ");
    }
    if (a.noun?.definite) base = "the " + base;
    return base;
  }

  private laSubjectOf(items: Item[], verbIdx: number): Item | undefined {
    const isSubjecty = (it: Item) => {
      const e = it.entry;
      return !!e && !it.consumed && !it.bare &&
        (e.pos === "pron" || e.pos === "n" ||
          (e.pos === "det" && ["den", "det"].includes(e.word)));
    };
    for (let i = verbIdx - 1; i >= 0; i--) {
      if (isSubjecty(items[i])) return items[i];
      if (items[i].punct && /[,;]/.test(items[i].src)) continue;
    }
    for (let i = verbIdx + 1; i < items.length; i++) {
      if (isSubjecty(items[i])) return items[i];
    }
    return undefined;
  }

  private laPerson(subj: Item | undefined): "1sg" | "3sg" | "pl" {
    const e = subj?.entry;
    if (!e) return "3sg";
    if (e.word === "ik") return "1sg";
    if (["han", "hon", "den", "det"].includes(e.word)) return "3sg";
    if (e.pos === "pron") return "pl"; // du, vi, ju, dei, hen - all take base form
    if (e.pos === "n") {
      const gloss = primaryGloss(e).split(" ").pop()!;
      if (subj?.analysis?.noun?.plural || EN_PLURAL_GLOSSES.has(gloss)) return "pl";
      return "3sg";
    }
    return "pl";
  }

  private renderLaVerb(
    items: Item[], i: number, perfLinked: Set<number>, infLinked: Set<number>,
  ): string {
    const item = items[i];
    const entry = item.entry!;
    const tense = item.analysis!.verb?.tense ?? "inf";
    const base = item.glossBase ?? primaryGloss(entry);
    const subj = this.laSubjectOf(items, i);
    const person = this.laPerson(subj);

    if (item.bare) return base;
    if (perfLinked.has(i)) return enParticiple(base);
    if (infLinked.has(i)) return base;
    if (item.doAux) {
      return tense === "past" ? "did" : person === "3sg" ? "does" : "do";
    }

    if (entry.word === "vera") {
      if (tense === "pres") return person === "1sg" ? "am" : person === "3sg" ? "is" : "are";
      if (tense === "past") return person === "pl" ? "were" : "was";
      if (tense === "perf") return "been";
      return "be";
    }
    if (entry.word === "hava" && item.finite &&
        items.slice(i + 1, i + 5).some((x) => x.analysis?.verb?.tense === "perf")) {
      item.tags.push("AUX");
      return tense === "past" ? "had" : person === "3sg" ? "has" : "have";
    }
    const modal = MODAL_RENDER[entry.word];
    if (modal && item.finite) {
      let out = modal[tense] ?? modal.pres!;
      if (out.startsWith("want") && person === "3sg" && tense === "pres") {
        out = "wants to";
      }
      return out;
    }

    // nit after a lexical finite verb → English do-support.
    if (item.finite) {
      const nextIdx = items.findIndex((x, k) => k > i && !x.punct && !x.consumed);
      if (nextIdx >= 0 && items[nextIdx].entry?.word === "nit") {
        items[nextIdx].consumed = true;
        item.tags.push("NEG");
        const aux = tense === "past" ? "did" : person === "3sg" ? "does" : "do";
        return `${aux} not ${base}`;
      }
    }

    if (tense === "pres") return person === "3sg" ? enPres3(base) : base;
    if (tense === "past") return enPast(base);
    if (tense === "perf") return enParticiple(base);
    return base; // infinitive - "te bygga" reads "to build"
  }

  // =========================================================================
  // English → Laphurdi
  // =========================================================================

  private enToLp(sentence: RawTok[]): TokenResult[] {
    const isQuestion = sentence.some((t) => t.text === "?");

    // Expand contractions into the token stream.
    let toks: RawTok[] = [];
    for (const t of sentence) {
      const exp = t.isWord ? CONTRACTIONS[t.text.toLowerCase()] : undefined;
      if (exp) exp.forEach((w) => toks.push({ text: w, isWord: true }));
      else toks.push({ ...t });
    }

    // Question pre-pass: strip do-support, front the verb (V1 questions).
    // [Do] [you] [speak] … → [speak(pres)] [you(subj)] …
    if (isQuestion) {
      toks = this.stripEnDoSupport(toks);
    }

    const out: TokenResult[] = [];
    const lower = () => toks.map((t) => t.text.toLowerCase());
    let low = lower();
    const isWord = (k: number) => k < toks.length && toks[k].isWord;
    const word = (k: number) => (isWord(k) ? low[k] : "");
    const push = (r: TokenResult) => out.push(r);
    const lastWordOut = () => [...out].reverse().find((r) => !r.punct && r.output);

    let sawFiniteVerb = false;
    let pendingInf = false; // after a modal, the next verb is an infinitive

    const pushVerb = (tok: TokenResult) => {
      if (tok.tags.includes("PRES") || tok.tags.includes("PAST") ||
          tok.tags.includes("AUX") || tok.tags.includes("MODAL")) {
        sawFiniteVerb = true;
      }
      push(tok);
    };

    let i = 0;
    while (i < toks.length) {
      const t = toks[i];
      low = lower();
      if (!t.isWord) {
        push({ source: t.text, output: t.text, tags: [], punct: true });
        i++;
        continue;
      }
      const w = low[i];

      // Fronted question verb from the pre-pass.
      if (t.forceVerbTense) {
        const vb = this.enVerbToken(w, t.forceVerbTense);
        if (vb) {
          vb.tags.push("Q");
          pushVerb(vb);
          i++;
          continue;
        }
      }

      // The fossil greeting.
      if (w === "thank" && word(i + 1) === "you") {
        push({
          source: "thank you", output: "dank du", lemma: "dank", pos: "interj",
          tags: ["FOSSIL"],
          note: "the fossil greeting - regular syntax would give “dank dij”",
        });
        i += 2;
        continue;
      }

      // Multi-word lexicon phrases.
      const phrase = this.matchEnPhrase(toks, low, i);
      if (phrase) {
        push(phrase.token);
        i += phrase.len;
        continue;
      }

      // Modals: will/shall/would/should/can/could/must/may (+not) (+subject) + verb
      if (EN_MODAL[w]) {
        const [lemma, tense] = EN_MODAL[w];
        const entry = this.lexicon.lookup(lemma)!;
        pushVerb({
          source: t.text, output: this.morph.verbForm(entry, tense), lemma,
          gloss: primaryGloss(entry), pos: "v", tags: [tense.toUpperCase(), "MODAL"],
        });
        pendingInf = true;
        let j = i + 1;
        if (word(j) === "not") {
          push({ source: "not", output: "nit", lemma: "nit", gloss: "not", pos: "adv", tags: ["NEG"] });
          j++;
        }
        const vb = this.enVerbToken(word(j), "inf");
        if (vb) {
          push(vb);
          pendingInf = false;
          j++;
        }
        i = j;
        continue;
      }

      // want(s)/wanted to + verb → vilja + infinitive
      if (["want", "wants", "wanted"].includes(w) && word(i + 1) === "to" && isWord(i + 2)) {
        const vb = this.enVerbToken(word(i + 2), "inf");
        if (vb) {
          const entry = this.lexicon.lookup("vilja")!;
          const tense: Tense = w === "wanted" ? "past" : "pres";
          pushVerb({
            source: `${t.text} to`, output: this.morph.verbForm(entry, tense),
            lemma: "vilja", gloss: "want", pos: "v", tags: [tense.toUpperCase(), "MODAL"],
          });
          push(vb);
          i += 3;
          continue;
        }
      }

      // have/has/had (+not) (+subject) + participle → perfect
      if (["have", "has", "had"].includes(w)) {
        const scan = this.scanEnPerfect(toks, low, i);
        if (scan) {
          pushVerb({
            source: t.text, output: w === "had" ? "hadde" : "har", lemma: "hava",
            gloss: "have", pos: "v", tags: ["AUX", w === "had" ? "PAST" : "PRES"],
          });
          for (let k = i + 1; k < scan.partIdx; k++) {
            if (!toks[k].isWord) continue;
            if (low[k] === "not") {
              push({ source: "not", output: "nit", lemma: "nit", gloss: "not", pos: "adv", tags: ["NEG"] });
            } else {
              push(this.enWordToken(low[k], toks[k].text, {
                subject: isQuestion, preferVerb: false,
              }));
            }
          }
          const perf: TokenResult = {
            source: toks[scan.partIdx].text,
            output: this.morph.verbForm(scan.pick.entry, "perf"),
            lemma: scan.pick.entry.word, gloss: primaryGloss(scan.pick.entry), pos: "v",
            tags: ["PERF"], register: scan.pick.entry.register,
          };
          this.attachDoubletNote(perf, scan.pick.entry);
          this.attachAlternatives(perf, scan.pick);
          push(perf);
          i = scan.partIdx + 1;
          continue;
        }
      }

      // be-forms: progressive → simple tense; copula → vera
      if (["am", "is", "are", "was", "were"].includes(w)) {
        const past = ["was", "were"].includes(w);
        let j = i + 1;
        const negated = word(j) === "not";
        if (negated) j++;
        const ing = analyzeEnVerb(word(j)).find((x) => x.form === "ing");
        const ingPick = ing && isWord(j) ? this.pickEn(word(j), ing.base, "v") : undefined;
        if (ingPick) {
          const ingEntry = ingPick.entry;
          const vb: TokenResult = {
            source: `${t.text} ${toks[j].text}`,
            output: this.morph.verbForm(ingEntry, past ? "past" : "pres"),
            lemma: ingEntry.word, gloss: primaryGloss(ingEntry), pos: "v",
            tags: [past ? "PAST" : "PRES"], register: ingEntry.register,
          };
          this.attachDoubletNote(vb, ingEntry);
          this.attachAlternatives(vb, ingPick);
          pushVerb(vb);
          if (negated) {
            push({ source: "not", output: "nit", lemma: "nit", gloss: "not", pos: "adv", tags: ["NEG"] });
          }
          i = j + 1;
          continue;
        }
        const vera = this.lexicon.lookup("vera")!;
        pushVerb({
          source: t.text, output: this.morph.verbForm(vera, past ? "past" : "pres"),
          lemma: "vera", gloss: "be", pos: "v", tags: [past ? "PAST" : "PRES"],
        });
        if (negated) {
          push({ source: "not", output: "nit", lemma: "nit", gloss: "not", pos: "adv", tags: ["NEG"] });
          i += 2;
        } else {
          i++;
        }
        continue;
      }

      // do/does/did not + verb → verb + nit (declaratives)
      if (["do", "does", "did"].includes(w) && word(i + 1) === "not" && isWord(i + 2)) {
        const vb = this.enVerbToken(word(i + 2), w === "did" ? "past" : "pres");
        if (vb) {
          vb.tags.push("NEG");
          pushVerb(vb);
          push({ source: "not", output: "nit", lemma: "nit", gloss: "not", pos: "adv", tags: ["NEG"] });
          i += 3;
          continue;
        }
      }

      // the/a/an + [adj]* + noun
      if (["the", "a", "an"].includes(w)) {
        const np = this.matchEnNounPhrase(toks, low, i + 1);
        if (np) {
          this.pushEnNounPhrase(push, w, np);
          i = np.end;
          continue;
        }
        // Unknown noun: keep a sensible article anyway.
        push({
          source: t.text,
          output: w === "the" ? "den" : "en",
          pos: "det", tags: ["GUESS"],
          note: "unknown noun - gender guessed as common",
        });
        i++;
        continue;
      }

      // Pronouns by position.
      const pron = EN_TO_LA_PRONOUN[w];
      if (pron) {
        const prev = lastWordOut();
        const afterQuestionVerb = isQuestion &&
          out.filter((r) => !r.punct && r.output).length === 1 && prev?.pos === "v";
        const isObjectPos = !t.forceSubject && !afterQuestionVerb && prev &&
          (prev.pos === "v" || prev.pos === "prep");
        const nextIsNominal = isWord(i + 1) &&
          (this.lexicon.fromEnglish(word(i + 1), ["n", "adj"]) ||
            singularizeEn(word(i + 1)).some((s) => this.lexicon.fromEnglish(s, "n")));
        let la: string | undefined;
        if (w === "her") la = nextIsNominal ? "hons" : "henne";
        else if (pron.poss) la = pron.poss;
        else la = isObjectPos ? pron.obj ?? pron.subj : pron.subj ?? pron.obj;
        if (la) {
          // The they-family offers the gender-neutral singular as a pick.
          const altWords = EN_PRONOUN_ALTS[w] ?? [];
          const want = this.overrides[w];
          const chosen = want && altWords.includes(want) ? want : la;
          const entry = this.lexicon.lookup(chosen);
          const tok: TokenResult = {
            source: t.text, output: chosen, lemma: chosen,
            gloss: entry ? primaryGloss(entry) : w,
            pos: entry?.pos ?? "pron",
            tags: pron.poss || ["hons", "hens"].includes(chosen) ? ["POSS"]
              : isObjectPos ? ["OBJ"] : ["SUBJ"],
            note: w === "it" ? "Laphurdi uses det/den for “it”, as Swedish"
              : ["hen", "hens"].includes(chosen) ? HEN_NOTE : undefined,
          };
          const others = [la, ...altWords].filter((x) => x !== chosen);
          if (others.length > 0) {
            tok.alternatives = others.map((x) => {
              const e = this.lexicon.lookup(x);
              return {
                word: x, gloss: e ? primaryGloss(e) : x, pos: e?.pos ?? "pron",
                register: e?.register ?? "", pick: x,
              };
            });
          }
          if (chosen !== la) tok.tags.push("PICKED");
          push(tok);
          i++;
          continue;
        }
      }

      // "to" + verb → te + infinitive
      if (w === "to" && isWord(i + 1)) {
        const nextIsBaseVerb = analyzeEnVerb(word(i + 1)).some(
          (x) => x.form === "base" && this.lexicon.fromEnglish(x.base, "v"),
        );
        if (nextIsBaseVerb) {
          const vb = this.enVerbToken(word(i + 1), "inf")!;
          push({ source: "to", output: "te", lemma: "te", gloss: "to", pos: "prep", tags: [] });
          push(vb);
          i += 2;
          continue;
        }
      }

      if (w === "not") {
        push({ source: t.text, output: "nit", lemma: "nit", gloss: "not", pos: "adv", tags: ["NEG"] });
        i++;
        continue;
      }

      const prev = lastWordOut();
      const preferVerb = pendingInf ||
        (!sawFiniteVerb && !!prev && (prev.pos === "n" || prev.pos === "pron"));
      const tok = this.enWordToken(w, t.text, {
        subject: !!t.forceSubject,
        preferVerb,
        infinitive: pendingInf,
      });
      if (tok.pos === "v") {
        pendingInf = false;
        pushVerb(tok);
      } else {
        push(tok);
      }
      i++;
    }

    // V2: after a fronted adverbial, the finite verb comes second.
    if (!isQuestion) this.applyV2(out);

    return out;
  }

  /** [Do] [subj…] [verb] → [verb(tense)] [subj…]; also after a wh-word. */
  private stripEnDoSupport(toks: RawTok[]): RawTok[] {
    const low = toks.map((t) => t.text.toLowerCase());
    let auxIdx = -1;
    if (["do", "does", "did"].includes(low[0])) auxIdx = 0;
    else if (toks.length > 1 && ["do", "does", "did"].includes(low[1]) &&
        ["what", "who", "when", "where", "how", "why"].includes(low[0])) auxIdx = 1;
    if (auxIdx < 0) return toks;
    // "do not" is negation, not a question aux.
    if (low[auxIdx + 1] === "not") return toks;

    let verbIdx = -1;
    for (let k = auxIdx + 1; k < Math.min(auxIdx + 5, toks.length); k++) {
      if (!toks[k].isWord) break;
      const isVerb = analyzeEnVerb(low[k]).some(
        (x) => x.form === "base" && this.lexicon.fromEnglish(x.base, "v"),
      );
      if (isVerb && k > auxIdx + 1) {
        verbIdx = k;
        break;
      }
    }
    if (verbIdx < 0) return toks;

    const result = [...toks];
    const [verb] = result.splice(verbIdx, 1);
    verb.forceVerbTense = low[auxIdx] === "did" ? "past" : "pres";
    result.splice(auxIdx, 1, verb); // replace aux with the fronted verb
    for (let k = auxIdx + 1; k < verbIdx; k++) result[k].forceSubject = true;
    return result;
  }

  private scanEnPerfect(toks: RawTok[], low: string[], i: number):
    { partIdx: number; pick: NonNullable<ReturnType<Translator["pickEn"]>> } | undefined {
    for (let k = i + 1; k < Math.min(i + 4, toks.length); k++) {
      if (!toks[k].isWord) return undefined;
      const analyses = analyzeEnVerb(low[k])
        .filter((x) => x.form === "part" || x.form === "past");
      const pick = analyses
        .map((x) => this.pickEn(low[k], x.base, "v")).find(Boolean);
      if (pick) return { partIdx: k, pick };
      // only subject-ish material may stand between aux and participle
      if (low[k] !== "not" && !EN_TO_LA_PRONOUN[low[k]] &&
          !["the", "a", "an"].includes(low[k]) &&
          !this.lexicon.fromEnglish(low[k], ["n", "adj", "det"])) {
        return undefined;
      }
    }
    return undefined;
  }

  private pushEnNounPhrase(
    push: (r: TokenResult) => void, article: string,
    np: NonNullable<ReturnType<Translator["matchEnNounPhrase"]>>,
  ) {
    const compound = np.nounMods.length > 0;
    const glossOf = (e: Entry) => primaryGloss(e);
    // If the compound is itself a headword (helsaministerie), use the real entry.
    const compoundLemma = np.nounMods.map((m) => m.word.toLowerCase()).join("") +
      np.entry.word.toLowerCase();
    const realCompound = compound ? this.lexicon.lookup(compoundLemma) : undefined;
    const buildNoun = (opts: { plural?: boolean; definite?: boolean }): TokenResult => {
      const headForm = this.morph.nounForm(realCompound ?? np.entry, opts);
      const wordOut = realCompound
        ? headForm
        : np.nounMods.map((m) => m.word.toLowerCase()).join("") + headForm;
      const gloss = realCompound
        ? glossOf(realCompound)
        : [...np.nounMods.map(glossOf), glossOf(np.entry)].join(" ");
      const tags: string[] = [];
      if (opts.definite) tags.push("DEF");
      if (opts.plural) tags.push("PL");
      if (compound) tags.push("COMPOUND");
      const tok: TokenResult = {
        source: np.sourceWords.join(" "), output: wordOut,
        lemma: np.entry.word, gloss, pos: "n", tags, register: np.entry.register,
        note: compound ? "compounds are head-final (§3b)" : undefined,
      };
      this.attachDoubletNote(tok, np.entry);
      // Compound tokens span several source words, so a single pick key
      // wouldn't round-trip - offer alternatives on simple heads only.
      if (!compound && np.pick) this.attachAlternatives(tok, np.pick);
      return tok;
    };

    if (article === "the") {
      if (np.adjTokens.length === 0) {
        push(buildNoun({ definite: true, plural: np.plural }));
      } else {
        // Article moves out front before adjectives: den/det/de + adj + bare noun.
        const art = np.plural ? "de" : np.entry.gender === "n" ? "det" : "den";
        push({
          source: "the", output: art, pos: "det", tags: ["DEF", "FRONTED"],
          note: "with an adjective the article moves out front (den/det/de)",
        });
        np.adjTokens.forEach((a) => push(a));
        push(buildNoun({ plural: np.plural }));
      }
    } else {
      const art = np.entry.gender === "n" ? "et" : "en";
      push({ source: article, output: art, pos: "det", tags: ["INDEF"] });
      np.adjTokens.forEach((a) => push(a));
      push(buildNoun({}));
    }
  }

  private attachDoubletNote(tok: TokenResult, entry: Entry) {
    const doublet = this.lexicon.doubletOf(entry);
    if (doublet) tok.note = `${doublet.register} register: ${doublet.word}`;
  }

  private matchEnPhrase(toks: RawTok[], low: string[], i: number):
    { token: TokenResult; len: number } | undefined {
    for (let len = Math.min(this.lexicon.maxEnglishPhraseLen, 4); len >= 2; len--) {
      if (i + len > toks.length) continue;
      let allWords = true;
      for (let k = i; k < i + len; k++) if (!toks[k].isWord) allWords = false;
      if (!allWords) continue;
      const phrase = low.slice(i, i + len).join(" ");
      const pick = this.pickEn(phrase, phrase);
      if (pick) {
        const entry = pick.entry;
        const token: TokenResult = {
          source: phrase, output: entry.word, lemma: entry.word,
          gloss: primaryGloss(entry), pos: entry.pos, tags: [],
          register: entry.register,
        };
        this.attachDoubletNote(token, entry);
        this.attachAlternatives(token, pick);
        return { token, len };
      }
    }
    return undefined;
  }

  private enVerbToken(w: string, tense: Tense): TokenResult | undefined {
    if (!w) return undefined;
    for (const cand of analyzeEnVerb(w)) {
      const pick = this.pickEn(w, cand.base, "v");
      if (!pick) continue;
      const entry = pick.entry;
      let t = tense;
      if (tense !== "inf" && (cand.form === "past" || cand.form === "part")) {
        t = "past";
      }
      const tok: TokenResult = {
        source: w, output: this.morph.verbForm(entry, t), lemma: entry.word,
        gloss: primaryGloss(entry), pos: "v",
        tags: [t.toUpperCase()], register: entry.register,
      };
      this.attachDoubletNote(tok, entry);
      this.attachAlternatives(tok, pick);
      return tok;
    }
    return undefined;
  }

  private matchEnNounPhrase(toks: RawTok[], low: string[], from: number):
    | {
      entry: Entry; plural: boolean; end: number;
      adjTokens: TokenResult[]; nounMods: Entry[]; sourceWords: string[];
      pick?: NonNullable<ReturnType<Translator["pickEn"]>>;
    }
    | undefined {
    const adjTokens: TokenResult[] = [];
    const nounMods: Entry[] = [];
    const sourceWords: string[] = [];
    let k = from;
    while (k < toks.length && toks[k].isWord) {
      const w = low[k];
      const directPick = this.pickEn(w, w, "n");
      const pluralPick = singularizeEn(w)
        .map((s) => this.pickEn(w, s, "n")).find(Boolean);
      const nounPick = directPick ?? pluralPick;
      const noun = nounPick?.entry;
      // A following noun continues the NP as a compound - unless it could
      // just as well be the sentence's verb ("the people vote").
      const nextIsNoun = k + 1 < toks.length && toks[k + 1].isWord &&
        !this.lexicon.fromEnglish(low[k + 1], "v") && (
          this.lexicon.fromEnglish(low[k + 1], "n") ||
          singularizeEn(low[k + 1]).some((s) => this.lexicon.fromEnglish(s, "n"))
        );
      if (noun && !nextIsNoun) {
        sourceWords.push(toks[k].text.toLowerCase());
        return {
          entry: noun, plural: !directPick && !!pluralPick, end: k + 1,
          adjTokens, nounMods, sourceWords, pick: nounPick,
        };
      }
      if (noun && nextIsNoun) {
        // noun modifier - becomes the left half of a compound
        nounMods.push(noun);
        sourceWords.push(toks[k].text.toLowerCase());
        k++;
        continue;
      }
      const adjPick = this.pickEn(w, w, ["adj", "det", "num"]);
      if (adjPick && !["the", "a", "an"].includes(w)) {
        const adjEntry = adjPick.entry;
        const adjTok: TokenResult = {
          source: toks[k].text, output: adjEntry.word, lemma: adjEntry.word,
          gloss: primaryGloss(adjEntry), pos: adjEntry.pos, tags: [],
          register: adjEntry.register,
        };
        this.attachAlternatives(adjTok, adjPick);
        adjTokens.push(adjTok);
        k++;
        continue;
      }
      const comp = analyzeEnAdj(w)
        .map((c) => ({ c, p: this.pickEn(w, c.base, "adj") }))
        .find((x) => x.p);
      if (comp) {
        const e = comp.p!.entry;
        const compTok: TokenResult = {
          source: toks[k].text, output: this.morph.adjForm(e, comp.c.degree),
          lemma: e.word, gloss: primaryGloss(e), pos: "adj",
          tags: [comp.c.degree.toUpperCase()],
        };
        this.attachAlternatives(compTok, comp.p!);
        adjTokens.push(compTok);
        k++;
        continue;
      }
      return undefined;
    }
    return undefined;
  }

  private enWordToken(
    w: string, original: string,
    opts: { subject?: boolean; preferVerb?: boolean; infinitive?: boolean },
  ): TokenResult {
    const pron = EN_TO_LA_PRONOUN[w];
    if (pron && (opts.subject || pron.subj)) {
      const la = pron.subj ?? pron.obj ?? pron.poss!;
      return {
        source: original, output: la, lemma: la, gloss: w,
        pos: "pron", tags: [opts.subject ? "SUBJ" : ""].filter(Boolean),
      };
    }

    if (opts.preferVerb || opts.infinitive) {
      const vb = this.enVerbToken(w, opts.infinitive ? "inf" : "pres");
      if (vb) {
        vb.source = original;
        return vb;
      }
    }

    const directPick = this.pickEn(w, w);
    if (directPick) {
      const direct = directPick.entry;
      const tok: TokenResult = {
        source: original, output: direct.word, lemma: direct.word,
        gloss: primaryGloss(direct), pos: direct.pos, tags: [],
        register: direct.register,
      };
      if (direct.pos === "v") {
        const tense: Tense = opts.infinitive ? "inf" : "pres";
        tok.output = this.morph.verbForm(direct, tense);
        tok.tags.push(tense.toUpperCase());
      }
      this.attachDoubletNote(tok, direct);
      this.attachAlternatives(tok, directPick);
      return tok;
    }

    const vb = this.enVerbToken(w, opts.infinitive ? "inf" : "pres");
    if (vb) {
      vb.source = original;
      return vb;
    }

    for (const s of singularizeEn(w)) {
      const pick = this.pickEn(w, s, "n");
      if (pick) {
        const entry = pick.entry;
        const tok: TokenResult = {
          source: original, output: this.morph.nounForm(entry, { plural: true }),
          lemma: entry.word, gloss: primaryGloss(entry), pos: "n", tags: ["PL"],
          register: entry.register,
        };
        this.attachDoubletNote(tok, entry);
        this.attachAlternatives(tok, pick);
        return tok;
      }
    }

    for (const c of analyzeEnAdj(w)) {
      const pick = this.pickEn(w, c.base, "adj");
      if (pick) {
        const tok: TokenResult = {
          source: original, output: this.morph.adjForm(pick.entry, c.degree),
          lemma: pick.entry.word, gloss: primaryGloss(pick.entry), pos: "adj",
          tags: [c.degree.toUpperCase()],
        };
        this.attachAlternatives(tok, pick);
        return tok;
      }
    }

    if (/^\d/.test(w)) {
      return { source: original, output: original, tags: ["NUM"] };
    }
    return { source: original, output: original, tags: ["UNKNOWN"], unknown: true };
  }

  /** Move the finite verb to second position after a fronted adverbial. */
  private applyV2(out: TokenResult[]) {
    const words = out.filter((r) => !r.punct && r.output);
    if (words.length < 3) return;
    const first = words[0];
    if (first.pos !== "adv" || first.output === "nit") return;
    const verbIdx = out.findIndex(
      (r) => r.pos === "v" && (r.tags.includes("PRES") || r.tags.includes("PAST") ||
        r.tags.includes("AUX") || r.tags.includes("MODAL")),
    );
    if (verbIdx < 0) return;
    const firstIdx = out.indexOf(first);
    if (verbIdx <= firstIdx + 1) return; // already V2
    const between = out.slice(firstIdx + 1, verbIdx).filter((r) => !r.punct);
    if (between.length === 0 || between.some((r) => r.pos === "v")) return;
    const [verb] = out.splice(verbIdx, 1);
    verb.tags.push("V2");
    out.splice(firstIdx + 1, 0, verb);
  }
}
