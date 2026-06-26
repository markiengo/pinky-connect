# Crambox 3-Tier Pricing Strategy

**Version:** 1.0 — June 2026
**Status:** Client-facing Draft
**Audience:** Sinh viên đại học Việt Nam

---

## 1. Executive Summary

Restructure Crambox from 2 tiers (Basic/VIP) to 3 tiers (Free/Plus/Pro). Free is the acquisition engine — search and quiz from the existing database. Plus unlocks AI that reads the student's own materials (notes, syllabus, past exams). Pro adds 3rd-party integrations and adaptive AI that turns Crambox into a full study command center.

**Pricing:**

| Tier | Monthly | Semester (6mo) | Annual |
|------|---------|-----------------|--------|
| Free | 0đ | 0đ | 0đ |
| Plus | 49.000đ/mo | 249.000đ (~42K/mo, ~15% off) | 439.000đ (~37K/mo, ~25% off) |
| Pro | 99.000đ/mo | 499.000đ (~83K/mo, ~15% off) | 899.000đ (~75K/mo, ~25% off) |

---

## 2. The Problem with the Current 2-Tier Model

The client's original proposal has two tiers (Basic + VIP) with a massive feature gap:

- **Basic** is overloaded: search, AI recommendations, file uploads, AI-generated quizzes, wellness coach, history — all for free. This leaves almost nothing to upsell except "advanced" versions.
- **VIP** is a grab bag of every advanced feature with no internal logic. There's no middle ground for a student who wants *some* AI but doesn't need the full ecosystem.

