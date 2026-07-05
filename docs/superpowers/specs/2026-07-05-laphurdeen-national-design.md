# Laphurdeen National Design — Resolution of Outstanding Questions

**Date:** 2026-07-05
**Status:** Approved in discussion; pending spec review
**Applies to:** `CONSTITUTION.md` (v2 → v3), `LAPHURDI.md`, new `NATIONAL_SYMBOLS.md`

## Context

Constitution v2 left four areas running on provisional defaults: the head-of-state arrangement, the ministry list, the Senate-vs-Commons size balance, and national styling/symbols. A brainstorming session resolved all four. This spec records the decisions and the exact changes needed to apply them.

## Decisions

| Area | Decision |
|---|---|
| Head of state | **Speaker of the Commons** — ceremonial head of state; Senate governs |
| Ministries | **Keep the 12** as drafted in Article 23 |
| Senate ratio | **1 Senator per 250,000 residents** (~30 at 7.5M population) |
| Provinces | Boundary Commission targets **15–18 provinces** → Commons of 45–54 (the larger chamber) |
| State name | **Commonwealth of Laphurdeen** (kept) |
| Motto | ***Frihed, Velvard, Konsens*** (Freedom, Welfare, Consensus) |
| Flag | **The Amber Curve** — sea-blue field, amber arc across lower third, white star above |
| Anthem | ***Sang av de Mange Strander*** ("Song of the Many Shores") |

## Detailed Design

### A. The Speaker of the Commons (head of state)

- **Election:** the Commons elects the Speaker from among its members by 66% of votes cast at the first sitting of each Parliament. Term runs with the Parliament (4 years). The Commons may recall the Speaker by a 66% vote. A Deputy Speaker, elected the same way, acts when the Speaker is unavailable.
- **Functions:** promulgates laws; accredits and receives ambassadors; presides over the Commons and over joint sittings of Parliament; performs the ceremonial and representative functions of the Commonwealth at home and abroad. Holds **no executive power** and acts internationally only on the instruction of the Council (the Senate acting collectively).
- **Dual mandate:** the Speaker retains their Commons seat and their managerial office within a Ministry (preserving the Commons eligibility rule), but their day-to-day ministry duties are reduced by law during tenure.
- **The Senate's Convenor is demoted** to a purely internal presiding officer: elected annually by the Senate by 66%, chairs Senate sittings, no head-of-state functions.

### B. Chamber arithmetic

- **Senate (Article 17):** one Senator per **250,000** residents, number fixed after each census; each of the 12 Ministries receives at least one seat. At ~7.5M residents this yields ~30 Senators, averaging 2–3 Lead Ministers per Ministerial College.
- **Provinces (Article 40):** the Boundary Commission establishes **no fewer than 15 and no more than 18 provinces**. With 3 Commons seats per province, the Commons has 45–54 members and is the larger chamber.
- Expected map shape (non-binding guidance for the Boundary Commission): Darcambria's metro spans 3–4 provinces; Lapentieur anchors 1–2; remaining regional/island provinces average ~400–500k residents.

### C. National symbols (new constitutional article)

Insert **Article 5 — National Symbols** at the end of Part I:

1. Motto: *Frihed, Velvard, Konsens*.
2. Flag: described verbally (deep sea-blue field; broad amber arc across the lower third, for the founding bay at sunset; a single white star above, for the light of Lapentieur); precise form fixed by law.
3. Anthem: *Sang av de Mange Strander*; text and music fixed by law.

Full flag specification lives in `NATIONAL_SYMBOLS.md`: ratio 2:3; palette — sea blue `#003A66`, amber `#F2A900`, white `#FFFFFF`; five-pointed white star centred above the arc's apex; plus motto usage rules and the anthem's structure (four "shore" verses — English, Dutch, Swedish, French heritage — with a unifying Laphurdi chorus; lyrics deferred to a future session).

### D. File changes

1. **`CONSTITUTION.md` → v3** (single clean rewrite):
   - New Article 5 (National Symbols) in Part I; all subsequent articles renumber +1 (Charter becomes Articles 6–16; final article becomes 45).
   - Cross-references to update: limitation-clause refs (old 5(1)/14(2)/14(3) → 6(1)/15(2)/15(3)); Consensus Rule ref in deadlock and entrenchment articles (19 → 20); refs to the Senate/Commons articles in the elections and civil-service articles (17/18 → 18/19); judges-manner refs (29 → 30); amendment ref in taxation (43 → 44); provinces ref to Commons article (18 → 19); emergency non-derogation ref (15(2) → 16(2)); entrenched tax-rates ref (34(2) → 35(2)).
   - Senate ratio: 100,000 → 250,000 (old Article 17).
   - Province range 15–18 written into the provinces article (old Article 40).
   - Promulgation article (old 21): Convenor → Speaker of the Commons.
   - Convenor article (old 26): replaced by two provisions — the Speaker of the Commons (election, functions, dual mandate, Deputy) and the Senate Convenor as internal chair.
   - Edition line updated to "Third Edition".
2. **`NATIONAL_SYMBOLS.md`** (new): flag blazon and construction sheet (in text), palette, motto usage, anthem structure, symbol etymologies.
3. **`LAPHURDI.md`**: add vocabulary *sang* (song), *mange* (many); add a short "National symbols in Laphurdi" note linking motto and anthem title; *strander* (shores) already present as plural of *strand*.

## Out of Scope

- Anthem lyrics and musical composition (future Laphurdi session).
- The actual provincial map, province names, and boundaries.
- Flag artwork files (SVG/PNG).
- City charter laws for Lapentieur and Darcambria.

## Success Criteria

- Constitution v3 is internally consistent: numbering sequential, all cross-references resolve, no orphaned mentions of the Convenor as head of state.
- All eight decisions in the table above are reflected verbatim in the files.
- `NATIONAL_SYMBOLS.md` is complete enough that a vexillographer could draw the flag from text alone.
