# The Great Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `docs/superpowers/specs/2026-07-05-landing-pages-expansion-design.md` - three new canon docs plus the Darcambria-becomes-a-province retcon, a vite glob, and three new bilingual pages (Praktisk, Provinser atlas, Darlingmoors), fully integrated.

**Architecture:** Canon-first: write `PROVINCES.md`, `TRANSPORT.md`, `DARCAMBRIA.md` and retcon existing canon before any page cites them. Pages are static bilingual HTML pairs in `apps/landing-page/` sharing `src/style.css` + `src/main.ts`, registered automatically once `vite.config.ts` globs for `index.html` files.

**Tech Stack:** Vite + TypeScript (static multi-page app), Python (lexicon tooling: `tools/lexicon.py`, `tests/test_lexicon.py`), GitHub Pages (existing `deploy-pages.yml`, unchanged).

## Global Constraints

- Laphurdi edition leads at the unprefixed path; English mirrors under `/en/`. Every page pair carries `hreflang` alternates (`lp`, `en`, `x-default`) exactly like `apps/landing-page/darcambria/index.html:15-17`.
- Every Laphurdi token on a page must be attested in `LEXICON.tsv`, quoted verbatim from `GRUNDLOJEN.md`, or added via §3b in Task 1. Verify tokens with `grep -E $'^word\t' LEXICON.tsv` before use.
- Proper nouns (province, town, district names) are NOT lexicon entries and keep un-Reformed spellings.
- Money format: `kr.` prefix, comma thousands - `kr.320`, `kr.4,950`.
- Canonical populations - Darcambria province 4,900,000; Darlingmoors 2,850,000; Lapentieur 1,250,000. No other population figures anywhere.
- The sixteen provinces and seats, verbatim from the spec §3.1 roster table. Never introduce the retired names (Norsund, Westmoor, Whitmere-as-province, The Wolds, Linmouth-as-province, Saltmarsh, Saltney, Greenholt, Skerry Harbour).
- Commits go straight to `main` (repo convention), message style `feat:`/`docs:`/`feat(landing-page):`, ending with the Claude Fable 5 co-author trailer.
- After every task: `python3 tools/lexicon.py check` reports 0 errors, and `python3 -m pytest tests/ -q` passes.

---

### Task 1: Lexicon - the expansion's new words (§3b)

**Files:**
- Modify: `LEXICON.tsv` (append rows at end; the file is not alphabetical)
- Test: `tools/lexicon.py check` + `tests/test_lexicon.py`

**Interfaces:**
- Produces: attested headwords `marsk`, `bors`, `mynt`, `konsert`, `nabolag`, `ostra`, `restaurang` for use in canon docs and page copy. (Already attested, do NOT re-add: `ferje`, `stasjon`, `bank`, `musik`, `galleri`, `marknad`, `mat`, `fisk`, `betala`, `strand`, `kust`, `provins`, `vik`, `baan`, `tram`, `linje`.)

- [ ] **Step 1: Baseline check**

Run: `python3 tools/lexicon.py check`
Expected: `2011 rows, 0 errors, 0 warnings` (row count may be higher if other sessions added words; note the number).

- [ ] **Step 2: Confirm the seven words are missing**

Run: `grep -cE $'^(marsk|bors|mynt|konsert|nabolag|ostra|restaurang)\t' LEXICON.tsv`
Expected: `0`. If any hit, drop that row from Step 3 and reuse the existing entry.

- [ ] **Step 3: Append the rows**

Append to `LEXICON.tsv` (tab-separated, columns `word pos gender forms english domain register sources notes`):

```tsv
marsk	n	c		salt marsh	world-nature		DA marsk + DE Marsch	the root of Saltmarsken province
bors	n	c		stock exchange	work-trade	high	FR bourse + SV börs	
mynt	n	n		coin, mint	work-trade		SV mynt	where the three-word motto is struck
konsert	n	c		concert	arts-leisure		FR concert + SV konsert	
nabolag	n	n		neighbourhood	house-home		DA nabolag	
ostra	n	c		oyster	plants-animals		SV ostron + FR huître	Oyster Point keeps its English Charter name
restaurang	n	c		restaurant	food-drink		FR restaurant + SV restaurang	-ang per §3b French-loan adaptation
```

