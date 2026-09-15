# Nat 5 Computing v8.4.4

## Flashcard parity update

This release brings the integrated Revision Hub up to feature parity with `nat5_computing_flashcards_website_v1_1` while retaining the account-based Nat 5 Computing app.

### Verified card bank
- The integrated `REVISION_CARDS` bank contains **197 cards**.
- Its IDs, prompts, accepted answers, marking points, unit IDs and exam-style flags are an exact match for the 197 cards in the standalone v1.1 flashcard package.
- No approved course-card wording was changed in this release.

### Existing Revision Hub features retained
- Choose course area and individual topics.
- Type an answer before revealing the accepted answer.
- Accepted course wording remains unchanged.
- Mark-point self-checks.
- Not secure / Partly secure / Secure self-rating.
- Cloud-saved spaced retrieval.
- Not-secure cards return later in the same session.

### Added from standalone v1.1
- Create personal flashcards.
- Edit personal flashcards.
- Delete personal flashcards.
- Choose an existing topic when creating a card.
- Create a new personal topic.
- Include/exclude personal cards in revision sessions.
- Export personal cards as JSON.
- Import standalone-compatible personal-card JSON.
- Smart mix, Due/difficult first and Random order modes.
- All-selected-cards session size.
- Select-all / clear-all topics control.
- **Skip for now** during a card, revealing the answer and then requiring a confidence rating.
- Optional access to all 197 course cards even before the matching course unit has been completed.

### Improvement over the standalone site
Personal cards and revision spacing are stored against the signed-in pupil account in Firestore rather than only in one browser's local storage, so progress follows the pupil between devices.

### Files changed
- `index.html`
- `app-v8-4-4.js`
- `styles.css`
- `firestore.rules`
- `README.md`
- `RELEASE-NOTES-V8.4.4.md`
- `V8.4.4-FLASHCARD-DEPLOYMENT.md`
