# The Great Expansion — Praktisk Guide, Provinces Atlas, Darlingmoors

**Date:** 2026-07-05
**Status:** Approved design, pending implementation plan
**Predecessor:** `2026-07-05-tourism-landing-page-design.md` (the site this expands)

## 1. Context and goals

The tourism site currently has a bilingual main page, three city pages
(Darcambria, Lapentieur, Agaetisboro), and links to the Oversettaren
translator and the Laphurdikursen course. This project expands it with three
sub-projects in one spec, implemented in phases:

1. **Praktisk** — a practical traveller guide (money, national rail, phrasebook).
2. **Provinser** — a full atlas of the sixteen provinces (new canon).
3. **Darlingmoors** — a deep city page for the country's largest city.

Everything follows the site's standing rules: Laphurdi edition leads at the
unprefixed path, English mirrors under `/en/`; every fact traces to canon;
every Laphurdi token is attested in `LEXICON.tsv` or added through §3b.

## 2. The retcon: Darcambria becomes a province

Approved canon change. **Darcambria is a province, not a city.** The amber
curve is the bay — the founding Anchorage — and around it stand the eight
Charter cities, of which **Darlingmoors (pop. 2,850,000) is the largest city
in the Commonwealth**. Darcambria province totals **4,900,000**. Lapentieur
(**1,250,000**) sits in the **National Capital Region** province.
Agaetisboro's population is deliberately unstated in canon; only the three
figures above are recorded.

The retcon pass touches:

- `CONSTITUTION.md` Art 2.3: "Darcambria is recognised as a chartered
  principal city" → **Darlingmoors** is recognised as the chartered
  principal city. Art 41.3: "Lapentieur and Darcambria are chartered
  cities" → "Lapentieur and **Darlingmoors** are chartered cities."
- `GRUNDLOJEN.md` Artikel 2.3 and Artikel 41.3 — the same edits in Laphurdi.
- `LAPHURDI.md` §7 — Darcambria's etymology keeps "the amber curve," now
  describing the bay and its province rather than a city.
- `NATIONAL_SYMBOLS.md` — light touch only; "Darcambrian amber sunset" and
  "the great curved harbour" survive as descriptions of the bay.
- The two existing `/darcambria/` pages (Laphurdi and English) are
  reframed as province pages (see §7). The eight cities' joint governance is named **the Darcambrian
  Communities** — the "DC" already present in DCTS.

## 3. New canon documents (repo root)

### 3.1 `PROVINCES.md`

The Boundary Commission's roster under Article 41: **sixteen provinces**
(within the constitutional 15–18 band, leaving amendment headroom in both
directions). Naming mixes **English** (the majority of pre-Laphurdeen
settlers), **Laphurdi** (Torkadeland, Lakmorgen, Rullarkuller, Mund-av-Lin,
Saltmarsken), and **French and Norse blends** for the minority threads.
English and French proper nouns stay un-Reformed, like the Charter towns'
⟨ph⟩ and ⟨ae⟩; the Laphurdi names build on attested lexicon roots.

Each entry records: name, §7-style etymology, seat, geography, a one-line
character, and population where canon establishes it.

| Province | Seat | Character |
|---|---|---|
| Darcambria | Darlingmoors | The amber curve; the eight Charter cities (pop. 4,900,000) |
| National Capital Region | Lapentieur | The fog-brushed slopes of government (pop. 1,250,000) |
| Southcape | Agaetisboro | White sand, corals, the casino coast |
| Peaklands | Highbridge | The gorges and summits behind the amber curve |
| Easthaven | Easthaven | Fishing coast, morning markets |
| Torkadeland | Moorgate | Heath and dry-stone country (*torka*, to dry: "the parched land") |
| Lakmorgen | Whitmere | The lake district (*lak* + *morgen*: "the morning lake") |
| Rullarkuller | Woldham | Rolling grain country (*rulla* + *kuller*: "rolling hills") |
| Vinedale | Vinedale | Terraced vineyards |
| The Forests | Pineforest | Cork-oak and pine forest |
| Mund-av-Lin | Linmouth | The river delta (*mund av Lin*, "mouth of the Lin" — the *lin* of Riverlin) |
| Saltmarsken | Saltvik | Salt pans and flamingo lagoons (*salt* + *marsk*: "the salt marsh"; seat "salt cove") |
| Highcliffe | Highcliffe | The chalk cliffs of the north coast |
| Sainte-Agathe | Shellharbour | The scattered outer isles |
| Belhaven | Belhaven | French-blend port of the west (cf. Beaulieu) |
| The Northern Straits | Sundby | The strait crossings; Norse-blend ferry towns |