- [ ] **Step 4: Verify**

Run: `python3 tools/lexicon.py check && python3 -m pytest tests/ -q`
Expected: baseline+7 rows, 0 errors, 0 warnings; pytest all pass.

- [ ] **Step 5: Commit**

```bash
git add LEXICON.tsv
git commit -m "feat: the expansion words - marsk, bors, mynt, konsert, nabolag, ostra, restaurang"
```

---

### Task 2: PROVINCES.md - the Boundary Commission's roster

**Files:**
- Create: `PROVINCES.md`

**Interfaces:**
- Consumes: Task 1 headwords for etymologies (`marsk`, plus existing `rulla`, `kulle`, `torka`, `lak`, `morgen`, `mund`, `salt`, `vik`).
- Produces: the canonical province roster; Tasks 3, 7, 8, 9 cite province/seat names and populations from here.

- [ ] **Step 1: Write the document**

Structure (all content required, no other provinces or figures):

1. Title + intro: sixteen provinces under Article 41 (15–18 band), drawn by the independent Boundary Commission; three members of the Commons each; subsidiarity; Lapentieur and Darlingmoors are chartered cities *within* National Capital Region and Darcambria respectively (per the amended Art 41.3 - Task 4).
2. The roster table, copied verbatim from spec §3.1 (16 rows, seats and character lines exactly as speced, populations only for Darcambria/Darlingmoors/Lapentieur).
3. One entry section per province: name, etymology in `LAPHURDI.md` §7 style, seat, geography, character. Worked example to match in tone and length:

```markdown
### Rullarkuller - seat: Woldham

**Etymology:** *rulla* ("to roll") + *kuller* ("hills," the plural of *kulle*
- cf. Grundarkulleren, the Founders' Hills of Lapentieur): **"the rolling
hills."** The English settlers called this country the Wolds; the Reform-era
Boundary Commission set the Laphurdi name on the map, and the wheat kept
growing under both.

Rolling grain country inland of the east coast. Woldham holds the grain
exchange and the harvest festival; Baaner Laphurdeen's eastern regional
line calls at Woldham on its way to the coast at Easthaven.
```

English-named provinces get English etymologies (settler morphology: *-haven*, *-cliffe*, *-cape*); Sainte-Agathe gets a French settler-chapel origin; The Northern Straits notes its Norse-blend ferry towns (seat Sundby).
4. "Country towns" section: the smaller Baaner regional stops - Ashcombe, Fernlea, Millford, Linbridge - one line each, all English names.

- [ ] **Step 2: Verify roster integrity**

Run: `grep -c '^### ' PROVINCES.md`
Expected: `16` entry sections (country towns use a different heading level).
Run: `grep -nE 'Norsund|Westmoor|Saltney|Greenholt|Skerry Harbour|The Wolds|Whitmere \||Linmouth \|' PROVINCES.md`
Expected: no output (retired names absent; Whitmere/Linmouth may appear only as seats).

- [ ] **Step 3: Commit**

```bash
git add PROVINCES.md
git commit -m "docs: PROVINCES.md - the sixteen provinces of the Commonwealth"
```

---

### Task 3: TRANSPORT.md - Baaner Laphurdeen and the DCTS

**Files:**
- Create: `TRANSPORT.md`

**Interfaces:**
- Consumes: province seats from `PROVINCES.md` (Task 2).
- Produces: canonical rail network, fares, and DCTS data; Tasks 6, 8, 9 cite from here.

- [ ] **Step 1: Find the Charter fare-cap provision**

Run: `grep -n -i 'fare' CONSTITUTION.md GRUNDLOJEN.md`
Note the article number; cite it in the fares section.

- [ ] **Step 2: Write the document**

Required sections and facts:

