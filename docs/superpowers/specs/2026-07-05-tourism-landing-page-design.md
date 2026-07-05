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

## Revisions (same day, user-directed)

1. **Bilingual site.** The page ships in both English and Laphurdi, with
   lexicon additions coined as needed (7 new entries: *lerna, besoka, besok,
   resare, fras, behova, oversettare* — all per LAPHURDI.md §3b).
2. **Laphurdi leads.** The Laphurdi edition serves at the site root (language
   code `lp`); English moves to `/en/`. Language switcher in the header,
   hreflang alternates on both pages, `x-default` → the Laphurdi root.
3. Every Laphurdi token on the page is audited against `LEXICON.tsv` with
   generated inflections; unmatched tokens are only canon-verbatim quotes
   (GRUNDLOJEN forms *seer, ligger, prisen, dodstraffen, sjartat, navnat,
   dise, gaver* — flagged as lexicon/canon divergences for a future session).

4. **City pages** (user-directed, same day). Bilingual pages for the two
   chartered cities, linked from the landing city cards and cross-linked to
   each other: `/darcambria/` + `/en/darcambria/` (harbourside city centre,
   five neighbourhoods — Fiskarhamnen, Gammelstaden, Darstranden, Vinbergen,
   Nyhamn — and the U-bahn/T-bahn networks; the *bahn* spelling is Charter-era
   heritage license for *baan*), and `/lapentieur/` + `/en/lapentieur/`
   (Grundarkulleren — the Founders' Hills: Sjartakullen, Sterkullen,
   Mistkullen — the open houses of government, the capital's byname *Ankeret
   on Kullen* / "The Anchor on The Hill", and the Bergbaan). Six more lexicon
   entries: *kulle, tram, linje, baan, grundare, park*.

5. **Agaetisboro** (user-directed, same day). A third city, pop. ~200,000, on
   the southern tip of the main island — the Commonwealth's resort paradise
   and fishing port: `/agaetisboro/` + `/en/agaetisboro/`. Name: old
   pre-Laphurdeen *agaet* ("alright") + old genitive *-is* + English Charter
   *-boro* — "Alright-town" (LAPHURDI.md §7); byname *Solsidan av Samveldet*,
   "the Sun Side of the Commonwealth". Canon set on the page: Solstranden
   (five km of beach), Korallviken (the coral reef), Sydkapen (the cape),
   two casinos — Solhjulet by the beach and Maanhuset on the cape, taxed for
   the Guarantee ("wen huset vinnar, vinnar folket oek") — the Commonwealth's
   largest fishing fleet, and the Strandbaan tram line (Artikel 14 fare cap;
   ferries from both sister cities, flyghamn ten minutes out). Twelve more
   lexicon entries: *korall, rif, vik, kap, dyka, spelhus, kasino, hotell,
   sida, fangst, paradis, formell* (spelhus/kasino join the register
   doublets).

6. **Greater Darcambria** (user-sourced document, same day; source:
   `~/Documents/Darcambria.txt`). Darcambria is a metropolis: around the bay
   lie eight Charter towns with English heritage names — the English fleet's
   shore, never touched by the Reform — Darlingmoors (City & Island, the
   largest; zones NW/NE/C/SW/SE with districts incl. Seaport Village, Oyster
   Point, Forest Park, The Beaches, Outer/Inner Docks, Government Centre,
   Yacht Harbour, City Centre, Peak District, the Gorges, Shoreline Rocks,
   Cambrian Junction, Timberland, Outlook, Darling Hill), Addison,
   Marionberry, Upperlea, Lowerlea, Briarside, Winchester-on-the-Sea, and
   Riverlin (smallest by population, second by density). DCTS — the
   Darcambrian Communities Transport Service, "the T" — operates the whole
   network: the city's three tunnel lines are the core segments of local
   train routes U1 Shoreline / U2 Central / U3 Crosstown, joined by U4
   Harbour (airport), U5 University, R6 Eastern, and R7 Village (Cambrian
   Inlet towns), plus four expresses (U1x/U2x/U4x/U5x) calling at the City
   Centre Mainline stations Central, Market Square, and Old Courthouse. One
   capped ticket; only the Airport Link carries a premium of kr. 320.
   Dialling plan: 0221 (zones 0221 2–7). Pages gain the eight-towns section,
   a DCTS transit item (badge-r roundels), and a 0221 ticker entry.

## Success criteria

- `npm run build` succeeds in `apps/landing-page`; page renders with JS off.
- Flag SVG matches the construction sheet (2:3, #003A66/#F2A900/#FFFFFF,
  arc apex ⅓ height, star centre ⅗ height, diameter ⅕ height).
- Every Laphurdi string on the page is attested in canon files.
- One Pages artifact contains both apps; translator tests still gate deploy.
