# Constitutional Values Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four value themes (island stewardship, digital citizen, neutrality, everyday dignity) to the Constitution as 13 trailing clauses across nine articles, in both language editions, with four lexicon coinages.

**Architecture:** Canon-first: each theme is one task that adds its lexicon rows, appends its clauses to `CONSTITUTION.md` (English) and `GRUNDLOJEN.md` (Laphurdi), audits every Laphurdi token through the canon gate, and commits. No article renumbers; Charter clauses gain Art. 44 entrenchment automatically. Spec: `docs/superpowers/specs/2026-07-06-constitutional-values-design.md`.

**Tech Stack:** Markdown canon docs, `LEXICON.tsv` (9 tab-separated columns), `tools/lexicon.py` (Python stdlib), vitest + `apps/laphurdikursen/src/test/canon.ts` for audits.

## Global Constraints

- No em dashes (U+2014) anywhere; use a spaced hyphen ` - `.
- Every LEXICON.tsv row has exactly 9 tab-separated fields; a row with an empty notes field still ends in a trailing tab. `lexicon.py check` enforces this.
- Never edit `LEXICON.md` by hand; regenerate with `python3 tools/lexicon.py build`.
- All Laphurdi prose must pass the canon gate. Every clause below was pre-audited on 2026-07-06 against LEXICON.tsv + this plan's four coinages; if the audit step fails, the lexicon changed - fix the token per LAPHURDI.md §3, do not skip the audit.
- Both editions land together in the same commit; editions are meaning-parallel, not word-for-word.
- Commits go direct to `main`. Do NOT push.
- Parallel sessions land commits: before each task, run `git log --oneline -5 && git status --short` and confirm the target article's current final clause number matches this plan; if it moved, append after the new final clause and renumber the plan's clause accordingly.
- The scratch audit pattern: create the test file in `apps/laphurdikursen/src/test/`, run it, then DELETE it before committing. Never commit a scratch test.

---

### Task 1: Theme A - the island, the sea, the future

**Files:**
- Modify: `LEXICON.tsv` (two new rows in the world-nature cluster, after the `natur` row)
- Regenerate: `LEXICON.md`
- Modify: `CONSTITUTION.md` (Art. 2 cl. 4, Art. 10 cl. 5, Art. 14 cl. 5, Art. 34 cl. 4)
- Modify: `GRUNDLOJEN.md` (same articles, Laphurdi)
- Test (scratch, deleted after): `apps/laphurdikursen/src/test/scratch-a.test.ts`

**Interfaces:**
- Consumes: existing headwords `natur`, `luft`, `jord`, `zee`, `iland`, `strand`, `kulle`, `framtid`, `generasjon`, `advokat`, `lojforslag`, `budsjet`.
- Produces: headwords `miljo` (n c, environment), `klima` (n n, climate), and `neutral` (adj) - `neutral` lands here, not in Task 3, because this task's compound `klimaneutral` needs both parts to be headwords. Compounds `klimaneutral` and `Framtidsadvokat` are §3b head-final compounds; they get no TSV row.

- [ ] **Step 1: Write the scratch audit test (it must FAIL first - the coinages are not yet in the TSV)**