1. **Baaner Laphurdeen** - the national rail carrier ("Railways Laphurdeen"; *baaner*, the heritage plural of *baan*, Charter-era spelling kept like the ⟨ph⟩ of Laphurdeen).
2. **The express triangle** - Lapentieur ⇄ Darlingmoors ⇄ Agaetisboro, all three legs, hourly service framing.
3. **Regional routes** - grouped by compass, serving every province seat and the country towns: east (Woldham, Easthaven, Linmouth), south (Saltvik, Vindalen, Agaetisboro onward), west (Moorgate, Belhaven, Pineforest), north (Whitmere, Highcliffe, Sundby), with Ashcombe, Fernlea, Millford, Linbridge as intermediate stops. Routes are prose + stop lists, same idiom as the DCTS section below.
4. **Rail-ferry sailings** - integrated tickets to the island provinces: Shellharbour (Sainte-Agathe) and the Sundby crossings (The Northern Straits). One ticket, boat included.
5. **Fares** - the Charter fare cap (cite the article from Step 1); the **weekly cap of kr.4,950** across the whole Baaner Laphurdeen network; **tap-to-pay**: contactless credit/debit cards and Apple Pay/Google Pay, cap applied automatically to whatever was tapped, no ticket office required.
6. **DCTS - the Darcambrian Communities Transport Service** - metro Darcambria only. Record verbatim from the source notes (`~/Documents/Darcambria.txt`, now canonized here):
   - Dialling plan 0221: NW `0221 4`, NE `0221 5`, C `0221 3`, City Centre `0221 2`, SW `0221 6`, SE `0221 7`.
   - Local routes: U1 Shoreline (Briarside – SE Suburbs – Marionberry – Cambrian Jct – The Gorges – City Centre – Addison – NW Coast – Winchester-on-the-Sea); U2 Central (Oyster Pt – Forest Park NE – The Beaches – Timberland – City Centre – Addison – SW Suburbs); U3 Crosstown (Seaport Village – The Northwest – Darling Hill – Gov Ctr – City Centre – Peak District – Shoreline Rocks – Cambrian Jct); U4 Harbour (Airport – Riverlin – City Centre – Gov Ctr – Outlook); U5 University (SE Coast – Marionberry – Cambrian Jct – The Gorges – City Centre – Gov Ctr – Darling Hill – The Northwest – Forest Park NW); R6 Eastern (Oyster Pt – Forest Park NE – The Beaches – Eastern Peak – SE Slopes – Shoreline Rocks – Cambrian Jct); R7 Village (Marionberry – Cambrian Inlet towns – Airport – Riverlin – Addison).
   - Express routes: U1x Shoreline Express (Addison Central – City Centre ML – Cambrian Jct – Marionberry Square – Briarside); U2x Northern Express (The Beaches – City Centre ML – Addison Central – Winchester-on-the-Sea); U4x Airport Link (Gov Centre – City Centre ML – Yacht Harbour – Airport); U5x Berry Express (Gov Centre – City Centre ML – Cambrian Jct – Marionberry Square – Briarside).
   - City Centre Mainline stations: Central, Market Square, Old Courthouse.
   - Airport premium: kr.320.

- [ ] **Step 3: Verify**

Run: `grep -c 'kr.4,950' TRANSPORT.md && grep -c 'kr.320' TRANSPORT.md`
Expected: at least 1 each.
Run: `grep -nE 'Skerry Harbour|Norsund|Saltney' TRANSPORT.md`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add TRANSPORT.md
git commit -m "docs: TRANSPORT.md - Baaner Laphurdeen, the kr.4,950 weekly cap, and the DCTS"
```

---

### Task 4: The retcon - Darcambria becomes a province

**Files:**
- Modify: `CONSTITUTION.md` (Art 2.3 at :31, Art 41.3 at :277)
- Modify: `GRUNDLOJEN.md` (Artikel 2.3 at :33, Artikel 41.3 at :279)
- Modify: `LAPHURDI.md` (§7 Darcambria bullet)
- Create: `DARCAMBRIA.md`

**Interfaces:**
- Produces: `DARCAMBRIA.md` cultural canon consumed by Task 8; amended constitutional text cited by Tasks 7 and 9.

- [ ] **Step 1: Constitutional amendments (exact replacements)**

`CONSTITUTION.md`:
- `3. **Darcambria** is recognised as a chartered principal city of the Commonwealth.` → `3. **Darlingmoors** is recognised as a chartered principal city of the Commonwealth.`
- `3. **Lapentieur** and **Darcambria** are chartered cities, each with an elected council and mayor and with powers of local self-government fixed by charter law.` → same sentence with `**Darlingmoors**` in place of `**Darcambria**`.

`GRUNDLOJEN.md`:
- `3. **Darcambria** er en sjartat storstad av Samveldet.` → `3. **Darlingmoors** er en sjartat storstad av Samveldet.`
- `3. **Lapentieur** og **Darcambria** er sjartat stader, beide med veljat raad og borgmester, og med lokal self-styring settat av sjarta-loj.` → same with `**Darlingmoors**`.

- [ ] **Step 2: LAPHURDI.md §7 - Darcambria's etymology now names the bay**

Replace the Darcambria bullet's final clause `**"the amber curve,"** for the city's great curved harbour and its amber summer sunsets.` with `**"the amber curve,"** for the great curved bay - the founding Anchorage - and its amber summer sunsets; once the name of the harbour city, now the name of the province whose eight Charter cities ring the bay.`

