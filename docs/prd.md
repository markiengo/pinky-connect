# PRD: AI Exam Prep App

**Version:** 0.3 — Updated to reflect current implementation
**Last Updated:** June 2026
**Status:** Client-facing Draft

---

## 1. Product Summary

Crambox là một web app giúp sinh viên đại học tìm đề luyện tập phù hợp với nội dung đang học ở trường.

User có thể dùng **AI-style chatbox** để:

* Gõ yêu cầu như: “Cho mình đề Kế toán về định khoản”
* Upload tài liệu PDF của trường
* Nhận lại các đề phù hợp dưới dạng cards
* Chọn đề và làm quiz trực tiếp
* Xem lại lịch sử làm bài, điểm số, và biểu đồ tiến bộ theo môn

MVP sẽ ưu tiên hướng **zero-cost AI**, nghĩa là không gọi OpenAI/Claude API trong bản đầu tiên. Chatbox sẽ hoạt động như một **smart retrieval assistant** dựa trên keyword, tag, subject detection, và database search.

---

## 2. Problem Statement

Sinh viên đại học ở Việt Nam thường phải tự tìm đề luyện thi trên nhiều website khác nhau. Các nền tảng hiện tại như Hoc24, VietJack hoặc các kho đề online khá generic, không cá nhân hóa theo tài liệu học thực tế của từng trường.

Điều này khiến sinh viên mất thời gian lọc đề, dễ luyện sai trọng tâm, hoặc làm các câu chưa liên quan đến nội dung đang học.

---

## 3. Goal

Build một web app nơi sinh viên có thể:

1. Đăng nhập
2. Dùng chatbox để hỏi đề luyện tập
3. Upload tài liệu PDF nếu muốn
4. Nhận đề phù hợp từ question bank
5. Làm quiz ngay trên web
6. Lưu lịch sử làm bài
7. Xem biểu đồ điểm theo thời gian và theo môn

Core goal:

> Giúp sinh viên tìm đề ôn tập đúng trọng tâm nhanh hơn, không cần tự search và lọc thủ công.

---

## 4. Target Users

* Sinh viên đại học các năm 1-4
* Sinh viên đang ôn kiểm tra giữa kỳ, cuối kỳ, hoặc thi lại
* Sinh viên có tài liệu học từ trường như PDF bài giảng, notes, textbook, hoặc đề cũ
* Sinh viên muốn luyện đề đúng chương / đúng môn / đúng nội dung đã học

---

## 5. MVP Positioning

MVP không phải là ChatGPT clone.

Chatbox trong MVP là một **AI-style search interface**, không phải chatbot tự do.

User có thể hỏi:

```text
Cho mình đề Kế toán về bảng cân đối
Tìm đề Tài chính ngân hàng về lãi suất
Mình upload file này, tìm đề giống nội dung trong file
```

System sẽ xử lý bằng:

```text
Prompt / PDF text
↓
Normalize Vietnamese text
↓
Detect subject + topic keywords
↓
Match tags trong database
↓
Return đề cards
```

MVP sẽ không dùng paid LLM API mặc định.

---

## 6. Scope

### 6.1 In MVP

* Username/password login (no OAuth)
* AI-style chatbox as main interface
* Text prompt search
* PDF upload inside chatbox
* Limit: 3 prompts per session
* Limit: 3 PDF files per prompt
* Limit: 200 words per prompt
* PDF-only upload
* Keyword / tag-based matching
* Display matched đề as cards
* User selects a đề
* Quiz page with MCQ and essay / short answer support
* MCQ instant feedback
* Essay answer reveal after submit
* Save quiz attempts
* History page
* Score graph over time
* Bar chart showing average score by subject
* Web only, responsive for mobile browser

---

### 6.2 Out of MVP

* Full free-form AI tutoring chatbot
* AI-generated new đề
* AI grading essay answers
* Claude/OpenAI API by default
* Google OAuth login
* Facebook login
* Unlimited uploads
* Multiple languages
* Native mobile app
* Leaderboard / gamification
* Admin dashboard
* Advanced analytics
* Export or share results

---

## 7. User Flow

```text
Login with username/password
    ↓
AI Chatbox
    ├── User types prompt
    └── User uploads up to 3 PDFs
    ↓
System detects subject/topics
    ↓
Matched đề cards appear
    ↓
User selects one đề
    ↓
Quiz Page
    ├── MCQ → tap answer → instant correct/incorrect feedback
    └── Essay → type answer → submit → reveal model answer
    ↓
Submit quiz
    ↓
Score saved to history
    ↓
Dashboard shows progress graph and subject score chart
```

---

## 8. Chatbox Requirements

