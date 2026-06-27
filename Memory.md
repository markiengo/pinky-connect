# Memory — Calendar Feature Development Insights

## Project: Crambox (pinky)
**Date:** June 27, 2026

---

## What We Built Today

### Calendar Version 1 — Complete Feature Set

1. **Prisma Schema Changes**
   - Added `StudyPlan`, `StudySubject`, `StudySession` models
   - Added `description` field to `StudySession`
   - Synced to both local SQLite and Supabase PostgreSQL

2. **Smart Schedule Algorithm** (`src/lib/calendar.ts`)
   - 3 time frames: Morning 7:00-11:00, Afternoon 13:30-17:00, Evening 19:00-22:00
   - 30-min breaks between sessions within a frame
   - Quarter-hour snapping (:00/:15/:30/:45) — no odd times
   - Max 2h per session for focus
   - Subject rotation across frames for variety
   - No weekend reduction — respects user's dailyHours exactly
   - Validation: rejects if total dailyHours > 10.5h with popup error
   - `findAlternativeSlot` updated to use same time frames

3. **Calendar UI** (`src/components/calendar/calendar-client.tsx`)
   - Month view (Monday-start) and Week view (24h time grid)
   - Drag-and-drop session moving with confirmation modal
   - "Thêm sự kiện" button — opens EventEditModal with defaults
   - "Sửa kế hoạch" button — opens wizard to edit existing plan
   - "Lưu lịch" button — always visible, disabled when no unsaved changes
   - Click empty time slots in WeekView to create events
   - Unsaved changes tracking with save/discard confirmation

4. **Event Edit Modal** (Google Calendar-style)
   - Title input (autofocused)
   - Native date picker (directly editable)
   - Time inputs: text-based, no spin buttons, keyboard Arrow Up/Down support
   - Description textarea
   - Color picker (6 pastel swatches)
   - Save / Cancel / Delete buttons
   - Replaced old SessionDetailModal entirely

5. **Setup Wizard**
   - Shows current subjects pre-filled when editing
   - Subject color dots
   - Trash icon to delete any subject
   - "Thêm môn" button to add new subjects
   - Back button ("← Quay lại") when editing existing plan
   - Dynamic title: "Tạo kế hoạch ôn thi" vs "Chỉnh sửa kế hoạch"
   - Validation error popup from server (e.g. total hours exceeded)

---

## Key Insights

### Architecture
- Next.js App Router with server actions in `src/lib/calendar.ts`
- Prisma ORM with SQLite (local) and PostgreSQL (Supabase)
- Schema uses `@map` for snake_case DB columns, camelCase in TS
- `serializePlan` in `page.tsx` must explicitly include new fields
- API routes in `src/app/api/calendar/` handle plan CRUD and session batch updates

### Gotchas Encountered
- **Prisma generate lock**: Dev server locks `query_engine.dll` — must kill node before `prisma generate`
- **Wizard routing bug**: `showWizard` condition at line 313 caught both first-time and edit paths — needed to split into separate `if` blocks
- **Unicode in JSX**: `\u2192` renders literally — must use actual `→` character
- **Number input spin buttons**: Webkit shows spin buttons on `type="number"` — use `type="text"` + `inputMode="numeric"` + CSS to hide
- **Supabase push**: Schema provider is `sqlite` — need temporary postgres schema file to push to Supabase
- **`@map` fields**: Prisma `@map` column names need explicit handling in serialize functions
- **CRITICAL — Never run seed-hard.mts against Supabase**: The seed script starts with `deleteMany()` on ALL tables. Running it against Supabase wipes all production data. Only run `npm run seed` for local SQLite. For Supabase schema changes, use `npm run supabase:migrate` which only pushes schema (no data loss).
- **TypeScript union types from Prisma**: Prisma returns `status` as `string`, but our interface requires `"planned" | "done" | "skipped"`. Must cast explicitly in `getStudyPlan()`.
- **Supabase pool limit**: Pooler max connections = 15. Keep parallel DB operations at concurrency ≤ 5.

### Design Decisions
- **3 frames over 1 continuous block**: Better lifestyle fit (lunch break, dinner break)
- **30-min breaks**: User preference for comfortable pacing
- **Max 2h sessions**: Research-backed optimal focus duration
- **Quarter-hour snapping**: Clean UI, easy to read, no weird times like 7:24
- **No weekend reduction**: User wants exact hours respected
- **Always-visible "Lưu lịch"**: Better UX than hiding the save button

### File Map
- `prisma/schema.prisma` — DB schema (SQLite local, Postgres Supabase)
- `src/lib/calendar.ts` — Server actions: CRUD, scheduling algorithm, slot suggestions
- `src/app/api/calendar/plan/route.ts` — Plan GET/POST API
- `src/app/api/calendar/session/route.ts` — Session PUT (batch save)
- `src/app/calendar/page.tsx` — Calendar page (auth, premium gate, serialize)
- `src/components/calendar/calendar-client.tsx` — Main calendar UI component (~1200 lines)
- `src/proxy.ts` — Middleware for route protection

