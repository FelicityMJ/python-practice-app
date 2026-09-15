# Nat 5 Computing

Active prototype: **v8.4.2 — Mastery Edition + Computing Arcade + school email/password authentication**

Open `index.html`. It imports `app-v8-4-2.js`.

Study routes:
- **Full Course** — Teach me Computing Science.
- **Daily Mastery** — Make me genuinely fluent at Computing Science.
- **Exam Accelerator** — Get me exam-ready quickly.
- **Revision Hub** — Help me retrieve the theory accurately.
- **Computing Arcade** — Play short games only from reached/unlocked skills, with a practice-only next-skill option. School teachers can open or close the Arcade per class.

Authentication (v8.4.2):
- **Teachers use email + password.** A teacher email must first exist as an active `teacherInvites/{email}` document in Firestore. On first-time setup, the teacher creates a Nat 5 Computing password and verifies the school email address.
- **Classroom pupils use email + password.** They join once with class code + display name + school email + password, verify the email address, then use email + password thereafter.
- **Personal Study licence** accounts continue to use their existing email + password sign-in.
- Teacher, classroom-pupil and Personal Study password-reset links are sent by Firebase Authentication.
- Only **Email/Password** is required for the active UI. Google may remain enabled temporarily for old test accounts, but v8.4.2 does not show Google sign-in buttons.
- No Microsoft Entra app registration and no Blaze-plan Cloud Function is required for this authentication flow.

Deployment:
- Upload/deploy `index.html`, `app-v8-4-2.js`, `styles.css` and the existing supporting assets.
- Deploy the included `firestore.rules` before testing new classroom accounts.
- In Firebase Authentication, keep **Email/Password** enabled.
- Add `nat5computing.co.uk` and `www.nat5computing.co.uk` to authorised domains if they are not already present.

See:
- `RELEASE-NOTES-V8.3.0.md` — Mastery Edition feature list
- `RELEASE-NOTES-V8.4.0.md` — Computing Arcade, classroom access and skill gating
- `RELEASE-NOTES-V8.4.2.md` — school email/password authentication
- `V8.4.2-EMAIL-AUTH-DEPLOYMENT.md` — exact authentication setup and test steps
