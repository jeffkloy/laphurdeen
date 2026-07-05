# Laphurdi Lexicon Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow Laphurdi from ~95 words to a validated 1,000-word core lexicon in `LEXICON.tsv`, with lint/build tooling and updated grammar documentation.

**Architecture:** A single TSV is the source of truth; `tools/lexicon.py` lints it (`check`) and deterministically generates `LEXICON.md` (`build`). Words are coined in domain batches under the word-building rulebook in the spec (`docs/superpowers/specs/2026-07-05-laphurdi-lexicon-design.md`), each batch gated by `check` before commit.

**Tech Stack:** Python 3 stdlib only; unittest for tests; no dependencies.

## Global Constraints

- Python 3, **stdlib only** — no pip installs.
- TSV header, exactly: `word	pos	gender	forms	english	domain	register	sources	notes`
- POS values: `n, v, adj, adv, prep, conj, pron, num, det, interj`
- Domain slugs, exactly 20, in this canonical order: `world-nature, plants-animals, body-health, people-family, food-drink, house-home, clothing, time-calendar, numbers-measure, motion-travel, sea-ships, work-trade, communication, mind-emotion, law-civic, arts-leisure, school-knowledge, common-verbs, qualities, function-words`
- Register values: empty (neutral), `everyday`, `high`.
- Irregular closed list (16, fixed by Task 0 spec amendment): `vera, hava, gaa, staa, komma, se, doa, ta, geva, faa, seja, veta, kunna, vilja, skola, moste` — plus `krona` may carry `pl=kronur`.
- Words: letters a–z/A–Z only, no accents, no hyphens. Verbs end in *-a* unless on the closed list.
- Every row cites `sources`. Derivations reference Laphurdi headwords (`X + -suffix`, `o- + X`, `X + Y`); roots cite language-tagged sources (`EN … + NL … + SV … + FR …`, tags EN/NL/SV/FR/DA). A term is a root citation iff it starts with a language tag.
- All ~95 words already in `LAPHURDI.md` enter the TSV with **identical spelling**.
- Run `python3 tools/lexicon.py check` before every commit that touches the TSV; commit only on 0 errors.
- Commit after every task.

---

### Task 0: Amend spec — irregular verbs 10 → 16

**Files:**
- Modify: `docs/superpowers/specs/2026-07-05-laphurdi-lexicon-design.md` (§1.4, §2.1 forms row, §2.2 rules 6–7, Success Criteria)

**Why:** Existing canon forces six more irregulars: the v1 perfect is built with *har* (→ *hava* irregular); the Preamble contains *stod* (→ *staa* irregular); and the modals *kan/skal/vil/moste* are non-*-a* forms already implied by v1 grammar (*skal + inf.*). Modals are irregular in all four source languages.

- [ ] **Step 1: Replace spec §1.4 table and note with the 16-verb version**

Replace the §1.4 table and its notes paragraph with:

```markdown
### 1.4 Irregular verbs — the closed list of 16

Ten strong verbs were chosen by design; six more are forced by existing canon:
*hava* (the v1 perfect auxiliary *har*), *staa* (the Preamble's *stod*), and the
four modals, which are irregular in every source language.

| infinitive | present | past | perfect | English |
|---|---|---|---|---|
| vera | er | var | har vart | be |
| hava | har | hadde | har havt | have (also perfect auxiliary) |
| gaa | gaar | gik | har gaat | go |
| staa | staar | stod | har stat | stand |
| komma | kommar | kom | har kommat | come |
| se | ser | saag | har seet | see |
| doa | doar | dede | har doat | do, make |
| ta | tar | tok | har tat | take |
| geva | gevar | gav | har gevat | give |
| faa | faar | fik | har faat | get, receive |
| seja | sejar | sa | har sejt | say |
| veta | vet | viste | har vetat | know |
| kunna | kan | kunde | har kunnat | can, be able |
| vilja | vil | vilde | har vilt | want, will |
| skola | skal | skulle | — | shall (future auxiliary) |
| moste | moste | moste | — | must (invariant, as SV *måste*) |

Notes: irregularity concentrates in past/perfect; presents are near-regular
(*-r* directly after long-vowel stems). *veta* keeps its v1 spelling but gains
irregular *vet/viste*. Irregular pasts reuse native conventions (⟨aa⟩ in
*saag*). This list is constitutionally closed: new non-modal verbs are always
regular.
```

Also: add one row to the §1.1 derivation table — `| inhabitant noun | -er | *Laphurdeener* (attested in v1 §5) | *Darcambrier* Darcambrian |`; update §2.1 `forms` rule and §2.2 check rules 6–7 from "10" to "16"; update Success Criteria bullet to "16 irregular verbs carry `forms`"; and revise the coverage criterion (§3 "Coverage validation" + Success Criteria) from "a standard top-1,000 everyday-English lemma list" to "the Swadesh-207 sweep plus the per-domain concept checklists in the implementation plan" — no standard top-1,000 lemma list is reproducibly available offline, and the checklists serve that role concretely.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-07-05-laphurdi-lexicon-design.md
git commit -m "spec: irregular closed list 10->16, forced by v1 canon (hava, staa, modals)"
```

---

### Task 1: `tools/lexicon.py check` (TDD)

**Files:**
- Create: `tools/lexicon.py`
- Test: `tests/test_lexicon.py`

**Interfaces:**
- Produces: `lexicon.COLUMNS: list[str]`, `lexicon.DOMAINS: list[str]`, `lexicon.IRREGULAR_VERBS: set[str]`, `lexicon.load(path) -> list[dict]`, `lexicon.check(rows) -> (errors: list[str], warnings: list[str])`, CLI `python3 tools/lexicon.py check` (exit 1 on errors).

- [ ] **Step 1: Write the failing tests**

Create `tests/test_lexicon.py`:

```python
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import lexicon


def row(**kw):
    r = {c: "" for c in lexicon.COLUMNS}
    r["_line"] = kw.pop("line", 2)
    r.update(kw)
    return r


def noun(word="vatter", english="water", **kw):
    base = dict(word=word, pos="n", gender="c", english=english,
                domain="world-nature", sources="EN water + NL water + SV vatten")
    base.update(kw)
    return row(**base)


