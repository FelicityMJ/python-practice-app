# Nat 5 Computing v8.3.2 — Pupil self-service authentication

v8.3.2 keeps the full v8.3 Mastery Edition and replaces the temporary teacher-managed password-reset approach from v8.3.1 with a simpler pupil-owned sign-in model.

## Pupil sign-in

Pupils can now sign in in either of two ways:

1. **Continue with Google** — Firebase uses the pupil's Google identity. There is no Nat 5 Computing password to remember or reset.
2. **Email + password** — the pupil's real email address is their username. Firebase handles password reset by email.

A class code is no longer part of day-to-day sign-in. It is used only when the pupil first creates an account and joins a class.

## Account creation

The Create pupil account tab now asks for:

- class code
- display name
- either Continue with Google, or email + password

For email/password accounts, Firebase sends an email-verification link after account creation. The pupil cannot use school-class learning data until the email is verified. If an unverified pupil tries to sign in, the app sends another verification email and signs them out with a clear instruction.

## Password recovery

The Pupil sign in tab now contains **Forgot password?**. The pupil enters their email address and Firebase sends the reset email directly to that mailbox.

Teachers no longer need a Reset password button and do not need access to Firebase Authentication for normal pupil password problems.

## Security/data model

- School pupil profile `username` is now the pupil's real lower-case email address.
- School pupil profiles and class-member records also store `email`.
- Firestore rules allow school pupil creation through either Firebase password authentication or Google authentication.
- Firestore class access requires a verified Firebase email identity.
- Teacher Google sign-in and teacher invite rules are unchanged.
- Existing mastery, peer feedback, revision, games and teacher analytics remain unchanged.

## Cost/deployment change

The v8.3.1 callable Cloud Function and Functions configuration have been removed. Pupil password recovery uses Firebase Authentication's client-side reset-email flow instead, so this feature does not require deploying Cloud Functions or upgrading solely for password resets.

## Active files

- `index.html` loads `app-v8-3-2.js`
- `app-v8-3-2.js` is the active application
- `firestore.rules` contains the new pupil identity/verification rules
- `firebase.json` no longer declares a Functions deployment