Create `apps/laphurdikursen/src/test/scratch-a.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { Canon, tokenize } from "./canon";
import lexiconRaw from "../../../../LEXICON.tsv?raw";

const clauses = [
  "Samveldet haldar ilanderen, zeen, jorden, og luften for dem dat kommar efter os. In alle handling moste staten se oek de generasjoner dat kommar, als lojen sejar.",
  "Alle person har rekt te en ren og goed miljo. Samveldet skal halda luften, vatteret, og jorden ren; og det skal bliva klimaneutral befor en dag settat in loj, og bliva det for alltid.",
  "Stranderen og det open land er for alle. Alle person kan gaa over stranderen, kulleren, og det open land - og moste lemna dem als dei staar.",
  "En fri Framtidsadvokat sprekar for dem dat kommar efter os: hen provar alle lojforslag og alle budsjet for framtiden, publiserar wat hen ser, og kan bera saker te domstoleren. Hen blivar utnemnat als domarer under Artikel 30.",
];

describe("theme A canon audit", () => {
  const canon = new Canon(lexiconRaw);
  it("every token is justified", () => {
    const bad: string[] = [];
    for (const c of clauses)
      for (const t of tokenize(c)) if (!canon.isJustified(t)) bad.push(t);
    expect(bad).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and verify it fails on exactly the two coinages**

Run: `cd apps/laphurdikursen && npx vitest run src/test/scratch-a.test.ts`
Expected: FAIL with `expected [ 'miljo', 'klimaneutral' ] to deeply equal []`

- [ ] **Step 3: Add the three lexicon rows**

In `LEXICON.tsv`, directly after the `natur` row (search for a line starting `natur\tn\tc`), insert these two rows. Fields are TAB-separated; all three rows in this step carry a notes field, so no trailing tab is needed:

```
miljo	n	c		environment	world-nature		SV miljö + DA miljø	rekt te en ren og goed miljo (Art. 10)
klima	n	n		climate	world-nature		DA klima + FR climat	klimaneutral befor en dag settat in loj (Art. 10)
```

Then, directly after the `krig` row (line starts `krig\tn\tn`), insert:

```
neutral	adj			neutral	law-civic		FR neutre + SV neutral	klimaneutral (Art. 10); Laphurdeen er neutral (Art. 28)
```

- [ ] **Step 4: Lint and rebuild the lexicon**

Run: `cd /Users/jeffkloy/Laphurdeen && python3 tools/lexicon.py check && python3 tools/lexicon.py build`
Expected: `... rows, 0 errors, 0 warnings` twice, then `wrote LEXICON.md`. If "wrong column count": a tab was lost - re-check the two rows against the 9-column layout.

- [ ] **Step 5: Re-run the audit test and verify it passes**

Run: `cd apps/laphurdikursen && npx vitest run src/test/scratch-a.test.ts`
Expected: PASS. Then delete the scratch test: `rm src/test/scratch-a.test.ts`

- [ ] **Step 6: Append the English clauses**

In `CONSTITUTION.md`:

After Article 2's final clause (currently `3. **Darlingmoors** is recognised as a chartered principal city of the Commonwealth.`) append:

```markdown
4. **The Commonwealth holds its islands, sea, soil, and air in stewardship for those who come after us.** In every act of the state, the generations to come must also be seen, as provided by law.
```

After Article 10's final clause (currently clause 4, ending `...a matter of health, not of punishment.`) append:

```markdown
5. **Every person has the right to a clean and healthy environment.** The Commonwealth shall keep the air, the waters, and the soil clean; and it shall become climate-neutral by a date fixed in law, and remain so forever.
```

After Article 14's final clause (currently clause 4, ending `...travel free of charge.`) append:

```markdown
5. **The shores and the open land belong to everyone.** Every person may walk the shores, the hills, and the open country - and must leave them as they stand.
```

After Article 34's final clause (currently clause 3, ending `...on complaint by any person, without charge.`) append:

```markdown
4. An independent **Advocate for Future Generations** speaks for those who come after us: the Advocate examines every bill and every budget for the future, reports publicly what they find, and may bring matters before the courts. The Advocate is appointed in the manner of judges under Article 30.
```

- [ ] **Step 7: Append the Laphurdi clauses**

In `GRUNDLOJEN.md`, at the same four positions (Artikel 2 after cl. 3, Artikel 10 after cl. 4, Artikel 14 after cl. 4, Artikel 34 after cl. 3):

```markdown
4. **Samveldet haldar ilanderen, zeen, jorden, og luften for dem dat kommar efter os.** In alle handling moste staten se oek de generasjoner dat kommar, als lojen sejar.
```

```markdown
5. **Alle person har rekt te en ren og goed miljo.** Samveldet skal halda luften, vatteret, og jorden ren; og det skal bliva klimaneutral befor en dag settat in loj, og bliva det for alltid.
```

```markdown
5. **Stranderen og det open land er for alle.** Alle person kan gaa over stranderen, kulleren, og det open land - og moste lemna dem als dei staar.
```

```markdown
4. En fri **Framtidsadvokat** sprekar for dem dat kommar efter os: hen provar alle lojforslag og alle budsjet for framtiden, publiserar wat hen ser, og kan bera saker te domstoleren. Hen blivar utnemnat als domarer under Artikel 30.
```

- [ ] **Step 8: Run the full test suites**

Run: `cd apps/laphurdikursen && npm test && cd ../translator && npm test && cd ../.. && python3 -m unittest discover -s tests`
Expected: course 27+ passed, translator 77+ passed, lexicon tool `OK`.

- [ ] **Step 9: Commit**

```bash
cd /Users/jeffkloy/Laphurdeen
git add CONSTITUTION.md GRUNDLOJEN.md LEXICON.tsv LEXICON.md
git commit -m "feat(canon): the island holds its future - stewardship, environment, roam, and a Future Generations Advocate

Theme A of the values expansion: Art. 2.4, 10.5, 14.5, 34.4 in both
editions. Coinages miljo, klima, and neutral; klimaneutral and
Framtidsadvokat are 3b compounds.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Theme B - the digital citizen

