# Laphurdi Lexicon Expansion — Design

**Date:** 2026-07-05
**Status:** Approved in discussion; pending spec review
**Applies to:** new `LEXICON.tsv`, new `tools/lexicon.py`, generated `LEXICON.md`, `LAPHURDI.md`

## Context

`LAPHURDI.md` v1 defines ~90 words and names the goal (§8): "grow the vocabulary from ~90 words toward a usable core of 1,000." This spec designs that expansion. It also resolves two open questions the expansion forces: the closed list of irregular verbs (§8.2) and the extent of the French high register (§8.4, partially — register *in the lexicon*; courtroom/menu *usage conventions* remain open).

## Decisions

| Question | Decision |
|---|---|
| Target size | **Full 1,000-word core in this expansion** |
| Storage | **`LEXICON.tsv` as source of truth** + `tools/lexicon.py` (check/build) + generated `LEXICON.md` |
| French register | **Broad**: law, courts, government, cuisine/menus, academia, fine arts, diplomacy, fashion, finance, medicine-as-profession — plus **~40 everyday/high doublets** (cow/beef pattern) |
| Irregular verbs | **Closed list of 16** (table below — 10 by design, 6 forced by v1 canon); everything else regular forever |
| Method | **Morphology-first hybrid**: codify derivation rulebook → coin ~600 roots by domain → derive ~400 by rule → validate coverage against Swadesh-207 + the plan's per-domain concept checklists |

## 1. Word-Building Rulebook

This becomes a new "Word-Building" section in `LAPHURDI.md` and governs every lexicon entry. Rules are extracted from patterns already present in the v1 vocabulary (anchors cited).

### 1.1 Derivational morphology

| Rule | Affix | Anchor | Examples |
|---|---|---|---|
| adjective → abstract noun (common gender) | -hed | *frihed* | *blijhed* happiness, *storhed* greatness |
| noun → relationship/state noun (common) | -skap | — (SV vänskap / NL vriendschap) | *vrendskap* friendship, *ledarskap* leadership |
| verb → agent noun (common, gender-neutral) | -are | — (SV lärare) | *werkare* worker, *byggare* builder |
| verb → action noun (common) | -ing | — (NL/EN) | *bygging* construction, *stemming* voting |
| place of craft or trade (neuter) | -eri | — | *bakeri* bakery, *fiskeri* fishery |
| noun → adjective | -ig | — (SV/NL) | *regnig* rainy, *solig* sunny |
| nationality/language adjective | -sk | *Fransk* | *Engelsk*, *Svensk*, *Hollandsk* |
| learned adjective | -isk | — | *politisk*, *historisk* |
| negation prefix | o- | — (SV o-) | *ofri* unfree, *oblij* unhappy |
| noun/adjective → verb | -a | *stemma* ← *stem* | *fiska* to fish, *regna* to rain |
| diminutive (affective, neuter) | -je | — (NL) | *husje* little house, *kindje* little one |
| inhabitant noun | -er | *Laphurdeener* (attested in v1 §5) | *Darcambrier* Darcambrian |
| compounding | head-final; optional linking -s-, fixed per word | *Folkskameren*, *Helsaministeriet* | *zeevind* sea-wind, *stadshus* city hall |

### 1.2 French-loan adaptation (First Spelling Reform, systematized)

- *-tion* → **-sjon** (anchor: *nasjon*); common gender.
- *-té* → **-tet** (anchor: *universitet*); common gender.
- French verbs → **-era**, conjugating regularly (*assistera, diskutera, organisera*); stress on the *-er-* syllable, consistent with French-heritage late stress.
- *-el(le)* → **-ell** (*formell, kulturell*); *-iste* → **-ist**; *-isme* → **-isme**.
- Spelling: ç→s, é/è/ê→e, ch(/ʃ/)→sj, qu→kw, no accents ever, ⟨k⟩ for hard /k/.
- French loans keep late stress (per `LAPHURDI.md` §2); all other words stress the first syllable.

### 1.3 Grammar riders (additions to `LAPHURDI.md` §3)

- **Comparatives:** *-er / -est* (*storer, storest*). Chosen over Swedish *-are/-ast* because *-are* already forms agent nouns. Long adjectives and French loans use *mer / mest* (*mer formell, mest formell*).
- **Ordinals:** *ferste, andre, tridde, fyrde, femte, sekste, sjunde, akte, niende, tiende*.
- **Adverbs:** zero-marked — adjectives serve as adverbs unchanged (Dutch-style; pidgin-friendly).
- **Question words:** *wat* what, *wie* who, *wen* when, *hoe* how, *warfor* why — completing existing *waar* where.
- **Regular verb shape:** every regular verb's infinitive ends in unstressed *-a* and takes *-ar / -ade / har -at*. Vowel-final infinitives occur only in the irregular list.

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
irregular *vet/viste*. *vera*'s *er/var* are unchanged from v1; *har vart* is
newly fixed here. Irregular pasts reuse native conventions (⟨aa⟩ in *saag*).
This list is constitutionally closed: new non-modal verbs are always regular.

## 2. Data Model

### 2.1 `LEXICON.tsv`

Tab-separated, one row per word, header row required. TSV chosen because no field will ever contain a tab — no quoting or escaping, and every diff line is one word's change.

