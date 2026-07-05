# Laphurdi Object Pronouns — Design

**Date:** 2026-07-05
**Status:** Approved in discussion
**Applies to:** `LAPHURDI.md` §3 (Pronouns), `LEXICON.tsv` / `LEXICON.md`

## Context

The first extended Laphurdi text (the citizen's letter, this session) exposed a gap: "she stimulates *me*" has no defined form. Laphurdi is a V2 language that celebrates fronting (*Idag stemmar vi*), and V2 without object pronouns makes fronted objects ambiguous (*Hon ser ik* — "she sees me" or "her, I see"?). This is exactly why all four source languages kept object pronouns after losing other case marking.

## Decisions

| Question | Decision |
|---|---|
| Paradigm | **Six new object forms** — *mij, dij, ham, henne, os, dem*; *hen* and *ju* invariant |
| Reflexive | **Include *sik*** (third person only; 1st/2nd person reflex with object forms) |
| Storage | Object pronouns enter `LEXICON.tsv` as **their own headwords** (pron, function-words) — no schema or checker changes |
| Possessives | Formally declared **invariant** across gender and number (*min sinn*, though *sinn* is neuter) |
| Fossil | The attested greeting **Dank du** predates the paradigm and survives unchanged (regular syntax: *dank dij*) |

## The paradigm

| | subject | object | possessive |
|---|---|---|---|
| I | ik | **mij** | min |
| you (sg.) | du | **dij** | din |
| he | han | **ham** | hans |
| she | hon | **henne** | hons |
| they (sg.) | hen | hen | hens |
| we | vi | **os** | vaar |
| you (pl.) | ju | ju | jer |
| they | dei | **dem** | deis |

Reflexive (3rd person only): **sik**.

Blend sources: *mij/dij* — NL spelling ⟨ij⟩ with the SV sound ("may"/"day", the *blij* pattern; SV *mig/dig* are pronounced "mey"/"dey"); *ham* — DA; *henne* — SV/DA; *os* — DA/NL; *dem* — SV/DA; *sik* — SV/DA *sig* + NL *zich*, hard ⟨k⟩ per the Reform. *hen* invariant mirrors real Swedish usage of *hen*; *ju* invariant mirrors English *you*.

Collision check performed against all 1,045 headwords: *mij, dij, ham, henne, os, dem, sik* are all free (*hamn*, *hem*, *hens*, *ost*, *oest*, *dei*, *der* remain distinct).

## Grammar rules (new LAPHURDI.md §3 text)

1. Object forms are used as verb objects **and after every preposition**: *med mij, te dij, for os* — never *med ik*.
2. Object fronting is fully grammatical and unambiguous: *Henne ser ik alle dager* — "Her I see every day."
3. *sik* only for third persons: *Han vaskar sik* (himself) vs. *Han vaskar ham* (someone else). First/second persons use their object forms: *Ik vaskar mij*.
4. Possessives never inflect: *min sinn, min hus, min vrender*.
5. *Dank du* is a fossilized greeting from before the paradigm — Laphurdeen's "methinks."

## File changes

1. **`LEXICON.tsv`**: +7 rows (mij, dij, ham, henne, os, dem, sik) — pos `pron`, domain `function-words`, root citations; regenerate `LEXICON.md`.
2. **`LAPHURDI.md`** §3 Pronouns: replace the current two-paragraph section with the full three-column table, the *mij/dij* pronunciation note, and rules 1–5 (keeping the existing *hen* constitutional note).

## Out of scope

- Possessive gender/number agreement (declared invariant instead).
- T-V politeness distinction (none — fits the egalitarian constitution).
- Darcambrian dialect pronoun habits.

## Success criteria

- `tools/lexicon.py check` passes with 0 errors; `LEXICON.md` regenerated.
- All 7 forms present in the lexicon; paradigm table in LAPHURDI.md matches this spec exactly.
- Existing tests still pass unchanged.