Lapentieur and Darlingmoors are chartered cities *within* their provinces
(National Capital Region and Darcambria respectively), per the amended
Art 41.3.

Smaller country towns (Baaner regional stops) also carry English names —
e.g. Ashcombe, Fernlea, Millford, Linbridge — the full list drawn up in
`TRANSPORT.md` when the routes are written.

### 3.2 `TRANSPORT.md`

National and metro transport canon:

- **Baaner Laphurdeen** — the national rail carrier. The **express
  triangle** links the three major cities: Lapentieur ⇄ Darlingmoors ⇄
  Agaetisboro. **Regional routes** radiate to the province seats and
  country towns. **Integrated rail-ferry sailings** serve the island
  provinces (Sainte-Agathe, The Northern Straits) — the ticket is one
  ticket.
- **Fares** — the Charter fare cap applies nationally, made concrete as a
  **weekly cap of kr.4,950** across the Baaner Laphurdeen network.
  Payment is **tap-to-pay**: contactless credit/debit cards and Apple
  Pay/Google Pay, with the cap applied automatically to whatever was
  tapped — no ticket office required. Concrete fare canon lives here so
  pages can cite it.
- **DCTS** — the Darcambrian Communities Transport Service, absorbed from
  `~/Documents/Darcambria.txt`: the 0221 dialling plan, Darlingmoors'
  zones, the U/R local routes and x-express routes, City Centre Mainline
  stations (Central, Market Square, Old Courthouse), and the kr.320
  airport premium. DCTS is metro-Darcambria only; the national story is
  Baaner Laphurdeen.

### 3.3 `DARCAMBRIA.md`

Metro canon for the province and its principal city:

- The eight Charter cities ranked by population and density (from the
  source notes): Darlingmoors, Addison, Marionberry, Upperlea, Lowerlea,
  Briarside, Winchester-on-the-Sea, Riverlin.
- Darlingmoors' five zones (NW/NE/C/SW/SE + City Centre) and full district
  roster with dialling codes.
- New cultural canon, one subsection per page theme (§7 below): the
  financial centre anchored on Market Square (the Exchange, the bank
  headquarters, the Mint that strikes the three-word motto onto every
  krona); arts & culture on Old Courthouse and Yacht Harbour; the music
  scene from Cambrian Junction's warehouses to Seaport Village's folk
  rooms; the beaches (The Beaches, Shoreline Rocks, the Forest Park
  coast); the street-food and restaurant scene (Oyster Point seafood, the
  markets, Yacht Harbour dining); and neighbourhood characters by zone.

## 4. Pages: Praktisk — `/praktisk/` + `/en/praktisk/`

Three sections in the site's existing card-and-section idiom:

1. **Pengar / Money** — the pegged krona, the heritage plural (*en krona,
   twe kronur*), tax-inclusive prices as a constitutional comfort, kr.
   formatting, tipping culture.
2. **Baaner Laphurdeen / Getting around** — the express triangle, regional
   routes to the province seats, rail-ferry sailings to Sainte-Agathe and
   The Northern Straits — and the headline traveller promises: the
   **weekly fare cap of kr.4,950** and **tap-to-pay** everywhere
   (contactless credit/debit, Apple Pay/Google Pay), promoted prominently. Cross-link: metro Darcambria runs DCTS
   (the kr.320 airport premium lives on the Darcambria/Darlingmoors pages,
   not here).
3. **Frasboken / Phrasebook** — greetings, transport, café, emergencies —
   every token lexicon-attested — with "go deeper" links into
   Laphurdikursen and the Oversettaren.

## 5. Pages: Provinser atlas — `/provinser/` + `/en/provinser/`