| Column | Content | Rules |
|---|---|---|
| `word` | Laphurdi headword | unique; lowercase except proper nouns; letters a–z only |
| `pos` | part of speech | one of: n, v, adj, adv, prep, conj, pron, num, det, interj |
| `gender` | c or n | required for nouns, empty otherwise |
| `forms` | irregular forms | only for the 16 irregular verbs (`pres=…, past=…, perf=…`) and *krona* (`pl=kronur`); empty otherwise |
| `english` | gloss | required |
| `domain` | semantic domain | one of the 20 controlled domains (§3) |
| `register` | everyday / high | empty = neutral |
| `sources` | blend recipe or derivation | derivations use `X + -suffix`, `o- + X`, or `X + Y` (compound), where X/Y are Laphurdi headwords; roots cite language-tagged natural sources, e.g. `NL water + SV vatten + EN water` — a term is a root citation iff it starts with a language tag (EN/NL/SV/FR/DA) |
| `notes` | etymology stories, usage | optional |

Doublets need no special mechanism: two rows share a gloss with `register=everyday` on one and `register=high` on the other.

### 2.2 `tools/lexicon.py`

Python 3, stdlib only. Two subcommands:

**`check`** — exits nonzero on any error:
1. Header and column count correct on every row.
2. `word` values unique.
3. Character set: letters only, no accents (proper nouns may capitalize).
4. `pos`, `domain`, `register` values from the controlled lists.
5. Nouns have `gender`; non-nouns have it empty.
6. Verb infinitives end in *-a*, or the word is on the closed irregular list.
7. `forms` populated only for the 16 irregulars and *krona*.
8. Derivation integrity: when `sources` contains terms without language tags (`X + -suffix`, `o- + X`, or compound `X + Y`), the referenced headwords must exist (no *byggare* without *bygga*).
9. Duplicate glosses flagged as warnings unless they form an everyday/high register pair.

**`build`** — regenerates `LEXICON.md` deterministically (stable ordering: domains in the §3 order, words alphabetical within domain):
- Stats header: total words, roots vs. derived, per-domain counts.
- One table per domain (word, pos, english, register, sources).
- Alphabetical Laphurdi→English index.

## 3. Domain Plan

~600 roots + ~400 derived ≈ 1,000 words. Targets are ±10% guides, not quotas. Domain slugs are the controlled `domain` values.

| # | Domain slug | ≈ words | Flavour |
|---|---|---|---|
| 1 | world-nature | 60 | weather, landscape, sky; Germanic core |
| 2 | plants-animals | 50 | farm animals set up food doublets |
| 3 | body-health | 50 | body Germanic; medicine-as-profession high |
| 4 | people-family | 45 | |
| 5 | food-drink | 65 | French menu register; *ko/boef, svin/pork, faar/moeton* doublets |
| 6 | house-home | 50 | |
| 7 | clothing | 25 | fashion terms high |
| 8 | time-calendar | 45 | weekday and month names decided here |
| 9 | numbers-measure | 35 | 11–99, ordinals, units |
| 10 | motion-travel | 45 | |
| 11 | sea-ships | 40 | the national domain — rich maritime lexicon |
| 12 | work-trade | 45 | commerce everyday; finance high |
| 13 | communication | 35 | |
| 14 | mind-emotion | 50 | |
| 15 | law-civic | 55 | extends the existing French-flavoured register |
| 16 | arts-leisure | 35 | high register; *sang* (song) lands here |
| 17 | school-knowledge | 35 | academia high |
| 18 | common-verbs | 60 | open, close, carry, throw… |
| 19 | qualities | 60 | colours, dimensions, evaluations; includes *mange* (many) |
| 20 | function-words | 45 | pronouns, prepositions, degree words, connectives |

**Doublets:** ~40 everyday/high pairs, concentrated in food-drink, law-civic, and formal speech (*helpa/assistera*, *eta/dinera*, *hus/residens*, *beginna/kommensera*).

**Coverage validation:** after coining, verify every Swadesh-207 concept is expressible via an automated sweep; everyday coverage beyond Swadesh is guaranteed by the per-domain concept checklists in the implementation plan (no standard top-1,000 lemma list is reproducibly available offline).

**Existing words:** all ~90 words in `LAPHURDI.md` §§4–6 enter the TSV with identical spelling — no silent respellings. This includes *sang* and *mange*, added to `LAPHURDI.md` by the national-design implementation.

## 4. File Changes

1. **`LEXICON.tsv`** (new) — source of truth, ≥1,000 rows.
2. **`tools/lexicon.py`** (new) — `check` and `build` as specified.
3. **`LEXICON.md`** (new, generated) — committed so it reads on GitHub without tooling.
4. **`LAPHURDI.md`**:
   - New "Word-Building" section: derivation table (§1.1), French adaptation rules (§1.2).
   - §3 grammar additions: comparatives, ordinals, adverbs, question words, irregular-verb table (§1.3–1.4).
   - §4 keeps its tables as the beginner core, gains a pointer to `LEXICON.md`.
   - §8 open questions: mark irregular verbs (#2) and the lexicon (#7) resolved; note that register *extent* is now fixed in the lexicon while courtroom/menu usage conventions remain open.

## Out of Scope

- Dialect variation (Lapentieuran vs. Darcambrian) and LSL.
- IPA phonology chart and syllable rules.
- Anthem lyrics.
- Constitution v3 / `NATIONAL_SYMBOLS.md` changes from the national-design spec (separate implementation).

## Success Criteria

- `LEXICON.tsv` has ≥1,000 entries and `tools/lexicon.py check` passes with no errors.
- All ~90 v1 words present with unchanged spelling.
- 16 irregular verbs carry `forms`; *krona* carries `pl=kronur`.
- ~40 register doublets present (each pair shares a gloss).
- `LEXICON.md` regenerates byte-identical from the TSV.
- Every Swadesh-207 concept is expressible per the automated sweep; every per-domain concept checklist in the implementation plan is covered.
- `LAPHURDI.md` word-building rules match the derivations actually used in the TSV.
