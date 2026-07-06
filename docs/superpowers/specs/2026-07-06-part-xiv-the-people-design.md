# Part XIV - The People: Direct Democracy and the Debt Brake

**Date:** 2026-07-06
**Status:** Approved design, pending implementation plan

## 1. Context and goals

Laphurdeen's constitution already matches or exceeds Switzerland's
distinctives on the collegial executive (Arts 1(2), 26), consensus
government (Art 20), neutrality (Art 28(4)-(5)), subsidiarity (Art 41(4)),
and recall (Art 23(3)). What it lacks are the Swiss crown jewels of direct
democracy - the popular initiative and the optional referendum - plus the
treaty referendum and the debt brake. Article 1(3) already promises that
the people exercise sovereignty "through free elections, referendums, and
the institutions established by this Constitution"; this project builds
the missing machinery.

Approved scope, chosen from four candidate directions (deep federalism was
considered and rejected - provinces are statutory creatures of the
Boundary Commission, not sovereign cantons, and shall stay so):

1. **Popular initiative** - citizens propose constitutional amendments.
2. **People's veto** - citizens force a fresh act of Parliament to referendum.
3. **Treaty referendum** - joining an organisation of states needs the people's assent.
4. **Debt brake** - a structural balance rule for public borrowing.

Approved placement: a new **Part XIV - The People** appended after Part
XIII (Transitional Provisions), before the closing line, holding Articles
46-48. The debt brake lands in Article 36. Nothing renumbers: every
existing "Art. X" citation across GRUNDLOJEN, the website, MINISTRIES.md,
and NATIONAL_SYMBOLS.md stays valid. The website is not touched.

Both editions change together: `CONSTITUTION.md` (English) and
`GRUNDLOJEN.md` (Laphurdi). Every Laphurdi token below has been audited
against the canon validator (`apps/laphurdikursen/src/test/canon.ts` +
`LEXICON.tsv`); the token `stemmeren` depends on the lexicon fix in §6.

## 2. Part XIV - The People / Del XIV - Folket

Placed after Article 45, before the closing line (`*Done at Lapentieur...*`
/ its GRUNDLOJEN twin).

### Article 46 - The Popular Initiative / Folkets Forslag

English:

1. Five per cent (5%) of registered electors may, by petition, propose an
   amendment to this Constitution, as a complete drafted text.
2. Parliament shall put the proposal to the people within one year. It may
   place its own counter-proposal beside the people's text; it may not
   amend it, and it may not hold it back.
3. The proposal becomes part of this Constitution if approved by a
   majority of votes cast, at a turnout of at least half of registered
   electors; where it would touch the entrenched provisions of Article 44,
   the sixty per cent rule of that Article applies. Where both the
   proposal and a counter-proposal are approved, the text with the more
   votes becomes law.
4. A proposal inconsistent with the absolute rights of Article 16(2) is
   not put to the vote; the High Court decides.

Laphurdi:

1. Fem prosent (5%) av alle stemmare kan, med en skrift, geva et forslag
   te veksling av dis Grundloj - als en hel tekst.
2. Parlamentet skal senda forslaget te folket innen et jaar. Det kan setta
   et egen forslag ved sidan av folkets tekst - men det kan nit veksla
   den, og det kan nit halda den terug.
3. Forslaget gaar te folkstemming, og blivar del av dis Grundloj wen mer
   als halv av stemmeren sejar ja, og minst halv av alle stemmare har
   stemmat; waar det vil veksla de fast deler av Artikel 44, kravar det
   oek seksti prosent (60%) ja. Wen beide forslager faar ja, blivar
   teksten med mest stemmer loj.
4. Et forslag dat gaar mot de absolut rekter av Artikel 16(2) gaar nit te
   stemming; Hoogdomstolen sejar det.

### Article 47 - The People's Veto / Folkets Veto

English:

1. No person or office holds a power of veto over an act of Parliament -
   but the people themselves do. Within one hundred days of promulgation,
   two per cent (2%) of registered electors may by petition require that
   an act be put to national referendum.
2. The act does not enter into force until the people have voted.
3. The act falls only where a majority of votes cast is against it, at a
   turnout of at least half of registered electors; otherwise it stands.
4. The annual budget (Article 36) and emergency measures (Article 42)
   stand outside this Article; they answer to their own safeguards.

Laphurdi:

1. Ingen person og ingen werk haldar veto over en loj av Parlamentet - men
   folket self haldar et. Innen hundra dager fra publisering kan twe
   prosent (2%) av alle stemmare, med en skrift, krava dat lojen gaar te
   folkstemming.
2. Den loj blivar nit gyldig befor folket har stemmat.
3. Lojen fallar bara wen mer als halv av stemmeren sejar nej, og minst
   halv av alle stemmare har stemmat; wen nit, staar den.
