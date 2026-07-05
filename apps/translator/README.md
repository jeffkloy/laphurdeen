# Oversettaren — the Laphurdi ⇄ English translator

A static web app (Vite + TypeScript, no framework) that translates between
English and Laphurdi in both directions, with a word-by-word gloss line.
Deployable to GitHub Pages; everything runs client-side.

*Oversettaren* = "the translator": attested `oversetta` (translate) + the
agent suffix `-are` (§3b) + the suffixed definite article.

## How it works

- **`LEXICON.tsv` at the repo root is the single source of truth.** It is
  imported at build time (`?raw`), so rebuilding after lexicon changes is all
  that's needed — the Pages workflow triggers on `LEXICON.tsv` too.
- `src/engine/lexicon.ts` — TSV parser; word → entry and English-gloss →
  entry indexes with register-aware sense ranking (everyday beats high).
- `src/engine/morphology.ts` — Laphurdi inflection per `LAPHURDI.md` §3:
  suffixed definite articles (-en/-et, pl. -er, def. pl. -eren), tense-only
  verbs (-ar/-ade/-at plus the closed irregular sixteen from the TSV `forms`
  column), -er/-est comparison, -je diminutives, and compound splitting.
- `src/engine/english.ts` — English morphology for the other side of the
  border: irregular verbs/plurals, do-support forms.
- `src/engine/translate.ts` — the pipelines. Handles V2 inversion after
  fronted adverbials, verb-first questions (adding/removing English
  do-support), nit-negation, perfect with *har*, future with *skal*,
  modals, den/det/de article fronting before adjectives, pronoun case by
  position, and the *Dank du* fossil.

Where the reference is silent (vowel-final noun inflection: *ministerie →
ministeriet*), the engine follows the Swedish pattern the grammar already
leans on.

## Develop

```sh
npm install
npm run dev      # local dev server
npm test         # engine tests (canonical sentences from LAPHURDI.md)
npm run build    # typecheck + production build to dist/
```

## Deploy to GitHub Pages

`.github/workflows/deploy-translator.yml` builds and deploys on every push
to `main` that touches the app or the lexicon. One-time setup after pushing
the repo to GitHub: **Settings → Pages → Source → "GitHub Actions"**.

The Vite `base` is relative (`./`), so the build works at any Pages URL
without knowing the repo name.
