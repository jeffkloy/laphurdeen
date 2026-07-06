# Constitutional values expansion - four themes into the founding texts

*2026-07-06 · approved in session (themes A-D, mapping confirmed by user)*

## Goal

Add four value themes to the Constitution, in both editions
(`CONSTITUTION.md` + `GRUNDLOJEN.md`), with every Laphurdi token passing the
canon gate:

- **A. The island itself** - environment, the sea, future generations.
- **B. The digital citizen** - disconnection, offline access, algorithmic
  due process.
- **C. Peace abroad** - neutrality, completing the disarmament of Art. 15.
- **D. Everyday dignity** - housing, water, repair, dying with dignity.

## Approach: trailing-clause grafting

New values land as **new final clauses of existing articles** - the pattern
set by Art. 15(7)-(8) (disarmament) and Art. 12(5) (the 32-hour week).
Rationale: eleven files cite article numbers 16-45, so inserting articles
would break cross-references in two languages; and every clause grafted into
Part II is automatically entrenched by Art. 44 (80% of both chambers plus a
60% referendum). Rejected: a new Part XIV after the Transitional Provisions
(reads as an appendix, and its rights would sit outside Art. 44's shield).

## The mapping (13 clauses across nine articles)

| Value | Lands in | Entrenched |
|---|---|---|
| Stewardship of islands, sea, and air for those not yet born | Art. 2, cl. 4 | ordinary |
| Right to a healthy environment; climate-neutrality duty | Art. 10, cl. 5 | Art. 44 |
| Right to die with dignity | Art. 10, cl. 6 | Art. 44 |
| Algorithmic due process - explainable, appealable to a human | Art. 9, cl. 4 | Art. 44 |
| Right to reach every public service offline, in person | Art. 9, cl. 5 | Art. 44 |
| Right to disconnect outside working hours | Art. 12, cl. 6 | Art. 44 |
| Housing as a right of every resident | Art. 13, cl. 4 | Art. 44 |
| Water a public good; its supply never privatised | Art. 13, cl. 5 | Art. 44 |
| Right to roam - shores and open land belong to everyone | Art. 14, cl. 5 | Art. 44 |
| Right to repair what you own | Art. 37, cl. 3 | ordinary |
| Neutrality: no foreign bases; no wars of aggression | Art. 28, cl. 4-5 | ordinary |
| Future Generations Advocate beside the watchdogs of Part VII | Art. 34, cl. 4 | ordinary |

Clause numbers are the next free number in each article at implementation
time; re-verify against `git log` first (parallel sessions land commits).

## Drafting principles

- Document voice: a **bold anchor sentence**, then short declarative
  sentences; "as provided by law" for detail delegated to Parliament.
- Numbers spelled out with parenthetical digits: "thirty-two (32)".
- Spaced hyphen ` - `, never an em dash. Editions are meaning-parallel, not
  word-for-word (the Art. 15(6) precedent).
- The Laphurdi edition is drafted with *hen* for any singular person.

## Lexicon plan

Coinages per LAPHURDI.md §3b, final list settled at implementation and
verified with `lexicon.py check` plus a scratchpad canon audit per clause.
Anticipated: *natur*, *miljo* (SV miljö + DA miljø), *klima*, a word for
future (SV *framtid*), *generasjon* (FR, `-sjon`), *algoritm*,
*reparera* (FR, `-era`), *neutral* / *neutralitet* (FR, `-tet`).
Constitutional keywords get TSV rows with attestation notes (the
`skytvapen` / `selfforsvar` / `fulltidswerk` precedent); compound numerals
and ad-hoc head-final compounds do not.

## Verification

Per theme: `lexicon.py check` + `build`; scratch vitest canon audit of every
new Laphurdi clause; course, translator, and lexicon-tool suites green.
Commits go direct to `main`, one commit per theme (A, B, C, D), no push
unless asked.

## Out of scope

- Website updates (verder / home cards can surface the new values in a
  follow-up pair of changes).
- The documented GRUNDLOJEN lexicon divergences (*dodstraffen*, *politiet*)
  - already flagged in earlier specs for a dedicated session.
- Course and translator content.
