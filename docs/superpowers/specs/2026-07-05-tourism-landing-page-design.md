# Laphurdeen Tourism Landing Page — Design

**Date:** 2026-07-05
**Status:** Executed under standing autonomous pre-approval ("Move on. No approvals needed.")
**Applies to:** new `apps/landing-page/`, replaces `.github/workflows/deploy-translator.yml`

## Purpose

A tourism landing page for the Commonwealth of Laphurdeen, built with Vite and
deployed to GitHub Pages. Its distinctive angle: it markets the country through
its **governance and constitutional values** — "visit the nation with no
president" — alongside the usual sun-sea-harbour material. All facts on the
page trace to canon: `CONSTITUTION.md`, `NATIONAL_SYMBOLS.md`, `LAPHURDI.md`,
`GRUNDLOJEN.md`. No Laphurdi text may appear unless attested in those files.

## Approaches considered

1. **Vanilla Vite + TS, content in `index.html`** *(chosen)* — mirrors
   `apps/translator` (same devDeps, fonts, favicon, `base: "./"`). Content is
   semantic static HTML; `src/main.ts` is a small enhancement layer only
   (scroll-reveal, nav state). Zero runtime deps, best Lighthouse, and the
   page is readable with JS disabled.
2. React/Preact SPA — rejected: adds a framework for a page with no state.
3. Astro/eleventy static site — rejected: introduces a third toolchain to the
   repo when Vite already is the established pattern.

## Page structure (single scrolling page)

1. **Hero** — sea-blue field with the amber arc as a landscape motif; name,
   motto *Frihed, Velvard, Konsens*, tagline on the no-single-ruler premise;
   CTAs to the governance section and the phrasebook/translator.
2. **The Anchorage** — the founding story (many shores, bound by choice), the
   two cities: Lapentieur ("place of slopes", the white star) and Darcambria
   ("the amber curve", amber sunsets), with etymologies from `LAPHURDI.md` §7.
3. **Governance** — the tourism-of-ideas centerpiece: no President/PM/monarch
   (Art 1); Consensus Rule 66 % (Art 20); every Senator a directly elected
   Lead Minister (Art 18); Speaker of the Commons as ceremonial head of state
   (Art 27); no veto (Art 22); Integrity Commission (Art 32). Stat cards +
   short prose. Flag SVG rendered exactly to the `NATIONAL_SYMBOLS.md`
   construction spec.
4. **Values** — the three pillars as cards (Frihed / Velvard / Konsens), then
   Charter highlights: dignity and equality (Art 6), universal healthcare
   free at point of use (Art 10), tertiary tuition ≤ 4 % of median income
   (Art 11), the Laphurdeen Guarantee (Art 13), press freedom (Art 7), no
   mass surveillance (Art 9), death penalty abolished forever (Art 15).
5. **For travellers** — constitutional perks tourists actually feel: displayed
   price is the full price, tax always included (Art 35(4)); fare-capped,
   fully accessible public transport (Art 14); krona pegged Kr. 100 = US$ 1
   (Art 38); two official languages (Art 4).
6. **Language** — attested phrasebook from `LAPHURDI.md` §6 (Hallej, Velkom te
   Laphurdeen, Mersi/Dank du, Asjeblie, Adjuu, Sprekar du Laphurdi?, …), the
   Preamble's first line in Laphurdi as a pull quote, link to the
   Oversettaren translator at `translator/`.
7. **Footer** — motto, "Done at Lapentieur, for the people of Laphurdeen."

## Deployment

GitHub Pages supports **one deployment per repository**, and the translator
already occupies it. `deploy-translator.yml` is replaced by
`deploy-pages.yml`, which builds both apps and uploads one artifact:

```
_site/            ← apps/landing-page/dist  (site root)
_site/translator/ ← apps/translator/dist
```

Translator tests keep running in CI before deploy. Consequence: the
translator's public URL moves from `/` to `/translator/`; its `base: "./"`
makes this transparent to its code. The landing page links to it with the
relative href `translator/`.

## Out of scope

- Photography/imagery (no real photos exist of a fictional country; the page
  is typographic + SVG).
- Anthem lyrics (still unwritten in canon).
- A Laphurdi-language version of the page (future session; Art 4 would demand
  it eventually).

## Success criteria

- `npm run build` succeeds in `apps/landing-page`; page renders with JS off.
- Flag SVG matches the construction sheet (2:3, #003A66/#F2A900/#FFFFFF,
  arc apex ⅓ height, star centre ⅗ height, diameter ⅕ height).
- Every Laphurdi string on the page is attested in canon files.
- One Pages artifact contains both apps; translator tests still gate deploy.