- [ ] **Step 3: Sweep for stragglers**

Run: `grep -n 'Darcambria' CONSTITUTION.md GRUNDLOJEN.md NATIONAL_SYMBOLS.md LAPHURDI.md`
Expected: remaining mentions are bay/province-compatible ("Darcambrian amber sunset", "the great curved harbour", the §7 entry). Fix any that still call Darcambria a city.

- [ ] **Step 4: Write DARCAMBRIA.md**

Required sections:
1. **The province** - the amber-curve bay ringed by the eight Charter cities; population 4,900,000; joint governance as **the Darcambrian Communities** (the "DC" of DCTS), Government Centre on Darlingmoors.
2. **The eight Charter cities** - by population: Darlingmoors, Addison, Marionberry, Upperlea, Lowerlea, Briarside, Winchester-on-the-Sea, Riverlin; by density: Darlingmoors, Riverlin, Addison, Marionberry, Lowerlea, Briarside, Winchester-on-the-Sea, Upperlea.
3. **Darlingmoors - City & Island** - population 2,850,000, the Commonwealth's largest city and chartered principal city. Zones and districts with dialling codes: NW (0221 4) Seaport Village, The Northwest, Outlook, Darling Hill, Timberland; NE (0221 5) Oyster Point, Forest Park, The Beaches; C (0221 3) Outer Docks, Government Centre, Inner Docks, Yacht Harbour; City Centre (0221 2); SW (0221 6) Peak District, Eastern Peak, Inner Gorge, Outer Gorge; SE (0221 7) Southeast Slopes, Shoreline Rocks, Cambrian Junction.
4. **The financial centre** - Market Square as the money quarter: the Bors (the Exchange), the bank headquarters, and the Mint that strikes *Frihed, Velvard, Konsens* onto every krona.
5. **Arts & culture** - institutions on Old Courthouse and around Yacht Harbour.
6. **The music scene** - Cambrian Junction warehouse venues; Seaport Village folk rooms.
7. **The food scene** - Oyster Point seafood, market-stall street food, boardwalk food at The Beaches, Yacht Harbour dining; Mediterranean produce through English, French, and Norse settler kitchens.
8. **The beaches** - The Beaches district, Shoreline Rocks, the Forest Park coast.
9. **Suburban zones** - SW: Winchester-on-the-Sea to Riverlin; SE: Linear Village to Briarside South.

Sections 4–8 are new invention: 2–4 paragraphs each, naming 2–3 concrete institutions/venues/dishes per section so Task 8 has real material to cite.

- [ ] **Step 5: Verify and commit**

Run: `python3 -m pytest tests/ -q` - Expected: pass.

```bash
git add CONSTITUTION.md GRUNDLOJEN.md LAPHURDI.md DARCAMBRIA.md
git commit -m "feat: the retcon - Darcambria the province, Darlingmoors the principal city"
```

---

### Task 5: Vite glob - pages register themselves

**Files:**
- Modify: `apps/landing-page/vite.config.ts` (full replacement)

**Interfaces:**
- Produces: automatic HTML entry discovery; Tasks 6–8 create pages without touching config.

- [ ] **Step 1: Baseline build**

Run: `cd apps/landing-page && npm run build`
Expected: succeeds; `ls dist/ dist/en/` shows index.html at root, `en/`, `darcambria/`, `lapentieur/`, `agaetisboro/`, `en/darcambria/`, `en/lapentieur/`, `en/agaetisboro/` (8 pages).

