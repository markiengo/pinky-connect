# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

**AI Exam Prep App** — a Vietnamese THPT exam-prep web app. Students find practice đề, take quizzes, and track progress. Zero-cost AI (deterministic Vietnamese normalization + keyword/tag matching, no paid LLM).

**Stack**: Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui, Prisma + SQLite (local-first), bcryptjs + jose for auth.

**Source of truth**: `prd.md` (product requirements), `.planning/` (execution docs, roadmap, state).

**Design reference**: `design/00-logs.md` and `screens/*.html` are kept as visual reference from the predecessor project. Design tokens are ported into `src/app/globals.css` and `.planning/DESIGN-TOKENS.md`. NEVER ship Angleton Script font (personal-use-only license).

**Platform**: Windows 11, PowerShell. Use PowerShell syntax in Bash commands.

## Behavioral Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing an existing file to creating a new one
- NEVER save working files or tests to the root folder
- ALWAYS read a file before editing it
- After spawning a swarm, STOP — do not poll or check status; wait for results

## Build & Test

```bash
npm run dev     # dev server on port 3000
npm run build   # production build
npm run seed    # seed database (subjects, đề, demo user)
npm run lint    # lint
```

## Repo Structure

```
src/
  app/            # Next.js App Router pages (layout, home, (auth)/login, (auth)/signup)
  components/     # Reusable components (app-shell, ui/)
  lib/            # Utilities (db, auth, session, utils)
  middleware.ts   # Route protection (redirects anon to /login)
prisma/           # Prisma schema + seed script
.planning/        # Execution docs: PROJECT, REQUIREMENTS, ROADMAP, STATE, etc.
design/           # Reference design docs from predecessor project (read-only reference)
screens/          # Reference HTML prototypes from predecessor project (visual verification)
prd.md            # Product requirements document (source of truth)
AGENTS.md         # Agent read-order and intake rules
CLAUDE.md         # This file
```

## Hook System

Hooks run automatically via `.claude/helpers/hook-handler.cjs`:

| Event | Handler arg | What it does |
|-------|-------------|--------------|
| PreToolUse Bash | `pre-bash` | Route/validate bash calls |
| PreToolUse Write/Edit | `pre-edit` | Pre-edit checks |
| PostToolUse Write/Edit | `post-edit` | Post-edit learning |
| PostToolUse Bash | `post-bash` | Post-bash metrics |
| UserPromptSubmit | `route` | Prompt routing + intelligence |
| SessionStart | `session-restore` | Restore session state |
| SessionEnd / Stop | `session-end` / `sync` | Persist state; sync memories |
| SubagentStop | `post-task` | Checkpoint after each agent |

Auto-memory (`auto-memory-hook.mjs`) imports MEMORY.md files into AgentDB on session start and syncs on stop.

## Agent Model Routing

| Tier | Handler | Use Cases |
|------|---------|-----------|
| 1 | Edit tool directly | Simple transforms — no LLM needed |
| 2 | Haiku | Simple tasks (<30% complexity) |
| 3 | Sonnet/Opus | Complex reasoning, architecture, security |
