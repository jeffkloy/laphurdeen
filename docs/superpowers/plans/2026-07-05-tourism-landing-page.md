# Laphurdeen Tourism Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static tourism landing page for Laphurdeen at the GitHub Pages site root, with the existing translator relocated to `/translator/`, in one Pages deployment.

**Architecture:** Vanilla Vite + TypeScript app in `apps/landing-page`, mirroring `apps/translator` conventions: content as semantic HTML in `index.html`, `src/main.ts` as a progressive-enhancement layer only, `base: "./"` for path-agnostic assets. One GitHub Actions workflow builds both apps and uploads a single Pages artifact.

**Tech Stack:** Vite ^6, TypeScript ^5.6, no runtime dependencies, GitHub Actions Pages deploy (`upload-pages-artifact` + `deploy-pages`).

## Global Constraints

- Palette exactly per `NATIONAL_SYMBOLS.md`: sea blue `#003A66`, amber `#F2A900`, white `#FFFFFF`.
- Flag construction exactly per `NATIONAL_SYMBOLS.md`: ratio 2:3; arc upper edge from lower corners to apex at ⅓ height; star centre at ⅗ height, circumscribing diameter ⅕ height, centred fly-wise, point up.
- Every Laphurdi string must be attested in `LAPHURDI.md`, `GRUNDLOJEN.md`, `NATIONAL_SYMBOLS.md`, or `LEXICON.tsv`. No new coinages.
- All constitutional claims cite the correct Article of `CONSTITUTION.md` (v3 numbering).
- Fonts match the translator: Fraunces + Instrument Sans (+ Fragment Mono if monospace needed) via Google Fonts.
- Direct commits to main (repo convention; no branches/PRs).

---

### Task 1: Scaffold `apps/landing-page`

**Files:**
- Create: `apps/landing-page/package.json`
- Create: `apps/landing-page/tsconfig.json`
- Create: `apps/landing-page/vite.config.ts`
- Create: `apps/landing-page/.gitignore`
- Create: `apps/landing-page/README.md`

**Interfaces:**
- Produces: `npm run build` → `apps/landing-page/dist/` consumed by Task 3's workflow; `npm run dev` / `npm run preview` for local checks.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "laphurdeen-landing",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "Velkom te Laphurdeen - the tourism landing page of the Commonwealth",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Copy `tsconfig.json` from the translator** (same compiler options; drop vitest types if present).

- [ ] **Step 3: Write `vite.config.ts`** - `base: "./"`, no server.fs allowlist (landing page reads no repo-root files):

```ts
import { defineConfig } from "vite";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (site root today, anywhere else tomorrow) without config.
export default defineConfig({
  base: "./",
});
```

- [ ] **Step 4: Write `.gitignore`** (`node_modules/`, `dist/`) and a short `README.md` (what it is, dev/build commands, deploy note).