**Result:** The jump from Basic to VIP is too large and too vague. Students either stay on Basic (because it's good enough) or bounce (because VIP is unclear and "coming soon").

---

## 3. The 3-Tier Architecture

### Design Principle: The Upgrade Ladder

Each tier answers a progressively deeper question:

| Tier | Question it answers | Mental model |
|------|---------------------|--------------|
| **Free** | "What đề should I practice?" | AI finds đề for me |
| **Plus** | "What should I study from MY materials?" | AI studies WITH me |
| **Pro** | "How do I manage my entire exam prep?" | AI runs my study life |

The upgrade triggers are user-initiated — the student hits a natural wall and the next tier removes it.

---

## 4. Tier 1: Free — "Tìm & Luyện"

**Purpose:** Acquisition engine. Get students in, build the habit of practicing with đề.

### What's included

- Search & browse đề database (150 đề, 5 subjects)
- AI-style chatbox search (keyword/tag matching — current zero-cost AI)
- Daily limit: 5 đề searches/day
- Make quizzes from existing đề (MCQ + essay)
- View detailed explanations after each question
- Save quiz history (last 5 attempts)
- Basic dashboard: score over time, average score by subject
- Filter by subject (school/faculty filter coming soon)

### What's NOT included

- No file uploads (no AI analysis of personal materials)
- No AI-generated quizzes from user content
- No exam planner
- No syllabus analyzer
- No wellness coach
- Limited history (5 attempts)

### The wall

The student finds đề and practices, but the moment they think *"I wish the app could analyze MY class notes"* or *"I wish it could make a quiz from MY past exam"* — that's the Plus trigger.

### Why this works as Free

It's genuinely useful. A student can find đề, practice, see explanations, and track progress without paying. This builds trust and habit. But it's deliberately *impersonal* — the AI works on the public database, not on the student's own materials.

---

## 5. Tier 2: Plus — "AI Học Cùng Bạn"

**Purpose:** The serious-student tier. AI reads the student's own materials and provides personalized guidance.

### What's included (everything in Free, plus)

- **Unlimited search** — no daily limits, no cooldown
- **AI Material Analysis** — upload PDFs/images of class notes, past exams, textbooks → AI extracts topics, identifies important chapters, suggests relevant đề from database
  - Upload limit: 10 files/day, 15 images/day, 20MB per file
  - AI suggests up to 5 related đề per analysis
- **AI-Generated Quizzes** — AI creates practice quizzes from uploaded materials (unlimited, subject to fair-use rate limits)
- **Flashcards** — AI generates flashcards from exam content and question bank topics, auto-linked to the đề the student is practicing
- **Syllabus Analyzer** — upload syllabus/đề cương → AI identifies high-frequency chapters, suggests study priority order
- **Basic Exam Planner** — input exam dates → AI generates a study schedule (theory → practice → review)
- **Basic Wellness Coach** — study break reminders (50/10 Pomodoro), hydration/movement nudges, motivational messages
- **Extended history** — unlimited quiz attempts saved
- **Advanced dashboard** — weakness analysis by topic, improvement tracking, study streaks

### What's NOT included

- No 3rd-party integrations
- No adaptive rescheduling (planner is static — doesn't auto-adjust if you miss a session)
- No advanced wellness analytics (effective study hours, distraction patterns)

### The wall

The student has a study plan and AI analysis, but when they think *"I wish this synced with my Google Calendar"* or *"I wish it would reschedule when I skip a day"* or *"I wish I could pull quiz content from a YouTube lecture"* — that's the Pro trigger.

### Why this works as the middle tier

It's the sweet spot of perceived value. The student goes from "AI searches a database" to "AI reads MY stuff and tells me what to do." That's a qualitative leap, not just a quantitative one. Most paying students will land here.

### The Free → Plus upgrade justification

The key insight: Free users already experience "AI" through the chatbox search (keyword/tag matching). So the upgrade isn't "no AI → AI" — it's "AI searches the public database → AI reads YOUR materials and tells you what to study." That's a natural extension, not a foreign leap.

The trigger moment is when a student uploads a past exam to the chatbox and gets a message like: *"Tính năng phân tích tài liệu cá nhân chỉ có ở gói Plus. Nâng cấp để AI đọc đề của bạn và gợi ý đề luyện tập."* This is a friction point that feels natural, not artificial.

---

## 6. Tier 3: Pro — "Trung Tâm Điều Khiển"

**Purpose:** The power-user tier. Crambox becomes the student's entire study operating system.

### What's included (everything in Plus, plus)

#### Advanced AI Features

- **Adaptive Exam Planner**
  - Adaptive rescheduling: missed a session? AI asks *"Bỏ lỡ bài này, có muốn điều chỉnh lịch học không?"* and reflows the schedule
  - Difficulty-based time allocation: user rates subject difficulty → AI allocates more time to harder subjects
  - AI Countdown: progress tracking per subject based on quiz performance → *"Môn A: 78% sẵn sàng, Môn B: 45% sẵn sàng"*
- **Advanced Wellness Coach**
  - Asks how the student feels → adjusts study time recommendations
  - Analyzes effective study hours, distraction patterns, optimal study duration
  - Correlates wellness data with quiz performance

#### 3rd-Party Integrations

Based on research into Vietnamese university student digital habits (Decision Lab Connected Consumer Report Q3-Q4 2024/2025, RMIT ChatGPT adoption study, TPB+TAM study of 313 Hanoi students):

**1. Google Calendar** — *High priority*

- **Why:** Google ecosystem is ubiquitous in Vietnamese universities. Google Classroom, Drive, Docs are the de facto LMS.
- **Feature:** Two-way sync — exam dates entered in Crambox appear in Google Calendar. AI-generated study schedule syncs to Calendar. Changes in either direction are reflected.
- **Value:** Crambox becomes part of the student's daily workflow, not a separate app they have to remember to open.

**2. YouTube Parsing** — *High priority*

- **Why:** 87% of Vietnamese Gen Z use YouTube daily. It's both a top learning tool and a top distraction. Educational content, lecture replays, and "study with me" Pomodoro videos are huge.
- **Feature:** Paste a YouTube URL → AI extracts topics from the video (transcript/title/description) → generates practice quizzes or suggests relevant đề from the database.
- **Value:** Turns passive YouTube watching into active practice. A student watches a lecture on "Kế toán quản trị" → Crambox generates a quiz from that lecture's topics.

**3. Zalo Notifications** — *High priority*

- **Why:** 75% of Vietnamese Gen Z use Zalo daily. It's THE Vietnamese messaging app, deeply embedded in academic life — class group chats, lecturer communication, task coordination. A study at Thu Dau Mot University confirmed students use Zalo primarily for academic task coordination.
- **Feature:** Push study reminders, exam countdowns, and AI planner alerts to Zalo. "Bỏ lỡ bài hôm qua" notifications delivered where students already are.
- **Value:** Study reminders reach students on the platform they check first thing in the morning and last thing at night. No need to open a separate app.

**4. Notion Sync** — *Medium priority, growing*

- **Why:** Notion adoption is growing among Vietnamese power-user students who use it for note-taking and study planning. Niche but high-value for the Pro target audience.
- **Feature:** Export AI study plans, syllabus analysis, and quiz performance reports to Notion pages. Two-way sync of study notes.
- **Value:** Integrates Crambox into the student's existing knowledge management system. For students who already use Notion, this makes Crambox their study hub.

### What's NOT included

- No Facebook Group scraping (technically complex, ToS issues, low reliability)
- No Instagram/Messenger/TikTok integrations (entertainment-first, no clear study use case)
- No Microsoft Teams integration (university-controlled LMS, hard for third-party apps to access)

### Why this works as the top tier

The jump from Plus to Pro is about *connectivity* and *autonomy*. Plus gives you AI analysis; Pro makes that AI work across all your tools and adapt to your behavior. The integrations aren't gimmicks — they're the platforms Vietnamese students already use daily (Google Calendar, YouTube, Zalo) plus one power-user tool (Notion).

---

## 7. Feature Allocation Summary

| Feature | Free | Plus | Pro |
|---------|------|------|-----|
| Search & browse đề database | ✅ (5/day, cooldown) | ✅ (unlimited) | ✅ |
| Make quizzes from existing đề | ✅ | ✅ | ✅ |
| Detailed explanations | ✅ | ✅ | ✅ |
| Quiz history | 5 attempts | unlimited | unlimited |
| Basic dashboard | ✅ | ✅ | ✅ |
| AI Material Analysis (upload) | ❌ | ✅ (10 files/day) | ✅ (unlimited) |
| AI-Generated Quizzes from uploads | ❌ | ✅ | ✅ |
| Flashcards from exam content | ❌ | ✅ | ✅ |
| Syllabus Analyzer | ❌ | ✅ | ✅ |
| Exam Planner (basic) | ❌ | ✅ (static) | ✅ (adaptive) |
| Wellness Coach (basic) | ❌ | ✅ (reminders) | ✅ (analytics) |
| Advanced dashboard | ❌ | ✅ | ✅ |
| Adaptive rescheduling | ❌ | ❌ | ✅ |
| AI Countdown | ❌ | ❌ | ✅ |
| Advanced Wellness analytics | ❌ | ❌ | ✅ |
| Google Calendar sync | ❌ | ❌ | ✅ |
| YouTube parsing | ❌ | ❌ | ✅ |
| Zalo notifications | ❌ | ❌ | ✅ |
| Notion sync | ❌ | ❌ | ✅ |

---

## 8. Pricing Rationale

### Market Context

- Vietnamese university students have limited disposable income (~500K-2M VND/month allowance)
- Competitor StudyX charges ~99K-199K VND/month for AI homework solving
- Quizlet Plus charges ~$35/year (~900K VND/year, ~75K/month) — considered expensive by many VN students
- The sweet spot for Vietnamese student SaaS is 30K-80K VND/month

### Pricing Logic

| Tier | Price | Rationale |
|------|-------|-----------|
| **Free** | 0đ | Acquisition. No barrier. Must be genuinely useful to build trust. |
| **Plus** | 49.000đ/mo | Price of 1-2 cups of cà phê sữa. Low enough to be impulse, high enough to signal value. Semester/annual plans create commitment. |
| **Pro** | 99.000đ/mo | 2x Plus. Justified by integrations + adaptive AI. At the psychological ceiling for student apps in Vietnam. |

### Discount Strategy

- **Semester plan (6mo):** ~15% off — aligns with Vietnamese academic calendar. Natural purchase moment at start of semester.
- **Annual plan:** ~25% off — for students who commit early. Best value proposition.
- **Exam season promo:** Potential 30-50% off during finals period (May-June, November-December) to capture peak demand.

---

## 9. Research Basis

### Vietnamese Student Digital Habits

Data sources:
- Decision Lab Connected Consumer Report Q3-Q4 2024/2025 (446 Gen Z respondents, Vietnam)
- RMIT University ChatGPT adoption study (108 students, Vietnam)
- TPB+TAM study of AI-powered study tools (313 students, Hanoi universities, Dec 2024)
- Thu Dau Mot University Zalo-based learning study (112 students)
- Statista Vietnam social media statistics 2024-2025

### Key Findings

| Platform | Gen Z Daily Usage | Study Relevance |
|----------|-------------------|-----------------|
| Facebook | ~97% | Class groups, đề sharing, study communities |
| YouTube | ~87% | Educational tutorials, lecture replays, "study with me" |
| Zalo | ~75% | Class chats, lecturer communication, task coordination |
| Instagram | ~66% | Social only, minimal study use |
| TikTok | ~55%+ | Growing, but entertainment-first |

### Adoption Drivers for AI Study Tools (Vietnamese Gen Z)

Vietnamese Gen Z students prioritize **functional benefits** (academic performance, efficiency) over entertainment value when adopting AI study tools. Key adoption drivers:

1. **Perceived ease of use** — students adopt tools that are user-friendly and convenient
2. **Personalization** — tools that adapt to individual student needs
3. **Interactivity** — interactive features drive adoption
4. **Computer self-efficacy** — students who feel confident using technology are more likely to adopt

Notably, **perceived trust and intelligence had no significant effect** on adoption intentions. Vietnamese students don't need to trust the AI — they need it to be useful and easy.

---

## 10. Client-Facing Pitch

### One-liner

> Crambox Free giúp bạn tìm đề và luyện tập. Crambox Plus giúp AI đọc tài liệu của bạn và gợi ý ôn tập. Crambox Pro kết nối với các ứng dụng bạn đã dùng hàng ngày — Google Calendar, YouTube, Zalo, Notion — để biến Crambox thành trung tâm điều khiển ôn thi của bạn.

### Pitch by tier

**Free — "Bắt đầu miễn phí"**
> Tìm đề, làm quiz, xem lời giải, theo dõi tiến bộ. Đủ để bắt đầu luyện thi hiệu quả.

**Plus — "AI học cùng bạn"**
> Upload tài liệu, AI phân tích và tạo đề luyện tập cá nhân hóa. Lập kế hoạch ôn thi, theo dõi sức khỏe học tập. 49.000đ/tháng — bằng giá 1 ly cà phê.

**Pro — "Trung tâm điều khiển"**
> Tất cả tính năng Plus + đồng bộ Google Calendar, phân tích YouTube, nhắc nhở qua Zalo, sync Notion. AI tự điều chỉnh lịch học khi bạn bỏ lỡ. 99.000đ/tháng.

### Upgrade triggers (in-app messaging)

| Trigger | Message |
|---------|---------|
| Free user tries to upload | *"Tính năng phân tích tài liệu cá nhân chỉ có ở gói Plus. Nâng cấp để AI đọc đề của bạn."* |
| Plus user's static plan doesn't reschedule | *"AI tự điều chỉnh lịch học khi bạn bỏ lỡ — chỉ có ở gói Pro."* |
| Plus user wants YouTube integration | *"Paste YouTube link để tạo quiz từ video — nâng cấp Pro để mở khóa."* |
| Plus user wants calendar sync | *"Đồng bộ lịch học với Google Calendar — nâng cấp Pro."* |

---

## 11. Implementation Notes (for dev team)

### Schema changes needed (future)

- `User.plan` field: update from `"basic" | "premium"` to `"free" | "plus" | "pro"`
- New table: `user_uploads` — track uploaded files for Plus/Pro users
- New table: `study_plans` — store AI-generated exam planner schedules
- New table: `integrations` — store OAuth tokens for Google Calendar, Notion, etc.
- New table: `wellness_logs` — store wellness coach data (study hours, breaks, mood)

### Integration technical notes

| Integration | Auth method | API |
|-------------|------------|-----|
| Google Calendar | OAuth 2.0 | Google Calendar API v3 |
| YouTube | API key + OAuth | YouTube Data API v3 (transcript via youtube-transcript library) |
| Zalo | Zalo Official Account API | Zalo OA API (requires business registration) |
| Notion | OAuth 2.0 | Notion API |

### Phased rollout

1. **Phase 1 (now):** Update pricing page to 3 tiers, update `User.plan` values, update seed data
2. **Phase 2 (Plus features):** File upload + AI material analysis, flashcards, syllabus analyzer, basic exam planner, basic wellness coach
3. **Phase 3 (Pro features):** Adaptive planner, advanced wellness, Google Calendar sync
4. **Phase 4 (Pro integrations):** YouTube parsing, Zalo notifications, Notion sync