### 8.1 Prompt Input

User can type natural requests such as:

```text
Cho mình đề Kế toán về định khoản
Tìm đề Kinh tế vi mô về cầu cung
Cho t đề Pháp luật về hợp đồng dân sự
```

Prompt limits:

| Rule                 |    Limit |
| -------------------- | -------: |
| Prompts per session  |        3 |
| Max words per prompt |      200 |
| Files per prompt     |   3 PDFs |
| Supported file type  | PDF only |

---

### 8.2 File Upload Inside Chatbox

User can attach PDFs with each prompt.

Rules:

* Max 3 files per prompt
* PDF only
* Recommended max size: 20MB per file
* System extracts text from PDF
* System does not send raw PDF to LLM in MVP
* System uses keyword/topic matching to find relevant đề

Example flow:

```text
User:
"Find đề giống mấy file này"
+ uploads 3 PDFs

System:
"Mình thấy nội dung chính là đạo hàm, cực trị, tiếp tuyến.
Dưới đây là các đề phù hợp nhất."
```

---

## 9. Zero-Cost AI Strategy

MVP will use a **zero-paid-AI architecture**.

This means:

* No OpenAI API
* No Claude API
* No paid embedding API
* No paid LLM call
* No AI API key required for MVP matching

Instead, the app uses:

```text
PDF parser
Vietnamese text normalization
Keyword detection
Topic tags
Database search
Rule-based ranking
```

This keeps AI cost at:

```text
0 VND AI cost per upload
0 VND AI cost per chatbox request
```

There will still be normal infrastructure costs such as hosting, database, and storage if usage grows.

---

## 10. Optional Paid AI Upgrade

Later, the system can upgrade to paid AI API for better semantic matching.

### Option A: Zero-cost MVP

```text
Prompt / PDF
↓
Normalize Vietnamese text
↓
Detect keywords/tags
↓
Search database
↓
Return đề
```

Pros:

* No AI bill
* No API key needed
* Easier to control cost
* Lower prompt injection risk
* Good enough for small seeded dataset

Cons:

* Less semantic
* Needs good tags
* User prompt needs clearer keywords

---

### Option B: Paid Embedding API

```text
Prompt / PDF
↓
Convert text into embeddings
↓
Vector search
↓
Return đề
```

Pros:

* Better semantic matching
* Understands similar meaning, not only exact keywords
* Better long-term product quality

Cons:

* Requires API key
* Costs money per processed text
* Needs abuse limits

Estimated cost for 3 files × 8 pages each:

```text
~8–10 VND per upload processing
<1 VND per semantic chatbox search
```

---

### Option C: Paid LLM Chat/Rerank

```text
Prompt / PDF snippets
↓
LLM analyzes or reranks
↓
Returns polished response
```

Pros:

* More natural response
* Can explain why each đề is relevant
* Better chatbox experience

Cons:

* More expensive
* Higher prompt injection risk
* Cost can grow if full chat history is sent repeatedly

Estimated cost:

```text
~20–200+ VND per chatbox request
```

For MVP, this option is not recommended unless client explicitly wants richer AI responses.

---

## 11. Why Upload Can Cost Money With AI API

If the app uses OpenAI / Claude / embedding API, each upload costs money because the app is not using a personal ChatGPT subscription.

ChatGPT Plus or Pro is for one user using ChatGPT directly.

This app is a separate product, so the backend must call an AI provider through API.

API billing works like this:

```text
The more text the app sends to AI,
the more API usage cost it generates.
```

So when a user uploads a PDF, the app may need to:

```text
Extract text from PDF
↓
Send text to AI API for embedding or analysis
↓
Receive result
↓
Use result to find matching đề
```

That AI API call is what creates cost.

In the zero-cost MVP, this step is skipped.

---

## 12. Prompt Injection & Safety Strategy

Uploaded PDFs and chatbox prompts are treated as untrusted input.

MVP avoids prompt injection risk by not sending raw uploaded PDF content to an instruction-following LLM.

Safe MVP flow:

```text
User PDF
↓
Extract text
↓
Normalize text
↓
Keyword/tag match
↓
Database search
```

If paid LLM is added later:

* Do not send secrets to LLM
* Do not send full answer bank unless needed
* Do not send full chat history every time
* Use structured state instead of raw history
* Validate JSON output
* Limit prompt length and file count
* Fallback to deterministic search if LLM fails

---

## 13. Matching Logic

### 13.1 Vietnamese Text Normalization

System normalizes Vietnamese text for easier search.

Example:

```text
"Đạo hàm của hàm số"
↓
"dao ham cua ham so"
```

This is pure code and does not need AI.

---

### 13.2 Subject Detection