### Supabase Connection
- Project: `lhxgvqdlpnjzxnbewoer`
- Pooler: `aws-1-ap-southeast-2.pooler.supabase.com:5432`
- To push schema: create temp postgres schema file, set `SUPABASE_DB_URL` env, run `prisma db push --schema=<temp> --skip-generate`

---

## Animation Smoothness Session (June 27-28, 2026)

### What Was Done
Applied Emil Kowalski's design engineering principles across the entire codebase:

1. **globals.css keyframe fixes**
   - `growBar`: `scaleY(0)` → `scaleY(0.02)` (bars grow from sliver, not nothing)
   - `fadeInDot`: `scale(0)` → `scale(0.5)` (dots appear from visible start)
   - Durings tightened: `dreamReveal` 500→300ms, `floatReveal` 600→300ms, `cardIn` 350→250ms, `growBar` 800→600ms
   - Reduced-motion block expanded: added `dream-reveal`, `float-reveal`, `card-in`, `chat-msg-in`, `graph-path`, `graph-bar`, `graph-dot`, `petal`, `page-enter`

2. **Replaced all `transition-all` with specific properties** (~60+ instances across 15 files)
   - `transition-transform` for hover lift/scale
   - `transition-colors` for background/color hover
   - `transition-opacity` for show/hide
   - `transition-[background,color,box-shadow]` for multi-property state changes
   - `transition-[border-color,box-shadow]` for input focus
   - `transition-[gap]` for arrow-on-hover widening
   - `transition-[width]` for progress bars

3. **Easing curve fixes**
   - Login/signup error banners: `float-reveal 0.3s ease-out` → `floatReveal 300ms cubic-bezier(0.23, 1, 0.32, 1)`
   - premium-overlay.tsx inline transitions: bare `ease-out` → `cubic-bezier(0.23, 1, 0.32, 1)`

4. **Liquid theme transition** (View Transitions API)
   - `theme-provider.tsx`: `setTheme()` accepts `{ x, y }` origin, uses `document.startViewTransition()` with circular `clip-path` expand
   - 500ms duration, `cubic-bezier(0.32, 0.72, 0, 1)` liquid easing
   - Fallback: instant switch if API unsupported or reduced-motion preferred
   - CSS: `::view-transition-old/new(root)` rules in globals.css

5. **Sliding liquid nav indicator** (app-shell.tsx)
   - Highlight pill slides between active sidebar items using `transform: translateY()`
   - Moves on click (not pathname change) for zero perceived lag
   - 250ms with `cubic-bezier(0.32, 0.72, 0, 1)`
   - `prefetch` on all nav links for instant page loads
   - `key={pathname}` on `<main>` + `page-enter` CSS animation (180ms fade-in)

### Key Insights
- **View Transitions API**: `::view-transition-new(root)` z-index must be 9999 to appear above old state
- **Nav indicator on click vs pathname**: Moving indicator on `onClick` (not waiting for `useLayoutEffect` on pathname change) eliminates perceived lag
- **`prefetch` on `<Link>`**: Critical for instant navigation feel in Next.js
- **`key={pathname}` remount trick**: Forces React to remount `<main>` on route change, retriggering CSS enter animation
- **`transition-[gap]`**: Tailwind arbitrary value for animating `gap` property on flex containers (arrow hover effects)
- **Pre-existing lint warnings**: `@custom-variant`, `@theme`, `@apply` in globals.css are Tailwind v4 at-rules — not errors, safe to ignore

### Files Modified
- `src/app/globals.css` — keyframes, durations, reduced-motion, view-transition CSS, page-enter
- `src/components/theme-provider.tsx` — View Transitions API for liquid theme switch
- `src/components/theme-toggle.tsx` — pass click coordinates to setTheme
- `src/components/app-shell.tsx` — sliding nav indicator, prefetch, page-enter, theme toggle coordinates
- `src/components/premium-overlay.tsx` — specific transitions, custom easing
- `src/components/quiz-client.tsx` — all transition-all replaced, progress bar duration 700→300ms
- `src/components/chatbox.tsx` — all transition-all replaced
- `src/components/de-thi-card.tsx` — transition-all → transition-transform
- `src/components/de-pane-card.tsx` — transition-all replaced
- `src/components/calendar/calendar-client.tsx` — transition-all → transition-transform
- `src/app/page.tsx` — transition-all replaced
- `src/app/dashboard/page.tsx` — transition-all replaced
- `src/app/pricing/page.tsx` — transition-all replaced
- `src/app/login/page.tsx` — transition-all replaced, easing fix
- `src/app/signup/page.tsx` — transition-all replaced, easing fix
- `src/app/profile/page.tsx` — transition-all replaced
- `src/app/library/page.tsx` — transition-all replaced
- `src/app/history/page.tsx` — transition-all replaced

---

## What's Next (Potential v2)
- Google Calendar sync (Pro tier feature per pricing strategy)
- Adaptive exam planner (adjusts based on quiz performance)
- Session completion tracking with progress stats
- Notifications/reminders for upcoming study sessions
- Subject-based filtering in calendar view