class CheckTests(unittest.TestCase):
    def assert_error(self, rows, fragment):
        errors, _ = lexicon.check(rows)
        self.assertTrue(any(fragment in e for e in errors), errors)

    def assert_clean(self, rows):
        errors, _ = lexicon.check(rows)
        self.assertEqual(errors, [])

    def test_clean_row_passes(self):
        self.assert_clean([noun()])

    def test_duplicate_headword(self):
        self.assert_error([noun(), noun(english="wet stuff", line=3)],
                          "duplicate headword")

    def test_noun_requires_gender(self):
        self.assert_error([noun(gender="")], "needs gender")

    def test_non_noun_rejects_gender(self):
        self.assert_error(
            [row(word="blij", pos="adj", gender="c", english="happy",
                 domain="qualities", sources="NL blij")],
            "must not have gender")

    def test_verb_must_end_in_a(self):
        self.assert_error(
            [row(word="sprek", pos="v", english="speak",
                 domain="communication", sources="EN speak + SV spreka")],
            "must end in -a")

    def test_irregular_verb_se_allowed(self):
        self.assert_clean(
            [row(word="se", pos="v", forms="pres=ser, past=saag, perf=seet",
                 english="see", domain="common-verbs", sources="SV se + NL zien")])

    def test_forms_only_for_closed_list(self):
        self.assert_error([noun(forms="pl=vattrar")], "may not carry forms")

    def test_irregular_requires_forms(self):
        self.assert_error(
            [row(word="gaa", pos="v", english="go", domain="common-verbs",
                 sources="SV gaa + NL gaan")],
            "missing forms")

    def test_sources_required(self):
        self.assert_error([noun(sources="")], "missing sources")

    def test_derivation_integrity(self):
        bygga = row(word="bygga", pos="v", english="build",
                    domain="work-trade", sources="SV bygga")
        byggare = row(word="byggare", pos="n", gender="c", english="builder",
                      domain="work-trade", sources="bygga + -are", line=3)
        self.assert_error([byggare], "unknown")
        self.assert_clean([bygga, byggare])

    def test_root_citation_not_checked(self):
        self.assert_clean([noun(sources="EN nonexistent + FR imaginaire")])

    def test_doublet_glosses_allowed(self):
        helpa = row(word="helpa", pos="v", english="help", register="everyday",
                    domain="common-verbs", sources="NL helpen + SV hjälpa")
        assistera = row(word="assistera", pos="v", english="help",
                        register="high", domain="common-verbs",
                        sources="FR assister", line=3)
        _, warnings = lexicon.check([helpa, assistera])
        self.assertEqual(warnings, [])

    def test_plain_duplicate_gloss_warns(self):
        a = noun()
        b = noun(word="aqua", line=3, sources="FR eau")
        _, warnings = lexicon.check([a, b])
        self.assertTrue(any("duplicate gloss" in w for w in warnings), warnings)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'lexicon'`

- [ ] **Step 3: Implement `tools/lexicon.py` (check + load + CLI)**

```python
#!/usr/bin/env python3
"""Laphurdi lexicon tooling: `check` lints LEXICON.tsv, `build` generates LEXICON.md."""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TSV_PATH = ROOT / "LEXICON.tsv"
MD_PATH = ROOT / "LEXICON.md"

COLUMNS = ["word", "pos", "gender", "forms", "english",
           "domain", "register", "sources", "notes"]
POS = {"n", "v", "adj", "adv", "prep", "conj", "pron", "num", "det", "interj"}
REGISTERS = {"", "everyday", "high"}
DOMAINS = ["world-nature", "plants-animals", "body-health", "people-family",
           "food-drink", "house-home", "clothing", "time-calendar",
           "numbers-measure", "motion-travel", "sea-ships", "work-trade",
           "communication", "mind-emotion", "law-civic", "arts-leisure",
           "school-knowledge", "common-verbs", "qualities", "function-words"]
IRREGULAR_VERBS = {"vera", "hava", "gaa", "staa", "komma", "se", "doa", "ta",
                   "geva", "faa", "seja", "veta", "kunna", "vilja", "skola",
                   "moste"}
FORMS_ALLOWED = IRREGULAR_VERBS | {"krona"}
LANG_TAG = re.compile(r"^(EN|NL|SV|FR|DA)\b")
WORD_RE = re.compile(r"^[A-Za-z]+$")


def load(path=TSV_PATH):
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t", restkey="_extra")
        if reader.fieldnames != COLUMNS:
            raise SystemExit(f"bad header: {reader.fieldnames}")
        for lineno, r in enumerate(reader, start=2):
            r["_line"] = lineno
            rows.append(r)
    return rows


def is_derived(r):
    src = r["sources"]
    if not src:
        return False
    terms = [t.strip() for t in src.split(" + ")]
    return not any(LANG_TAG.match(t) for t in terms)


