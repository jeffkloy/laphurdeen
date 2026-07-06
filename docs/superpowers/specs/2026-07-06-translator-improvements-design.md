# Oversettaren improvements - design

*2026-07-06. Eight improvements to `apps/translator`, requested as a batch
("Build it all!") after a code exploration session.*

## Goals

1. **Canon-gate badge** - in Laphurdi→English mode, every word token is also
   run through the course app's `Canon` validator
   (`apps/laphurdi/src/test/canon.ts`, imported directly - one validator, no
   copy). `TokenResult` gains `canonLegal?: boolean`. The UI shows a red
   "nit canon" badge on illegal tokens; unknown-but-legal tokens (proper
   names, novel compounds) get a softer note instead of the red treatment.
2. **Register toggle** - `TranslateOptions` gains `register?: "everyday" |
   "high"`. When "high", `pickEn` re-ranks candidates to prefer high-register
   entries (the ~40 doublets: hjelpa/assistera, bygga/konstruera). UI: a
   two-button toggle in the paper head, persisted.
3. **A path to `hen`** - the English pronouns *they/them/their/theirs* offer
   the gender-neutral singular (`hen`/`hens`) as alternative chips, wired
   into the existing overrides mechanism. The Constitution is drafted with
   *hen*; the translator should at least offer it.
4. **Persistence + shareable URLs** - direction, input text, overrides, and
   register survive reload via `localStorage`; the URL hash carries
   `#<dir>/<encoded text>` so a translation can be linked. Hash beats
   storage on load.
5. **Copy button** - copies the rendering to the clipboard.
6. **Closed-class table consolidation** - one `MODALS` table drives both the
   la→en render map and the en→la modal recognition (previously two tables
   that had to be kept in sync by hand); the goed/beter/best irregular lives
   in one exported constant in `morphology.ts`.
7. **Synonym-fallback transparency** - when `EN_FALLBACK_SYNONYMS` redirects
   (little→small, ocean→sea…), the token now carries a "via synonym" note
   and a `SYN` tag instead of rewriting silently.
8. **Test expansion** - new `improvements.test.ts` covering the new features
   plus the previously untested paths: modals beyond will, contractions,
   past progressive, comparatives both directions, possessives and the
   her-disambiguation, wh-questions with do-support, det→it, a→an,
   diminutives, unknown words, numbers, and round-trip stability on the
   example sentences.

## Out of scope

- Singular-they *detection* (hen stays opt-in via chips).
- Register preference in the la→en direction (output there is English).
- UI tests (vitest env is node; the engine carries the logic).
