# STATE — AI Exam Prep App

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-06-25)

**Core value:** A student can ask for or upload material and immediately get relevant practice đề they can take and track.
**Current focus:** Phase 1 — Foundation (complete)

## Status

| Phase | Name | Wave | Model | Status |
|-------|------|------|-------|--------|
| 1 | Foundation | 1 | GLM-4.6 | ✓ Complete |
| 2 | Authentication | 2 | Kimi-K2 | ○ Pending |
| 3 | Content & Matching Engine | 2 | GLM-4.6 | ○ Pending |
| 4 | Chatbox & PDF Upload | 3 | Kimi-K2 | ○ Pending |
| 5 | Quiz Engine | 3 | GLM-4.6 | ○ Pending |
| 6 | History & Dashboard | 4 | Kimi-K2 | ○ Pending |
| 7 | Polish & Visual Verification | 5 | GLM-4.6 | ○ Pending |

Legend: ○ Pending · ◆ In Progress · ✓ Complete · ✗ Blocked

## Decisions Locked (from questioning)

- Local-first Prisma + SQLite (no Supabase for demo; Postgres-swappable for deploy)
- Username/password auth, bcryptjs, cookie/JWT session (no Google OAuth)
- Synthetic seed đề grounded in researched real THPT exams, authored in LaTeX + Markdown
- Next.js App Router + TS + Tailwind + shadcn/ui
- KaTeX + Markdown rendering
- Reuse reference design tokens + components (mix of port + fresh); meet `screens/*.html` standard via screenshot-compare loop
- Research every phase; computer-vision visual verification gate every phase
- Model rotation GLM-4.6 ↔ Kimi-K2; escalate to Opus/GPT only at roadblocks
- Target: full PRD end-to-end overnight

## Phase Log

(Each session appends here after completing its phase: what shipped, tests run, screenshots verified, anything risky.)

### Phase 1 — Foundation (2026-06-25)

**Shipped:**
- FND-01: Scaffolded Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui. `npm run dev` runs on port 3000.
- FND-02: Ported design tokens from DESIGN-TOKENS.md — candy palette (pink, mint, lilac, blue, cream), fonts (Schibsted Grotesk, EB Garamond, Plus Jakarta Sans via Google Fonts), radii (card 20px, panel 26px, pill 999px), pink wash gradient + drifting blob background.
- FND-03: Prisma v6 + SQLite. All PRD §19 models (Subject, DeThi, Question, QuizAttempt, QuizAnswer) + User table. Initial migration created and applied.
- FND-04: Idempotent seed script (`prisma/seed.mts`) via `npm run seed`. Upserts 3 subjects (Toán, Vật Lý, Hóa Học) + 4 đề thi. Vietnamese text normalization + slug generation.
- FND-05: Responsive AppShell layout (desktop icon rail 80px + mobile bottom nav). Styled home page with serif greeting, 3-column stat pills, filter tabs, 4-card subject grid, CTA strip. All Vietnamese text.

**Visual verification:**
- Desktop (~1280px): Palette correct (candy pink/mint/lilac/blue/cream), serif greeting (EB Garamond), rounded surfaces, icon rail, 2-column card grid. Pink wash gradient visible.
- Mobile (~400px): Bottom nav visible, icon rail hidden, single-column cards, no layout breakage. Vietnamese text intact (no mojibake).

**Decisions / Risks:**
- Used Prisma v6 instead of v7 — v7's libSQL adapter had initialization issues with SQLite file URLs on Windows. Future migration to v7 may need revisiting.
- Tailwind v4 uses CSS-based config (@theme) instead of tailwind.config.ts; design tokens live in globals.css.

## Needs Human Review

(Agents log here any default they had to assume because a decision was unclear. Empty for now.)

---
*Last updated: 2026-06-25 after Phase 1 completion*