- [ ] **Step 2: Replace the config**

```ts
import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

// base "./" keeps asset URLs relative, so the build works at any GitHub
// Pages path (site root today, anywhere else tomorrow) without config.
// Entries are discovered: every index.html in the tree is a page, so new
// bilingual pages register themselves. Laphurdi leads at /, English at /en/.
const root = fileURLToPath(new URL(".", import.meta.url));
const SKIP = new Set(["node_modules", "dist", "src", ".git"]);

function htmlEntries(dir: string = root, entries: Record<string, string> = {}) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (item.isDirectory()) {
      if (!SKIP.has(item.name)) htmlEntries(join(dir, item.name), entries);
    } else if (item.name === "index.html") {
      const rel = relative(root, dir);
      entries[rel === "" ? "main" : rel.replaceAll("/", "-")] = join(dir, "index.html");
    }
  }
  return entries;
}

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: htmlEntries(),
    },
  },
});
```

- [ ] **Step 3: Verify identical output**

Run: `cd apps/landing-page && npm run build && find dist -name index.html | sort`
Expected: build succeeds; the same 8 index.html paths as Step 1.

- [ ] **Step 4: Commit**

```bash
git add apps/landing-page/vite.config.ts
git commit -m "feat(landing-page): vite glob - every index.html is a page"
```

---

### Task 6: Praktisk - the traveller guide, both languages

**Files:**
- Create: `apps/landing-page/praktisk/index.html` (lang `lp`)
- Create: `apps/landing-page/en/praktisk/index.html` (lang `en`)

**Interfaces:**
- Consumes: `TRANSPORT.md` fares/routes (Task 3), attested lexicon tokens (Task 1).
- Produces: `/praktisk/` + `/en/praktisk/`, linked from nav in Task 9.

- [ ] **Step 1: Build the Laphurdi page**

Skeleton: copy the `<head>`, `<header class="site-header">`, and `<footer class="site-footer">` blocks verbatim from `apps/landing-page/darcambria/index.html`, then adjust:
- `<title>Praktisk - pengar, baaner, fraser · Laphurdeen</title>`, matching `<meta name="description">`.
- hreflang alternates: `lp` → `./`, `en` → `../en/praktisk/`, `x-default` → `./`.
- Nav anchors: `#pengar`, `#baaner`, `#frasboken`, plus the standard cross-links and `nav-lang` → `../en/praktisk/`.
- Keep `<script type="module" src="/src/main.ts"></script>` and the existing card/section/`data-reveal` classes so shared CSS and reveal JS apply.

Three `<section>`s with required facts:
1. `#pengar` - *en krona, twe kronur* (the heritage plural); the pegged krona (grep `peg` in `CONSTITUTION.md` for the article to cite); tax-inclusive prices as a Charter comfort; `kr.` formatting with `kr.4,950` as the worked example; tipping culture.
2. `#baaner` - Baaner Laphurdeen: the express triangle (Lapentieur ⇄ Darlingmoors ⇄ Agaetisboro); regional routes to the province seats; rail-ferry sailings to Shellharbour and Sundby; a highlight card promoting the **weekly cap of kr.4,950** and **tap-to-pay** (contactless credit/debit, Apple Pay/Google Pay); a cross-link card noting metro Darcambria runs the DCTS (link `../darcambria/`).
3. `#frasboken` - a phrasebook table of 10–12 rows (greeting, please/thanks, ordering, ticket-buying, emergency), every Laphurdi token verified against `LEXICON.tsv`; closing cards linking `../laphurdi/` (Laphurdikursen) and `../translator/` (Oversettaren).

- [ ] **Step 2: Build the English page**

Mirror section-for-section at `en/praktisk/index.html`: `lang="en"`, hreflang `lp` → `../../praktisk/`, `en` → `./`; nav/footer links prefixed `../../`; `nav-lang` link says `Laphurdi` and points to `../../praktisk/`. English headings translate the Laphurdi ones (Money · Getting around · The phrasebook); the phrasebook table keeps the same Laphurdi column.

- [ ] **Step 3: Verify**