System detects subject from prompt/PDF content.

Example keywords:

| Subject | Keywords                                     |
| ------- | -------------------------------------------- |
| Kế toán              | kế toán, định khoản, bảng cân đối, BCTC, tài khoản |
| Tài chính–Ngân hàng  | tài chính, tiền tệ, ngân hàng, lãi suất, tín dụng |
| Quản trị Kinh doanh  | marketing, chiến lược, SWOT, thương hiệu, phân khúc |
| Kinh tế vi mô        | cầu, cung, co dãn, độc quyền, Cournot, Nash |
| Pháp luật đại cương  | hiến pháp, dân sự, thương mại, hợp đồng, tòa án |

---

### 13.3 Topic / Tag Matching

Each đề in the database has tags.

Example:

```json
{
  "title": "Đề Kế toán - Bảng cân đối kế toán",
  "subject": "Kế toán",
  "tags": ["bang_can_doi", "tai_khoan", "dinh_khoan", "bao_cao_tai_chinh"]
}
```

When user prompt/PDF contains matching topics, system ranks đề by tag overlap.

---

## 14. Results Page / Chat Results

Matched đề are displayed as cards.

Each card shows:

* Đề title
* Subject
* Number of questions
* Question type: MCQ / Essay / Mixed
* Match reason, for example:

  * “Khớp với topic: đạo hàm, cực trị”
  * “Khớp với file upload: dao động điều hòa”
* Start Quiz button

Max results:

```text
3–6 đề cards per request
```

---

## 15. Quiz Page

### 15.1 MCQ Questions

* One question displayed at a time
* 4 answer options
* User taps answer
* Correct answer highlights green
* Wrong answer highlights red
* If wrong, correct answer is shown
* Next button to continue
* Progress bar at top
* End screen shows score summary

Example:

```text
Bạn đúng 8/10 câu
```

---

### 15.2 Essay / Short Answer Questions

* Question displayed at top
* Text input field below
* Submit button
* On submit, reveal model answer
* No AI grading in MVP
* Essay score is not automatically counted unless manually configured

---

## 16. Auth

Implementation:

```text
Username/password login (bcryptjs + JWT session)
```

Details:

* Passwords hashed with bcryptjs (10 rounds)
* JWT session in httpOnly cookie (`session_v2`)
* Dev mode: session-only cookie (cleared on browser close)
* Production: 7-day session with auto-logout on expiry
* No OAuth (Google/Facebook) in current version

---

## 17. Quiz History

After user completes a quiz, system saves the attempt.

Saved data:

* User ID
* Đề ID
* Subject ID
* Score
* Total questions
* Percentage
* Completed date

History page shows:

| Field        | Description     |
| ------------ | --------------- |
| Đề title     | Name of quiz    |
| Subject      | Kế toán / Tài chính / QTKD |
| Score        | Example: 8/10   |
| Percentage   | Example: 80%    |
| Completed at | Date/time       |

---

## 18. Dashboard & Graphs

Dashboard includes:

### 18.1 Score Over Time

Line graph showing user score progression across attempts.

Example:

```text
Attempt 1: 60%
Attempt 2: 75%
Attempt 3: 85%
```

---

### 18.2 Average Score by Subject

Bar chart showing average score per subject.

Example:

```text
Kế toán: 78%
Tài chính: 65%
QTKD: 82%
```

This helps students see which subjects need more practice.

---

## 19. Data Model

### 19.1 `subjects`

| Column     | Type      | Notes                 |
| ---------- | --------- | --------------------- |
| id         | uuid      | Primary key           |
| name       | text      | Kế toán, Tài chính, QTKD |
| slug       | text      | ke_toan, tai_chinh_ngan_hang, quan_tri_kinh_doanh |
| created_at | timestamp |                       |

---

### 19.2 `de_thi`

| Column           | Type      | Notes                 |
| ---------------- | --------- | --------------------- |
| id               | uuid      | Primary key           |
| subject_id       | uuid      | FK → subjects         |
| title            | text      | Name of đề            |
| source           | text      | School/year/source    |
| tags             | text[]    | Topic tags            |
| normalized_title | text      | Search-friendly title |
| created_at       | timestamp |                       |

---

### 19.3 `questions`

| Column         | Type  | Notes                          |
| -------------- | ----- | ------------------------------ |
| id             | uuid  | Primary key                    |
| de_thi_id      | uuid  | FK → de_thi                    |
| type           | enum  | mcq or essay                   |
| content        | text  | Question text                  |
| options        | jsonb | 4 options for MCQ              |
| correct_answer | text  | Correct answer or model answer |
| order_index    | int   | Question order                 |

---