4. Jaar-budsjeten (Artikel 36) og nodtid-regeleren under Artikel 42 staar
   uten for dis Artikel; de har deis egen skydd.

### Article 48 - Treaties and the People / Avtaler og Folket

English:

1. The Commonwealth joins no organisation of states, and enters no union
   of states, without the assent of the people at national referendum.
2. Every other treaty whose ratification requires an act of Parliament is
   subject to the People's Veto (Article 47).
3. A treaty inconsistent with this Constitution binds the Commonwealth
   only once the Constitution itself has been amended.

Laphurdi:

1. Samveldet gaar in te ingen organisasjon av lander, og in te ingen unjon
   av stater, uten ja fra folket in en folkstemming.
2. Alle anner avtaler dat kravar en loj av Parlamentet staar under Folkets
   Veto (Artikel 47).
3. Et avtal dat gaar mot dis Grundloj bindar Samveldet ferst wen
   Grundlojen self er vekslat.

## 3. The debt brake - Article 36 gains clauses 3 and 4

Article titles stay ("The Budget and Continuity of Government" /
"Budsjeten, og Dat Staten Aldri Stoppar").

English:

3. **Across the good years and the lean years together, the Commonwealth
   spends no more than it receives** - by a formula fixed in law, verified
   annually and publicly by the Auditor-General.
4. The Commonwealth may borrow beyond that balance only for emergencies
   under Article 42, or for works that serve those who come after us -
   each time by eighty per cent of votes cast in each chamber - and what
   is borrowed is repaid on a published schedule.

Laphurdi:

3. **Over de goed jaar og de svag jaar tesamme brukar Samveldet nit mer
   penger als det faar in** - efter et tal settat in loj, og Storrevisoren
   provar det alle jaar, open for alle.
4. Samveldet kan laana mer bara for nodtider under Artikel 42, el for werk
   for dem dat kommar efter os - alle mal med akti prosent (80%) av
   stemmeren in beide kamerer - og wat blivar laanat, blivar betalat terug
   on en open plan.

Deliberate phrasing: the "economic cycle" is written as the good years and
the lean years - Laphurdi `sykel` means bicycle - and clause 4 reuses the
stewardship idiom of Art 2(4) and Art 34(4), "for dem dat kommar efter os".

## 4. Knock-on edit - Article 22

The veto line gains its counterpoint. English: "**No person or office
holds a power of veto over an act of Parliament** - save the people
themselves, as Article 47 provides." Laphurdi: "**Ingen person og ingen
werk haldar veto over en loj av Parlamentet** - bara folket self, als
Artikel 47 sejar."

Article 47(1) deliberately echoes the same line back.

## 5. Knock-on edit - Article 44 (entrenchment)

Part XIV joins the entrenched list, so the people's instruments cannot be
amended away by the ordinary route. English inserts "the People's Part
(Part XIV)," before "or this Article"; GRUNDLOJEN inserts "Folkets Del
(Del XIV)," before "el dis Artikel self".

## 6. Lexicon fix - the forms of `stem`

`LEXICON.tsv` row `stem` (vote, n, c) gains explicit forms:
`pl=stemmer, pldef=stemmeren`. Today the validator generates the plural
mechanically as `stemer`/`stemeren` (no consonant doubling), yet
GRUNDLOJEN already says `stemmeren` in Articles 21, 43, and 44. The fix
records the doubled-consonant plural the canon actually uses, in the same
way `kunna` lists `kan/kunde/kunnat`. After the TSV edit: run
`python3 tools/lexicon.py check` and `build` (regenerates `LEXICON.md`).

## 7. Out of scope

- No website changes (no page cites the affected articles' text or the
  Part structure; article numbers do not move).
- No changes to LAPHURDI.md, MINISTRIES.md, PROVINCES.md.
- No deep federalism: provinces stay statutory (Art 41), no double
  majority, no communal layer.

## 8. Verification

1. Every new or edited Laphurdi line passes the canon gate: scratchpad
   script importing `Canon` and `tokenize` from
   `apps/laphurdikursen/src/test/canon.ts` over the new text (Roman
   numerals like "XIV" and "II" are heading labels, exempt as in existing
   GRUNDLOJEN headings).
2. `python3 tools/lexicon.py check` - 0 errors, 0 warnings.
3. `python3 tools/lexicon.py build` - LEXICON.md regenerated, word count
   unchanged (2,399; the fix adds forms, not a row).
4. Both app test suites pass (`apps/laphurdikursen`, `apps/translator`) -
   the TSV feeds both.
5. The two editions stay structurally parallel: same part/article/clause
   skeleton, verified by eye against the numbering.