Run: `cd apps/landing-page && npm run build && find dist -path '*praktisk*' -name index.html`
Expected: build passes; `dist/praktisk/index.html` and `dist/en/praktisk/index.html` exist.
Then `npm run preview` and check both pages with Playwright: hero renders, three sections reveal, language toggle round-trips, `kr.4,950` visible in both.

- [ ] **Step 4: Commit**

```bash
git add apps/landing-page/praktisk apps/landing-page/en/praktisk
git commit -m "feat(landing-page): Praktisk - money, Baaner Laphurdeen, and the phrasebook, in both languages"
```

---

### Task 7: Provinser - the atlas, both languages

**Files:**
- Create: `apps/landing-page/provinser/index.html` (lang `lp`)
- Create: `apps/landing-page/en/provinser/index.html` (lang `en`)

**Interfaces:**
- Consumes: `PROVINCES.md` roster (Task 2), amended Art 41 (Task 4).
- Produces: `/provinser/` + `/en/provinser/`, linked from nav in Task 9.

- [ ] **Step 1: Build the Laphurdi page**

Same skeleton discipline as Task 6 (copy head/header/footer from `darcambria/index.html`, adjust): title `Provinseren av Laphurdeen · Laphurdeen` (verify the definite plural form against `LAPHURDI.md` §3 noun rules; fall back to `De seksten provinser` phrasing if §3 says otherwise), hreflang pair `./` ↔ `../en/provinser/`.

Content: an intro citing Article 41 (16 provinces, the Boundary Commission), then six card groups - exactly these, three cards each unless noted:
- Heartland: Darcambria (→ `../darcambria/`), National Capital Region (→ `../lapentieur/`), Peaklands
- The south: Southcape (→ `../agaetisboro/`), Saltmarsken, Vindalen
- The east: Easthaven, Rullarkuller, Mund-av-Lin
- The west: Belhaven, Torkadeland, The Forests
- The north: Highcliffe, Lakmorgen, The Northern Straits
- The outer isles: Sainte-Agathe (1 card)

Each card: province name, seat, the spec's character line, population only for Darcambria (4,900,000) and National Capital Region (Lapentieur, 1,250,000).

- [ ] **Step 2: Build the English page**

Mirror at `en/provinser/index.html`, same 16 cards, links prefixed `../../`.

- [ ] **Step 3: Verify**

Run: `cd apps/landing-page && npm run build && grep -c 'class="card"' provinser/index.html en/provinser/index.html`
Expected: build passes; 16 cards in each file.
Playwright: both pages render, the three city-page links navigate, toggle round-trips.

- [ ] **Step 4: Commit**

```bash
git add apps/landing-page/provinser apps/landing-page/en/provinser
git commit -m "feat(landing-page): Provinseren - the atlas of the sixteen provinces, in both languages"
```

---

### Task 8: Darlingmoors - the city page, both languages

**Files:**
- Create: `apps/landing-page/darcambria/darlingmoors/index.html` (lang `lp`)
- Create: `apps/landing-page/en/darcambria/darlingmoors/index.html` (lang `en`)

**Interfaces:**
- Consumes: `DARCAMBRIA.md` §3–§9 (Task 4), `TRANSPORT.md` DCTS routes (Task 3).
- Produces: `/darcambria/darlingmoors/` + English twin; Task 9 links the Darcambria pages here.

- [ ] **Step 1: Build the Laphurdi page**

Skeleton from `darcambria/index.html` with paths one level deeper (brand `../../`, shared cross-links `../../lapentieur/` etc.), crumbs `Laphurdeen · Darcambria · Darlingmoors`, hreflang pair `./` ↔ `../../en/darcambria/darlingmoors/`.