def check(rows):
    errors, warnings = [], []
    seen = {}
    for r in rows:
        seen.setdefault(r["word"], []).append(r["_line"])
    for w, lines in seen.items():
        if len(lines) > 1:
            errors.append(f"duplicate headword: {w} (lines {lines})")
    headwords = set(seen)

    for r in rows:
        line, w = r["_line"], r["word"]
        if "_extra" in r or any(r.get(c) is None for c in COLUMNS):
            errors.append(f"line {line}: wrong column count")
            continue
        if not WORD_RE.match(w):
            errors.append(f"line {line}: illegal characters in '{w}'")
        if r["pos"] not in POS:
            errors.append(f"line {line}: bad pos '{r['pos']}'")
        if r["domain"] not in DOMAINS:
            errors.append(f"line {line}: bad domain '{r['domain']}'")
        if r["register"] not in REGISTERS:
            errors.append(f"line {line}: bad register '{r['register']}'")
        if r["pos"] == "n":
            if r["gender"] not in {"c", "n"}:
                errors.append(f"line {line}: noun '{w}' needs gender c or n")
        elif r["gender"]:
            errors.append(f"line {line}: non-noun '{w}' must not have gender")
        if (r["pos"] == "v" and not w.endswith("a")
                and w not in IRREGULAR_VERBS):
            errors.append(f"line {line}: verb '{w}' must end in -a or be on the closed irregular list")
        if r["forms"] and w not in FORMS_ALLOWED:
            errors.append(f"line {line}: '{w}' may not carry forms")
        if w in IRREGULAR_VERBS and r["pos"] == "v" and not r["forms"]:
            errors.append(f"line {line}: irregular verb '{w}' missing forms")
        if not r["english"]:
            errors.append(f"line {line}: '{w}' missing gloss")
        if not r["sources"]:
            errors.append(f"line {line}: '{w}' missing sources")
        elif is_derived(r):
            for t in (t.strip() for t in r["sources"].split(" + ")):
                if t.startswith("-") or t.endswith("-"):
                    continue  # affix
                if t not in headwords:
                    errors.append(f"line {line}: '{w}' derives from unknown headword '{t}'")

    by_gloss = {}
    for r in rows:
        by_gloss.setdefault(r["english"], []).append(r)
    for gloss, rs in by_gloss.items():
        if len(rs) > 1 and sorted(x["register"] for x in rs) != ["everyday", "high"]:
            words = ", ".join(x["word"] for x in rs)
            warnings.append(f"duplicate gloss '{gloss}' without register doublet: {words}")
    return errors, warnings


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd not in {"check", "build"}:
        print("usage: lexicon.py check|build")
        sys.exit(2)
    rows = load()
    errors, warnings = check(rows)
    for msg in warnings:
        print(f"WARN: {msg}")
    for msg in errors:
        print(f"ERROR: {msg}")
    print(f"{len(rows)} rows, {len(errors)} errors, {len(warnings)} warnings")
    if errors:
        sys.exit(1)
    if cmd == "build":
        MD_PATH.write_text(build(rows), encoding="utf-8")
        print(f"wrote {MD_PATH.name}")


if __name__ == "__main__":
    main()
```

(`build()` arrives in Task 2; the `cmd == "build"` branch will raise `NameError` until then, which is fine — nothing calls it yet.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: all CheckTests PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/lexicon.py tests/test_lexicon.py
git commit -m "feat: lexicon checker with 9-rule lint (TDD)"
```

---

### Task 2: `build` subcommand (TDD)

**Files:**
- Modify: `tools/lexicon.py` (add `build()`)
- Test: `tests/test_lexicon.py` (add BuildTests)

**Interfaces:**
- Produces: `lexicon.build(rows) -> str` (full LEXICON.md content); CLI `python3 tools/lexicon.py build` writes `LEXICON.md`.

- [ ] **Step 1: Add failing BuildTests to `tests/test_lexicon.py`**

```python
class BuildTests(unittest.TestCase):
    def rows(self):
        return [
            row(word="vatter", pos="n", gender="c", english="water",
                domain="world-nature", sources="EN water + NL water + SV vatten"),
            row(word="fri", pos="adj", english="free", domain="qualities",
                sources="EN free + SV fri", line=3),
            row(word="frihed", pos="n", gender="c", english="freedom",
                domain="law-civic", sources="fri + -hed", line=4),
        ]

    def test_build_structure(self):
        out = lexicon.build(self.rows())
        self.assertIn("# LEXICON", out)
        self.assertIn("## world-nature", out)
        self.assertIn("## Alphabetical index", out)
        self.assertIn("| **frihed** | n (c) | freedom |  | fri + -hed |", out)
        self.assertIn("**3 words** — 2 roots, 1 derived.", out)

    def test_build_deterministic(self):
        self.assertEqual(lexicon.build(self.rows()), lexicon.build(self.rows()))

    def test_empty_domains_omitted(self):
        self.assertNotIn("## sea-ships", lexicon.build(self.rows()))
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: BuildTests FAIL with `AttributeError: module 'lexicon' has no attribute 'build'`

- [ ] **Step 3: Implement `build()` in `tools/lexicon.py`**

```python
def build(rows):
    by_domain = {d: [] for d in DOMAINS}
    for r in rows:
        by_domain[r["domain"]].append(r)
    derived = sum(1 for r in rows if is_derived(r))
    total = len(rows)

    out = ["# LEXICON — Laphurdi–English", "",
           "*Generated from `LEXICON.tsv` by `tools/lexicon.py build` — do not edit by hand.*",
           "",
           f"**{total} words** — {total - derived} roots, {derived} derived.",
           "",
           "| domain | words |", "|---|---|"]
    for d in DOMAINS:
        if by_domain[d]:
            out.append(f"| {d} | {len(by_domain[d])} |")
    for d in DOMAINS:
        if not by_domain[d]:
            continue
        out += ["", f"## {d}", "",
                "| Laphurdi | pos | English | register | sources |",
                "|---|---|---|---|---|"]
        for r in sorted(by_domain[d], key=lambda r: r["word"].lower()):
            pos = r["pos"] + (f" ({r['gender']})" if r["gender"] else "")
            word = f"**{r['word']}**" + (f" ({r['forms']})" if r["forms"] else "")
            out.append(f"| {word} | {pos} | {r['english']} | {r['register']} | {r['sources']} |")
    out += ["", "## Alphabetical index", "",
            "| Laphurdi | English |", "|---|---|"]
    for r in sorted(rows, key=lambda r: r["word"].lower()):
        out.append(f"| {r['word']} | {r['english']} |")
    return "\n".join(out) + "\n"
```

- [ ] **Step 4: Run tests to verify all pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/lexicon.py tests/test_lexicon.py
git commit -m "feat: deterministic LEXICON.md generator"
```

---

### Task 3: Seed `LEXICON.tsv` with all attested v1 words

**Files:**
- Create: `LEXICON.tsv`
- Create: `LEXICON.md` (generated)

**Interfaces:**
- Consumes: `python3 tools/lexicon.py check|build`
- Produces: a TSV whose headwords are a superset of every word in `LAPHURDI.md` §§3–7 (base forms).

- [ ] **Step 1: Write the seed TSV**

Transcribe every attested v1 word (~135 rows counting support words). Conventions: headwords are base forms (*grundloj* not *Grundlojen*, *senat* not *Senaten*, *folkskamer*, *ledminister*); definite/inflected attested forms go in `notes`. Proper nouns take gender `c` by convention. The complete seed word list (word/pos/gender/domain — glosses and sources filled at transcription):

