# Nat 5 Computing

Active prototype: **v8.4.1 — Mastery Edition + Computing Arcade + simplified authentication**

Open `index.html`. It imports `app-v8-4-1.js`.

Study routes:
- **Full Course** — Teach me Computing Science.
- **Daily Mastery** — Make me genuinely fluent at Computing Science.
- **Exam Accelerator** — Get me exam-ready quickly.
- **Revision Hub** — Help me retrieve the theory accurately.
- **Computing Arcade** — Play short games only from reached/unlocked skills, with a practice-only next-skill option. School teachers can open or close the Arcade per class.

Pupil authentication (v8.4.1):
- **Classroom pupils use Google only.** They join once with class code + display name + Google, then use Continue with Google thereafter.
- Classroom pupils do **not** create a Nat 5 Computing password and do **not** complete an email-verification step.
- **Personal Study licence** accounts retain email + password sign-in.
- **Forgot your Personal Study password?** sends a Firebase password-reset email for a matching Email/Password account.
- Keep both **Google** and **Email/Password** enabled in Firebase Authentication: Google is for teachers/classrooms; Email/Password is for Personal Study.
- The pupil's Google email address remains the stored classroom username/identity.

The v8.3.1 teacher-managed password-reset Cloud Function has been removed from the active project. **No Blaze-plan Cloud Function is required for Personal Study password recovery.**

See:
- `RELEASE-NOTES-V8.3.0.md` — Mastery Edition feature list
- `RELEASE-NOTES-V8.3.2.md` — pupil authentication update
- `RELEASE-NOTES-V8.4.0.md` — Computing Arcade, classroom access and skill gating
- `RELEASE-NOTES-V8.4.1.md` — Google-only classroom sign-in and Personal Study password reset
- `V8.3-MASTERY-DEPLOYMENT.md` — mastery data/rules notes
- `V8.3.2-AUTH-DEPLOYMENT.md` — historical v8.3.2 authentication notes (superseded by v8.4.1)
