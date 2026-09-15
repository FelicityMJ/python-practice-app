# Nat 5 Computing v8.4.2

## School email/password sign-in

This release removes Google buttons from the active login screen and lets a Microsoft-school environment use ordinary school email addresses without Microsoft/Entra SSO.

### Teacher
- Teacher signs in with school email + Nat 5 Computing password.
- First-time setup is available only when that email has an active `teacherInvites/{email}` Firestore document.
- A verification email is sent before the teacher profile can be created.
- Teacher password reset is available from the login card.

### Classroom pupil
- Pupil joins with class code, display name, school email and a Nat 5 Computing password.
- Firebase sends an email-verification link.
- After verification, the pupil signs in with school email + password; the class code is not needed again.
- Pupil password reset is available from the classroom login card.

### Personal Study
- Existing Personal Study email/password login is unchanged.
- Its password reset remains separate from classroom sign-in.

### Security/rules
- Firestore permits a new email/password classroom account to create only its own class profile and membership when a valid active join code is supplied.
- School-class learning data requires a verified school email for password-based accounts.
- Teacher profile creation requires a verified email and an active matching teacher invite.
- Legacy Google identities remain accepted by the rules so old data is not unnecessarily invalidated, but v8.4.2 does not expose a Google login button.

No Microsoft Entra application, paid Firebase App Hosting plan or Blaze Cloud Function is required for this flow.