Six sections, each grounded in the named `DARCAMBRIA.md` material: `#nabolag` (the zone-by-zone tour, dialling codes as flavour), `#bors` (Market Square: the Bors, the banks, the Mint striking the motto - cross-link the main page's coin section `../../#`), `#kultur` (Old Courthouse + Yacht Harbour institutions), `#musik` (Cambrian Junction warehouses vs Seaport Village folk rooms), `#mat` (Oyster Point *ostra*-and-seafood culture - check `LAPHURDI.md` §3 before inflecting any plural - market stalls, The Beaches boardwalk, Yacht Harbour dining), `#strander` (The Beaches, Shoreline Rocks, Forest Park coast - with the U2/R6 DCTS lines that reach them). Population 2,850,000 in the hero; "the Commonwealth's largest city and chartered principal city" framing.

- [ ] **Step 2: Build the English page**

Mirror at `en/darcambria/darlingmoors/index.html`, links prefixed `../../../`.

- [ ] **Step 3: Verify**

Run: `cd apps/landing-page && npm run build && find dist -path '*darlingmoors*' -name index.html`
Expected: both dist pages exist.
Playwright: six sections render in both languages, toggle round-trips, DCTS route mentions match `TRANSPORT.md`.

- [ ] **Step 4: Commit**

```bash
git add apps/landing-page/darcambria/darlingmoors apps/landing-page/en/darcambria/darlingmoors
git commit -m "feat(landing-page): Darlingmoors - the principal city in six movements, both languages"
```

---

### Task 9: Integration - the province reframe and the nav

**Files:**
- Modify: `apps/landing-page/darcambria/index.html`, `apps/landing-page/en/darcambria/index.html`
- Modify: `apps/landing-page/index.html`, `apps/landing-page/en/index.html`
- Modify: `apps/landing-page/README.md`

**Interfaces:**
- Consumes: all new pages (Tasks 6–8), amended canon (Task 4).

- [ ] **Step 1: Reframe the Darcambria pages as province pages**

In both language editions:
- Hero eyebrow `Den sjartat storstad` (en: its equivalent) → province framing, e.g. `Provinsen av den dar boge` / `The province of the amber curve`.
- `<meta name="description">` and hero lede: no longer "storstaden"/"the city"; the bay, the eight Charter cities, population 4,900,000.
- The Darlingmoors card: add population 2,850,000 and a link to `darlingmoors/` (en: `darlingmoors/`), e.g. a `card-link` matching existing card link styling if present, else wrap the `<h3>` in an `<a>`.
- The eight-cities section: name the joint governance **the Darcambrian Communities** and note DCTS spells it out.

- [ ] **Step 2: Wire the main pages**

Both editions of the main page: add nav + footer links to `praktisk/` and `provinser/` (en: `../praktisk/` → `praktisk/` relative to `/en/`), labels `Praktisk` / `Provinseren` (lp) and `Practical` / `The provinces` (en).

- [ ] **Step 3: Update the README**

`apps/landing-page/README.md`: page inventory now lists main, praktisk, provinser, darcambria (province), darcambria/darlingmoors, lapentieur, agaetisboro - each with its `/en/` twin - and notes entries are discovered by the vite glob.

- [ ] **Step 4: Verify and commit**

Run: `cd apps/landing-page && npm run build` - Expected: 14 index.html files in dist.

```bash
git add apps/landing-page
git commit -m "feat(landing-page): the province reframe and the new doors - Praktisk, Provinseren, Darlingmoors"
```

---

### Task 10: Full verification pass

**Files:** none created; fixes committed if found.

- [ ] **Step 1: Canon and lexicon**

Run: `python3 tools/lexicon.py check && python3 -m pytest tests/ -q`
Expected: 0 errors, all tests pass.
Run: `grep -rn 'chartered principal city' CONSTITUTION.md` - Expected: names Darlingmoors.

- [ ] **Step 2: Build and parity**

Run: `cd apps/landing-page && npm run build && find dist -name index.html | sort`
Expected: exactly 14 pages - 7 Laphurdi (`/`, `praktisk`, `provinser`, `darcambria`, `darcambria/darlingmoors`, `lapentieur`, `agaetisboro`) + 7 English twins under `en/`.

- [ ] **Step 3: Playwright sweep**

`npm run preview`, then for all 14 pages: page renders with hero + sections; every language toggle lands on the twin page and back; nav links resolve (no 404s); spot-check facts against canon: kr.4,950 (praktisk), 16 cards (provinser), populations (4,900,000 / 2,850,000 / 1,250,000), Darcambrian Communities naming.

- [ ] **Step 4: Fix-and-commit anything found, then final commit if needed**

```bash
git add -A && git commit -m "fix(landing-page): verification pass fixes"
```
