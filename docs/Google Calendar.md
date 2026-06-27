

Tôi đã đọc xong [pricing-strategy.md](cci:7://file:///d:/CRAMBOX/pinky/docs/pricing-strategy.md:0:0-0:0) và [prd.md](cci:7://file:///d:/CRAMBOX/pinky/docs/prd.md:0:0-0:0). Giờ tôi cần khám phá codebase hiện tại để hiểu kiến trúc, schema, và cách tổ chức code trước khi đưa ra kế hoạch.

Tôi cần xem thêm cấu trúc API routes, pricing page, và cách session/auth hoạt động để đưa ra kế hoạch chính xác.

Tôi đã nắm rõ codebase. Giờ tôi cần hỏi bạn một số quyết định thiết kế trước khi đưa ra kế hoạch chi tiết.

Cảm ơn các câu trả lời. Tôi sẽ đưa ra kế hoạch chi tiết cho feature Google Calendar integration với:
- **Service Account** (không cần user OAuth)
- **Use case**: Đọc lịch thi + lịch cá nhân → tạo lịch ôn tập → push lên Google Calendar
- **Plan only** (chưa code)

---

# Kế hoạch: Google Calendar Integration (Pro Tier)

## 1. Tổng quan

**User flow:**
```
User (Pro) kết nối Google Calendar (share calendar với service account email)
    ↓
User nhập ngày thi các môn
    ↓
System đọc lịch cá nhân từ Google Calendar (events/free-busy)
    ↓
System tạo lịch ôn tập (rule-based: phân bổ sessions vào các thời gian rảnh trước ngày thi)
    ↓
System push study events lên Google Calendar (user nhận được event invitations)
    ↓
User thấy lịch ôn tập trên Google Calendar của mình
```

**Tại sao Service Account phù hợp:**
- Không cần thay đổi auth system hiện tại (username/password vẫn là login chính)
- User chỉ cần share calendar với 1 email service account (one-time setup)
- Service account có quyền đọc calendar (để tìm slot rảnh) + tạo events

---

## 2. Setup Google Service Account

### Bước chuẩn bị (Google Cloud Console)

1. Tạo project trên Google Cloud Console
2. Enable **Google Calendar API v3**
3. Tạo **Service Account** → download JSON key file
4. Service account email sẽ có dạng: `crambox@<project-id>.iam.gserviceaccount.com`
5. Lưu JSON key vào env vars (base64 encoded) hoặc file path

### Env vars cần thêm (`.env.example`)

```env
# Google Calendar Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=crambox@<project-id>.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./keys/crambox-service-account.json
# Or base64-encoded key (for Railway deployment)
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=<base64-encoded-json-key>
```

---

## 3. Schema Changes (Prisma)

### 3.1 Update `User.plan`

```prisma
// Thay đổi: "basic" | "premium" → "free" | "plus" | "pro"
plan String @default("free") // "free" | "plus" | "pro"
```

### 3.2 New model: `GoogleCalendarConnection`

Lưu thông tin kết nối Google Calendar của user.

```prisma
model GoogleCalendarConnection {
  id              String   @id @default(cuid())
  userId          String   @unique @map("user_id")
  googleEmail     String   @map("google_email")     // User's Gmail
  calendarId      String   @map("calendar_id")       // User's primary calendar ID
  connectedAt     DateTime @default(now()) @map("connected_at")
  lastSyncedAt    DateTime? @map("last_synced_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("google_calendar_connections")
}
```

### 3.3 New model: `ExamDate`

Lưu ngày thi của user.

```prisma
model ExamDate {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  subject     String                         // "Kế toán", "Tài chính", etc.
  examDate    DateTime @map("exam_date")
  notes       String   @default("")          // Optional notes
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("exam_dates")
}
```

### 3.4 New model: `StudyPlan`

Lưu lịch ôn tập đã generate.

```prisma
model StudyPlan {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  examDateId  String   @map("exam_date_id")
  status      String   @default("active")    // "active" | "completed" | "archived"
  createdAt   DateTime @default(now()) @map("created_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  examDate ExamDate @relation(fields: [examDateId], references: [id], onDelete: Cascade)
  sessions StudySession[]

  @@map("study_plans")
}
```

### 3.5 New model: `StudySession`

Từng session ôn tập (1 session = 1 event trên Google Calendar).

```prisma
model StudySession {
  id              String   @id @default(cuid())
  studyPlanId     String   @map("study_plan_id")
  subject         String
  title           String                          // "Ôn Kế toán: Bảng cân đối"
  startTime       DateTime @map("start_time")
  endTime         DateTime @map("end_time")
  sessionType     String   @default("study")      // "study" | "review" | "practice"
  googleEventId   String?  @map("google_event_id") // ID từ Google Calendar
  syncStatus      String   @default("pending")     // "pending" | "synced" | "failed"
  createdAt       DateTime @default(now()) @map("created_at")

  studyPlan StudyPlan @relation(fields: [studyPlanId], references: [id], onDelete: Cascade)

  @@map("study_sessions")
}
```

### 3.6 Update `User` model — thêm relations

```prisma
model User {
  // ... existing fields ...
  googleCalendarConnection GoogleCalendarConnection?
  examDates                ExamDate[]
  studyPlans               StudyPlan[]
}
```

---

## 4. Dependencies

```json
{
  "googleapis": "^144.0.0"
}
```

Chỉ cần thêm `googleapis` (official Google API client for Node.js). Không cần thêm auth library nào khác.

---

## 5. Lib Files (Business Logic)

### 5.1 `src/lib/google-calendar.ts` — Google Calendar API wrapper

```
- getCalendarClient(): tạo JWT client từ service account key, return calendar instance
- listUserEvents(googleEmail, calendarId, timeMin, timeMax): đọc events từ user's calendar
- getFreeBusy(googleEmail, calendarId, timeMin, timeMax): query free/busy slots
- createStudyEvent(calendarId, session): tạo event trên service account calendar, add user as attendee
- deleteStudyEvent(calendarId, googleEventId): xóa event
- updateStudyEvent(calendarId, googleEventId, session): update event
```

### 5.2 `src/lib/study-planner.ts` — Study plan generation logic

```
- generateStudyPlan(examDates, busySlots, preferences):
    Input: exam dates + user's busy times from calendar
    Output: array of StudySession objects

    Algorithm (rule-based, zero-cost):
    1. Sắp xếp exam dates theo thứ tự thời gian
    2. Tính số ngày còn lại cho mỗi exam
    3. Phân bổ study sessions vào các free slots:
       - Mỗi session: 2 giờ
       - Priority: môn khó hơn / ngày thi gần hơn → nhiều session hơn
       - Spacing: cách nhau ít nhất 1 ngày giữa sessions cùng môn
       - Buffer: 2 ngày trước exam dành cho review tổng hợp
    4. Tránh conflict với events có sẵn trên calendar
    5. Return sessions sorted by start time
```

### 5.3 `src/lib/plan-gate.ts` — Tier-based feature access

```
- checkPlanAccess(userId, requiredPlan):
    "free" < "plus" < "pro"
    Return boolean + current plan
```

---

## 6. API Routes

### 6.1 `POST /api/calendar/connect`

```
Body: { googleEmail: string }
- Check user.plan === "pro"
- Save googleEmail + calendarId to GoogleCalendarConnection
- Return connection status
```

### 6.2 `GET /api/calendar/status`

```
- Return: { connected: boolean, googleEmail?: string, lastSyncedAt?: Date }
```

### 6.3 `POST /api/calendar/exam-dates`

```
Body: { exams: [{ subject, examDate, notes? }] }
- Save to ExamDate table
- Return saved exam dates
```

### 6.4 `GET /api/calendar/exam-dates`

```
- Return user's exam dates
```

### 6.5 `POST /api/calendar/sync`

```
Body: { examDateIds?: string[] }  // optional, sync all if not provided
Flow:
1. Check user.plan === "pro"
2. Get GoogleCalendarConnection
3. Read user's calendar events (next 30 days) via service account
4. Get exam dates from DB
5. Generate study plan (study-planner.ts)
6. Save StudyPlan + StudySessions to DB
7. Push each session to Google Calendar as events
8. Update syncStatus + googleEventId
9. Return generated plan summary
```

### 6.6 `DELETE /api/calendar/sync`

```
- Delete all synced events from Google Calendar
- Update StudySession.syncStatus = "pending"
```

### 6.7 `DELETE /api/calendar/connect`

```
- Delete GoogleCalendarConnection
- Optionally clean up synced events
```

---

## 7. UI Pages / Components

### 7.1 `src/app/settings/page.tsx` (hoặc `src/app/integrations/page.tsx`)

**Mục "Google Calendar Integration":**
- Nếu chưa connected: Hiển thị service account email + hướng dẫn share calendar
  - *"Để đồng bộ, hãy share Google Calendar của bạn với email: crambox@xxx.iam.gserviceaccount.com"*
  - Input: nhập Gmail
  - Button: "Kết nối"
- Nếu đã connected: Hiển thị trạng thái + nút "Ngắt kết nối"
- **Pro-only**: Hiển thị upgrade prompt nếu user không phải Pro

### 7.2 `src/app/planner/page.tsx` — Exam Planner

**Step 1: Nhập ngày thi**
- Form: chọn môn + chọn ngày thi + notes
- List exam dates đã nhập

**Step 2: Tạo lịch ôn tập**
- Button "Tạo lịch ôn tập" → gọi `/api/calendar/sync`
- Loading state while generating

**Step 3: Xem lịch ôn tập**
- Display generated sessions as list/timeline
- Mỗi session: subject, title, time, type (study/review/practice)
- Button "Đồng bộ lên Google Calendar"
- Button "Tạo lại" (regenerate)

### 7.3 `src/components/study-planner-form.tsx`

Form component cho việc nhập exam dates + trigger sync.

### 7.4 `src/components/study-schedule-view.tsx`

Hiển thị lịch ôn tập đã generate (list hoặc calendar-like view).

### 7.5 Update `src/components/premium-overlay.tsx`

- Thay "Premium" → "Pro" (hoặc "Plus" tùy context)
- Cập nhật FEATURES list cho phù hợp 3-tier

---

## 8. Pro-tier Gating

### Logic

```typescript
const PLAN_HIERARCHY = { free: 0, plus: 1, pro: 2 };

function hasPlanAccess(userPlan: string, required: string): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[required];
}
```

### Touch points cần gate:
- `/api/calendar/*` routes → check `plan === "pro"` 
- `/planner` page → redirect hoặc show upgrade overlay
- `/settings` integrations section → show upgrade prompt

### Upgrade trigger message (từ pricing-strategy.md):
> *"Đồng bộ lịch học với Google Calendar — nâng cấp Pro."*

---

## 9. Study Plan Generation Algorithm (Chi tiết)

```
Input:
  - examDates: [{ subject: "Kế toán", examDate: "2026-07-15" }, ...]
  - busySlots: [{ start: "...", end: "..." }]  // from Google Calendar
  - preferences: { studyHoursPerDay: 2-4, preferredTime: "evening" }

Algorithm:
  1. FOR each examDate (sorted by date ASC):
       daysUntilExam = examDate.examDate - today
       studyDays = daysUntilExam - 2  // reserve 2 days for final review

  2. Calculate weight per subject:
       weight = (difficulty_score / total_difficulty) * totalAvailableSlots
       // difficulty: user-rated or default equal

  3. Generate candidate sessions:
       FOR each studyDay (from today to studyDays before exam):
         Find free slots in that day (exclude busySlots)
         IF free slot >= 2 hours:
           Create StudySession:
             - subject = examDate.subject
             - startTime = free slot start
             - endTime = startTime + 2h
             - sessionType = "study" (normal) | "review" (last 2 days) | "practice" (weekend)

  4. Spacing rule:
       Same subject sessions must be >= 1 day apart
       Max 2 sessions per day

  5. Output: StudySession[] sorted by startTime
```

**Lưu ý:** Algorithm này là **rule-based, zero-cost** (phù hợp với current architecture). Sau này có thể upgrade sang LLM để tạo plan thông minh hơn (phân tích syllabus, gợi ý topics cụ thể cho từng session).

---

## 10. Service Account Flow — Chi tiết

### User kết nối Google Calendar

```
1. User (Pro) vào /settings → Google Calendar section
2. UI hiển thị: "Share calendar với email: crambox@xxx.iam.gserviceaccount.com"
3. User mở Google Calendar → Settings → Share with specific people → Add service account email → Make changes AND manage sharing (or at least "See all event details")
4. User nhập Gmail của mình vào Crambox
5. Crambox lưu GoogleCalendarConnection (userId, googleEmail, calendarId)
6. Crambox test: listUserEvents() → verify access
```

### Sync flow

```
1. User vào /planner → nhập exam dates → click "Tạo lịch ôn tập"
2. Backend: getFreeBusy(user's calendar, today, max(examDates) + 7 days)
3. Backend: generateStudyPlan(examDates, busySlots)
4. Backend: FOR each session:
     createStudyEvent(session) → creates event on service account's calendar
     Event has: user's gmail as attendee
     User receives Google Calendar invitation → accepts → shows on their calendar
5. Backend: save googleEventId to StudySession
```

### Tại sao tạo events trên service account calendar + add user as attendee?

- Service account **không thể tạo events trực tiếp trên calendar của user** (kể cả khi user share calendar, behavior không ổn định)
- Tạo trên calendar của service account + add user as attendee → user nhận invitation → event hiện trên calendar
- **Workaround**: Hoặc user tạo 1 calendar riêng tên "Crambox Study" rồi share với service account với write permission → service account tạo events trực tiếp trên đó

---

## 11. Files cần tạo/sửa

### Files mới:
| File | Mục đích |
|------|----------|
| `src/lib/google-calendar.ts` | Google Calendar API wrapper (service account) |
| `src/lib/study-planner.ts` | Study plan generation algorithm |
| `src/lib/plan-gate.ts` | Tier-based feature access check |
| `src/app/api/calendar/connect/route.ts` | Connect Google Calendar |
| `src/app/api/calendar/status/route.ts` | Check connection status |
| `src/app/api/calendar/exam-dates/route.ts` | CRUD exam dates |
| `src/app/api/calendar/sync/route.ts` | Generate + sync study plan |
| `src/app/planner/page.tsx` | Exam planner UI |
| `src/app/settings/page.tsx` | Settings/integrations page |
| `src/components/study-planner-form.tsx` | Exam date input form |
| `src/components/study-schedule-view.tsx` | Study schedule display |

### Files sửa:
| File | Thay đổi |
|------|----------|
| [prisma/schema.prisma](cci:7://file:///d:/CRAMBOX/pinky/prisma/schema.prisma:0:0-0:0) | Update `User.plan` + thêm 4 models mới |
| `prisma/seed-hard.mts` | Update plan values: `"free"`, `"plus"`, `"pro"` |
| `.env.example` | Thêm Google service account env vars |
| [package.json](cci:7://file:///d:/CRAMBOX/pinky/package.json:0:0-0:0) | Thêm `googleapis` dependency |
| `src/components/premium-overlay.tsx` | Update cho 3-tier (Plus/Pro thay vì Premium) |
| [src/app/pricing/page.tsx](cci:7://file:///d:/CRAMBOX/pinky/src/app/pricing/page.tsx:0:0-0:0) | Update Pro features list (thêm "Google Calendar sync") |
| `src/proxy.ts` | Protect `/planner` route (Pro-only) |

---

## 12. Phased Implementation

| Phase | Nội dung | Ưu tiên |
|-------|----------|---------|
| **Phase 1** | Schema changes + `googleapis` dep + `.env.example` + `plan-gate.ts` | Cần làm đầu tiên |
| **Phase 2** | `google-calendar.ts` wrapper + service account setup guide | Core logic |
| **Phase 3** | API routes (`/api/calendar/*`) | Backend |
| **Phase 4** | `study-planner.ts` generation algorithm | Core logic |
| **Phase 5** | UI: `/planner` page + `/settings` page + components | Frontend |
| **Phase 6** | Update `premium-overlay.tsx` + [pricing/page.tsx](cci:7://file:///d:/CRAMBOX/pinky/src/app/pricing/page.tsx:0:0-0:0) + seed data | Polish |
| **Phase 7** | Testing: unit test study-planner, integration test calendar sync | QA |

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| User không biết share calendar | UI hướng dẫn step-by-step với screenshot |
| Service account calendar events hiện là "invitations" (user phải accept) | Document rõ; hoặc dùng approach user tạo calendar riêng share write |
| Google API rate limits (1000 req/100s per user) | Batch create events; cache calendar reads |
| Study plan generation quá đơn giản (rule-based) | OK cho MVP; upgrade LLM sau (Phase 4 trong pricing-strategy) |
| SQLite không hỗ trợ tốt cho date queries phức tạp | OK cho dev; PostgreSQL (prod) hỗ trợ đầy đủ |
| Service account key leak | Store trong env vars, không commit vào git |

---

## 14. Câu hỏi còn mở

1. **Calendar approach**: Tạo events trên service account calendar + add user as attendee, **hay** yêu cầu user tạo calendar "Crambox Study" riêng và share write access với service account? (Cách 2 seamless hơn nhưng cần user làm nhiều bước hơn)

2. **Study plan generation**: Giữ rule-based (zero-cost) cho Phase 3, hay muốn dùng LLM ngay? (LLM sẽ tốn cost per request)

3. **Adaptive rescheduling**: Pricing-strategy nói Pro có "adaptive rescheduling" (tự điều chỉnh khi user bỏ lỡ session). Implement luôn hay để sau?

4. **Update `User.plan` ngay?**: Schema hiện tại đang `"basic" | "premium"`. Update sang `"free" | "plus" | "pro"` sẽ cần migration + update seed data. Làm luôn hay chỉ thêm Pro features trước?

---

Bạn muốn tôi bắt đầu implement phase nào, hay cần điều chỉnh kế hoạch trước? Nếu OK, hãy chuyển sang **Code mode** để tôi bắt đầu.