**Files:**
- Modify: `CONSTITUTION.md` (Art. 9 cl. 4-5, Art. 12 cl. 6)
- Modify: `GRUNDLOJEN.md` (same)
- Test (scratch, deleted after): `apps/laphurdikursen/src/test/scratch-b.test.ts`

**Interfaces:**
- Consumes: existing headwords `masjin`, `mennisk`, `svar`, `svara`, `nej`, `uur`, `werk`. No new lexicon rows. `werkuureren` is werk + uur, a §3b compound in plural definite form.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the scratch audit test**

Create `apps/laphurdikursen/src/test/scratch-b.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { Canon, tokenize } from "./canon";
import lexiconRaw from "../../../../LEXICON.tsv?raw";

const clauses = [
  "Wen en masjin sejar ja el nej over en person, har hen rekt te veta warfor - in klar ord - og te faa en mennisk dat ser saken igen.",
  "Alle offentlig tjenst staar open oek uten masjin - fra mennisk te mennisk - og ingen person kan bliva straffat for te leva so.",
  "Efter werkuureren moste en werkare geva ingen svar. Werkets ord kan venta - nit lesat og nit svarat - og ingen werkare kan bliva straffat for det.",
];

describe("theme B canon audit", () => {
  const canon = new Canon(lexiconRaw);
  it("every token is justified", () => {
    const bad: string[] = [];
    for (const c of clauses)
      for (const t of tokenize(c)) if (!canon.isJustified(t)) bad.push(t);
    expect(bad).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and verify it passes (no coinages in this theme)**

Run: `cd apps/laphurdikursen && npx vitest run src/test/scratch-b.test.ts`
Expected: PASS. Delete it: `rm src/test/scratch-b.test.ts`

- [ ] **Step 3: Append the English clauses**

In `CONSTITUTION.md`, after Article 9's final clause (currently clause 3, ending `...requires prior judicial authorisation.`) append both:

```markdown
4. **Where a machine says yes or no over a person**, that person has the right to know why - in plain words - and to a human being who looks at the matter again.
5. **Every public service stands open without a machine** - from human being to human being - and no person may be disadvantaged for living so.
```

After Article 12's final clause (currently clause 5, ending `...working full time and no more.`) append:

```markdown
6. **After working hours, a worker owes no answer.** Work's words can wait - unread and unanswered - and no worker may be disadvantaged for it.
```

- [ ] **Step 4: Append the Laphurdi clauses**

In `GRUNDLOJEN.md`, after Artikel 9's final clause append both:

```markdown
4. **Wen en masjin sejar ja el nej over en person**, har hen rekt te veta warfor - in klar ord - og te faa en mennisk dat ser saken igen.
5. **Alle offentlig tjenst staar open oek uten masjin** - fra mennisk te mennisk - og ingen person kan bliva straffat for te leva so.
```

After Artikel 12's final clause (12.5, `Fulltidswerk er trititwe (32) uurer alle vek...`) append:

```markdown
6. **Efter werkuureren moste en werkare geva ingen svar.** Werkets ord kan venta - nit lesat og nit svarat - og ingen werkare kan bliva straffat for det.
```

- [ ] **Step 5: Run the full test suites**

Run: `cd apps/laphurdikursen && npm test && cd ../translator && npm test && cd ../.. && python3 -m unittest discover -s tests`
Expected: all green (no TSV change, but cheap insurance).

- [ ] **Step 6: Commit**

```bash
cd /Users/jeffkloy/Laphurdeen
git add CONSTITUTION.md GRUNDLOJEN.md
git commit -m "feat(canon): the digital citizen - machine decisions, offline access, disconnect

Theme B of the values expansion: Art. 9.4, 9.5, 12.6 in both editions.
No new lexicon rows; werkuureren is a 3b compound.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Theme C - neutrality

**Files:**
- Modify: `CONSTITUTION.md` (Art. 28 cl. 4-5)
- Modify: `GRUNDLOJEN.md` (same)
- Test (scratch, deleted after): `apps/laphurdikursen/src/test/scratch-c.test.ts`

