/** English morphology helpers: generation (for Laphurdi→English output)
 *  and analysis (for English→Laphurdi input). */

interface IrregularVerb {
  past: string;
  part: string;
  pres3?: string;
}

export const EN_IRREGULAR_VERBS: Record<string, IrregularVerb> = {
  be: { past: "was", part: "been", pres3: "is" },
  have: { past: "had", part: "had", pres3: "has" },
  go: { past: "went", part: "gone", pres3: "goes" },
  stand: { past: "stood", part: "stood" },
  come: { past: "came", part: "come" },
  see: { past: "saw", part: "seen" },
  do: { past: "did", part: "done", pres3: "does" },
  take: { past: "took", part: "taken" },
  give: { past: "gave", part: "given" },
  get: { past: "got", part: "gotten" },
  say: { past: "said", part: "said", pres3: "says" },
  know: { past: "knew", part: "known" },
  build: { past: "built", part: "built" },
  drink: { past: "drank", part: "drunk" },
  eat: { past: "ate", part: "eaten" },
  speak: { past: "spoke", part: "spoken" },
  sing: { past: "sang", part: "sung" },
  swim: { past: "swam", part: "swum" },
  write: { past: "wrote", part: "written" },
  read: { past: "read", part: "read" },
  run: { past: "ran", part: "run" },
  sit: { past: "sat", part: "sat" },
  sleep: { past: "slept", part: "slept" },
  buy: { past: "bought", part: "bought" },
  bring: { past: "brought", part: "brought" },
  think: { past: "thought", part: "thought" },
  find: { past: "found", part: "found" },
  hold: { past: "held", part: "held" },
  keep: { past: "kept", part: "kept" },
  leave: { past: "left", part: "left" },
  make: { past: "made", part: "made" },
  mean: { past: "meant", part: "meant" },
  meet: { past: "met", part: "met" },
  pay: { past: "paid", part: "paid" },
  send: { past: "sent", part: "sent" },
  tell: { past: "told", part: "told" },
  feel: { past: "felt", part: "felt" },
  grow: { past: "grew", part: "grown" },
  hear: { past: "heard", part: "heard" },
  fall: { past: "fell", part: "fallen" },
  fly: { past: "flew", part: "flown" },
  win: { past: "won", part: "won" },
  lose: { past: "lost", part: "lost" },
  choose: { past: "chose", part: "chosen" },
  break: { past: "broke", part: "broken" },
  wear: { past: "wore", part: "worn" },
  drive: { past: "drove", part: "driven" },
  ride: { past: "rode", part: "ridden" },
  rise: { past: "rose", part: "risen" },
  sell: { past: "sold", part: "sold" },
  teach: { past: "taught", part: "taught" },
  catch: { past: "caught", part: "caught" },
  fight: { past: "fought", part: "fought" },
  understand: { past: "understood", part: "understood" },
  become: { past: "became", part: "become" },
  begin: { past: "began", part: "begun" },
  steal: { past: "stole", part: "stolen" },
  forget: { past: "forgot", part: "forgotten" },
  draw: { past: "drew", part: "drawn" },
  throw: { past: "threw", part: "thrown" },
  let: { past: "let", part: "let" },
  put: { past: "put", part: "put" },
  cut: { past: "cut", part: "cut" },
  cost: { past: "cost", part: "cost" },
  hit: { past: "hit", part: "hit" },
  hurt: { past: "hurt", part: "hurt" },
  set: { past: "set", part: "set" },
  swear: { past: "swore", part: "sworn" },
};

export const EN_IRREGULAR_PLURALS: Record<string, string> = {
  man: "men",
  woman: "women",
  child: "children",
  person: "people",
  foot: "feet",
  tooth: "teeth",
  mouse: "mice",
  goose: "geese",
  sheep: "sheep",
  fish: "fish",
  deer: "deer",
};

/** English nouns whose base gloss already takes plural agreement. */
export const EN_PLURAL_GLOSSES = new Set(["people", "police", "cattle", "folk"]);

const SIBILANT = /(s|x|z|ch|sh)$/;

export function enPlural(w: string): string {
  if (EN_IRREGULAR_PLURALS[w]) return EN_IRREGULAR_PLURALS[w];
  if (SIBILANT.test(w)) return w + "es";
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ies";
  if (/o$/.test(w)) return w + "es";
  return w + "s";
}

