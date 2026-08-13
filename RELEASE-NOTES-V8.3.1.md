# Nat 5 Computing v8.3.1 — Teacher pupil-password reset

> **Historical note:** v8.3.1 was superseded by v8.3.2. The teacher-managed password-reset Cloud Function described below is no longer part of the active project; v8.3.2 uses pupil self-service Google/email sign-in and reset emails instead.


v8.3.1 keeps the full v8.3 Mastery Edition and adds secure teacher-managed password resets for school pupil accounts.

## New teacher action
Teachers can now reset a pupil password from:
- the pupil row in the class dashboard; or
- the pupil insight profile.

The reset panel allows the teacher to:
- type a new temporary password; or
- generate a 12-character temporary password;
- confirm and apply the reset;
- copy the pupil's class code, username and new password after success.

The password is displayed only in the teacher's current browser after the successful reset so it can be handed to the pupil. It is not written into Firestore.

## Security model
The browser does not receive Firebase Admin privileges. The app calls a Firebase callable Cloud Function named `resetPupilPassword`.

Before changing a password, the function verifies that:
1. the caller is authenticated;
2. the caller's Firestore profile is an approved teacher profile;
3. the teacher owns the selected class;
4. the selected user is a pupil member of that class;
5. the pupil's user profile belongs to the same class; and
6. the Firebase Authentication email matches the app's internal school-pupil address format.

Only then does Firebase Admin update the password.

A password-reset audit entry records the pupil, teacher and reset time. The password itself is never included in the audit record.

## Existing pupil data
Changing the password updates the existing Firebase Authentication user. It does not replace the user's UID, Firestore profile, progress, mastery history, peer-feedback records or class membership.

## Files added/changed
- `app-v8-3-1.js` — active app
- `index.html` — now loads v8.3.1
- `styles.css` — password-reset UI
- `functions/index.js` — privileged callable function
- `functions/package.json` — Cloud Functions dependencies/runtime
- `firebase.json` — functions source/runtime and emulator configuration
- `V8.3.1-PASSWORD-RESET-DEPLOYMENT.md` — deployment steps

`app-v8-3-0.js` is retained as the previous rollback version.
