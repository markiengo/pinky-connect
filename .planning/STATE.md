# STATE — AI Exam Prep App

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-06-25)

**Core value:** A student can ask for or upload material and immediately get relevant practice đề they can take and track.
**Current focus:** Phase 3 — Content & Matching (complete)

## Status

| Phase | Name | Wave | Model | Status |
|-------|------|------|-------|--------|
| 1 | Foundation | 1 | GLM-4.6 | ✓ Complete |
| 2 | Authentication | 2 | Kimi-K2 | ○ Pending |
| 3 | Content & Matching Engine | 2 | GLM-4.6 | ✓ Complete |
| 4 | Chatbox & PDF Upload | 3 | Kimi-K2 | ○ Pending |
| 5 | Quiz Engine | 3 | GLM-4.6 | ○ Pending |
| 6 | History & Dashboard | 4 | Kimi-K2 | ○ Pending |
| 7 | Polish & Visual Verification | 5 | GLM-4.6 | ○ Pending |

Legend: ○ Pending · ◆ In Progress · ✓ Complete · ✗ Blocked

## Decisions Locked (from questioning)

- Local-first Prisma + SQLite (no Supabase for demo; Postgres-swappable for deploy)
- Username/password auth, bcryptjs, cookie/JWT session (no Google OAuth)
- Synthetic seed đề grounded in researched real college exams (Accounting, Banking, Business), authored in Markdown
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

### Phase 3 — Content & Matching Engine (2026-06-26)

**Shipped:**
- CONT-01: Seed bank updated to 3 college subjects: Kế toán (ke_toan), Tài chính – Ngân hàng (tai_chinh_ngan_hang), Quản trị Kinh doanh (quan_tri_kinh_doanh)
- CONT-02: 8 đề thi total (3 Accounting, 3 Banking, 2 Business), 60 questions (MCQ + essay), each with clean tags + correct/model answers
- CONT-03: Questions authored in Vietnamese with Markdown formatting, grounded in researched real university exam formats (FTU, NEU, UEL, ĐH Mở TP.HCM, HVNH, ĐH Kinh tế Đà Nẵng)
- MATCH-01: `src/lib/vietnamese.ts` — stripDiacritics, normalize, tokenize, normalizeAndTokenize, slugifyVietnamese (pure code, unit-tested)
- MATCH-02: `src/lib/subject-detection.ts` — keyword tables for 3 college subjects, detectSubjects, detectPrimarySubject (PRD §13.2)
- MATCH-03: `src/lib/matching.ts` — extractTagsFromPrompt, matchDeThi with tag overlap + subject boost + title keyword boost ranking (PRD §13.3)
- MATCH-04: matchDeThi returns 3–6 ranked results with human-readable Vietnamese match reasons per đề

**Tests:**
- 33 unit tests pass (vitest): 11 vietnamese, 11 subject-detection, 11 matching
- Seed verified: `npm run seed` → 8 de_thi, 60 questions created
- Matching sanity-checked with Vietnamese prompts (accounting, banking, business all return correct top results)

**Research:**
- `.planning/research/phase3-content.md` — Vietnamese college exam structure for Accounting, Banking, Business
- Sources: dethitracnghiem.vn, tailieu.vn, 123docz.com, vietjack.com, onthisinhvien.com, docx.com.vn, 1900.com.vn

**Decisions / Risks:**
- Pivoted from THPT (Toán/Lý/Hóa) to college-level (Accounting/Banking/Business) per user direction
- 60 questions (target was 50–100); can expand in future phases if needed
- Tags use snake_case normalized Vietnamese (e.g. `tong_quan_ke_toan`, `lai_suat`, `quan_tri_marketing`)
- Matching engine is a typed service ready for Phase 4 (Chatbox) consumption

## Needs Human Review

- Subject pivot from THPT to college-level (Accounting/Banking/Business) was directed by user mid-session. PRD §13.2 keyword tables and REQUIREMENTS.md still reference THPT subjects — should be updated in a future pass.

---
*Last updated: 2026-06-26 after Phase 3 completion*
