# Laphurdikursen - the Laphurdi Course · Design

*2026-07-05 · app: `apps/laphurdi` · deployed at `/laphurdi/`*

## What

An interactive course that teaches Laphurdi to English speakers: eleven lessons
built from `LAPHURDI.md`, each ending in a quiz (*provet*). Progress is saved in
the browser. In-world, the course is published by the Language Commission -
the same voice as the Working Reference.

Branding: **Laphurdikursen** (head-final compound, *Laphurdi + kurs*, definite
*-en* - the *Folkskameren* pattern). Instruction language is English (it is a
course *for learners*), with Laphurdi surfacing everywhere it can carry its own
weight: lesson titles, UI labels with English glosses, and all example material.

## Approaches considered

1. **Hash-routed SPA, lessons as typed TS data - chosen.** One HTML entry;
   content lives in `src/lessons/*.ts` as structured data, which makes quizzes,
   progress, and - decisively - *automated canon-auditing of every Laphurdi
   token* possible. Matches the translator's app-like pattern.
2. Multi-page static HTML (landing-page style). Pretty, but quizzes need JS
   anyway, the chrome would be duplicated across ~12 pages, and lesson content
   trapped in HTML can't be integrity-tested.
3. A framework (React/Preact). The repo is deliberately vanilla; no.

## Course structure (11 lessons)

| # | slug | title (en) | title (lp) | source |
|---|---|---|---|---|
| 1 | hallej | Hello! First words | Hallej! | §6 phrases, small words |
| 2 | ljud | Sound & spelling | Ljuden* | §2 (ij, oe, aa, sj, hard k, stress) |
| 3 | nouns | Nouns & articles | Substantiven* | §3 (en/et, -en/-et, plurals, den/det/de, genitive -s) |
| 4 | verbs | Regular verbs | Verben* | §3 (tense-only: -a/-ar/-ade/har -at/skal/imperative) |
| 5 | irregulars | The sixteen irregulars | De Sekston* | §3 closed list |
| 6 | pronouns | Pronouns | Pronomen* | §3 (subject/object/possessive, hen, sik, Dank du) |
| 7 | order | Word order | Ordfoljden* | §3 (V2, nit, questions, wat/wie/wen/waar/hoe/warfor, dat) |
| 8 | numbers | Numbers & comparison | Nummeren* | §5, §3 (ordinals, -er/-est, mer/mest, adverbs) |
| 9 | wordbuilding | Word-building | Ordbygging* | §3b derivation + compounds |
| 10 | register | The high register | Den Hoge Registeren* | §3b French loans, doublets |
| 11 | laphurdeen | Reading Laphurdeen | Lesa Laphurdeen* | §6–7 motto, Preamble, place names, civic vocab |

\* Laphurdi titles are drafted at content-writing time and **must pass the token
audit** - any title word missing from the lexicon is replaced with an attested
phrasing rather than coining new words (no new-word authority in this app).

Each lesson: intro paragraph → 2–5 teaching sections (prose, tables, examples
with glosses) → vocabulary list (*Orden* - words to know) → quiz.

## Quiz (Provet)

- 8+ questions per lesson; two types:
  - `choice`: 4 options, one correct, immediate feedback + one-line explanation.
  - `type`: free-typed answer, normalized (trim, lowercase, collapse spaces),
    multiple accepted answers allowed.
- Score shown at the end; **≥ 80 % = passed** (amber star on the home page).
  Retakes always allowed; best score kept.
- Progress in `localStorage` under `laphurdikursen.v1`:
  `{ [slug]: { best: number, total: number, passedAt?: string } }`.
  No gating - every lesson is open from the start (konsens, not gatekeeping).

## Architecture

```
apps/laphurdi/
  index.html            single entry: header (brand, home link), <main id="app">, footer
  package.json          scripts: dev / build (tsc && vite build) / test (vitest run) / preview
  tsconfig.json         copy of sibling apps'
  vite.config.ts        base "./", fs.allow repo root (vitest reads LEXICON.tsv)
  src/
    main.ts             hash router: #/ (home) · #/leksjon/<slug> (lesson+quiz)
    types.ts            Lesson / Section / VocabItem / Question types
    lessons/index.ts    exports Lesson[] in order
    lessons/01-hallej.ts … 11-laphurdeen.ts
    render.ts           home + lesson page rendering (trusted innerHTML from our own data)
    quiz.ts             quiz state machine: answer → feedback → next → summary
    progress.ts         localStorage wrapper (schema-checked, fails soft)
    style.css           landing-page palette/fonts: navy #003A66, amber #F2A900,
                        paper, Fraunces/Instrument Sans/Fragment Mono
  test/
    content.test.ts     integrity: unique slugs, valid answer indexes, ≥8 questions,
                        option counts, non-empty accepted answers
    quiz.test.ts        scoring + answer normalization
    audit.test.ts       THE CANON GATE: parses ../../LEXICON.tsv and validates every
                        Laphurdi token in titles, examples, vocab, and quiz answers -
                        accepted if it is a lexicon headword, a listed form, a regular
                        inflection (verb -ar/-ade/-at, noun -en/-et/-er/-eren, adj
                        -er/-est, genitive -s), a proper name, or a numeral compound
```

Lesson content marks Laphurdi text structurally (e.g. `lp("Goed morgen")` /
`{ lp, en }` example pairs) rather than inline in English prose, so the audit
knows exactly which tokens are Laphurdi. English prose may still mention
Laphurdi words - those are wrapped with the same helper to stay auditable.

## Deploy & cross-links

- Extend `.github/workflows/deploy-pages.yml` (the single Pages workflow -
  never a second one): add `apps/laphurdi/**` to trigger paths and cache;
  `npm ci && npm test && npm run build`; copy `dist` → `_site/laphurdi/`.
- Landing page: add course links following the translator's pattern on all
  8 pages (nav + footer) - lp pages: nav `Kursen ↗` / footer `Laphurdikursen`,
  href `laphurdi/` (root pages) or `../laphurdi/` (city pages); en pages the
  same href with `The Course ↗` / `Laphurdikursen - the Laphurdi course`.
  The two home pages also get a `Beginna Kursen ↗` / `Start the Course ↗`
  button in the language section beside the translator's.

## Error handling

- Unknown hash route → render home (no 404 page needed under a hash router).
- Corrupt/absent localStorage → treated as empty progress, never throws.
- No network calls at runtime; everything ships in the bundle.

## Testing & verification

- `npm test` (vitest, node env) runs content-integrity, quiz-engine, and
  token-audit suites; wired into the Pages workflow like the translator's.
- Manual: `npm run dev`, walk a lesson end-to-end, take a quiz, reload to
  confirm progress persists; `npm run build && npm run preview` sanity pass.

## Out of scope

- Audio/pronunciation recordings, spaced repetition, server-side anything.
- New lexicon words (course adapts phrasing to the lexicon, never the reverse).
- A Laphurdi-medium mirror of the course (the landing page's `/en/` pattern) -
  a future session could add `#/lp/` routes once learners exist in-world.