- [ ] **Step 5: `npm install` in `apps/landing-page`** - generates `package-lock.json` (required by CI's `npm ci`).

- [ ] **Step 6: Commit** - `feat(landing-page): scaffold Vite app`.

### Task 2: Page content - `index.html`, `src/style.css`, `src/main.ts`

**Files:**
- Create: `apps/landing-page/index.html`
- Create: `apps/landing-page/src/style.css`
- Create: `apps/landing-page/src/main.ts`
- Create: `apps/landing-page/src/vite-env.d.ts`

**Interfaces:**
- Consumes: Task 1 scaffold.
- Produces: the complete page; `main.ts` adds `.revealed` to `[data-reveal]` elements via IntersectionObserver and toggles the mobile nav.

- [ ] **Step 1: Write `index.html`** with these sections, in order, all content from canon:
  1. Header/nav: flag mark + LAPHURDEEN, links to #anchorage #governance #values #travellers #language.
  2. Hero: motto `Frihed, Velvard, Konsens`, tagline on the no-single-ruler premise (Art 1(2)), CTAs → #governance, #language. Amber-arc landscape motif (decorative SVG, `aria-hidden`).
  3. `#anchorage`: founding story (Preamble; "bound by choice rather than by blood"), etymology "The Anchorage" (LAPHURDI.md §7), city cards for Lapentieur and Darcambria with their etymologies.
  4. `#governance`: stat cards (0 presidents - Art 1(2); 66 % Consensus Rule - Art 20; 12 ministries - Art 24; 2 chambers, all directly elected - Art 17); prose on Senators-as-Lead-Ministers (Art 18), Speaker as ceremonial head of state (Art 27), no veto (Art 22), Integrity Commission (Art 32); flag SVG to construction spec with caption; motto/anthem note (Art 5).
  5. `#values`: three pillar cards (Frihed/Velvard/Konsens); Charter grid: dignity & equality (Art 6), expression & press (Art 7), privacy - no mass surveillance (Art 9), universal healthcare (Art 10), tertiary tuition ≤ 4 % median income (Art 11), Laphurdeen Guarantee (Art 13), justice - death penalty abolished forever (Art 15), conscience (Art 8).
  6. `#travellers`: tax-inclusive displayed prices (Art 35(4)); fare-capped accessible transport (Art 14); Kr. 100 = US$ 1 peg (Art 38); official languages (Art 4).
  7. `#language`: phrasebook table strictly from LAPHURDI.md §6 (Hallej!; Goed morgen / Goed natt; Velkom te Laphurdeen!; Dank du. / Mersi!; Asjeblie; Adjuu!; Sprekar du Laphurdi?; Ik sprekar en liten Laphurdi.; Waar er staden?); Preamble first line in Laphurdi as pull quote (LAPHURDI.md §6); CTA link `href="translator/"` to the Oversettaren.
  8. Footer: motto, "Done at Lapentieur, for the people of Laphurdeen.", GitHub repo link.

  Flag SVG (viewBox `0 0 300 200`): field rect `#003A66`; arc `M0 200 Q150 66.67 300 200 Z` filled `#F2A900` (quadratic through apex (150, 133.33) = ⅓ height); star at centre (150, 80) (⅗ height from base), outer R 20 (Ø 40 = ⅕ height), points: outer (150,60)(169.02,73.82)(161.76,96.18)(138.24,96.18)(130.98,73.82), inner (154.49,73.82)(157.27,82.36)(150,87.64)(142.73,82.36)(145.51,73.82), fill `#FFFFFF`.

  Favicon: same data-URI flag SVG as the translator's.

- [ ] **Step 2: Write `src/style.css`** - national palette as custom properties; Fraunces for display, Instrument Sans for body; light parchment/white background with sea-blue and amber accents; responsive (single column < 720 px); `.reveal` transition driven by `[data-reveal]`/`.revealed`; `prefers-reduced-motion` disables it.

- [ ] **Step 3: Write `src/main.ts`** - imports the CSS; IntersectionObserver adding `.revealed`; mobile nav toggle with `aria-expanded`; no other behaviour.

- [ ] **Step 4: Verify** - `npm run build` passes; open `vite preview`, check the page renders and reads correctly with JS disabled (content must not depend on `main.ts`).

- [ ] **Step 5: Commit** - `feat(landing-page): tourism landing page content`.

### Task 3: Combined Pages deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Delete: `.github/workflows/deploy-translator.yml`

**Interfaces:**
- Consumes: `apps/landing-page/dist`, `apps/translator/dist` (each app's own `npm run build`).
- Produces: one Pages artifact - landing page at root, translator under `translator/`.

- [ ] **Step 1: Write `.github/workflows/deploy-pages.yml`**

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - "apps/landing-page/**"
      - "apps/translator/**"
      - "LEXICON.tsv"
      - ".github/workflows/deploy-pages.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: |
            apps/landing-page/package-lock.json
            apps/translator/package-lock.json
      - run: npm ci
        working-directory: apps/landing-page
      - run: npm run build
        working-directory: apps/landing-page
      - run: npm ci
        working-directory: apps/translator
      - run: npm test
        working-directory: apps/translator
      - run: npm run build
        working-directory: apps/translator
      - name: Assemble site (landing at root, translator at /translator/)
        run: |
          mkdir -p _site
          cp -r apps/landing-page/dist/. _site/
          mkdir -p _site/translator
          cp -r apps/translator/dist/. _site/translator/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Delete `deploy-translator.yml`** (its `concurrency: pages` group would race the new workflow and last-wins clobber the site).

- [ ] **Step 3: Sanity-check the assembly locally** - build both apps, run the two `cp` commands into a scratch dir, confirm `index.html` at root and `translator/index.html` both exist.

- [ ] **Step 4: Commit** - `ci: one Pages deploy - landing page at root, translator at /translator/`.
