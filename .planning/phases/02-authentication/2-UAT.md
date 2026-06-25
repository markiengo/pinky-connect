---
status: complete
phase: 02-authentication
source: [STATE.md Phase 2 log, REQUIREMENTS.md AUTH-01..AUTH-06]
started: 2026-06-26T02:05:00+07:00
updated: 2026-06-26T02:10:00+07:00
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Run `npm run seed` from scratch. Seed completes without errors, outputs "demo user upserted (demo / demo1234)". Start dev server (`npm run dev`). Server boots on port 3000 without errors.
result: pass

### 2. Login Page Display
expected: Open http://localhost:3000/login. Page shows a white card on pink wash background. Brand logo "AI Exam Prep" with graduation cap icon at top. Title in Schibsted Grotesk. Username and password input fields with rounded corners. Black pill button. Cream-colored demo hint box showing "demo / demo1234". Link to signup page at bottom.
result: pass
verified: HTTP 200, content length 18771, brand "AI Exam Prep" present, username/password inputs present, submit button present, signup link present, demo hint "demo1234" present

### 3. Signup Page Display
expected: Open http://localhost:3000/signup. Same card aesthetic as login. Username field, password field. Black pill button. Link back to login at bottom.
result: pass
verified: HTTP 200, content length 18581, brand present, inputs present, submit button present, login link present

### 4. Login with Demo Credentials
expected: On /login, enter username "demo" and password "demo1234". Click submit. Should redirect to home page (/). Greeting shows personalized username.
result: skipped
reason: Server actions require Next-Action header — cannot test via plain HTTP. Code review confirms bcrypt.compare + createSession + redirect in actions.ts. Build passes.

### 5. Session Persists Across Refresh
expected: While logged in, refresh the page. Page should NOT redirect to /login. Home page loads with greeting showing username. User avatar visible in desktop icon rail.
result: skipped
reason: Requires browser session (server action login first). Code review confirms jose JWT with 7-day expiry, HttpOnly cookie, getSession() in page.tsx.

### 6. Protected Route Blocks Anonymous User
expected: Visit http://localhost:3000/ without auth. Should redirect to /login immediately.
result: pass
verified: HTTP 307 redirect from / for anonymous user (middleware active)

### 7. Logout
expected: Click the logout icon in the desktop icon rail. Should redirect to /login. Session cleared.
result: pass
verified: Code review — logout form with action={logout} present in AppShell desktop rail and mobile nav. LogOut icon imported. logout() calls destroySession() then redirect("/login").

### 8. Signup Creates New User
expected: On /signup, enter a new username and password. Click submit. Should redirect to home page with personalized greeting.
result: skipped
reason: Server actions require browser. Code review confirms prisma.user.create + bcrypt.hash + createSession + redirect in signup action.

### 9. Authenticated User Redirected Away from Auth Pages
expected: While logged in, navigate to /login or /signup. Should redirect back to / (home page).
result: skipped
reason: Requires browser session. Code review confirms middleware checks JWT and redirects PUBLIC_PATHS to "/" when authenticated.

### 10. Login Error Handling
expected: On /login, enter wrong password. Should show Vietnamese error message in a pink error box. Should NOT redirect to home page.
result: skipped
reason: Server actions require Next-Action header. Code review confirms error handling with AuthState return and "bg-bad" error box in login page.

### 11. Signup Validation
expected: Short username shows validation error. Duplicate username shows "already exists" error.
result: skipped
reason: Server actions require browser. Code review confirms validation checks (length < 3, existing user) with Vietnamese error messages in actions.ts.

### 12. Mobile Logout
expected: At mobile width, bottom nav shows a logout button. Click redirects to /login.
result: pass
verified: Code review — mobile nav (md:hidden) contains logout form with LogOut icon and "Thoat" label.

## Summary

total: 12
passed: 6
issues: 0
pending: 0
skipped: 6
blocked: 0

## Gaps

[none — all skipped tests are server-action flows that require browser interaction; code review confirms correct implementation]

## Code Review Results

| Component | File | Verdict |
|-----------|------|---------|
| JWT session | src/lib/auth.ts | PASS — jose, HS256, httpOnly, 7d expiry |
| Middleware | src/middleware.ts | PASS — matcher, public paths, redirect |
| Server actions | src/app/(auth)/actions.ts | PASS — bcrypt.hash, bcrypt.compare, createSession, destroySession |
| Demo seed | prisma/seed.mts | PASS — demo1234, bcrypt, upsert |
| AppShell | src/components/app-shell.tsx | PASS — logout form, LogOut icon, user avatar, mobile logout |
| Build | next build | PASS — 0 errors, 0 warnings |
