# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Kort, on Laphurdi

> `LEXICON.tsv` er kellan av santheden for spraket, og `LEXICON.md` er byggat
> fra den — skriv det aldri med handen. Alle ny ord folgar `LAPHURDI.md` §3b,
> og alle Laphurdi ord on en sida moste vera in ordboken, el folga §3. Alle
> sider gaar on beide spraker: Laphurdi on `/`, Engelsk on `/en/`. Werket gaar
> direkt te `main`, og te `origin` gaar det bara wen anvendaren fragar.
> Proveren gaar ferst, og svaret te anvendaren gaar alltid on beide spraker.

The same rules in English follow below. Every Laphurdi token above is attested
in `LEXICON.tsv` or rule-derived per §3 — audited with the canon validator, as
all Laphurdi prose in this repo must be.

## What this is

A worldbuilding project: the Commonwealth of Laphurdeen, a fictional nation
with a constitution, a constructed language (Laphurdi — an English/Dutch/
Swedish/French blend), and three small web apps that present it. There is no
backend and no framework: canon lives in Markdown at the repo root, the
language lives in one TSV, and the apps are plain-TypeScript Vite sites.

## Commands

Lexicon tooling (Python, stdlib only):

```sh
python3 tools/lexicon.py check        # lint LEXICON.tsv — run before committing TSV changes
python3 tools/lexicon.py build        # regenerate LEXICON.md from the TSV
python3 -m unittest discover -s tests # tests for the lexicon tool itself
```

Apps — each directory under `apps/` is its own npm project (no workspace
tooling; `cd` into the app first):

```sh
npm run dev                            # Vite dev server
npm run build                          # tsc type-check + production build to dist/
npm test                               # vitest (translator and laphurdi only; landing-page has no tests)
npx vitest run src/test/audit.test.ts  # one test file
npx vitest run -t "pattern"            # one test by name
```

## Source-of-truth architecture

Three layers, strictly ordered — facts flow downward, never up:

1. **Canon documents** (repo root): `CONSTITUTION.md` (English) and
   `GRUNDLOJEN.md` (the same constitution in Laphurdi, every token
   lexicon-audited), `LAPHURDI.md` (the language spec — grammar in §3,
   word-building in §3b, place-name etymology in §7), `NATIONAL_SYMBOLS.md`,
   `PROVINCES.md`, `TRANSPORT.md`, `DARCAMBRIA.md`. Every fact on a web page
   must trace to one of these.
2. **`LEXICON.tsv`** — the single source of truth for every Laphurdi word
   (9 tab-separated columns: word, pos, gender, forms, english, domain,
   register, sources, notes). `LEXICON.md` is generated from it by
   `lexicon.py build`; never edit the .md by hand.
3. **Apps** consume canon directly: the translator and the course import
   `LEXICON.tsv` from the repo root via Vite `?raw` imports, so a TSV edit
   changes app behavior and can break app tests. The deploy workflow
   triggers on `LEXICON.tsv` changes for this reason.

### The canon gate

`apps/laphurdi/src/test/canon.ts` is the reusable validator: a Laphurdi token
is legal only if it is a lexicon headword, a listed irregular form, a regular
inflection per §3 (verb `-ar/-ade/-at` + bare-stem imperative; noun
definite/plural/genitive; adjective `-er/-est`; `-je` diminutive), a
whitelisted proper name, or a head-final compound of justified parts.
`audit.test.ts` runs every `lang="lp"` string in the course through it —
deliberately-wrong quiz distractors are exempt. When writing Laphurdi
anywhere (pages, docs), audit it the same way; a quick scratchpad script that
imports `Canon` and `tokenize` and checks your prose is the established
pattern.

### Language rules that gate contributions

- The 16 irregular verbs are a constitutionally **closed list** (see
  `tools/lexicon.py` and `LAPHURDI.md` §3). All new verbs must be regular and
  end in unstressed `-a`; `lexicon.py check` enforces this.
- French loans are always Reform-adapted: `-tion→-sjon`, `-té→-tet`, French
  verbs→`-era`, `qu→kw`, `ch→sj`, `ph→f`. Un-Reformed spellings (the ⟨ph⟩ in
  Laphurdeen, English Charter city names, "bahn") are deliberate heritage
  exceptions — don't "fix" them.
- Register doublets = two TSV rows sharing an exact gloss, tagged
  `everyday`/`high`.

### The bilingual site

`apps/landing-page` serves Laphurdi at `/` and English at `/en/` (language
code is `lp`, not `lph`). Every page is a **pair** — a structural change
(sections, anchors, nav) must land in both editions, kept in sync with
`hreflang` alternates. Vite discovers entries by globbing for `index.html`,
so a new page directory registers itself. Conventions not written elsewhere:

- Money style follows Art. 38: `Kr.` prefix with a space. The Laphurdi
  edition uses European number separators (`Kr. 4.950`, `2.850.000`); the
  English edition uses commas.
- The `site-header` nav fits at most ~5 content links + 2 CTAs + the language
  toggle at 1200px before it overflows — trim labels or move links to the
  footer.

### Deploy

`.github/workflows/deploy-pages.yml` builds all three apps into **one**
GitHub Pages artifact (landing at root, translator at `/translator/`, course
at `/laphurdi/`). GitHub Pages allows a single deployment per repository —
never add a second Pages workflow. The workflow runs the translator and
course test suites, so a failing vitest blocks deploy.

## Working conventions

- **Always respond to the user in both languages** — every reply carries
  English and Laphurdi (a full Laphurdi rendering when practical, at minimum
  a faithful Laphurdi summary of the answer). The Laphurdi must pass the
  canon gate like any other prose in the repo.
- All work goes as direct commits to `main` — no branches, no PRs.
- Do **not** push unprompted: the user pushes in batches, and a push triggers
  the Pages deploy.
- Multiple Claude sessions run on this repo in parallel; commits can land
  mid-session. Re-check `git log`/`git status` before assuming file state.
- Design specs and plans live in `docs/superpowers/specs/` and
  `docs/superpowers/plans/`; substantial features start with a spec there.
