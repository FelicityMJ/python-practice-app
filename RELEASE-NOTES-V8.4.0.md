# Nat 5 Computing v8.4.0 — Computing Arcade

## What changed

v8.4.0 adds a course-linked **Computing Arcade** while preserving the existing mastery pathway.

### Teacher-controlled classroom access
- Every school class now has an **Open Arcade / Close Arcade** control in the class dashboard.
- New classes start with the Arcade **closed**.
- Existing classes with no `arcadeOpen` field are also treated as **closed** until the teacher opens them.
- Individual study accounts keep Arcade access without a teacher switch.
- Firestore rules now also check the class `arcadeOpen` flag before accepting saved game attempts from school pupils.

### Skill and mastery gating
- Normal Arcade play only offers question evidence linked to skills the pupil has actually **reached/unlocked** in the course.
- Locked later skills are not used merely to fill a game round.
- Pupils can switch to **Practise my next skill**.
- Next-skill practice follows Python, Databases and Computer Systems independently.
- Next-skill rounds are **practice-only** and do not save game/review evidence, so they cannot be used to bypass the main mastery gates.

### Arcade cabinets
- **Debug Rescue** — existing full debugging game, now correctly linked to `sdd-errors-17`.
- **Logic Showdown** — existing Boolean game, now correctly linked to `sdd-logic-07`.
- **Code Flyer** — fast Python output/tracing questions.
- **Trace Race** — variable, selection, loop and array tracing.
- **Binary Bomb** — binary/denary/data-representation practice.
- **SQL Sprint** — database and SQL retrieval practice.
- **Cyber Escape** — security, firewall and encryption practice.

### Teacher evidence
- Teacher class reports now show overall Arcade accuracy, Debug results, Logic results, quick-game evidence, cabinets played and last-played time.
- Arcade answers continue to feed the existing skill-evidence/retrieval model when played in normal unlocked-skill mode.

## Important fix from v8.3.2

The old game unlock code referred to two unit IDs that do not exist in the curriculum:
- `sdd-python-07`
- `sdd-python-17`

These are corrected to:
- `sdd-logic-07`
- `sdd-errors-17`

## Files to deploy

Upload/commit these changed website files:
- `index.html`
- `styles.css`
- `app-v8-4-0.js`

Keep the existing game assets in place, especially:
- `debug-fish.webp`
- `debug-shark.webp`
- `debug-ocean.webp`
- `game_over.mp4`
- `game_over.gif`

Then deploy the updated Firebase rules from:
- `firestore.rules`

If you use the Firebase CLI locally, the rules-only deployment command is:

```bash
firebase deploy --only firestore:rules
```

The website import in `index.html` now points to `app-v8-4-0.js`.

## Quick test checklist

1. Sign in as a teacher and open an existing class.
2. Confirm the new **Class Arcade access** panel says CLOSED.
3. Sign in as a pupil in that class and confirm the Arcade card is disabled/closed.
4. Return as teacher and choose **Open Arcade**.
5. Sign in as the pupil again and open the Computing Arcade.
6. Confirm cabinets for later/unreached skills say **Not ready yet**.
7. Confirm reached skills provide playable cabinets/questions.
8. Switch to **Practise my next skill** and confirm only the next unlocked/unmastered material is offered.
9. Complete a next-skill round and confirm it says practice-only.
10. Return to normal unlocked-skills mode, complete a game, then check the teacher Arcade overview for the saved evidence.
