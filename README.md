# Nat 5 Computing

Active prototype: **v8.4.0 — Mastery Edition + Computing Arcade**

Open `index.html`. It imports `app-v8-4-0.js`.

Study routes:
- **Full Course** — Teach me Computing Science.
- **Daily Mastery** — Make me genuinely fluent at Computing Science.
- **Exam Accelerator** — Get me exam-ready quickly.
- **Revision Hub** — Help me retrieve the theory accurately.
- **Computing Arcade** — Play short games only from reached/unlocked skills, with a practice-only next-skill option. School teachers can open or close the Arcade per class.

Pupil authentication (carried forward from v8.3.2):
- **Continue with Google** for pupils with a Google account.
- **Email + password** for any pupil with a working email address.
- **Forgot password?** sends a Firebase reset email directly to the pupil.
- Email/password pupils must verify their email before accessing class learning.
- A **class code is used only when creating/joining the account**, not every time the pupil signs in.
- The pupil's real email address is stored as their username/identity in the class.

The v8.3.1 teacher-managed password-reset Cloud Function has been removed from the active project. **No Blaze-plan Cloud Function is required for pupil password recovery in v8.3.2.**

See:
- `RELEASE-NOTES-V8.3.0.md` — Mastery Edition feature list
- `RELEASE-NOTES-V8.3.2.md` — pupil authentication update
- `RELEASE-NOTES-V8.4.0.md` — Computing Arcade, classroom access and skill gating
- `V8.3-MASTERY-DEPLOYMENT.md` — mastery data/rules notes
- `V8.3.2-AUTH-DEPLOYMENT.md` — authentication setup and test checklist
