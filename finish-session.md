---
name: finish-session
description: Run this skill at the end of every coding session before committing. It performs a full pre-deployment sweep: removes dead code, reorganizes files, audits markdown docs, syncs local Prisma schema to Supabase (without wiping data), runs build/tests, validates user flows with demo accounts, checks .gitignore, and commits. Use this whenever the user says "finish session", "wrap up", "end session", "pre-deploy check", "ship it", "clean up and push", or otherwise indicates they're done working and want to commit.
---

# Finish Session

A pre-deployment checklist that runs at the end of a coding session. The goal is a clean, mistake-free commit that won't break production.

Work through each phase in order. Don't skip phases — each one catches different classes of bugs. But be fast: use parallel tool calls where possible, and don't overthink things that are already fine.

## Phase 1: Dead Code Removal

Scan the codebase for unused exports, imports, variables, and files.

1. Search for unused imports in `src/` — TypeScript will flag these during build, but catch them now to save a build cycle.
2. Look for exported functions/components that are never imported anywhere.
3. Check for leftover debug `console.log` statements, commented-out code blocks, and TODO comments that reference completed work.
4. If a file was made entirely empty by cleanup, delete it.
5. Don't remove things that are part of a public API or used dynamically (e.g., route handlers referenced by string paths).

Be conservative — when unsure if something is used, leave it. Removing dead code is nice-to-have, not a reason to break things.

## Phase 2: Folder & File Organization

Check that the project structure follows its existing conventions:

- Components in `src/components/` (or subdirectories like `src/components/calendar/`)
- Business logic in `src/lib/`
- API routes in `src/app/api/`
- Pages in `src/app/`
- Prisma assets in `prisma/`
- Tests in `src/lib/__tests__/`

If any files are clearly in the wrong place, move them and update imports. Don't reorganize for aesthetic reasons — only fix actual misplacement.

Remove any temporary files created during the session:
- `prisma/schema-supabase.prisma` or similar temp schema files
- `prisma/schema-supabase-temp.prisma`
- Any `*.tmp`, `test-*`, `debug-*` files
- Scripts created for one-off data migration that won't be reused

## Phase 3: Markdown Audit

Update all `.md` files in the repo to reflect the current state:

- **README.md**: Ensure features list, pages table, project layout, and scripts are current.
- **CLAUDE.md**: Ensure repo structure, build commands, and architecture notes match reality.
- **Memory.md**: Update with insights, gotchas, and lessons learned from this session.
- **docs/prd.md**: Only update if product requirements actually changed.
- **docs/pricing-strategy.md**: Only update if pricing logic changed.

Key things to check:
- New files/directories added during the session must appear in the relevant structure section.
- Removed files must be deleted from docs.
- New npm scripts must be documented.
- New environment variables must be noted in `.env.example`.

Don't rewrite prose that's already correct — just patch what's stale.

## Phase 4: Database Sync (Local → Supabase)

The goal is to make local SQLite and Supabase PostgreSQL identical in schema. Data should already exist on both — this phase is about schema, not re-seeding.

### Schema Migration (safe, no data loss)

Run the migration script that pushes schema changes without touching data:

```powershell
$env:SUPABASE_DB_URL = "<from .env DB_CONNECTION>"
npm run supabase:migrate
```

This creates a temporary postgres schema (auto-swaps `sqlite` → `postgresql`), runs `prisma db push`, and cleans up the temp file.

If `supabase:migrate` script doesn't exist, do it manually:
1. Copy `prisma/schema.prisma` to `prisma/schema-supabase-temp.prisma`
2. Replace `provider = "sqlite"` with `provider = "postgresql"`
3. Replace `env("DATABASE_URL")` with `env("SUPABASE_DB_URL")`
4. Run: `npx prisma db push --schema=prisma/schema-supabase-temp.prisma --skip-generate --accept-data-loss`
5. Delete the temp schema file

### CRITICAL RULES
- **NEVER run `npm run seed` against Supabase.** The seed script starts with `deleteMany()` on ALL tables — it will wipe all production data.
- **NEVER run `seed-hard.mts` with `DATABASE_URL` pointing to Supabase.** Always verify `DATABASE_URL` is the local SQLite path before running seed.
- Only re-seed Supabase if data was accidentally wiped or corrupted. If re-seeding is truly necessary:
  1. Warn the user explicitly before proceeding
  2. Optimize the seed script first (parallel batches, concurrency ≤ 5 for Supabase pool limits)
  3. Generate the postgres Prisma client before running
  4. Clean up temp files after

