# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

**Crambox** — a Vietnamese university exam-prep web app. Students find practice đề, take quizzes, and track progress. Zero-cost AI (deterministic Vietnamese normalization + keyword/tag matching, no paid LLM).

**Stack**: Next.js 16 (App Router, Turbopack dev) + TypeScript + Tailwind v4 + shadcn/ui, Prisma + SQLite (local dev) / PostgreSQL via Supabase (production), bcryptjs + jose for auth. Railway deploy auto-swaps Prisma provider from `sqlite` to `postgresql` in the build step.

**Source of truth**: `docs/prd.md` (product requirements).

**Design reference**: `asset/ref/analysis.md` (design extraction & implementation guide). Design tokens live in `src/app/globals.css`. NEVER ship Angleton Script font (personal-use-only license).

**Platform**: Windows 11, PowerShell. Use PowerShell syntax in Bash commands.

## Behavioral Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing an existing file to creating a new one
- NEVER save working files or tests to the root folder
- ALWAYS read a file before editing it
- After spawning a swarm, STOP — do not poll or check status; wait for results

## Build & Test

```powershell
npm run dev     # dev server on port 3001 (Turbopack)
npm run build   # production build (prisma generate + next build)
npm run seed    # seed database (5 subjects, 150 đề, 3,000 questions, 2 users)
npm run lint    # lint
npx vitest run  # unit tests (35 tests: vietnamese, subject-detection, matching)
```

## Repo Structure

```
src/
  app/              Next.js App Router pages + API routes
    api/            API routes (search, dev-clear-session)
    dashboard/      Dashboard page
    history/        Quiz history page
    library/        Exam library page
    login/          Login page
    practice/       Chatbox page
    pricing/        Pricing page
    profile/        Profile page
    quiz/[deThiId]  Quiz taking page
    signup/         Signup page
    layout.tsx      Root layout (CursorGlow, ClearStorage, DevAutoLogout)
    page.tsx        Landing page
    globals.css     Design tokens, animations, global styles
  components/       UI components
    app-shell.tsx       Desktop sidebar + mobile bottom nav
    chatbox.tsx         Multi-chat AI search interface (in-memory sessions)
    quiz-client.tsx     Quiz taking (MCQ + essay, inline explanations)
    charts.tsx          Recharts score progression + subject averages
    de-pane-card.tsx    Library exam card
    de-thi-card.tsx     Chatbox result card
    premium-overlay.tsx Upsell modal when prompts run out
    rendered-content.tsx  Markdown + KaTeX renderer
    cursor-glow.tsx     Canvas cursor glow effect
    clear-storage.tsx   Clears localStorage/sessionStorage on mount
    dev-auto-logout.tsx Dev-only auto-logout on page unload
  lib/              Business logic
    auth.ts            Login/signup/logout server actions
    session.ts         JWT session management (jose, httpOnly cookie)
    db.ts              Prisma client singleton
    quiz.ts            Quiz data fetching + attempt saving
    history.ts         Quiz history + dashboard stats
    search-service.ts  Search orchestration with 5-min cache
    matching.ts        Tag matching + rule-based ranking engine
    subject-detection.ts  Subject detection from keyword tables
    vietnamese.ts      Vietnamese text normalization (strip diacritics, tokenize)
    format-date.ts     Deterministic date formatting (no Intl API)
    __tests__/         Unit tests (vitest)
  proxy.ts          Middleware: route protection + auth redirect
prisma/
  schema.prisma     Database schema (SQLite locally, Postgres on Railway)
  seed-hard.mts     Seed script (matches Supabase production data)
  data/             JSON seed data (accounting, finance, business, legal, microecon)
public/             Static assets (logo, backgrounds, faces, fonts)
docs/
  prd.md            Product requirements document (source of truth)
  pricing-strategy.md  3-tier pricing strategy
asset/ref/          Design extraction & reference images
AGENTS.md           Agent read-order and intake rules
CLAUDE.md           This file
```

## Key Architecture Decisions

- **Auth**: username/password (no OAuth). bcryptjs hash, JWT in httpOnly cookie (`session_v2`).
- **Dev mode**: session cookie is session-only (no maxAge, cleared on browser close). Auto-logout on hard refresh/tab close via `pagehide` + `sendBeacon` to `/api/dev-clear-session`.
- **Search**: zero-cost deterministic matching. Pipeline: normalize Vietnamese → detect subject → extract tags → match against đề tags → rank by score (tag overlap + subject boost + title keyword boost).
- **Chatbox**: multi-chat sessions are in-memory only (no DB persistence). Sessions are ephemeral React state.
- **Quiz**: MCQ + essay. Inline explanations (no modal). Correct=green (#5B8C5A), wrong=red (#C05656), essay answered=purple (#9F7AEA).
- **Rendering**: react-markdown + remark-math + rehype-katex for math/Markdown in questions and explanations.

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