export function enPres3(w: string): string {
  const irr = EN_IRREGULAR_VERBS[w];
  if (irr?.pres3) return irr.pres3;
  if (SIBILANT.test(w)) return w + "es";
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ies";
  if (/o$/.test(w)) return w + "es";
  return w + "s";
}

/** One-syllable CVC words double the final consonant: stop → stopped. */
function doubled(w: string): string | null {
  if (/[^aeiouwxy][aeiou][bdgklmnprt]$/.test(w) && !/[aeiou].*[aeiou]/.test(w.slice(0, -2))) {
    return w + w[w.length - 1];
  }
  return null;
}

export function enPast(w: string): string {
  const irr = EN_IRREGULAR_VERBS[w];
  if (irr) return irr.past;
  if (/e$/.test(w)) return w + "d";
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ied";
  const d = doubled(w);
  if (d) return d + "ed";
  return w + "ed";
}

export function enParticiple(w: string): string {
  const irr = EN_IRREGULAR_VERBS[w];
  if (irr) return irr.part;
  return enPast(w);
}

export type EnVerbForm = "base" | "pres3" | "past" | "part" | "ing";

export interface EnVerbAnalysis {
  base: string;
  form: EnVerbForm;
}

/** Reverse map for irregular verb forms, built once. */
const IRREGULAR_FORM_TO_BASE = new Map<string, EnVerbAnalysis[]>();
function addForm(form: string, base: string, kind: EnVerbForm) {
  const list = IRREGULAR_FORM_TO_BASE.get(form) ?? [];
  list.push({ base, form: kind });
  IRREGULAR_FORM_TO_BASE.set(form, list);
}
for (const [base, f] of Object.entries(EN_IRREGULAR_VERBS)) {
  addForm(f.past, base, "past");
  addForm(f.part, base, "part");
  if (f.pres3) addForm(f.pres3, base, "pres3");
}
addForm("am", "be", "base");
addForm("are", "be", "base");
addForm("were", "be", "past");
addForm("being", "be", "ing");

/** All plausible verb analyses of an English surface form, most specific first. */
export function analyzeEnVerb(w: string): EnVerbAnalysis[] {
  const out: EnVerbAnalysis[] = [...(IRREGULAR_FORM_TO_BASE.get(w) ?? [])];
  const tryBase = (base: string, form: EnVerbForm) => {
    if (base.length >= 2) out.push({ base, form });
  };
  if (/ied$/.test(w)) tryBase(w.slice(0, -3) + "y", "past");
  if (/ed$/.test(w)) {
    const stem = w.slice(0, -2);
    tryBase(stem, "past");
    tryBase(stem + "e", "past");
    if (/(.)\1$/.test(stem)) tryBase(stem.slice(0, -1), "past");
  }
  if (/ing$/.test(w)) {
    const stem = w.slice(0, -3);
    tryBase(stem, "ing");
    tryBase(stem + "e", "ing");
    if (/(.)\1$/.test(stem)) tryBase(stem.slice(0, -1), "ing");
  }
  if (/ies$/.test(w)) tryBase(w.slice(0, -3) + "y", "pres3");
  if (/es$/.test(w)) tryBase(w.slice(0, -2), "pres3");
  if (/s$/.test(w) && !/ss$/.test(w)) tryBase(w.slice(0, -1), "pres3");
  out.push({ base: w, form: "base" });
  return out;
}

const IRREGULAR_PLURAL_TO_SINGULAR = new Map(
  Object.entries(EN_IRREGULAR_PLURALS).map(([sg, pl]) => [pl, sg]),
);

/** Candidate singular forms if `w` is read as an English plural noun. */
export function singularizeEn(w: string): string[] {
  const out: string[] = [];
  const irr = IRREGULAR_PLURAL_TO_SINGULAR.get(w);
  if (irr) out.push(irr);
  if (/ies$/.test(w)) out.push(w.slice(0, -3) + "y");
  if (/es$/.test(w)) out.push(w.slice(0, -2));
  if (/s$/.test(w) && !/ss$/.test(w)) out.push(w.slice(0, -1));
  return out;
}
