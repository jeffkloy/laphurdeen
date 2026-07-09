# Laphurdikursen - the Laphurdi Course

An interactive course in Laphurdi, the national language of the Commonwealth
of Laphurdeen: **twelve lessons, twelve quizzes** (*provet*), from
*Hallej!* to reading the Preamble of the Grundlojen and ordering lunch like
a local, plus a vocabulary drill (*Prova orderen*, at `#/prova`) built from
the words of every lesson passed. Published, in-world, by Sprakkommisjonen -
the Language Commission.

Design spec: `docs/superpowers/specs/2026-07-05-laphurdi-course-design.md`.

## Run it

```sh
npm install
npm run dev       # develop
npm test          # vitest: quiz engine, content integrity, canon audit
npm run build     # tsc + vite → dist/
```

Deployed under `/laphurdikursen/` in the shared GitHub Pages artifact
(`.github/workflows/deploy-pages.yml` - the repo's single Pages workflow).

## How it is built

- Vite + vanilla TypeScript, no runtime dependencies - same formula as
  `apps/website` and `apps/translator`.
- Hash-routed SPA: `#/` (course home) and `#/leksjon/<slug>`.
- Lessons live in `src/lessons/*.ts` as typed data (`src/types.ts`);
  the renderer (`src/render.ts`) and quiz engine (`src/quiz.ts`) are content-blind.
- Progress (best score per quiz, 80 % passes) is kept in
  `localStorage["laphurdikursen.v1"]`. No network calls at runtime.

## The canon gate

`src/test/audit.test.ts` parses the repo-root `LEXICON.tsv` and verifies that
**every Laphurdi token the course presents as true** - titles, examples,
tables, vocabulary, quiz answers, and `lang="lp"` fragments inside prose - is
a lexicon headword, a listed irregular form, a regular inflection per
LAPHURDI.md §3, a whitelisted proper name, or a head-final compound of
justified parts. Deliberately-wrong quiz distractors are exempt (they are
supposed to be wrong). The course adapts its phrasing to the lexicon, never
the reverse: no new words are coined here.