### Verification

After migration, verify schema parity by checking that both local and Supabase have the same tables/columns. A quick way:

```powershell
# Local
npx prisma db push --skip-generate  # Should say "already in sync"

# Supabase (via temp schema)
# The migrate script already verified this
```

If there's a mismatch, loop: fix schema, re-push, verify. Don't proceed until they match.

## Phase 5: Build & Test

### Build check

```powershell
npm run build
```

This runs `prisma generate && next build`. Must pass with zero errors. If it fails:
- Read the error output
- Fix the root cause (don't patch around it)
- Re-run build

### Lint check

```powershell
npm run lint
```

Fix any new warnings/errors introduced during the session. Pre-existing warnings can be left.

### Unit tests

```powershell
npx vitest run
```

All tests must pass. If tests fail:
- If the test is stale (testing old behavior), update the test
- If the test reveals a real bug, fix the code
- Never delete or weaken a test without explicit user confirmation

If no tests exist for new features, consider adding a minimal test. Don't block the commit on this — just note it for the user.

## Phase 6: User Flow Validation

Run through the app as a demo user to catch runtime errors that build/lint won't find.

### Start the dev server

```powershell
npm run dev
```

### Quick smoke test (be fast, use curl/API calls where possible)

1. **Auth**: Login as `huyenmy` / `my1234` (premium) — verify session cookie is set
2. **Dashboard**: Hit `/dashboard` — verify it loads without errors
3. **Library**: Hit `/library` — verify exam papers are listed
4. **Quiz**: Hit `/quiz/<first-de-thi-id>` — verify questions render
5. **Calendar** (if calendar feature exists): Hit `/calendar` — verify it loads
6. **API health**: Hit `/api/health` — verify 200 response

For a faster check, use curl instead of a browser:

```powershell
# Login
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/login -d "username=huyenmy&password=my1234"
# Should get 303 (redirect after login)

# Dashboard
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/dashboard
# Should get 200

# Library
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/library
# Should get 200
```

If any endpoint returns 500, investigate and fix before committing. 404 is OK for routes that require auth (redirect to login).

### Data integrity check

Verify data exists on both local and Supabase:

```powershell
# Local: check user count
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM users;"

# Supabase: check via API or direct query
# The app hitting /dashboard successfully implies data exists
```

If the app works locally but Supabase is empty, the schema migration in Phase 4 created tables but didn't seed them. Only seed if absolutely necessary (see Phase 4 rules).

## Phase 7: Gitignore Audit

Check `.gitignore` for:

1. **Temp files from this session**: Any temp schema files, export files, or scripts should be gitignored or deleted.
2. **New file types**: If new file types were introduced (e.g., `.skill`, `.db-journal`), add them.
3. **Secrets**: Verify `.env` is gitignored. Verify no API keys, passwords, or connection strings are committed.
4. **Build artifacts**: `.next/`, `node_modules/`, `out/` should be gitignored.
5. **Prisma temp files**: `prisma/schema-supabase*.prisma` should be gitignored if not already.

Add missing entries to `.gitignore`. Don't remove existing entries without reason.

## Phase 8: Commit & Push

### Stage changes

```powershell
git add -A
```

### Review what's staged

```powershell
git status
```

Look at the staged files. Make sure:
- No temp files are staged
- No `.env` is staged
- No `node_modules/` or `.next/` is staged
- All source changes are staged

If something looks wrong, unstage and fix.

### Commit

Write a short commit message — **less than 5 words**. Examples:
- "Finish calendar version 1"
- "Fix auth redirect bug"
- "Add study planner UI"
- "Optimize seed script performance"

```powershell
git commit -m "<short message>"
```

### Push

```powershell
git push
```

### Verify

After push, confirm the remote is updated:

```powershell
git log --oneline -3
```

## Speed Tips

- Run build + lint + tests in parallel where possible (separate terminal tabs or background commands)
- Use curl for smoke tests instead of browser — faster and scriptable
- Don't spend time on Phase 1 (dead code) if the session was short — only do a quick scan
- Phase 3 (markdown audit) can be done while build runs in background
- If the user says "just push" or "quick wrap up", skip to Phase 5 (build check) → Phase 8 (commit). But still never skip the build check.

## What NOT to Do

- Never force-push without explicit user permission
- Never commit `.env` files
- Never run seed scripts against Supabase production
- Never skip the build check — a failed build on Railway wastes 5+ minutes
- Never delete tests to make them pass
- Never create unnecessary files (docs, scripts, configs) that weren't needed
