# Nat 5 Computing v8.4.1 — Simplified classroom sign-in

## What changed

### Classroom pupils are now Google-only
- Classroom pupils sign in with **Continue with Google**.
- New pupils join a class using **class code + display name + Google**.
- The email/password classroom registration option has been removed.
- The email-verification requirement and all `sendEmailVerification()` code have been removed.
- Classroom pupils no longer see a Nat 5 Computing password or password-reset option.

### Personal Study keeps email + password
- The Personal Study card now has its own email/password sign-in form.
- **Forgot your Personal Study password?** calls Firebase `sendPasswordResetEmail()`.
- The success message makes clear that the reset route is intended for Personal Study email/password accounts and classroom pupils should use Google.
- Useful Firebase errors such as rate limiting, network failure and Email/Password being disabled are now shown clearly.

### Firestore rules hardened
- New classroom pupil profiles can only be created when Firebase reports `google.com` as the sign-in provider.
- Classroom membership creation is also Google-only.
- Access to classroom pupil data now requires a Google-authenticated school pupil rather than an `email_verified` token.
- Individual Personal Study learners remain compatible with email/password authentication and their existing entitlement checks.

## Firebase settings

In **Firebase Console → Authentication → Sign-in method** keep both of these enabled:

1. **Google** — teachers and classroom pupils.
2. **Email/Password** — Personal Study licences and password resets.

You do **not** need to enable custom SMTP. Firebase's built-in email service can send Personal Study password-reset emails.

The Email address verification template is no longer used by the site.

## Files to deploy

Upload/deploy:
- `index.html`
- `styles.css`
- `app-v8-4-1.js`
- `firestore.rules` through Firebase/Firestore Rules

Keep the other existing curriculum, revision and game assets in place.

## Important effect on old test accounts

Old classroom test accounts that were created with email + password will no longer be allowed to use classroom data. That is intentional. Create/rejoin the test pupil using Google instead. Personal Study email/password accounts are unaffected provided their Firestore profile has `accountType: "individual"` and they have an active Nat 5 Computing entitlement.

## Recommended test

### Classroom pupil
1. Teacher creates/uses a test class and class code.
2. Open the site in an incognito/private window.
3. Choose **Classroom pupil → Join a class**.
4. Enter the class code and display name.
5. Choose **Continue with Google and join class**.
6. Confirm the pupil dashboard opens immediately with no email-verification screen.
7. Sign out.
8. Choose **Classroom pupil → Sign in → Continue with Google**.
9. Confirm the same pupil/progress opens.

### Personal Study password reset
1. Use a real Firebase Authentication account created with the **Email/Password** provider.
2. Confirm its Firestore user profile is an individual account and its Nat 5 Computing entitlement is active.
3. Enter that email in **Personal study licence** and choose **Forgot your Personal Study password?**
4. Confirm the site reports that Firebase accepted the reset request.
5. Check Inbox and Spam/Junk for the Firebase password-reset email.
6. Open the reset link, set a new password and sign in with the new password.

If step 4 shows `operation-not-allowed`, enable Email/Password in Firebase Authentication. If it shows `too-many-requests`, wait before testing again. If step 4 succeeds but no email arrives for a confirmed Email/Password account, the next check is Firebase's Password reset template/delivery rather than the website code.
