# Nat 5 Computing v8.3.0 — Mastery Edition

## Purpose
v8.3.0 keeps the existing Full Course, Exam Accelerator and Revision Hub, then adds a Kumon-style mastery layer that prescribes what a pupil should practise next.

## New in v8.3.0
1. **Daily Mastery route** — a 10–15 minute prescribed session combining older mastery, due retrieval, weak skills and the next new/repair activity.
2. **Independent working levels** — Python uses P-levels, SQL uses Q-levels and Computer Systems uses C-levels. Each area moves independently.
3. **Adaptive starting diagnostics** — short adaptive checks place each area separately and save the placement to both preferences and teacher-visible progress.
4. **Completed is no longer the same as mastered** — machine-marked activities now maintain explicit `mastered`, `masteryStatus`, streak and version evidence.
5. **Six deliberate practices** — fluency sets capture first-pass correctness, support/hints and active practice time. Finishing all six does not automatically award mastery.
6. **Automatic daily prescription** — retrieval is selected from old, due and weak evidence, followed by the best next activity.
7. **Spaced retrieval now changes mastery** — repeated delayed success can mark knowledge retained; unsuccessful retrieval brings a skill back for strengthening.
8. **Prerequisite repair** — repeated errors can trigger a smaller prerequisite activity before the pupil continues.
9. **Execution-based code marking** — Python fluency uses Pyodide execution plus AST structure; SQL fluency uses a real in-browser SQLite engine where appropriate, allowing valid solutions that differ from the model answer.
10. **Question variants** — Daily Mastery creates deterministic daily surface variants and fresh binary conversion values to reduce memorisation of individual questions.
11. **Mastery-gated progression** — Full Course assessed activities unlock from prerequisite mastery rather than simple completion. Teaching/explanation and self-reviewed exam tasks remain sensible progression gates.
12. **Teacher Mastery Map** — the old heatmap now includes Python/SQL/CS working levels plus retained and repair counts alongside per-skill evidence.

## Compatibility and migration
- Existing v8.2.x pupil progress is preserved.
- A legacy activity that was already completed before mastery fields existed is treated as secure initially, so existing classes are not locked back at the beginning.
- New attempts use the v8.3 mastery rules.
- `app-v8-2-2.js` is retained as a rollback copy; `index.html` now imports `app-v8-3-0.js`.

## Firestore
Deploy the included updated `firestore.rules`. The rule change permits the new `masteryPlacement` preference field. Diagnostic results themselves are stored in the existing `progress` collection and Daily Mastery summaries in the existing `reviewSessions` collection, so no new collection is required.

## Suggested deployment check
After deploying, test with a pupil account and a teacher account:
1. Open Daily Mastery and run one diagnostic in each area.
2. Confirm P/Q/C levels appear on the pupil dashboard and teacher Mastery Map.
3. Complete a machine-marked activity once, then verify the next assessed activity only unlocks when the mastery rule is satisfied.
4. Complete a six-practice fluency set and confirm first-pass/hint/time evidence is stored.
5. Answer a Daily Mastery retrieval question incorrectly and confirm the skill is scheduled sooner/appears as strengthening evidence.
6. Test a valid alternative Python and SQL solution.
