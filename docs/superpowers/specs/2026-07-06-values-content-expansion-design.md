# Values Content Expansion - Design

**Date:** 2026-07-06
**Status:** approved ("All three")

## Goal

Surface more of the nation's values on the landing page. Three deliverables,
agreed with the user:

1. **Home page quick win** - refresh the `#values` Charter strip with the
   strongest new canon (unarmed police, rehabilitation, real-time taxes) and
   add a residents' counterpart to the travellers section: lived-experience
   cards, not statute citations.
2. **A dedicated values page pair** - `/verder/` (Laphurdi) and `/en/verder/`
   (English): the motto's story, the full Preamble in both languages side by
   side, the Charter of Rights article by article with a Grundlojen pull-quote
   for each, the values that live outside the Charter, and the anthem's
   chorus as the close.
3. **Founding-text texture** - the anthem chorus (*Mange strander, en hamn*)
   and the motto's history get full treatment on the values page. (The
   Preamble's first line already lives on the home page's language section -
   found during survey, so the home page needs no new band.)

## Placement decisions

- The `site-header` nav is already at capacity (7 content links on the home
  page vs. the ~5-link budget). The values page is therefore reached by a
  CTA at the end of the home `#values` section and a footer link - **no new
  nav item on the home pages**. The values page's own nav uses section
  anchors, per the praktisk pattern.
- New home section `#athome` ("rights you live with") sits directly after
  `#travellers`, plain background, `card-row card-row-4`. Same id in both
  editions, as with all existing sections.
- Charter strip grows from 6 to 9 items; `charter-list` already has
  responsive columns.

## Sources (canon only)

- `CONSTITUTION.md` / `GRUNDLOJEN.md`: Preamble, Articles 6-16 (Charter),
  20-23, 32-38, 42. Laphurdi pull-quotes are verbatim Grundlojen sentences.
- `NATIONAL_SYMBOLS.md`: motto usage rules, anthem structure and chorus.
- `LAPHURDI.md` §"The Preamble's first line" (already on home).

## Constraints

- Every page is a pair; both editions land together with hreflang alternates.
- All Laphurdi (new prose and quotes) passes the canon validator; verbatim
  Grundlojen quotes may carry the known pre-existing divergences (Garantien,
  Dodstraffen, seer...) - they are quotes of canon and stay as written.
- No new CSS components: reuse section/card/pillar/charter-strip/
  preamble-quote/translator-cta. No em dashes. Money style per Art. 38
  (`Kr. 100.000.000` on lp pages, `Kr. 100,000,000` on en pages).
- Vite discovers the new page directories by glob; no config change.

## Page outline - /verder/ + /en/verder/

1. Hero: "Verderen av Samveldet" / "The values of the Commonwealth".
2. `#motto` (plain): three words, always in Laphurdi - coins, notes,
   passport; English may accompany, never replace.
3. `#preamble` (navy): the full Preamble, Laphurdi and English as two cards
   side by side - the first place the two constitutional texts meet.
4. `#charter` (plain): eleven cards, Art. 6-16, each led by a Grundlojen
   quote with an English body.
5. `#beyond` (sand): charter-strip list - consensus and referendum, no veto,
   glass-walled public life, the quiet tax office (santid, the wealth tax),
   the budget that never stops, emergencies on a leash.
6. `#anthem` (navy): the four shores and the chorus as a preamble-quote
   block; CTA to both constitution texts and the course.

## Verification

- Scratchpad canon audit over every lang="lp" string on the en pages and the
  full text of the lp pages (lang="en"/lang="fr" spans excluded).
- `npm run build` in `apps/website` (tsc + vite).
- Course and translator suites only if `LEXICON.tsv` changes (not expected).