### 19.4 `quiz_attempts`

| Column          | Type      | Notes                  |
| --------------- | --------- | ---------------------- |
| id              | uuid      | Primary key            |
| user_id         | uuid      | FK → auth user         |
| de_thi_id       | uuid      | FK → de_thi            |
| subject_id      | uuid      | FK → subjects          |
| score           | int       | Number correct         |
| total_questions | int       | Total scored questions |
| percentage      | numeric   | Score percentage       |
| completed_at    | timestamp |                        |

---

### 19.5 `quiz_answers`

| Column      | Type      | Notes                      |
| ----------- | --------- | -------------------------- |
| id          | uuid      | Primary key                |
| attempt_id  | uuid      | FK → quiz_attempts         |
| question_id | uuid      | FK → questions             |
| user_answer | text      | User selected/typed answer |
| is_correct  | boolean   | True/false/null for essay  |
| created_at  | timestamp |                            |

---

### 19.6 Optional Future Table: `embeddings`

Only needed if paid embedding or local embedding is added later.

| Column     | Type      | Notes           |
| ---------- | --------- | --------------- |
| id         | uuid      | Primary key     |
| de_thi_id  | uuid      | FK → de_thi     |
| chunk_text | text      | Text chunk      |
| embedding  | vector    | pgvector column |
| created_at | timestamp |                 |

---

## 20. Tech Stack

| Layer            | Tool                               |
| ---------------- | ---------------------------------- |
| Frontend         | Next.js                            |
| Hosting          | Railway                            |
| Backend          | Next.js API Routes                 |
| Auth             | bcryptjs + jose JWT (username/pass) |
| Database         | SQLite (dev) / PostgreSQL (prod) |
| File Storage     | Local (dev) / cloud storage (prod) |
| Search           | PostgreSQL tags / full-text search |
| PDF Parsing      | pdf-parse or PyMuPDF               |
| Charts           | Recharts                           |
| Paid AI          | Not used in MVP                    |
| Future Vector DB | PostgreSQL pgvector                |

---

## 21. Question Bank Seeding

Before demo, team will manually prepare question bank.

Seed target:

* 5 subjects: Kế toán, Tài chính–Ngân hàng, Quản trị Kinh doanh, Kinh tế vi mô, Pháp luật đại cương
* 30 đề per subject (150 total)
* 20 questions per đề
* 3,000 total questions
* Each đề must have clean tags
* Each question must have correct answer / model answer
* Seed script should be repeatable

Example tags:

```text
ke_toan
bao_cao_tai_chinh
tai_khoan
tai_chinh
ngan_hang
lai_suat
quan_tri
marketing
chien_luoc
```

---

## 22. Non-Functional Requirements

* PDF processing under 10 seconds for normal files
* Search results under 5 seconds
* UI responsive on mobile browser
* App should not crash during live demo
* No live scraping during demo
* Seed data controlled before demo
* File and prompt limits enforced server-side
* Chatbox should show clear error states

---

## 23. Error States

### Upload Errors

* File is not PDF
* File too large
* Too many files
* Could not parse PDF
* PDF has no readable text

### Chatbox Errors

* Prompt too long
* Prompt limit reached
* No matching đề found
* User not logged in
* Server/database error

### No Match State

Message:

```text
Không tìm thấy đề phù hợp. Bạn hãy thử nhập rõ môn học/chủ đề hơn hoặc upload tài liệu khác.
```

---

## 24. Timeline

| Day   | Task                                            |
| ----- | ----------------------------------------------- |
| Day 1 | Database setup, auth, schema, seed script       |
| Day 2 | Question bank seeding, tags, search logic       |
| Day 3 | Chatbox UI, prompt parsing, PDF upload          |
| Day 4 | PDF parsing, Vietnamese normalization, matching |
| Day 5 | Results cards, quiz page, MCQ/essay flow        |
| Day 6 | Quiz history, dashboard, score graphs           |
| Day 7 | Testing, UI polish, bug fixes only              |

---

## 25. Demo Success Criteria

Demo is successful if:

* User can log in with username/password
* User can type a prompt in chatbox
* User can upload up to 3 PDFs
* System returns at least 3 relevant đề cards
* User can start and complete a quiz
* MCQ feedback works correctly
* Essay answer reveal works
* Score is saved to history
* Dashboard shows score trend and subject bar chart
* App runs without crashing
* No paid AI API is required for demo

---

## 26. Final Product One-Liner

**Crambox là một smart exam assistant giúp sinh viên đại học hỏi đề, upload tài liệu học, nhận đề luyện tập phù hợp, làm quiz, và theo dõi tiến bộ theo từng môn — without paid AI cost in MVP.**
