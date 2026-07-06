# Laphurdeen Constitution v3 + National Symbols Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved national design (spec: `docs/superpowers/specs/2026-07-05-laphurdeen-national-design.md`) - Constitution v3 with National Symbols article, Senate at 1/250k, 15–18 provinces, and Speaker of the Commons as head of state - plus a new `NATIONAL_SYMBOLS.md` and Laphurdi vocabulary additions.

**Architecture:** Three documents, three tasks. The Constitution change is a renumber-then-edit transform of the existing v2 file: bump all article headings ≥5 by one with a single perl command, insert the new Article 5, then apply enumerated content and cross-reference edits. Each task ends with scripted verification (grep/awk) and a commit.

**Tech Stack:** Markdown, git, perl/grep/awk for mechanical transforms and verification. No code, no test framework - verification steps are shell checks with expected output.

## Global Constraints

- Senate ratio: **one Senator for every two hundred and fifty thousand residents** (was one hundred thousand).
- Provinces: **no fewer than fifteen and no more than eighteen**.
- All consensus thresholds remain **sixty-six per cent (66%)** - do not alter.
- Motto, exactly: **Frihed, Velvard, Konsens** (translation: Freedom, Welfare, Consensus).
- Anthem title, exactly: **Sang av de Mange Strander** ("Song of the Many Shores").
- Flag palette: sea blue `#003A66`, amber `#F2A900`, white `#FFFFFF`; ratio 2:3.
- Final Constitution must have exactly **45 articles**, numbered sequentially with no gaps.
- State styling stays "the Commonwealth of Laphurdeen"; head of state is the **Speaker of the Commons**; the Senate's Convenor becomes an internal presiding chair only.
- Working directory: `/Users/jeffkloy/Laphurdeen` (git repo, branch `main`).

---

### Task 1: Constitution v3

**Files:**
- Modify: `CONSTITUTION.md`