- **function-words:** og conj, el conj, nit adv, in prep, on prep, med prep, for prep, av prep, te prep, fra prep, waar adv, wat pron, wie pron, wen adv, hoe adv, warfor adv, ja interj, nej interj, ik pron, du pron, han pron, hon pron, hen pron, vi pron, ju pron, dei pron, ingen pron, befor prep, et det, dis det, dat det
- **numbers-measure:** en num (one; also common article — note), twe, tri, fyr, fem, seks, sju, akt, nien, tien, hundra, tusen (all num); ferste, andre, tridde, fyrde, femte, sekste, sjunde, akte, niende, tiende (num, ordinals per spec §1.3)
- **time-calendar:** dag n c, natt n c, morgen n c, idag adv
- **world-nature:** vatter n c, zee n c, iland n n(neuter), sol n c, maan n c, himmel n c, berg n c, strand n c, regn n n, grund n c, Laphurdeen n c (proper; note etymology §7), Lapentieur n c, Darcambria n c, stad n c
- **people-family:** folk n n, kvin n c, man n c, kind n n, vrend n c, famille n c (high? — keep neutral, note French loan/final stress), Laphurdeener n c (sources `Laphurdeen + -er`)
- **body-health:** helsa n c
- **food-drink:** eta v, drika v
- **house-home:** hus n n, kamer n c
- **work-trade:** werka v, bygga v, skatt n c, krona n c (forms `pl=kronur`), leda v
- **communication:** spreka v, Laphurdi n c (the language), hallej interj, dank n c (register high — v1: "Dank du" formal), mersi interj (register everyday), asjeblie interj, adjuu interj, velkom interj
- **mind-emotion:** veta v (forms `pres=vet, past=viste, perf=vetat`), lieva v
- **law-civic:** grundloj n c (sources `grund + loj`), loj n c, rekt n c, frihed n c (sources `fri + -hed`), velvard n c, konsens n c, stemma v (sources `stem + -a`), stem n c, senat n c, folkskamer n c (sources `folk + kamer`, note linking -s in Folkskameren), ministerie n n, minister n c, ledminister n c (sources `leda + minister`), helsaministerie n n (sources `helsa + ministerie`), nasjon n c, skol n c → school-knowledge, universitet n n → school-knowledge
- **arts-leisure:** sang n c (register everyday — doublet with *sjanson* arrives in Task 9)
- **common-verbs:** leva v, hjelpa v, and the 16 irregulars with forms — vera `pres=er, past=var, perf=vart`; hava `pres=har, past=hadde, perf=havt`; gaa `pres=gaar, past=gik, perf=gaat`; staa `pres=staar, past=stod, perf=stat`; komma `pres=kommar, past=kom, perf=kommat`; se `pres=ser, past=saag, perf=seet`; doa `pres=doar, past=dede, perf=doat`; ta `pres=tar, past=tok, perf=tat`; geva `pres=gevar, past=gav, perf=gevat`; faa `pres=faar, past=fik, perf=faat`; seja `pres=sejar, past=sa, perf=sejt`; kunna `pres=kan, past=kunde, perf=kunnat`; vilja `pres=vil, past=vilde, perf=vilt`; skola `pres=skal, past=skulle`; moste `pres=moste, past=moste` (veta sits in mind-emotion)
- **qualities:** goed adj, stor adj, liten adj, fri adj, blij adj, bela adj, ny adj, gammel adj, mange det, Fransk adj, Engelsk adj, Svensk adj, Hollandsk adj

- [ ] **Step 2: Run check until clean**

Run: `python3 tools/lexicon.py check`
Expected: `… rows, 0 errors, 0 warnings` (fix any transcription slips it reports).

- [ ] **Step 3: Generate LEXICON.md**

Run: `python3 tools/lexicon.py build`
Expected: `wrote LEXICON.md`

- [ ] **Step 4: Verify fidelity — every §4–6 word present, spelled identically**

Spot-check against `LAPHURDI.md` §4 tables (vatter, zee, iland… krona) and §6 phrases; confirm no respellings.

- [ ] **Step 5: Commit**

```bash
git add LEXICON.tsv LEXICON.md
git commit -m "feat: seed lexicon with all attested v1 words (~135 entries)"
```

---

### Tasks 4–9: Coin the domains (six batches)

Common procedure for every batch task:

- [ ] **Step 1:** Append rows for the batch's domains, coining per the spec's rulebook (§1.1–1.2): Germanic blends for everyday words, French adaptations for high-register domains, derivations (`X + -suffix`) wherever a family exists — every derivation's root must be in the TSV (add the root if missing; it counts toward the domain).
- [ ] **Step 2:** Run `python3 tools/lexicon.py check` → 0 errors (warnings resolved or justified).
- [ ] **Step 3:** Run `python3 tools/lexicon.py build`.
- [ ] **Step 4:** Commit `LEXICON.tsv LEXICON.md` with message `feat: lexicon batch <letter> — <domains> (<n> words)`.

Register doublets (identical gloss string; one row `everyday`, one `high`) are assigned to specific batches below; the full doublet quota is **≥36 pairs** across Tasks 4–9. Canonical pair list (spellings adjustable under the rulebook at coining time; glosses must match within each pair):

helpa/assistera *help* · beginna/kommensera *begin* · enda/terminera *end* · fraga/demandera *ask* · svara/respondera *answer* · stemma/votera *vote* · tenka/reflektera *think* · visa/demonstrera *show* · bruka/utilisera *use* · velja/selektera *choose* · tilata/permitera *allow* · forbida/proibera *forbid* · lera/instruera *teach* · betala/kompensera *pay* · selja/vendera *sell* · gifta/mariera *marry* · sterva/desedera *die* · treffa/renkontrera *meet* · werk/travalje *work (n.)* · hus/residens *house* · rum/sjamber *room* · gata/rue *street* · tal/diskur *speech* · sang/sjanson *song* · skip/vesel *ship* · drikk/beverasje *drink (n.)* · kokare/sjef *cook (n.)* · lekare/medesin *doctor* · sjuk/malad *sick* · brott/delikt *crime* · straff/punisjon *punishment* · handel/komers *trade (n.)* · fatig/pover *poor* · rik/opulent *rich* · blijhed/felisitet *happiness* · hjelp/asistans *help (n.)* · svar/respons *answer (n.)* · mote/konferens *meeting* · dank/mersi *thanks* (already seeded)