**Interfaces:**
- Consumes: Task 1 must be complete first (it added the `neutral` headword this theme's clauses use). Existing headwords `krig`, `unjon`, `arme`, `soldat`, `vapen`, `jord`, `utland`, `territorie`, `forsvar`.
- Produces: nothing later tasks depend on. `krigsunjon` and `utlandsarme` are §3b compounds with linking -s-; no TSV rows.

- [ ] **Step 1: Write the scratch audit test**

Create `apps/laphurdikursen/src/test/scratch-c.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { Canon, tokenize } from "./canon";
import lexiconRaw from "../../../../LEXICON.tsv?raw";

const clauses = [
  "Laphurdeen er neutral. Samveldet bindar sik te ingen krigsunjon, og gaar aldri ferst te krig; deis forsvar er bara for forsvar.",
  "Ingen utlandsarme staar on vaar jord. Ingen arme, soldat, el vapen fra utlandet kan staa on territoriet av Samveldet.",
];

describe("theme C canon audit", () => {
  const canon = new Canon(lexiconRaw);
  it("every token is justified", () => {
    const bad: string[] = [];
    for (const c of clauses)
      for (const t of tokenize(c)) if (!canon.isJustified(t)) bad.push(t);
    expect(bad).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it, verify PASS (Task 1 already coined `neutral`), delete the scratch test**

Run: `cd apps/laphurdikursen && npx vitest run src/test/scratch-c.test.ts && rm src/test/scratch-c.test.ts`
Expected: PASS. If it fails on `neutral`, Task 1 has not run - stop and complete Task 1 first.

- [ ] **Step 3: Append the English clauses**

In `CONSTITUTION.md`, after Article 28's final clause (currently clause 3, ending `...approval of both chambers under the Consensus Rule.`) append:

```markdown
4. **Laphurdeen is neutral.** The Commonwealth binds itself to no union of war, and never goes first to war; its defence forces exist for defence alone.
5. **No foreign army stands on our soil.** No army, soldier, or weapon of a foreign power may stand on the territory of the Commonwealth.
```

- [ ] **Step 4: Append the Laphurdi clauses**

In `GRUNDLOJEN.md`, after Artikel 28's final clause append:

```markdown
4. **Laphurdeen er neutral.** Samveldet bindar sik te ingen krigsunjon, og gaar aldri ferst te krig; deis forsvar er bara for forsvar.
5. **Ingen utlandsarme staar on vaar jord.** Ingen arme, soldat, el vapen fra utlandet kan staa on territoriet av Samveldet.
```

- [ ] **Step 5: Run the full test suites**

Run: `cd apps/laphurdikursen && npm test && cd ../translator && npm test && cd ../.. && python3 -m unittest discover -s tests`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
cd /Users/jeffkloy/Laphurdeen
git add CONSTITUTION.md GRUNDLOJEN.md
git commit -m "feat(canon): neutrality - Art. 28.4-28.5 complete the disarmament outward

Theme C of the values expansion: no union of war, never first to war,
no foreign army on our soil. Uses Task 1's neutral coinage; krigsunjon
and utlandsarme are 3b compounds.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Theme D - everyday dignity

**Files:**
- Modify: `LEXICON.tsv` (one row in the work-trade cluster, after the `masjin` row)
- Regenerate: `LEXICON.md`
- Modify: `CONSTITUTION.md` (Art. 10 cl. 6, Art. 13 cl. 4-5, Art. 37 cl. 3)
- Modify: `GRUNDLOJEN.md` (same)
- Test (scratch, deleted after): `apps/laphurdikursen/src/test/scratch-d.test.ts`

**Interfaces:**
- Consumes: Task 1 must be complete first (Art. 10 cl. 5 must exist so this theme's dignity clause lands as cl. 6). Existing headwords `sterva`, `vuksen`, `hjelp`, `vetskap`, `regel`, `hem`, `pris`, `kella`, `egendom`, `ting`, `dod`, `hyra`, `kopa`.
- Produces: headword `reparera` (v, regular `-era`).

- [ ] **Step 1: Write the scratch audit test**

Create `apps/laphurdikursen/src/test/scratch-d.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { Canon, tokenize } from "./canon";
import lexiconRaw from "../../../../LEXICON.tsv?raw";

const clauses = [
  "Alle person har rekt te sterva med verdighed. Hjelp te sterva er lojlig for en vuksen dat fragar fri og med full vetskap, under regeler settat in loj.",
  "Et hem er en rekt. Alle person dat levar in Laphurdeen har rekt te et seker og goed hem. Parlamentet skal med loj halda priseren av hem so alle kan betala dem - kopat el hyrat - og se dat hem blivar byggat for alle.",
  "Vatter er folkets egendom. Deis keller, deis veg te alle hem, og deis pris kan aldri bliva privat.",
  "Wat er din, kan du reparera. Ting seljat in Samveldet moste kunna bliva reparerat for en rettvis pris, als lojen sejar - og ingen ting skal bliva byggat for en snabb dod.",
];

describe("theme D canon audit", () => {
  const canon = new Canon(lexiconRaw);
  it("every token is justified", () => {
    const bad: string[] = [];
    for (const c of clauses)
      for (const t of tokenize(c)) if (!canon.isJustified(t)) bad.push(t);
    expect(bad).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and verify it fails on exactly the coinage's forms**

Run: `cd apps/laphurdikursen && npx vitest run src/test/scratch-d.test.ts`
Expected: FAIL with `expected [ 'reparera', 'reparerat' ] to deeply equal []`

- [ ] **Step 3: Add the lexicon row**

In `LEXICON.tsv`, directly after the `masjin` row (line starts `masjin\tn\tc`), insert (TAB-separated, notes field filled):

```
reparera	v			repair	work-trade		FR réparer	wat er din, kan du reparera (Art. 37)
```

- [ ] **Step 4: Lint and rebuild**

Run: `cd /Users/jeffkloy/Laphurdeen && python3 tools/lexicon.py check && python3 tools/lexicon.py build`
Expected: `0 errors, 0 warnings`, `wrote LEXICON.md`.

- [ ] **Step 5: Re-run the audit, verify PASS, delete the scratch test**

Run: `cd apps/laphurdikursen && npx vitest run src/test/scratch-d.test.ts && rm src/test/scratch-d.test.ts`

- [ ] **Step 6: Append the English clauses**

In `CONSTITUTION.md`:

After Article 10 clause 5 (added by Task 1, ending `...and remain so forever.`) append:

```markdown
6. **Every person has the right to die with dignity.** Aid in dying is lawful for an adult who asks freely and with full understanding, under safeguards fixed in law.
```

After Article 13's final clause (currently clause 3, ending `...after the service of public debt.`) append:

```markdown
4. **A home is a right.** Every person living in Laphurdeen is entitled to a secure and good home. Parliament shall by law hold the prices of homes within what all can pay - bought or rented - and see that homes are built for all.
5. **Water is the people's own.** Its springs, its way to every home, and its price may never become private.
```

After Article 37's final clause (currently clause 2, ending `...debt-to-income statistics.`) append:

```markdown
3. **What is yours, you may repair.** Things sold in the Commonwealth must be repairable at a fair price, as the law provides - and no thing shall be built for an early death.
```

- [ ] **Step 7: Append the Laphurdi clauses**

In `GRUNDLOJEN.md`, at the same positions (Artikel 10 after cl. 5, Artikel 13 after cl. 3, Artikel 37 after cl. 2):

```markdown
6. **Alle person har rekt te sterva med verdighed.** Hjelp te sterva er lojlig for en vuksen dat fragar fri og med full vetskap, under regeler settat in loj.
```

```markdown
4. **Et hem er en rekt.** Alle person dat levar in Laphurdeen har rekt te et seker og goed hem. Parlamentet skal med loj halda priseren av hem so alle kan betala dem - kopat el hyrat - og se dat hem blivar byggat for alle.
5. **Vatter er folkets egendom.** Deis keller, deis veg te alle hem, og deis pris kan aldri bliva privat.
```

```markdown
3. **Wat er din, kan du reparera.** Ting seljat in Samveldet moste kunna bliva reparerat for en rettvis pris, als lojen sejar - og ingen ting skal bliva byggat for en snabb dod.
```

- [ ] **Step 8: Run the full test suites**

Run: `cd apps/laphurdikursen && npm test && cd ../translator && npm test && cd ../.. && python3 -m unittest discover -s tests`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
cd /Users/jeffkloy/Laphurdeen
git add CONSTITUTION.md GRUNDLOJEN.md LEXICON.tsv LEXICON.md
git commit -m "feat(canon): everyday dignity - a home, the water, repair, and a dignified death

Theme D of the values expansion: Art. 10.6, 13.4, 13.5, 37.3 in both
editions. Coinage reparera (FR réparer, regular -era).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Verification notes for the whole plan

- Tasks 3 and 4 depend on Task 1 (Task 3 uses its `neutral` row; Task 4 needs Art. 10 cl. 5 in place so dignity lands as cl. 6). Task 2 is independent.
- The English wording "clean and healthy environment" (10.5) is deliberately broader than the Laphurdi "ren og goed miljo" glosses; editions are meaning-parallel per the Art. 15(6) precedent.
- Do not "fix" the pre-existing GRUNDLOJEN divergences (`dodstraffen`, `politiet`, `prisen`, `kellar` in a TSV note) if seen nearby - they are documented and out of scope.
- After all four tasks: `grep -c 'klimaneutral\|Framtidsadvokat\|krigsunjon\|utlandsarme' GRUNDLOJEN.md` should print 4, and `git log --oneline -4` shows the four theme commits. Do not push.