**Interfaces:**
- Consumes: `CONSTITUTION.md` at v2 (44 articles, "Second Edition" header line).
- Produces: `CONSTITUTION.md` at v3 (45 articles). Later tasks rely on: Article 5 titled "National Symbols" containing the motto, flag description, and anthem title exactly as written below (Task 2's file must match it), and Part I containing Article 4's Laphurdi Language Commission clause (Task 3 links to it).

- [ ] **Step 1: Update the edition line**

Edit - old:
```
*Adopted by the Constituent Assembly at Lapentieur - Second Edition (Founding Draft, revised)*
```
new:
```
*Adopted by the Constituent Assembly at Lapentieur - Third Edition (Founding Draft, revised)*
```

- [ ] **Step 2: Renumber all article headings ≥5 up by one**

Run:
```bash
perl -pi -e 's/^### Article (\d+) /"### Article ".($1>=5?$1+1:$1)." "/e' CONSTITUTION.md
```
This touches ONLY lines starting `### Article N` (headings), not inline references. Articles 1–4 are unchanged; old 5–44 become 6–45.

- [ ] **Step 3: Verify headings are 1–4 then 6–45 with old 5 gone**

Run:
```bash
grep -c '^### Article ' CONSTITUTION.md
grep -n '^### Article 5 ' CONSTITUTION.md
```
Expected: first command prints `44`; second prints nothing (exit 1) - the slot for the new Article 5 is open.

- [ ] **Step 4: Insert Article 5 - National Symbols at the end of Part I**

Edit - old:
```
2. Parliament shall maintain a Laphurdi Language Commission to cultivate the national language, and shall protect the linguistic heritage of all communities of Laphurdeen.

---

## PART II - THE CHARTER OF RIGHTS AND FREEDOMS
```
new:
```
2. Parliament shall maintain a Laphurdi Language Commission to cultivate the national language, and shall protect the linguistic heritage of all communities of Laphurdeen.

### Article 5 - National Symbols
1. The motto of the Commonwealth is **Frihed, Velvard, Konsens** - Freedom, Welfare, Consensus.
2. The flag of the Commonwealth is the **Amber Curve**: a deep sea-blue field crossed in its lower third by a broad amber arc, the founding bay at sunset, beneath a single white star, the light of Lapentieur. Its precise form is fixed by law.
3. The anthem of the Commonwealth is **Sang av de Mange Strander** - the Song of the Many Shores. Its text and music are fixed by law.
4. The symbols of the Commonwealth may be altered only by Act of Parliament under the Consensus Rule.

---

## PART II - THE CHARTER OF RIGHTS AND FREEDOMS
```

- [ ] **Step 5: Set the Senate ratio to 250,000 (now Article 18)**

Edit - old:
```
1. The Senate comprises **one Senator for every one hundred thousand residents** of the Commonwealth, the number of seats being fixed after each census by the Electoral and Qualifications Commission.
```
new:
```
1. The Senate comprises **one Senator for every two hundred and fifty thousand residents** of the Commonwealth, the number of seats being fixed after each census by the Electoral and Qualifications Commission.
```

- [ ] **Step 6: Fix the province range (now Article 41)**

Edit - old:
```
1. The territory of the Commonwealth is divided into **provinces**, established and altered by Act of Parliament on the recommendation of an independent Boundary Commission, having regard to community, geography, and reasonable equality of population.
```
new:
```
1. The territory of the Commonwealth is divided into **provinces**, established and altered by Act of Parliament on the recommendation of an independent Boundary Commission, having regard to community, geography, and reasonable equality of population. There shall be no fewer than fifteen and no more than eighteen provinces.
```

- [ ] **Step 7: Promulgation moves to the Speaker (now Article 22)**

Edit - old:
```
Bills duly passed are certified by the presiding officers of both chambers and promulgated by the Convenor of the Senate within fourteen days.
```
new:
```
Bills duly passed are certified by the presiding officers of both chambers and promulgated by the Speaker of the Commons within fourteen days.
```

- [ ] **Step 8: Replace the Convenor article with the Speaker article (now Article 27)**

Edit - old:
```
### Article 27 - The Convenor of the Senate
1. The Senate has a **Convenor**, elected annually by the Senate from among its members by sixty-six per cent of votes cast. No Senator may serve more than two terms as Convenor within a single Parliament.
2. The Convenor presides over the Senate, promulgates laws, accredits and receives ambassadors, and performs the ceremonial and representative functions of the Commonwealth abroad and at home.
3. The Convenor is first among equals, holds no executive power beyond their own ministerial office, and acts internationally only on the instruction of the Council.
```
new:
```
### Article 27 - The Speaker of the Commons
1. The Commons elects a **Speaker** from among its members by sixty-six per cent of votes cast at its first sitting after each general election. The Speaker serves for the term of the Parliament and may be recalled by the Commons by the same majority. A Deputy Speaker, elected in the same manner, acts when the Speaker is unable to act.
2. The Speaker of the Commons is the ceremonial head of state of the Commonwealth. The Speaker presides over the Commons and over joint sittings of Parliament, promulgates laws, accredits and receives ambassadors, and performs the ceremonial and representative functions of the Commonwealth at home and abroad.
3. The Speaker holds no executive power and acts internationally only on the instruction of the Council. While in office, the Speaker retains their seat and their ministerial office, but their day-to-day duties within their Ministry are reduced as provided by law.
4. The Senate elects a **Convenor** from among its members annually by sixty-six per cent of votes cast. The Convenor presides over sittings of the Senate and holds no further office or precedence by virtue of that role.
```

- [ ] **Step 9: Retitle Part V**

Edit - old:
```
## PART V - EXECUTIVE AUTHORITY
```
new:
```
## PART V - EXECUTIVE AUTHORITY AND THE HEAD OF STATE
```

- [ ] **Step 10: Fix all inline cross-references (+1 where the target was ≥5)**

Apply these ten edits exactly (the perl in Step 2 did not touch inline prose):

1. old: `The rights in Articles 5(1), 14(2), and 14(3)` → new: `The rights in Articles 6(1), 15(2), and 15(3)`
2. old: `A conciliated text returns to both chambers under Article 19.` → new: `A conciliated text returns to both chambers under Article 20.`
3. old: `the qualification standards under Articles 17 and 18` → new: `the qualification standards under Articles 18 and 19`
4. old: `save for the elected offices established by Articles 17 and 18` → new: `save for the elected offices established by Articles 18 and 19`
5. old (replace ALL occurrences - appears twice, in the Integrity Commission and Reserve Bank articles): `in the manner of judges under Article 29` → new: `in the manner of judges under Article 30`
6. old: `only by constitutional amendment under Article 43` → new: `only by constitutional amendment under Article 44`
7. old: `Each province elects three members of the Commons under Article 18.` → new: `Each province elects three members of the Commons under Article 19.`
8. old: `The rights identified in Article 15(2) are non-derogable.` → new: `The rights identified in Article 16(2) are non-derogable.`
9. old: `the Consensus Rule (Article 19)` → new: `the Consensus Rule (Article 20)`
10. old: `the tax rates (Article 34(2))` → new: `the tax rates (Article 35(2))`

- [ ] **Step 11: Verify the whole document**

Run:
```bash
grep -c '^### Article ' CONSTITUTION.md
awk '/^### Article /{n++; if ($3 != n) print "MISMATCH: expected " n " got " $0}' CONSTITUTION.md
grep -n 'Convenor' CONSTITUTION.md
grep -c 'hundred thousand residents' CONSTITUTION.md || true
```
Expected: `45`; no MISMATCH lines; `Convenor` appears on exactly one line - Article 27 clause 4; the last grep prints `0` (the old ratio phrase is gone; note the tax threshold says "hundred thousand kronur", which is different text and must remain - check with `grep -c 'hundred thousand kronur' CONSTITUTION.md` → `2`).

- [ ] **Step 12: Commit**

```bash
git add CONSTITUTION.md
git commit -m "Constitution v3: National Symbols article, Speaker of the Commons as head of state, Senate 1/250k, 15-18 provinces

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: NATIONAL_SYMBOLS.md

**Files:**
- Create: `NATIONAL_SYMBOLS.md`

**Interfaces:**
- Consumes: Constitution v3 Article 5 (Task 1) - motto, flag description, and anthem title in this file must match it verbatim.
- Produces: the reference document that a symbols statute (future work) would codify.

- [ ] **Step 1: Write the file**

Create `NATIONAL_SYMBOLS.md` with exactly this content:

````markdown
# National Symbols of the Commonwealth of Laphurdeen

*Reference for the First Symbols Act - implements Article 5 of the Constitution.*

## The Motto

> **Frihed, Velvard, Konsens.**
> *Freedom, Welfare, Consensus.*

The three constitutional pillars, in Laphurdi. Appears on the coat of arms, the krona coinage and notes, and the passport cover. Always rendered in Laphurdi; the English translation may accompany it in official documents but never replaces it.

## The Flag - "The Amber Curve"

**Ratio:** 2:3 (hoist:fly).

**Field:** deep sea blue.

**Arc:** a broad amber band sweeping across the lower third of the field. Its upper edge rises from the lower hoist and lower fly corners to an apex at one-third of the flag's height, centred on the fly-wise midline; the band's thickness is one-sixth of the flag's height at the apex. It is the founding bay - "The Anchorage" that gave Laphurdeen its name - under a Darcambrian amber sunset.

**Star:** a single five-pointed white star, points upward, centred fly-wise, its centre at three-fifths of the flag's height, its circumscribing diameter one-fifth of the flag's height. It is the light of Lapentieur, the capital on the slopes, and the star the Charter fleet steered by.

**Palette:**

| Element | Colour | Hex |
|---|---|---|
| Field | sea blue | `#003A66` |
| Arc | amber | `#F2A900` |
| Star | white | `#FFFFFF` |

**Verbal blazon:** *Azure, in base an arc embowed or, in chief a mullet argent.*

## The Anthem - "Sang av de Mange Strander"

*Song of the Many Shores.*

**Structure:** four verses and a chorus. Each verse arrives from one of the four founding shores - the English, Dutch, Swedish, and French-speaking settler fleets - telling one crossing in its own cadence. The chorus answers all four in Laphurdi: many shores, one anchorage. Musically, verses are set as a rising sea-shanty line; the chorus resolves as a hymn.

**Status:** text and music are to be composed (see the design spec's out-of-scope list); this structure is fixed by the First Symbols Act.

## Etymologies (for engravers and educators)

- **Laphurdeen** - "The Anchorage": Old Charter *La Fjärde* → *Laphurde* + archaic definite *-een*.
- **The amber curve** - Darcambria, "the amber curve," the great curved harbour under amber sunsets.
- **The white star** - Lapentieur, "the place of slopes," whose harbour light guided the Charter fleet home.
````

- [ ] **Step 2: Verify consistency with the Constitution**

Run:
```bash
grep -c 'Frihed, Velvard, Konsens' CONSTITUTION.md NATIONAL_SYMBOLS.md
grep -c 'Sang av de Mange Strander' CONSTITUTION.md NATIONAL_SYMBOLS.md
```
Expected: each file reports at least 1 for both greps.

- [ ] **Step 3: Commit**

```bash
git add NATIONAL_SYMBOLS.md
git commit -m "Add national symbols reference: motto, Amber Curve flag spec, anthem structure

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Laphurdi vocabulary and symbols note

**Files:**
- Modify: `LAPHURDI.md`

**Interfaces:**
- Consumes: anthem title and motto from Tasks 1–2 (must match verbatim).
- Produces: vocabulary entries *sang* and *mange* used by the anthem title; future anthem-lyrics sessions build on these.

- [ ] **Step 1: Add vocabulary rows**

Edit `LAPHURDI.md` - old:
```
| ny / gammel | new / old | SV |
```
new:
```
| ny / gammel | new / old | SV |
| sang | song | sång (SV) + zang (NL) + song |
| mange | many | många (SV) + many |
```

- [ ] **Step 2: Add the anthem to the phrases section**

Edit `LAPHURDI.md` - old:
```
### The national motto
> **Frihed, Velvard, Konsens.**
> *Freedom, Welfare, Consensus.*
```
new:
```
### The national motto
> **Frihed, Velvard, Konsens.**
> *Freedom, Welfare, Consensus.*

### The national anthem
> **Sang av de Mange Strander** - *Song of the Many Shores.*

Four verses arrive from the four founding shores - English, Dutch, Swedish, French - and the chorus unites them in Laphurdi (*strander* is the plural of *strand*, shore/beach; see `NATIONAL_SYMBOLS.md` for the full structure). Lyrics are a future session's work.
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -c 'sang\|mange' LAPHURDI.md
grep -c 'Sang av de Mange Strander' LAPHURDI.md
```
Expected: first ≥ 2; second ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add LAPHURDI.md
git commit -m "Add sang/mange vocabulary and national anthem note to Laphurdi reference

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
