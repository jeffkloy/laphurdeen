# Oversettaren - the Laphurdi ⇄ English translator

A static web app (Vite + TypeScript, no framework) that translates between
English and Laphurdi in both directions, with a word-by-word gloss line.
Deployable to GitHub Pages; everything runs client-side.

*Oversettaren* = "the translator": attested `oversetta` (translate) + the
agent suffix `-are` (§3b) + the suffixed definite article.

## How it works

- **`LEXICON.tsv` at the repo root is the single source of truth.** It is
  imported at build time (`?raw`), so rebuilding after lexicon changes is all
  that's needed - the Pages workflow triggers on `LEXICON.tsv` too.
- `src/engine/lexicon.ts` - TSV parser; word → entry and English-gloss →
  entry indexes with sense ranking: everyday register beats high, primary
  senses beat secondary ones, a bare gloss beats a parenthetically qualified
  one ("time" over "second (time unit)"), and a dedicated word beats a
  polysemous one (*tid* "time" over *mal* "time, occurrence").
- `src/engine/morphology.ts` - Laphurdi inflection per `LAPHURDI.md` §3:
  suffixed definite articles (-en/-et, pl. -er, def. pl. -eren), tense-only
  verbs (-ar/-ade/-at plus the closed irregular sixteen from the TSV `forms`
  column), -er/-est comparison, -je diminutives, and compound splitting.
- `src/engine/english.ts` - English morphology for the other side of the
  border: irregular verbs/plurals, do-support forms.
- `src/engine/translate.ts` - the pipelines. Handles V2 inversion after
  fronted adverbials, verb-first questions (adding/removing English
  do-support), nit-negation, perfect with *har*, future with *skal*,
  modals, den/det/de article fronting before adjectives, pronoun case by
  position, and the *Dank du* fossil. Each gloss-line token carries its
  rejected candidates as `alternatives`; `translate(text, dir, { overrides })`
  pins a pick per source word. The UI renders alternatives as chips - click
  one to overrule the Commission's choice, ↺ to return to it.

Where the reference is silent (vowel-final noun inflection: *ministerie →
ministeriet*), the engine follows the Swedish pattern the grammar already
leans on.

## Beyond the pipelines

- **The canon gate, visible** - in Laphurdi→English mode every word token is
  also run through the course app's `Canon` validator (imported from
  `apps/laphurdi/src/test/canon.ts` - one validator for the whole repo). A
  red *nit canon* badge means the form is not legal Laphurdi; an amber
  *canon* badge on an untranslatable token means the word is fine (a proper
  name or a novel compound) but the Commission cannot render it. Paste draft
  Laphurdi here to proofread it.
- **Register toggle** - *everyday | high* biases the sense ranking across
  the doublets (hjelpa/assistera, bygga/konstruera…). User picks still win.
- **The path to hen** - *they/them/their/theirs* offer the gender-neutral
  singular (`hen`/`hens`) as alternative chips, as the Constitution is
  drafted.
- **Synonym transparency** - when the lookup falls back through a synonym
  (little→small), the token says so (*via synonym*) instead of rewriting
  silently.
- **Persistence and shareable links** - direction, text, register, and your
  picks survive reload (`localStorage`); the URL hash carries
  `#<direction>/<text>` so a translation can be linked. A *copy* button
  takes the rendering to the clipboard.
- **One modal table** - the la→en render map and the en→la recognition map
  derive from a single `MODALS` constant, so the two directions cannot
  drift apart; same for the suppletive *goed/beter/best*.

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