### Task 4: Batch A — function-words, numbers-measure, time-calendar (~120 new)

**Concept checklist:**
- *function-words (to ~45):* possessives min, din, hans, hons, hens, vaar, jer, deis; demonstrative plurals; hier, der, nu, dan, alltid, aldri, ofta, snart, igen, kanske; men (but), om (if/whether), so, als/dan (than), fordat (because), alle, somme, faa-det? use *fa* (few), anner (other), samme, ok (also), bara (only), mer, mest, minder, minst, self, tosammen
- *numbers-measure (to ~35):* elva…tjue? — teens and tens (11–19, 20, 30…90), null, million, half, kwart, par, dusin, meter, kilometer, gram, kilo, liter, grad, prosent, nummer, mal (time/occurrence)
- *time-calendar (to ~45):* tid, ur/klok, minut, sekund, uur (hour), vek (week), maned? — month (avoid clash with maan: *manad*), jaar, sekel; weekdays (Germanic blends: mandag, tisdag, onsdag, torsdag, fredag, lordag, sundag); months (international: januar…desember); seasons (vaar? clash with possessive *vaar* — coin carefully, e.g. *printemp* high/*spring* blend, sommer, host, vinter); morgen (seeded), aften, kveld/avond, middag, igaar, imorgen, aldri/nu covered in function-words

### Task 5: Batch B — world-nature, plants-animals, sea-ships (~150 new)

**Concept checklist:**
- *world-nature (to ~60):* sten, sand, jord, stov (dust), sky/wolk (cloud), mist (fog — Darcambria's!), vind, sne, is, rok (smoke), fyr/eld (fire), aske, flod (river), insjo/lak (lake), salt, skog (forest), tre, blad, rot, blomma, gras, frukt-seed side: fro (seed), bark, veg (road), star (stjerna?), varld/werld (world), land, nord, syd, ost, west, kust, dal, klippa, o? use *holm* (islet), vulkan, jordskjelv? (earthquake — compound jord+skjelv), veder (weather), storm, torden (thunder), blixt (lightning), regnboge (rainbow — compound)
- *plants-animals (to ~50):* dier (animal), fisk, fugel (bird), hund, katt, hest, ko, svin, faar (sheep), get (goat), hona/kikken (chicken), and (duck), mus, ratt, orm (snake), wurm, insekt, bij (bee — NL!), flieg (fly), spin (spider), fjaril? (butterfly — coin blend), krab, val (whale), sel (seal), mak/meeuw (gull — coin *moev*?), egg, horn, stert (tail), feder (feather), vinge (wing), pels (fur), planta, ek (oak), gran (spruce), ros, tulp (tulip — NL heritage!), alg (seaweed)
- *sea-ships (to ~40):* skip (ship — doublet w/ vesel), boot, segel, mast, anker (the national object!), hamn (harbour), kaj (quay), dok, fjard (the bay of §7!), bukt, vaag (wave), tide/tij, eb, flud, storm→world-nature, fyrtorn (lighthouse — compound fyr+torn), fiskare (fisherman — fiska + -are), fiskeri, net, krok (hook), rodd/roeia (row), seila (sail v — segel + -a), styra (steer), kapten, matros, kompas, kart (chart/map), navigasjon high, flotta (fleet), ferje (ferry), last (cargo), varf (shipyard)

### Task 6: Batch C — body-health, people-family, house-home, clothing (~165 new)

**Concept checklist:**
- *body-health (to ~50):* kropp, hed? (head — *hoved*), oga (eye — *oog*? NL oog = ⟨oo⟩ illegal? no — oo not a defined digraph; prefer *og*? collision! coin *oje*), ore (ear), nese, mund, tand, tunga, haar, hand, arm, been (leg), knie, fot, finger, nagel, hals, rugg (back), bryst, hjerta, blod, ben (bone — distinguish from been), hud (skin), mage (belly), lever, lunga, sjel? → mind-emotion, sjuk/malad doublet, lekare/medesin doublet, sjukhus (hospital — compound), medisin (medicine), pil (pill), sund (healthy — helsa family: *helsig*?), trott (tired), sova (sleep), drom (dream) → mind-emotion?, vaska (wash), bad, tvool? (soap — *sep*), smerta (pain), feber, hosta (cough), doda (kill — *sterva* family caution: use *dreppa*?), foda (be born/bear), leva seeded
- *people-family (to ~45):* moder, fader, soon (son — *son*), dotter, broder, syster, bebis/barn? (baby — *bebe* FR everyday!), morfar-style compounds? keep simple: bestemor, bestefar, tante, onkel, kusin, neve, nabo (neighbour), gest (guest), vard (host), man/kvin seeded, make/maka? (spouse — *ektemake*? simpler: *spuus* NL echtgenoot/spouse blend), brud, brudgom, weduwe (widow — *vedve*), enkeling? skip, persoon (person), mennisk (human), ungdom (youth), volwassen? (adult — *vuksen*), alder (age), navn (name), gifta/mariera doublet, bryllop (wedding), familje-terms via famille seeded
- *house-home (to ~50):* rum/sjamber doublet, dor, fenster, vegg, tak (roof), golv (floor), trappa, kok (kitchen), badrum (compound), sovrum (compound), seng (bed), stol, bord (table), skap (cupboard), lampa, ljus/lys (light), spegel, matta (rug), gardin, nokel (key), laas (lock), garde/tuin (garden — *tuun* NL oe? tuin→*tuin* has ui — illegal digraph? letters fine, sound unclear; prefer *gard*), gaard (yard/farm), heim/hem (home), adres, hyra (rent v), bo (dwell? — must end -a: *boa*? awkward; use *vona* NL wonen → *woona*? coin *bygga*-adjacent *husera*? simplest: *vana*? decide at coining under rulebook; fallback compound *hemleva*), mobel (furniture), ugn (oven), kylskap? (fridge — *isskap* compound is+skap), tvatta? (launder = vaska), soppel (garbage), stadshus (city hall — compound, civic crossover)
- *clothing (to ~25):* kleder (clothes), rok/kjol (skirt), broek (trousers — NL broek ⟨oe⟩ ✓), hemd (shirt), jakk (jacket), kappa (coat), hatt, mossa? (cap — *muts* NL → *muts*), sko (shoe — *skoe*), stovel (boot), sok (sock), handske (glove — compound hand+ske? treat as root), skerf (scarf), belt, knap (button), ficka/zak (pocket — *sak* collision risk with sak thing → *fikk*), ull (wool), silke, bomull (cotton), leder (leather), mode (fashion, high), sy (sew — *sya*), sticka (knit), vestiment high? optional

### Task 7: Batch D — food-drink, common-verbs, motion-travel (~170 new)

**Concept checklist:**
- *food-drink (to ~65):* mat (food), brod (bread), smor (butter), ost (cheese), melk, kott (meat — *kjot*? keep *kot*? coin *vlees*-blend *flesk*? careful: flesk=pork in SV; decide at coining), boef (beef — FR bœuf, pairs with ko), pork (FR porc, pairs with svin), moeton (FR mouton, pairs with faar), kylling (chicken meat — *poulet* → *pule*? risky; use *kip* NL everyday), fisk-as-food (same word), egg seeded via plants-animals, ris, pasta, soppa, salat, gronsak (vegetable — compound gron+sak), potet, tomat, lok (onion), morot? (carrot — *karot* FR ✓), apel (apple), paron? (pear — *per*), banan, sitron, druva (grape), ber (berry), notter (nut — *not*), sukker, salt seeded, peppar, krydda (spice), honing, sylt (jam), kaka (cake), keks (biscuit), sjokolad, kafe (coffee — everyday! attested pattern mersi), te-clash! tea vs *te* (to) — coin *tee*, ol (beer — *bier* NL ✓), vin, most? (juice — *sap* NL ✓), vatter seeded, kokka (cook v — *koka*), baka, steka (fry), grilla, restaurang (high — *restoran*), meny (high — *menu* → *meny*), kwizin (cuisine, high), dinera/eta doublet, drikk/beverasje doublet, frukost (breakfast), lunsj, middag-dinner (crossover: middag = noon in time — gloss "midday meal"? coin *diner* high/*kveldsmat*), hunger, torst (thirst), smak (taste), sot (sweet), sur (sour), bitter, fersk (fresh)
- *common-verbs (to ~60):* opna, stenga (close), bera (carry), kasta (throw), fanga (catch), halda (hold), dra (pull — must end -a ✓ but vowel-final… *draga*), skjuta? (push — *pusja*), lyfta, legga (lay), setta (set/put), sitta (sit — regular! sittar/sittade), liggen? (lie — *ligga*), falla, venda (turn), springa (run), hoppa (jump), krypa (crawl), klimma (climb), simma (swim), flyga (fly), vandra (walk — or *lopa*), folja (follow — *folga*), leta (search), finna (find), tapa (lose), bringa (bring), senda, motta (receive = faa? "receive formally" — *resevera*? skip), gomma (hide), breka (break), laga (repair/fix), skera (cut), riva (tear), boja (bend), binda (tie), sy→clothing, vaska→body, torka (dry v), fylla (fill), tomma (empty v), stiga (rise), sjunka (sink), vexla (change/exchange), prova (try), lykkas? (succeed — *sukcedera* high only? keep *lyckas*→*lukka*?), decide at coining; slaa? (hit — *slaga*), sparka (kick), kramma (squeeze/hug), gnida (rub), grava (dig), branna (burn), frysa (freeze), flyta (float), rinna (flow)
- *motion-travel (to ~45):* resa (travel v+n), rejse? unify *resa*, tur (trip), veg seeded (road), sti (path), bro (bridge), tunel, gata/rue doublet, plats/plas (square/place), bil (car), buss, tag (train — *taag*? clash *ta*? use *tren* FR/EN!), sykel (bicycle), moped? skip, flygplan (airplane — compound flyga+plan), flygplats (airport), stasjon, hamn→sea, billet (ticket — *biljet*), pas (passport), koffert (suitcase), karta→sea kart, retning (direction), venstra (left), hogra (right — *rekt* clash! coin *hoger*), rak (straight), nara (near), fjern (far), snabb (fast), langsam (slow), ankomma (arrive — *komma* family: an+komma? use *arivera* high + *ankomma*), avresa (depart), kora (drive — *driva*? false friend; *kjora*→*kora*), rida (ride), parkera, gaa seeded

### Task 8: Batch E — qualities, mind-emotion, communication (~145 new)

**Concept checklist:**
- *qualities (to ~60):* colours rod, blaa, groen, gul, vit, svart, bruun, oranj, rosa, grå→*graa*, purpur; lang, kort, bred, smal, tjok (thick), tunn, tung (heavy), lett (light/easy), hard, mjuk (soft), varm, kald, het (hot), kool (cool — *koel* NL ⟨oe⟩ ✓), full, tom, ren (clean), smutsig (dirty — *smutsig*), vaat (wet), torr (dry), skarp, slo (dull — *sloo*?), slett (smooth), rund, hjornig? (square — *kwadrat*?), djup (deep), grunn (shallow — grund clash! *grund* is seeded as foundation; coin *flak*), hog (high — *hoog*? define *hoge*?), laag (low ✓ aa), stark, svag (weak), rett (correct — rekt clash → *korrekt* high + *rett*), fel (wrong), lik (similar), olik (o- + lik!), viktig (important), enkel (simple), svaar (difficult — *svaar* ✓ aa), klar, mork (dark), farlig (dangerous), seker (safe/sure), rik/opulent doublet, fatig/pover doublet, vakker? covered by bela; goed/beter/best? — comparative irregularity! decide: goed, beter, best as suppletive noted in notes (like EN); dalig/verre? keep *slekt* (bad — *slecht* NL → *slekt*)… clash with family-slekt? not seeded — fine
- *mind-emotion (to ~50):* sjel (soul), sinn (mind), tanka (thought — tenka + n? *tanke*), tenka/reflektera doublet, tro (believe — *troa*), tvivla (doubt), minna (remember), glomma (forget), forsta (understand — *forstaa*! staa-compound: forms follow staa? NO — keep regular *begripa* to avoid irregular contagion; or allow *forstaa* with note "conjugates like staa"; decide: *begripa*), lera→school doublet, hopp (hope), hoppa-clash! (jump) → hope v = *hopa*? collision hoppa/hopa OK distinct; redd (afraid — *redd*), frykt (fear n), modig (brave), sorg (sorrow), grata (weep — *graata*), lacha (laugh — *lakka*? *skratta*? NL lachen → *lakka*), smila (smile), sint (angry — *arg*), glad→blij seeded; blijhed/felisitet doublet (blij + -hed), kerlik? (love n — *liev* from lieva), lieva seeded, hata (hate), onska (wish — *venska*? clash vrendskap? coin *wensa* NL wensen ✓), vilja seeded, drom (dream), sova (sleep)→body? place here if not in C — ensure exactly one row; stolt (proud), skamm (shame), lykka (luck — *lukk*), karakter, personlikhed? (-hed family: *personlighed*→*personlijhed*? simplify *karakter* covers), klok (wise), dum (stupid), gal (crazy), nyfiken? (curious — *kurios* high + *nysgirig*? pick *kurios* only), interessant, kedelig? (boring — *trakig*? coin *langvilig*)
- *communication (to ~35):* ord (word), sprak (language — *spraket* attested in doc title! headword *sprak*), setning (sentence), bokstav (letter/char), skriva (write), lesa (read), bok, papper, penn, brev (letter), post, tidning (newspaper — compound tid+ning? treat root), nyhed (news — ny + -hed!), fraga/demandera doublet, svara/respondera doublet, tal/diskur doublet, ropa (call/shout), viska (whisper), lyssna (listen), hora (hear), telefon, radio, meddelande? (message — *besjed*? *messasj* FR ✓ high? everyday *bud*), navn→people? place once (people-family), betyda (mean v), forklara (explain — high *eksplikera* doublet? bonus), oversetta (translate — compound over+setta ✓!), prata? redundant w/ spreka — skip, tystnad (silence — *stillhed* = still + -hed!), sant (true), falsk (false), historie (story/history → school-knowledge? keep *saga* story here, *historie* school)

### Task 9: Batch F — work-trade, law-civic, school-knowledge, arts-leisure (~160 new)

**Concept checklist:**
- *work-trade (to ~45):* werk n (everyday; travalje high doublet), werkare (werka + -are), jobb? redundant — skip, yrke? (profession — *profesjon* high), arbeidsgiver? compounds: werkgever (employer — werk+gever? gever = geva+-are? use *werkherre*? decide simply: *werkgevare*), lon (wage — *loon*), betala/kompensera doublet, kopa (buy), selja/vendera doublet, pris, kost (cost), peng (money), bank, marknad (market — *markt* NL ✓), butik (shop), handel/komers doublet, handlare (handel + -are? handel is n; *handla* v + -are), eksport/import (high), skatt seeded, rekning (bill — *rekning*), kvitto? (receipt — *kwittens*), kontrakt (high), firma, fabrik, industri (high), bonde (farmer), jordbruk (agriculture — compound jord+bruk), verktyg? (tool — *werktyg* compound werk+tyg? treat root *tyg*? simpler root *tool*→*tuul*? decide at coining), maskin, bakeri (baka + -eri per spec §1.1!), fiskeri→sea seeded?, ensure single row; smed (smith), snickare? (carpenter — *timmerman* NL compound), rikdom? (wealth — rik + -dom? -dom not a rule suffix! use *rikhed*, rik + -hed ✓)
- *law-civic (to ~55):* domstol (court — compound dom+stol!), dom (judgment), domare (dom→*doma* v? cleaner: *doma* judge-v + -are), advokat (high), politi (police), brott/delikt doublet, straff/punisjon doublet, fengsel (prison), vitne (witness), bevis (proof), skyldig (guilty), oskyldig (o- + skyldig!), regering? — Senate governs: *rad* (council — *raad* ✓ aa), borgare (citizen — *borger*), medborger? redundant, val (election — clash w/ val whale! coin *valg*), kandidat (high), parti, debatt, majoritet/minoritet (high, -tet per spec §1.2), president? N/A — Speaker: *talman* (compound tal+man!), konvenor? keep FR *konvener*? skip (title in constitution is English), grens (border), pas→motion seeded once, flagg (flag), stat (state), provins, kommun? (municipality — *komyn* high), byraakrati? skip, tilata/permitera doublet, forbida/proibera doublet, plikt (duty), ansvar (responsibility), avtal (agreement/treaty), fred (peace), krig (war), arme (high), soldat (high), forsvar (defence), sikkerhed (security — sikker + -hed; add *sikker* to qualities? it's seeded there as seker — unify: use *sekerhed*), frihed seeded, jamlikhed? (equality — *eqalitet* high FR égalité → *ekalitet*? decide; also everyday *liknhed*? simplest: *egalitet*), rettvisa (justice — *justis* high + everyday *rettvis*? decide pair), stemma/votera doublet (stemma seeded — add votera)
- *school-knowledge (to ~35):* skol seeded, universitet seeded, lera/instruera doublet, lerare (lera + -are), student, elev (high), klass, kurs, leksjon (high, -sjon), eksamen (high), prov (test), kunskap (knowledge — *vetskap*? veta + -skap ✓!), vitenskap? unify: *vetskap* knowledge + *vetenskap* science? coin science = *sciens* high? prefer *vetskap* (knowledge) + *siens* (science, high FR), historie (history), geografi, matematik, fysik, kemi, biologi (all high/international), filosofi (high), idee (idea — *ide*), teori (high), fakta? (fact — *faktum* high? everyday *sakhed*? just *fakt*), sanning (truth — *santhed* = sant + -hed ✓), bibliotek (high), laboratorie? (high — *laboratorium*→*laboratorie* like ministerie ✓), professor (high), forska (research v), forskare (forska + -are)
- *arts-leisure (to ~35):* sang/sjanson doublet (sang seeded, add sjanson high), singa (sing — *sjunga*? SV; NL zingen; EN sing → *singa* ✓), musik, melodi, instrument (high), piano, fiol, tromma (drum), dans, dansa, teater (high), skuespill? (play — *pjes* FR pièce → *pjes* high; everyday *spel*), spela (play v), spel (game), leka (play-as-child), sport, fotboll? (football — compound fot+boll; add *boll* ball), boll, malning (painting — *mala* paint v + -ning? -ning not a rule suffix — use *maling*: mala + -ing ✓), mala (paint v), malare (mala + -are), kunst (art — *konst*), kunstner? (artist — *konstare*? konst is n… *artist* high only), bild (picture), foto, film, dikt (poem), diktare (poet — dikt→*dikta* v + -are), roman (novel, high), fest (party), ferie (holiday, high), hobby? (— *tidfordriv*? compound; or skip)

---

### Task 10: Coverage validation — Swadesh-207 sweep

**Files:**
- Create (scratchpad only, not committed): `<scratchpad>/coverage.py`
- Modify: `LEXICON.tsv` (gap fills)

- [ ] **Step 1: Write the sweep script**

Embed the Swadesh-207 concept list (standard list: I, you, he, we, you-pl, they, this, that, here, there, who, what, where, when, how, not, all, many, some, few, other, one…five, big, long, wide, thick, heavy, small, short, narrow, thin, woman, man, person, child, wife, husband, mother, father, animal, fish, bird, dog, louse, snake, worm, tree, forest, stick, fruit, seed, leaf, root, bark, flower, grass, rope, skin, meat, blood, bone, fat, egg, horn, tail, feather, hair, head, ear, eye, nose, mouth, tooth, tongue, fingernail, foot, leg, knee, hand, wing, belly, guts, neck, back, breast, heart, liver, drink, eat, bite, suck, spit, vomit, blow, breathe, laugh, see, hear, know, think, smell, fear, sleep, live, die, kill, fight, hunt, hit, cut, split, stab, scratch, dig, swim, fly, walk, come, lie, sit, stand, turn, fall, give, hold, squeeze, rub, wash, wipe, pull, push, throw, tie, sew, count, say, sing, play, float, flow, freeze, swell, sun, moon, star, water, rain, river, lake, sea, salt, stone, sand, dust, earth, cloud, fog, sky, wind, snow, ice, smoke, fire, ash, burn, road, mountain, red, green, yellow, white, black, night, day, year, warm, cold, full, new, old, good, bad, rotten, dirty, straight, round, sharp, dull, smooth, wet, dry, correct, near, far, right, left, at, in, with, and, if, because, name). Script loads the TSV via `lexicon.load()`, lowercases glosses, and reports any concept whose word does not appear as a whole word in any gloss.

- [ ] **Step 2: Run, triage, fill gaps**

Run: `python3 <scratchpad>/coverage.py`
For each reported miss: either an existing word covers it under a different gloss wording (note and move on) or coin the missing word into its domain. Re-run until misses are all triaged. Typical expected gaps to coin: louse (*lus*), suck (*suga*), spit (*spotta*), vomit (*sputa*? coin), blow (*blaasa*), breathe (*anda*), smell (*lukta*), hunt (*jaga*), split (*klyva*), stab (*stikka*), scratch (*klora*), wipe (*torka* covers), count (*tella*), swell (*svella*), rotten (*rutten*), guts (*tarm*), neck (*hals* covers), fat n (*fett*), stick (*pinn*), rope (*rep*).

- [ ] **Step 3: Run check + build, verify ≥1,000 rows**

Run: `python3 tools/lexicon.py check && python3 tools/lexicon.py build && wc -l LEXICON.tsv`
Expected: 0 errors; ≥1001 lines (header + 1,000).

- [ ] **Step 4: Commit**

```bash
git add LEXICON.tsv LEXICON.md
git commit -m "feat: Swadesh-207 coverage sweep and gap fills — lexicon reaches 1,000"
```

---

### Task 11: Update LAPHURDI.md — word-building, grammar riders, pointers

**Files:**
- Modify: `LAPHURDI.md`

- [ ] **Step 1: Insert new §4 "Word-Building" (renumber later sections +1, or insert as §3.5 without renumbering — prefer inserting after §3 as "## 3b. Word-Building" to avoid breaking §7 references from other docs)**

Content: the §1.1 derivation table from the spec (including the -er inhabitant row), the French adaptation rules (§1.2), and a two-line pointer: "The full lexicon lives in `LEXICON.md` (generated from `LEXICON.tsv`); §4 below is the beginner core."

- [ ] **Step 2: Extend §3 grammar**

Add under Verbs: the 16-verb irregular table (same as spec §1.4) replacing the current "Irregular but essential: vera" line. Add subsections: Comparatives (*-er/-est*, *mer/mest* for French loans and long adjectives), Ordinals (*ferste…tiende*), Adverbs (zero-marked), Question words (*wat, wie, wen, hoe, warfor* + existing *waar*).

- [ ] **Step 3: Update §8 Open Questions**

Mark resolved with pointers: irregular verbs (#2 → "resolved: closed list of 16, see §3"), lexicon (#7 → "resolved: 1,000-word core in LEXICON.tsv/LEXICON.md"). Amend the registers question (#4): "register extent fixed in the lexicon (broad French high register + ~40 doublets); courtroom/menu usage conventions still open."

- [ ] **Step 4: Commit**

```bash
git add LAPHURDI.md
git commit -m "docs: word-building rules, 16 irregular verbs, grammar riders, lexicon pointers"
```

---

### Task 12: Final verification

- [ ] **Step 1: Full test suite**

Run: `python3 -m unittest discover -s tests -v` → all PASS.

- [ ] **Step 2: Check clean, build deterministic**

Run: `python3 tools/lexicon.py check` → 0 errors.
Run: `python3 tools/lexicon.py build && git diff --stat LEXICON.md` → no diff (build is byte-stable).

- [ ] **Step 3: Success criteria sweep (spec)**

- `wc -l LEXICON.tsv` ≥ 1001 ✓
- All v1 words present unchanged: spot-grep 10 originals (`vatter, zee, frihed, folkskamer, krona, hen, sju, mersi, nasjon, mange`).
- 16 irregulars carry forms: `grep -c "pres=" LEXICON.tsv` ≥ 16.
- Doublet count ≥ 36: count gloss-sharing everyday/high pairs (small scratch script or eyeball the build's register column).
- LAPHURDI.md rules match TSV derivations (eyeball the -hed/-are/-skap families).

- [ ] **Step 4: Commit any stragglers; report results**