A hub page: the sixteen provinces as cards grouped by geography (the
capital island, the south, the outer isles), each with name, seat,
character line, and population where canonical. The Darcambria, National
Capital Region, and Southcape cards link through to the existing city
pages — the atlas is the site's connective tissue.

## 6. Pages: Darlingmoors — `/darcambria/darlingmoors/` + `/en/darcambria/darlingmoors/`

Six sections, all backed by `DARCAMBRIA.md`:

1. **Neighbourhoods** — a tour by zone: City Centre (Market Square, Old
   Courthouse), the NW (Seaport Village, Darling Hill, Outlook,
   Timberland), the NE (Oyster Point, Forest Park, The Beaches), the
   Centre docks, Government Centre and Yacht Harbour, the SW heights
   (Peak District, the Gorges), the SE (Shoreline Rocks, Cambrian
   Junction).
2. **The financial centre** — Market Square as the money quarter: the
   Exchange, the bank headquarters, the Mint (crosslink to the main
   page's "three words on every coin" section).
3. **Arts & culture** — the institutions on Old Courthouse and Yacht
   Harbour.
4. **The music scene** — Cambrian Junction warehouse venues against
   Seaport Village folk rooms.
5. **The food scene** — street food and restaurants: Oyster Point
   seafood, market stalls, boardwalk food at The Beaches, Yacht Harbour
   dining. Mediterranean produce through English, French, and Norse
   settler kitchens.
6. **The beaches** — The Beaches district, Shoreline Rocks, the Forest
   Park coast.

The existing Darcambria page's Darlingmoors card becomes the doorway to
this page.

## 7. Reframing the existing Darcambria pages

The two existing pages (`/darcambria/`, `/en/darcambria/`) become
**province pages**: the bay, the eight Charter cities led by Darlingmoors,
the Darcambrian Communities, DCTS. Most copy survives; city-centre
material ("a city centre built on the waterline") moves to the
Darlingmoors page where it belongs. Population figures appear per §2.

## 8. Infrastructure

- **`vite.config.ts`** — replace the eight hand-listed HTML entries with a
  glob over `**/index.html` (excluding `dist/`, `node_modules/`), so
  every future page registers itself. Going from 8 to 14 entries.
- **Navigation** — both editions of the main page gain links to Praktisk
  and Provinser; the Darcambria pages link to Darlingmoors.
- **Deploy** — `deploy-pages.yml` is untouched; the new pages live inside
  the landing-page app and ride the existing single Pages artifact.
- **READMEs** — the landing-page README's page inventory is updated.

## 9. Language work (§3b)

Candidate new words the pages may need: *ferja* (ferry), *stasjon*
(station), *bors* (exchange), *mynt* (mint/coin), *galleri*, *konsert*,
*nabolag* (neighbourhood), *marsk* (coastal marsh — the root of
Saltmarsken), plus food-scene vocabulary. Implementation
checks each candidate against `LEXICON.tsv` first (the recent expansion
to 2,000+ words likely covers several), adds only the missing ones
through the normal §3b word-building process with etymologies via
`tools/lexicon.py`, and keeps `tests/test_lexicon.py` green. Proper nouns
(province and town names) are not lexicon entries.

## 10. Phasing

1. **Canon** — write `PROVINCES.md`, `TRANSPORT.md`, `DARCAMBRIA.md`;
   retcon pass on `CONSTITUTION.md`, `GRUNDLOJEN.md`, `LAPHURDI.md`;
   lexicon additions.
2. **Infra** — vite glob.
3. **Pages** — Praktisk, then Provinser, then Darlingmoors — each
   bilingual, built and reviewed one at a time.
4. **Integration** — Darcambria pages reframed, nav links, READMEs.
5. **Verification** — see §11.

## 11. Verification

- `python3 -m pytest tests/` — lexicon integrity stays green.
- `npm run build` in `apps/landing-page` — type-check + production build.
- Bilingual parity: every new/changed `/x/` page has an `/en/x/` twin and
  working language toggles both ways.
- A Playwright pass over every new and changed page in both languages —
  layout, internal links, and canon spot-checks.

## 12. Out of scope

- The southern coast destination page (the staged lexicon words wait).
- A national symbols page.
- Naming populations for provinces beyond the three canonical figures.
- Any change to the translator or Laphurdikursen apps beyond inbound
  links.
