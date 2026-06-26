# Design Extraction & Implementation Guide
## Vietnamese College Exam-Prep App — Full UI/UX Reference Analysis
### 4 Reference Images → 1 Unified Design System

---

> **Purpose:** This document is a 100%-fidelity extraction of mood, palette, typography, layout, components, and interaction patterns from 4 reference images. A second AI (or a developer) reading this document alone should be able to replicate the aesthetic without ever seeing the source images.

---

## TABLE OF CONTENTS

1. [Image 1 — Learnthru Dashboard (Bookish/Aesthetic Reference)](#image-1)
2. [Image 2 — Poieto Login (Đề Pane Reference)](#image-2)
3. [Image 3 — Mindloop Landing (Additional Reference)](#image-3)
4. [Image 4 — Imagination Landing (Landing Page Reference)](#image-4)
5. [Unified Design System Recommendation](#unified)
6. [Implementation Execution Guide](#execution)
7. [How to Get the "Feel" — Intangibles](#feel)

---

<a name="image-1"></a>
## IMAGE 1 — Learnthru Dashboard
### Role in Project: Bookish / Aesthetic Reference. Structural component reference for the dashboard layout.

---

### 1. Overall Mood

- **Style:** Clean SaaS dashboard, soft educational, modern-light, flat-leaning with subtle depth
- **Feel:** Friendly and organized. Not corporate, not playful — sits in a "productive student workspace" register
- **Vibe words:** Airy, structured, calm, approachable, functional
- **NOT:** Minimalist brutalism. NOT editorial. NOT dark. NOT high-contrast
- **Closest design genre:** Figma Community "educational SaaS dashboard" — but done with more restraint than typical

---

### 2. Exact Color Palette

| Role | Hex | Notes |
|------|-----|-------|
| Page background | `#E8EAF0` | Cool desaturated lavender-grey. Not white. Subtle but deliberate. |
| Sidebar background | `#FFFFFF` | Pure white. Contrast against page background. |
| Main content background | `#FFFFFF` | White card surface |
| Right panel background | `#FFFFFF` | White |
| Hero banner background | `#F0F1F8` | Very light blue-grey. Slightly cooler than white. |
| Primary blue (cards, profile ring, active states) | `#8093F1` | Periwinkle / lavender-blue. Medium saturation. |
| Deep navy card (English Unit III) | `#5B6CC7` | Darker periwinkle, confident. Not navy, not bright blue. |
| Mid blue card (English Unit II) | `#7DACD6` / `#6DB8EB` | Muted sky blue |
| Pink/coral card (Unit I) | `#F4899A` | Desaturated rose-pink. Coral without being orange. |
| Pink gradient card endpoint | `#F7B3BE` | Lighter rose, used as gradient end |
| Accent salmon (banner illustration) | `#F4A295` | Soft salmon/coral for book illustration |
| CTA button background | `#8093F1` | Same as primary blue |
| CTA button text | `#FFFFFF` | White |
| Primary text | `#1A1A2E` | Near-black with a blue-grey undertone, NOT pure black |
| Secondary text / labels | `#7A7A9D` | Desaturated lavender-grey. Muted but legible. |
| Tertiary text / captions | `#A0A0C0` | Even lighter. Used for table secondary info. |
| Dividers / borders | `#E8E8F0` | Almost invisible. 1px, same family as background. |
| Calendar highlight (today) | `#8093F1` | Blue circle |
| Calendar accent (event) | `#F4899A` | Pink circle — matches card accent color |
| Done status dot | `#8093F1` | Blue |
| Pending status dot | `#F4899A` | Pink |
| Search bar background | `#F0F1F8` | Same as hero banner, slightly grey |
| Icon color | `#8093F1` | Consistent — all icons use primary blue |
| Nav item active | `#1A1A2E` | Bold text, no background color change |
| Nav item inactive | `#7A7A9D` | Muted |
| Profile avatar ring | `#8093F1` | Blue border on profile photo |
| Tag/avatar group overlap border | `#FFFFFF` | White border between stacked avatars |

---

### 3. Typography

- **Display / Welcome heading:** Sans-serif, bold, `font-weight: 700`, approx `22–24px`, color `#1A1A2E`
- **Subheading (section titles like "Classes", "Lessons"):** `font-weight: 600`, approx `16px`, `#1A1A2E`
- **Card title text:** `font-weight: 700`, approx `15–16px`, `#FFFFFF` (on colored cards)
- **Body / table text:** `font-weight: 400`, approx `13–14px`, `#1A1A2E`
- **Secondary / label text:** `font-weight: 400`, approx `12px`, `#7A7A9D`
- **CTA button text:** `font-weight: 600`, approx `14px`, `#FFFFFF`
- **Nav items:** `font-weight: 500`, approx `14px`
- **Calendar numbers:** `font-weight: 400`, approx `12px`; highlighted dates `font-weight: 700`
- **Font family inferred:** Likely **Inter**, **DM Sans**, or **Poppins** — rounded sans-serif with geometric proportions, good at small sizes
- **Letter spacing:** Default/normal — no tracked-out uppercase, no compressed
- **Line height:** Standard (~1.4–1.5 for body)
- **Uppercase usage:** Minimal — only column headers in table (`CLASS`, `TEACHER NAME`, etc.) appear to use uppercase, `font-size: 11px`, `letter-spacing: 0.08em`

---

### 4. Layout

- **Structure:** 3-column layout — Left sidebar (fixed) + Main content (scrollable) + Right panel (fixed)
- **Left sidebar width:** ~200px
- **Right panel width:** ~280px
- **Main content:** Flexible, fills remaining space
- **Page padding:** ~24–32px on all sides
- **Gap between sections:** ~24px
- **Card grid:** 3-column equal-width grid for class cards, ~16px gap
- **Table:** Full-width, 6 columns, ~48px row height, alternating white rows (no zebra striping visible — clean white)
- **Border radius:**
  - Page container: `16px`
  - Cards: `12px`
  - Buttons: `8px`
  - Search bar: `8px`
  - Profile photo: `50%` (circle)
  - Calendar cells: `50%` (circle for highlighted)
  - Avatar images: `50%`
- **Shadows:** Very subtle. Cards use `box-shadow: 0 2px 8px rgba(0,0,0,0.06)` — barely visible. Panel dividers use nothing.
- **Full-bleed vs contained:** Contained. The entire dashboard lives inside a rounded-corner wrapper at ~90% viewport width, with the grey page background visible at edges.
- **Vertical rhythm:** Consistent ~8px base unit

---

### 5. Components

#### Sidebar / Left Nav
- Logo: Small geometric icon + wordmark, `font-weight: 700`, `#1A1A2E`
- Nav items: Icon + label side by side, 44px height, 16px padding, `border-radius: 8px` on hover/active
- Active item: Bold text, icon color shifts to primary blue
- Bottom: "Need help?" card — rounded, light blue-grey background, support illustration (3D-ish character), small body text
- Width: ~200px, no visible border-right, contrast comes from background difference

#### Search Bar
- Width: ~60% of main area
- Height: ~40px
- Background: `#F0F1F8`
- Border: None or 1px `#E8E8F0`
- Border-radius: `8px`
- Icon: Search icon left-aligned, `#7A7A9D`
- Placeholder text: `#A0A0C0`

#### Welcome Hero Banner
- Background: `#F0F1F8` rounded card
- Left: Text content (heading + body + CTA button)
- Right: 3D illustration of stacked books (isometric, flat colors with slight shadow)
- Button: `background: #8093F1`, `color: #FFFFFF`, `border-radius: 8px`, `padding: 10px 20px`, `font-weight: 600`

#### Class Cards
- 3 cards in a row
- Solid color fills (deep blue, sky blue, pink) — no gradients, flat but saturated
- Top: Card title in white, bold
- Middle: Avatar group (stacked circles with white border, +N counter bubble)
- Bottom: 2 rows of metadata (file count with icon, teacher name with icon)
- All text white on colored card
- No image inside cards — pure color + text

#### Lessons Table
- Header row: Light grey background `#F8F8FC`, uppercase small caps labels
- Data rows: White background, 1px bottom divider `#E8E8F0`
- Status column: Colored dot (`8px` circle) + text label
- Download column: Text link `#8093F1`, underline on hover (inferred)
- Avatar column: Stacked small circles (same pattern as cards)

#### Right Panel — Profile
- Avatar: Large circle `~80px`, primary blue ring
- Name: Bold, `#1A1A2E`
- Role: Small text, `#7A7A9D`
- Profile button: Full-width, `background: #8093F1`, white text, `border-radius: 8px`

#### Right Panel — Calendar
- Month/year header + arrow navigation
- Day-of-week labels: `#7A7A9D`, uppercase, `11px`
- Date numbers: `12px`, `#1A1A2E`
- Today: Blue filled circle `#8093F1`, white number
- Event day: Pink filled circle `#F4899A`, white number
- Selected/other: Grey circle, muted number
- Weekends: Slightly muted vs weekday

#### Right Panel — Reminders
- Section title: Bold, `16px`
- Each item: Bell icon (outline) + bold title + date subtitle, aligned in a column
- Last item appears faded (opacity 0.4–0.5) suggesting it's in the past or hidden
- No background on items, just dividers implied by spacing

---

### 6. Decorative Elements

- **NO gradients** on backgrounds or cards — pure flat fills
- **NO blobs** or organic shapes
- **NO textures**
- **Illustration:** Single 3D isometric stacked-books illustration in hero. Flat colors, no photo-realism.
- **Shadows:** Extremely light, almost non-existent. `0 2px 8px rgba(0,0,0,0.05)`
- **Avatar overlaps:** White border `2px` between stacked profile photos — purely decorative but critical to the component pattern
- **Overall decoration budget:** Very low. The color in the class cards IS the decoration.

---

### 7. Text Hierarchy

```
H1   — "Welcome back, Stella Walton!" — bold, 22px, #1A1A2E
H2   — "Classes", "Lessons" — semibold, 16px, #1A1A2E
H3   — "English – UNIT III" — bold, 15px, #FFFFFF (on card)
Body — "New French speaking classes are available..." — regular, 13px, #7A7A9D
CTA  — "Buy Lesson" — semibold, 14px, #FFFFFF on #8093F1 button
Label — "10 Files", "Teacher: Leona Jimenez" — regular, 12px, #FFFFFF/80% on card
Caption — "Do you have any problem while using the Learnthru?" — regular, 12px, #7A7A9D
Table header — "CLASS", "TEACHER NAME" — uppercase, 11px, letter-spacing 0.08em, #A0A0C0
Date — "12 May 2022, Friday" — regular, 13px, #7A7A9D, right-aligned
```

---

### 8. Inferred Interactions

- **Nav items:** Background-fill hover state `rgba(128, 147, 241, 0.1)`, transition `150ms ease`
- **CTA button:** Slight darkening `#6B7FD4` on hover, `transform: translateY(-1px)` optional
- **Table rows:** Background `#F8F8FC` on hover, `150ms ease`
- **Calendar dates:** Hover background circle, `opacity: 0.6` version of the target color
- **Cards:** Subtle `translateY(-2px)` lift + shadow increase on hover
- **"View All" links:** Color shift to `#6B7FD4` on hover, no underline

---

### What to Reuse in Your App

- **Color palette directly:** The `#8093F1` periwinkle is already in your token set as `#8093F1` — match exactly
- **Avatar group pattern:** Stack avatars with white `2px` border, +N counter
- **Card color fills:** Flat saturated color cards (no gradient, no image) for subject category cards
- **Table pattern:** Clean, minimal table with dot-status indicators
- **Sidebar structure:** Fixed nav with icon+label pairs

### What is Mood-Only (Don't Copy Literally)

- The 3D book illustration — replace with your own illustration or photo
- The English-language class names — your subjects are Kế toán, Tài chính, QTKD
- The calendar widget — your app likely doesn't need this

---

<a name="image-2"></a>
## IMAGE 2 — Poieto Login Screen
### Role in Project: The ĐỀ PANE reference — the exam-paper info panel with aesthetic background

---

### 1. Overall Mood

- **Style:** Editorial, academic, art-museum quality. Feels like a university portal designed by someone who also curates gallery shows.
- **Feel:** Quiet confidence. The image does not shout. It places a classical pointillist painting behind a clean, cream-toned login card and trusts that contrast alone creates beauty.
- **Vibe words:** Cultured, warm-neutral, restrained luxury, intellectual, artful
- **NOT:** Pastel startup. NOT dark SaaS. NOT minimalist brutalism.
- **Closest design genre:** "Art-forward fintech" — think are.na meets a high-end museum membership app

---

### 2. Exact Color Palette

| Role | Hex | Notes |
|------|-----|-------|
| Background (blurred painting) | Multicolor — greens `#6BAF6C`, yellows `#D4B84A`, blues `#4E7BA6`, ochres `#C49A3C` | Pointillist painting — Signac style |
| Background blur intensity | ~`blur(12–16px)` applied to full-screen painting | Heavy blur, painting becomes texture not content |
| Card background | `#F5F0E8` | Warm cream / parchment. Slightly yellow-white. Critical tone. |
| Card left half (painting inset) | `#F5F0E8` border around actual unblurred painting crop | Painting visible inside card, NOT blurred |
| Primary text (heading) | `#1C1C1C` / `#111111` | Near-black. Very dark, no color cast. |
| Secondary text ("Login to") | `#3D3D3D` | Dark grey, lighter than heading |
| Input field background | `#EEEBE3` | Slightly darker cream than card background |
| Input field border | `#D9D4C7` | Warm grey, muted |
| Input placeholder text | `#8C8880` | Warm grey, readable |
| Link text ("Sign up") | `#C4783A` / `#B86E30` | Warm amber/terracotta. The only color accent on the card. |
| "Back" arrow + text | `#3D3D3D` | Same dark grey as secondary text |
| Logo mark | `#111111` | Black |
| Logo tagline text | `#3D3D3D` | Dark grey |
| Card border | None visible | Card is defined by shadow, not border |
| Card shadow | `box-shadow: 0 8px 40px rgba(0,0,0,0.18)` | Medium-soft. Stronger than typical light UI. Needed to lift from patterned background. |
| Card border-radius | `16–20px` | Clearly rounded, not sharp |

---

### 3. Typography

- **Heading ("Where Knowledge Comes Alive"):** Large serif display — likely **Playfair Display**, **Lora**, or **EB Garamond** (your current token — confirmed reusable). `font-size: ~36–40px`, `font-weight: 700`, `line-height: 1.2`, `color: #111111`. This is the dominant typographic moment in the image.
- **"Login to" pre-heading:** Small sans-serif, `font-size: ~14px`, `font-weight: 400`, `color: #3D3D3D`. Contrast with the large serif below — classic editorial pairing.
- **Input labels / placeholder:** Sans-serif, `font-size: 14px`, `font-weight: 400`, `color: #8C8880`
- **Link text ("Sign up"):** Same sans-serif, `font-weight: 600`, `color: #C4783A` (amber accent)
- **"Back" label:** Sans-serif, `font-size: 13px`, `font-weight: 400`
- **Logo wordmark ("poieto"):** Custom or geometric sans-serif, `font-size: ~18px`, `font-weight: 700`, `color: #111111`
- **Logo tagline:** `font-size: 11px`, `font-weight: 400`, `color: #3D3D3D`, `line-height: 1.3`

**Critical pairing:** The contrast between a large, confident serif heading and small, quiet sans-serif helper text IS the typographic identity of this card. This is directly applicable to your exam pane.

---

### 4. Layout — The Đề Pane Deep Dive

#### Card Shape and Dimensions
- **Shape:** Rounded rectangle, `border-radius: 16–20px`
- **Proportion:** Approximately `2:1` wide — left half is the painting image, right half is the form content
- **Overall card width:** ~`720–800px` max-width. Would be `90vw` on mobile.
- **Overall card height:** Auto, driven by form content — approximately `480–520px`
- **Split:** Left `50%` = painting/image. Right `50%` = form. Clean vertical midline.
- **Left side (painting):** The painting fills this area with `object-fit: cover`. It is NOT blurred inside the card — it shows clearly. The painting is a real crop of the background image but rendered sharp.
- **Right side (form):** White/cream background `#F5F0E8`, `padding: ~40–48px`
- **Vertical alignment (right side):** Content is vertically centered within the right panel
- **Background behind card:** The same painting image, but `blur(14px) brightness(0.85)` applied — dramatically out of focus, creating a rich painterly texture without legibility

#### Information inside the Card (Right Panel)
```
← Back                          ← navigation link, top-left of right panel
---
Login to                        ← small sans-serif label (pre-heading)
Where Knowledge Comes Alive     ← large serif H1 (this is the app tagline/brand)
---
[ Enter email         ]         ← input field, cream bg, no border-focus style visible
[ Enter password      ]         ← input field
---
Don't have an account? Sign up  ← inline helper text + amber link
---
[logo mark]  poieto             ← bottom-left of right panel
             Shared Knowledge   ← logo tagline below wordmark
             for a Responsible
             AI Future.
```

#### The "Aesthetic Picture Behind" — Full Analysis
- It is a **reproduction of a pointillist painting** — the style matches Paul Signac's work (early 1900s French post-impressionism). Specific painting may be "In the Time of Harmony" or similar Signac work.
- Background role: The full-screen background is this painting rendered at `blur(12–16px)`, `brightness(0.85–0.9)`, `scale(1.05)` (to avoid edge artifacts from blur). The painting becomes pure **texture and color field** — you can sense the greens and yellows but cannot read the scene.
- Inside the card (left panel): The same or similar painting is shown **unblurred, cropped to fill the left 50%** of the card, `object-fit: cover`, with a subtle `border-radius: 16px 0 0 16px` to round only the left corners.
- The left panel image has a very faint `overlay: rgba(0,0,0,0.05–0.08)` at most — the painting is meant to be seen clearly, just darkened slightly for depth.

#### Foreground/Background Contrast Relationship
- Background painting (blurred): average luminance drops to ~40% due to blur + darkening
- Card on top: `#F5F0E8` cream is high-luminance, very readable
- The contrast ratio between card and blurred background is high enough that no border is needed
- Text on cream side: `#111111` on `#F5F0E8` → contrast ratio ~12:1 (WCAG AAA easily)
- Text on image side (left panel): No text placed on image — intentional. Avoids contrast failure.

---

### 5. Components

#### Input Fields
- Background: `#EEEBE3` (warm, slightly darker than card surface)
- Border: `1px solid #D9D4C7` or no border (hard to tell at this resolution)
- Border-radius: `6–8px`
- Height: `44–48px`
- Padding: `12px 16px`
- Placeholder: `color: #8C8880`, `font-size: 14px`
- Focus state: Inferred — border color shifts to `#C4783A` (amber), `box-shadow: 0 0 0 3px rgba(196, 120, 58, 0.15)`
- NO floating labels visible — placeholder replaces label

#### Back Navigation
- Arrow icon (←) + "Back" text
- `color: #3D3D3D`
- `font-size: 13px`
- No background, no pill shape — pure text link

#### Logo Block
- Logo mark (geometric, abstract — looks like "10" or leaf shape)
- Wordmark "poieto"
- Tagline below
- All stacked, bottom-left aligned

---

### 6. Decorative Elements

- **Primary decoration:** The painting itself IS the decoration. Everything else is stripped to zero.
- **Blur effect on background:** `backdrop: blur(14px)` equivalent on the background div — NOT a CSS backdrop filter on the card, but a separate blurred background div underneath
- **No gradients** anywhere on the card
- **No drop shadows on the painting inset** — the left/right panel split is clean
- **Single color accent:** Amber `#C4783A` on the "Sign up" link — this is the only chromatic accent in the entire design

---

### 7. Text Hierarchy

```
Nav      — "← Back" — sans-serif, 13px, #3D3D3D
Pre-head — "Login to" — sans-serif, 14px, regular, #3D3D3D
H1       — "Where Knowledge Comes Alive" — serif display, 36–40px, bold, #111111
Input    — "Enter email", "Enter password" — sans-serif, 14px, #8C8880
Body     — "Don't have an account?" — sans-serif, 13px, #8C8880
Link CTA — "Sign up" — sans-serif, 13px, semibold, #C4783A
Logo     — "poieto" — sans-serif, 18px, bold, #111111
Tagline  — "Shared Knowledge for a Responsible AI Future." — sans-serif, 11px, regular, #3D3D3D
```

---

### 8. Inferred Interactions

- **Input focus:** Border color `#C4783A`, soft glow `box-shadow: 0 0 0 3px rgba(196,120,58,0.12)`
- **Back link hover:** Text color `#111111`, `text-decoration: underline`
- **Sign up link hover:** `text-decoration: underline`, color stays `#C4783A`
- **Card entrance:** Probably `fadeIn + translateY(8px → 0)` on load, `300ms ease-out`
- **Background:** Static — the blurred painting does not animate

---

### Application to Your Đề Pane

Your đề pane = the exam-paper info card. Apply this image's pattern as:

```
[Left half: Subject-relevant art/illustration/photo — unblurred, cropped, object-fit cover]
[Right half: cream/warm bg — exam metadata]
  Subject name (pre-heading, small sans)
  Đề title (large serif, bold)
  ---
  Tags: [Kế toán] [Năm 3] [30 câu]
  Difficulty: ••• (3/5 dots)
  Source: Đề thi HK1 2023
  ---
  [Làm bài]  [Xem đáp án]
Background: Subject-art blurred to full viewport
```

---

<a name="image-3"></a>
## IMAGE 3 — Mindloop Landing Page
### Role in Project: Additional reference — atmospheric hero, illustrative style, soft focus

---

### 1. Overall Mood

- **Style:** Dreamy, contemplative, full-bleed illustration hero. Soft gradient sky. Academic-adjacent (someone reading/studying on a hillside). Feels like a meditation or focus app.
- **Feel:** Aspirational calm. "This product will help you think clearly." Not stressful, not urgent.
- **Vibe words:** Serene, vast, open, atmospheric, soft, poetic
- **NOT:** Corporate SaaS. NOT dark-mode technical. NOT pastel EdTech.
- **Closest genre:** "Aesthetic productivity app landing" — Notion-adjacent but more painterly

---

### 2. Exact Color Palette

| Role | Hex | Notes |
|------|-----|-------|
| Sky top (deep dusk blue) | `#3A4A7A` / `#2E3D6B` | Desaturated dark blue-purple |
| Sky mid (horizon purple-pink) | `#7A5A8A` / `#8B6090` | Dusty purple |
| Sky near horizon (pink glow) | `#C4849A` / `#D4909A` | Dusty rose, sunset |
| Horizon glow (warmest) | `#E8B4A0` / `#EAB89A` | Peach/salmon near sun position |
| Mountains/mist | `#B8C4D8` / `#C0CCD8` | Hazy blue-grey |
| Flowers (foreground) | `#C8A0C8` / `#B890B8` | Muted lavender purple |
| Grass (foreground) | `#4A7A50` / `#3D6844` | Desaturated forest green |
| Character silhouette | `#2A3048` | Almost black, dark navy |
| Stars/particles | `#FFFFFF` at 20–40% opacity | Scattered, tiny |
| Navbar background | Transparent over illustration | No background |
| Navbar text | `#FFFFFF` | White, `font-weight: 400` |
| Hero H1 text | `#FFFFFF` | White, large, bold |
| Subheading text | `rgba(255,255,255,0.75)` | Semi-transparent white |
| Email input background | `rgba(255,255,255,0.15)` | Frosted glass effect |
| Email input border | `rgba(255,255,255,0.3)` | Faint white border |
| Email input text | `#FFFFFF` |  |
| Button background | `rgba(255,255,255,0.9)` | Near-white |
| Button text | `#2A3048` | Dark navy — reversal of hero text |
| Social proof avatars border | `#FFFFFF` | White ring |
| Social proof text | `rgba(255,255,255,0.85)` | Near-white |

---

### 3. Typography

- **H1 ("Focus in a Distracted World"):** Large, clean sans-serif. NOT serif despite the mood. `font-size: ~52–64px`, `font-weight: 700`, `color: #FFFFFF`, `line-height: 1.1`. The simplicity of sans against the painterly illustration creates a contrast that serves better than serif would.
- **Font family inferred:** **Inter**, **Satoshi**, or **Plus Jakarta Sans** (which you already have in your token set)
- **Subheading:** `font-size: ~16–18px`, `font-weight: 400`, `color: rgba(255,255,255,0.75)`, `max-width: ~480px`, centered
- **CTA button text:** `font-size: 14px`, `font-weight: 600`, `color: #2A3048`
- **Navbar links:** `font-size: 14px`, `font-weight: 400`, `color: #FFFFFF`
- **Social proof text ("7,000+ people already subscribed"):** `font-size: 13px`, `font-weight: 500`, `color: rgba(255,255,255,0.85)`
- **Letter spacing:** Default. No unusual tracking.
- **Uppercase:** None visible.

---

### 4. Layout

- **Hero:** Full-viewport-height, full-bleed illustration (no margins)
- **Content positioning:** Centered horizontally, upper-middle vertically (not centered — sits at ~35% from top)
- **Navbar:** Fixed top, transparent, `padding: 16px 40px`, flex row with logo left, links center, icons right
- **Hero content stack (top to bottom):**
  1. Social proof row (avatars + text) — ~`28px` height
  2. `16px` gap
  3. H1 — large, centered
  4. `16px` gap
  5. Subheading paragraph — centered, max-width ~480px
  6. `32px` gap
  7. Email + button inline row (pill shape, combined)
- **Email+button row:** Single rounded pill containing email input left + button right, `border-radius: 999px`, total height ~`48px`
- **Illustration:** Full bleed, `object-fit: cover`, `height: 100vh`, `width: 100vw`. Character and flowers placed in lower 60% of image.
- **Max-width of text content:** ~`600px`, centered
- **No cards, no sections below the fold visible** in this crop

---

### 5. Components

#### Frosted Glass Input+Button Combo
- Container: `border-radius: 999px`, `background: rgba(255,255,255,0.12)`, `border: 1px solid rgba(255,255,255,0.25)`, `backdrop-filter: blur(8px)`
- Email input: `background: transparent`, `color: #FFFFFF`, `placeholder: rgba(255,255,255,0.6)`, `padding: 0 24px`, `flex: 1`
- Button inside pill: `background: rgba(255,255,255,0.9)`, `color: #2A3048`, `border-radius: 999px`, `padding: 10px 24px`, `font-weight: 600`
- The button sits inside the pill container visually, with ~`4px` margin from edges

#### Social Proof Row
- 3 stacked avatar circles, `width: 28px`, `height: 28px`, overlapping by 8px, white 2px border
- Text to the right: "7,000+ people already subscribed"
- Font: `13px`, `font-weight: 500`
- Alignment: flex row, vertically centered

#### Navbar
- Logo: Small circular icon + "Mindloop" wordmark
- Nav links: "Features", "About", "News", "Docs" — spaced evenly
- Social icons: Instagram, LinkedIn, X (Twitter) — outline icons, white

---

### 6. Decorative Elements

- **The illustration IS the entire decoration.** It is an AI-generated or high-quality digital illustration in a soft painterly style — NOT a photograph.
- **Style of illustration:** Soft brush strokes, dreamlike, anime-adjacent but not anime. Think Studio Ghibli-esque outdoor scene. Colors are desaturated and harmonious.
- **Stars:** Scattered white dots in the sky portion, very small, low opacity
- **Gradient overlay on illustration:** A subtle linear gradient from `transparent` at mid-image to `rgba(0,0,0,0.2)` at very top — creates contrast for the white navbar text
- **No other decorative elements.** No blobs, no patterns, no cards in hero.

---

### 7. Text Hierarchy

```
Social proof  — "7,000+ people already subscribed" — 13px, medium, white 85%
H1            — "Focus in a Distracted World" — 56px, bold, white
Subheading    — "Tools for deep work and clarity..." — 16px, regular, white 75%
CTA secondary — "Enter your email..." — 14px, regular, white 60% (placeholder)
CTA primary   — "Join Waitlist" — 14px, semibold, #2A3048 on white button
Nav links     — "Features", "About", etc. — 14px, regular, white
```

---

### 8. Inferred Interactions

- **Button hover:** Button background `#FFFFFF` (full opacity), slight scale `1.02`
- **Input focus:** Border-glow with white at higher opacity
- **Parallax scroll:** Likely — the illustration likely shifts at a slower rate than the text on scroll
- **Navbar:** May pick up a backdrop blur (`blur(12px) + semi-transparent dark`) on scroll

---

### What to Reuse from Image 3

- **Full-bleed illustration background pattern** for your landing page hero — use a Vietnamese student studying or an exam-table illustration
- **Frosted-glass pill input+button combo** — very implementable, applies to search/filter bar in your app
- **Social proof avatar row** — "X students already studying"
- **Transparent navbar that gains background on scroll**
- **Content centering at ~35% from top** — feels more poetic than dead-center

### What is Mood-Only

- The Ghibli illustration style itself — you'd need to commission or generate your own
- The specific color palette (cool blue-purple) — your app is warmer pink/lavender

---

<a name="image-4"></a>
## IMAGE 4 — "Be in Touch with Your Imagination" Landing Page
### Role in Project: THE primary landing page reference

---

### 1. Overall Mood

- **Style:** Dark, atmospheric, cinematic, dreamlike. Full-bleed 3D/AI render. The visual language of a premium AI product or immersive experience. Dark blues dominate.
- **Feel:** Wonder, awe, a sense of something beyond ordinary. "This product does something extraordinary." Commands attention without being aggressive.
- **Vibe words:** Cinematic, luminous, mysterious, premium, surreal, weightless
- **NOT:** Educational startup pastel. NOT corporate SaaS. NOT bookish editorial.
- **Closest genre:** High-end creative AI tool landing — think Runway, Midjourney, Pika Labs

---

### 2. Exact Color Palette

| Role | Hex | Notes |
|------|-----|-------|
| Background (primary) | `#1E2440` / `#1A2038` | Deep navy, almost slate. NOT pure black. Has blue-purple undertone. |
| Background (lighter mid-area) | `#2A3258` | Slightly lighter navy in mid-shot |
| Surface/floor reflection | `#1E2440` mirrored | Reflective wet surface, same as bg |
| Fish/creature (orange glow) | `#E8702A` / `#F07830` | Warm amber-orange bioluminescence |
| Fish/creature (pink/magenta glow) | `#D04070` / `#C8386A` | Hot pink, secondary glow color |
| Fish/creature (blue glow) | `#4A80E0` / `#5A90F0` | Electric blue, tertiary glow |
| Fish/creature (purple glow) | `#8A50D0` / `#9060D8` | Violet, blending point between pink and blue |
| Fish/creature (white highlight) | `#F8F0E8` | Near-white on fin tips |
| Character (human figure) | `#C8C8D0` / `#B8B8C8` | Pale, almost white. Washed-out blue-grey. |
| Character hair | `#D8D0E8` | Silver-white with blue tint |
| Navbar text | `#FFFFFF` at 70–80% opacity | Muted white |
| Navbar active/hovered | `#FFFFFF` at 100% | Full white |
| H1 text (main) | `#FFFFFF` | Full white |
| H1 italic "imagination" | `rgba(255,255,255,0.7)` | Slightly more transparent than main heading — OR uses an italic serif vs the rest in sans |
| Body text | `rgba(255,255,255,0.55)` | Low-opacity white. Reads as blue-grey. |
| Bottom-left caption | `rgba(255,255,255,0.45)` | Even more muted |
| CTA button background | `rgba(255,255,255,0.12)` | Ghost/frosted. Very subtle. |
| CTA button border | `rgba(255,255,255,0.25)` | Faint outline |
| CTA button text | `rgba(255,255,255,0.9)` | Near-white |
| "Join the waitlist" button (top-right) | `rgba(200,200,220,0.2)` | Slightly more prominent glass pill |
| Horizontal divider line | `rgba(255,255,255,0.15)` | Nearly invisible thin line under nav |
| Navbar logo dot | `#FFFFFF` at 50% | Faint white sphere |

---

### 3. Typography — CRITICAL: TWO-FONT CONTRAST

This is the single most reusable typographic pattern in all four images:

#### H1 Text
- **"Be in touch with"** — clean, light/thin weight sans-serif. `font-weight: 300–400`. `font-size: ~56–72px`. `color: #FFFFFF`. `line-height: 1.15`.
- **"your"** — same sans-serif, same weight. Continuation of the line.
- **"imagination"** — **ITALIC SERIF** or **styled differently** from the rest. This word creates a typographic break. It reads as either:
  - Italic of the same sans (if a variable font), OR
  - A completely different typeface (serif italic) for just this one word
  - `color: rgba(255,255,255,0.7)` — slightly more ghost than the white lines above
  - This contrast between the roman sans and the italic word is the signature typographic gesture
- **Recommendation for implementation:** Use `font-style: italic` on a connected sans that has a beautiful italic (e.g., **Canela**, **Editorial New**, **EB Garamond italic**). The visual effect is that "imagination" bends away from the rigid sans structure — poetic and deliberate.

#### Navbar
- `font-size: 14px`, `font-weight: 400`, `letter-spacing: 0.02em`, `color: rgba(255,255,255,0.75)`
- Items: "Features", "Workflows", "Testimonials", "Our Vision", "Contact"
- Well-spaced, no bold

#### Body/Subheading
- `font-size: 14–15px`, `font-weight: 400`, `color: rgba(255,255,255,0.55)`, `line-height: 1.6`, `max-width: ~360px`
- Bottom-left caption: `font-size: 13px`, similar opacity

#### CTA Button
- `font-size: 14px`, `font-weight: 500`, `color: rgba(255,255,255,0.9)`

---

### 4. Layout — Landing Page Structure

**What's visible in this crop:**

Section 1 — HERO (full viewport)
- Fixed transparent navbar (top) with: logo left, nav links center, CTA button right
- Content positioned: lower-left, NOT centered
  - H1: starts at ~50% from top, left-aligned, `padding-left: 5–7%`
  - Body text: below H1, `max-width: 360px`, left-aligned
  - CTA button: below body text, `width: fit-content`
- Hero image: 3D render of glowing fish + human figure, center-to-right placement
  - Fish positioned at ~`60% from left`, `30% from top`
  - Human figure at ~`45% from left`, `55% from top`
  - Reflection of both visible below on the "floor"
- Bottom-left: Small caption text block, floating above the very bottom edge
- Horizontal hairline divider: between nav and hero content area, `rgba(255,255,255,0.15)`, full width

**Number of sections visible:** Only 1 (hero fold). The nav items ("Workflows", "Testimonials", "Our Vision") imply 3–5 additional sections below the fold.

**What makes it feel premium/cinematic:**
- Dark background dramatically contrasts the glowing subject
- The render fills ~60% of the viewport — it's enormous
- Left-aligned text gives breathing room to the right for the visual subject
- Low-opacity body text creates depth — the H1 is high contrast, body text recedes
- No cards, no grids, no sections visible in hero — pure editorial layout

---

### 5. Components

#### Ghost CTA Button ("Read more")
- `background: rgba(255,255,255,0.10)`
- `border: 1px solid rgba(255,255,255,0.22)`
- `border-radius: 6–8px`
- `padding: 10px 20px`
- `color: rgba(255,255,255,0.9)`
- `font-size: 14px`, `font-weight: 500`
- `backdrop-filter: blur(4px)`

#### "Join the Waitlist" (top-right nav button)
- Similar ghost style but slightly more opaque
- `background: rgba(200,210,240,0.18)`
- `border: 1px solid rgba(200,210,240,0.3)`
- `border-radius: 8px`
- `padding: 8px 18px`

#### Navbar Divider
- `border-bottom: 1px solid rgba(255,255,255,0.12)`
- Full width

#### Logo
- Small circular orb/sphere icon (glowing white point) + wordmark
- Icon suggests the same luminous aesthetic as the hero illustration

---

### 6. Decorative Elements

- **Primary decoration:** The 3D render. This is the ENTIRE visual budget.
- **The fish/creature:** Bioluminescent, translucent, detailed fins. The glow effect: multiple colored point lights behind/around it, creating orange → pink → blue → purple gradient across its body. Real-time render or Blender/Unreal quality.
- **Reflections:** The floor is reflective (wet surface / water). Both the fish and the human cast reflections downward — very naturalistic, adds depth.
- **Atmospheric haze:** Distance fog effect in the background, blue-grey. Gives infinite depth.
- **Ambient particle:** One bright white specular highlight (star/orb) upper-left corner — very subtle.
- **NO gradients in UI layer** (backgrounds, buttons, text)
- **NO patterns, NO textures in UI layer**
- **All decoration is in the 3D scene itself**

---

### 7. Text Hierarchy

```
Nav links    — "Features Workflows..." — 14px, regular, white 75%
Nav CTA      — "Join the waitlist" — 14px, medium, white 85% on ghost button
H1 line 1    — "Be in touch with" — 64px, light, white 100%
H1 line 2    — "your imagination" — 64px, light, white + italic serif shift on "imagination"
Body         — "Our work begins where imagination sparks..." — 14px, regular, white 55%
CTA          — "Read more" — 14px, medium, white 90% on ghost button
Caption      — "Imagination sparks possibility..." — 13px, regular, white 45%
```

---

### 8. Inferred Interactions

- **Navbar links hover:** `color: rgba(255,255,255,1)`, `transition: 200ms ease`
- **Ghost buttons hover:** `background: rgba(255,255,255,0.18)`, `border-color: rgba(255,255,255,0.4)` — brighten slightly
- **Scroll behavior:** Page likely does NOT scroll the hero section at all — it's a fixed full-screen hero, content below appears on scroll past 100vh
- **Possibly:** Subtle particle animation or slow camera drift on the 3D render (not a static image in final product)
- **Possible 3D interaction:** The fish or character may follow cursor position very slightly (parallax) — this is a common pattern in this design genre

---

### What to Reuse from Image 4

- **Left-aligned hero text placement** — breaks from centered default, gives the illustration room to breathe on the right
- **Ghost button pattern** — glass/frosted, no solid fill
- **Mixed-weight/style heading** — using italic or serif for a key word within a larger sans headline
- **Divider hairline below navbar** — subtle professional touch
- **Dark atmospheric background for specific sections** (not for the whole app — maybe a hero banner on the exam page)

### What is Mood-Only

- The 3D bioluminescent render — this is expensive to replicate
- The pure dark color scheme — your app is warmer and lighter
- The specific fish illustration — replace with Vietnamese/academic visual language

---

<a name="unified"></a>
## UNIFIED DESIGN SYSTEM RECOMMENDATION

### Synthesizing All 4 Images for Your Vietnamese Exam-Prep App

---

### Primary Color
- **Value:** `#8093F1` (already in your token set)
- **Role:** Interactive blue — buttons, active states, links, icons, selected states
- **From:** Image 1 (Learnthru) — exact match
- **Use at:** Full opacity for interactive elements; `rgba(128, 147, 241, 0.12)` for hover backgrounds; `rgba(128, 147, 241, 0.08)` for very light tints

---

### Secondary / Accent Color
- **Value:** `#C4783A` (warm amber — derived from Image 2 Poieto's link color)
- **Role:** Accent and emphasis — links, highlights, difficulty indicators, selected tags, the "warmth" of the academic feel
- **From:** Image 2 — the only color accent, earns attention precisely because it is used sparingly
- **Vietnamese context:** Amber has a natural resonance with traditional Vietnamese aesthetics (lacquerware, ancient documents, warm lamplight)
- **Use at:** Sparingly — maximum 5–8% of screen surface should ever carry this color
- **Alternative for subjects:** Could be replaced per-subject: amber for Kế toán, sage green for Quản trị Kinh doanh, muted teal for Tài chính–Ngân hàng

---

### Background Color
- **Value:** `#F7F4EE` (warm off-white, parchment-adjacent)
- **Why NOT pure white:** Image 2 shows that warm cream (`#F5F0E8`) creates a far more academic, printed-page feeling than pure white. Pure white reads as SaaS/tech. Warm white reads as intellectual/bookish.
- **From:** Image 2 — directly extrapolated to page-level background
- **Hex range:** `#F7F4EE` to `#F5F0E8` — choose based on monitor calibration

---

### Surface / Card Color
- **Value:** `#FFFFFF`
- **Role:** Card backgrounds, input backgrounds, overlays
- **Why:** Warm page background + pure white cards creates subtle elevation without shadow dependency
- **From:** Image 1 — sidebar and panels are pure white against the grey/cream background

---

### Text Primary Color
- **Value:** `#1C1A18`
- **Why NOT `#000000`:** Pure black on warm cream is harsh and creates an uncomfortable contrast. A very slightly warm near-black reads more bookish.
- **From:** Image 2 — the heading text on cream background has a very faintly warm undertone
- **Contrast ratio on `#F7F4EE`:** ~14.5:1 (WCAG AAA)

---

### Text Secondary Color
- **Value:** `#6B6760`
- **Role:** Subtitles, metadata, labels, captions, placeholder hints
- **Why this specific value:** Warm grey — cooler greys look tech, warm greys look editorial
- **Contrast ratio on `#F7F4EE`:** ~5.2:1 (WCAG AA)

---

### Font Pairing

#### Display / Heading Font
- **Recommended:** **EB Garamond** (already in your token set — confirmed)
- **Roles:** H1, H2, large card titles, the exam title on the đề pane
- **Why:** Classic academic serif — it reads as "important document", "textbook", "university". Has beautiful italics for the italic-word-within-heading technique (Image 4).
- **Sizes:** H1 `36–48px`, H2 `24–28px`, H3 `20px`
- **Weights:** 400 (regular) for large display, 700 (bold) for emphasis
- **Letter spacing:** `-0.02em` at large sizes (optical correction)

#### Body / UI Font
- **Recommended:** **Plus Jakarta Sans** (already in your token set — confirmed)
- **Roles:** Body text, nav items, table content, input fields, labels, metadata, captions
- **Why:** Humanist sans with slightly warm personality — better editorial feel than pure geometric like Inter. Works at small sizes for Vietnamese diacritics.
- **Sizes:** Body `15–16px`, Small `13px`, Caption `11–12px`
- **Weights:** 400 (regular), 500 (medium for labels), 600 (semibold for CTA)
- **Letter spacing:** `0` at body; `0.04–0.06em` for uppercase labels

#### Optional Third Font
- **Schibsted Grotesk** (also in your token set) can serve as the "utility" face — nav, buttons, tags — if Plus Jakarta Sans is reserved for body content

---

### Border Radius Standard

| Element | Radius |
|---------|--------|
| Full-page container / Modal | `16–20px` |
| Cards (đề pane, class cards) | `12px` |
| Buttons (primary, secondary) | `8px` |
| Tags / Pills / Badges | `999px` (fully rounded) |
| Input fields | `8px` |
| Avatar/Profile photos | `50%` |
| Small chips/counts | `6px` |
| Tooltip | `6px` |
| Progress bar | `999px` |

**Philosophy:** Consistent rounded rectangle + full-circle for person-related elements. Do NOT mix sharp (`0px`) and rounded — pick a lane. Your lane is rounded-but-not-bubbly.

---

### Shadow Standard

| Level | Value | Use |
|-------|-------|-----|
| None | `none` | Flat items on white surface |
| Subtle | `0 1px 4px rgba(28,26,24,0.06)` | Cards on warm background |
| Lifted | `0 4px 16px rgba(28,26,24,0.10)` | Modals, dropdowns, hovered cards |
| Floating | `0 8px 32px rgba(28,26,24,0.14)` | Sidebars, popovers |
| Image-over-photo | `0 8px 40px rgba(0,0,0,0.18)` | Direct from Image 2 — card over painting background |

**Key rule:** Shadows should have a warm bias (use `rgba(28,26,24,...)` not `rgba(0,0,0,...)`). This maintains the warm-cream aesthetic at every depth level.

---

### Button Style

#### Primary Button
```css
background: #8093F1;
color: #FFFFFF;
border: none;
border-radius: 8px;
padding: 10px 20px;
font-family: 'Plus Jakarta Sans', sans-serif;
font-size: 14px;
font-weight: 600;
letter-spacing: 0.01em;
transition: background 150ms ease, transform 100ms ease;
```
```css
/* Hover */
background: #6B7FD4;
transform: translateY(-1px);
```

#### Secondary / Ghost Button (light surface)
```css
background: transparent;
color: #8093F1;
border: 1.5px solid #8093F1;
border-radius: 8px;
padding: 9px 20px;
```

#### Ghost Button (dark surface — from Image 4)
```css
background: rgba(255,255,255,0.10);
border: 1px solid rgba(255,255,255,0.22);
color: rgba(255,255,255,0.90);
border-radius: 8px;
padding: 10px 20px;
backdrop-filter: blur(4px);
```

#### Amber CTA (accent, sparingly)
```css
background: #C4783A;
color: #FFFFFF;
border-radius: 8px;
padding: 10px 20px;
```

---

### Card Style

#### Standard Đề Card (most important)
```css
background: #FFFFFF;
border-radius: 12px;
box-shadow: 0 4px 16px rgba(28,26,24,0.10);
overflow: hidden;
/* Two-column internal layout: image left (40%), content right (60%) */
```

Content side:
```css
padding: 24px;
background: #FFFFFF; /* or #F7F4EE if you want parchment inside too */
```

Image side:
```css
/* img */
width: 100%;
height: 100%;
object-fit: cover;
```

#### Colored Subject Card (from Image 1)
```css
background: [subject color]; /* flat, no gradient */
border-radius: 12px;
padding: 20px;
color: #FFFFFF;
```
Subject color mapping:
- Kế toán: `#8093F1` (blue-periwinkle)
- Tài chính–Ngân hàng: `#72DDF7` (sky blue, from your tokens)
- Quản trị Kinh doanh: `#F4899A` (rose-pink, from Image 1)

---

### Any Accessibility Concerns

1. **Text over images (đề pane background):** If you place text directly over the blurred painting background (full-screen), you MUST test contrast. The blurred painting has variable luminance. Fix: add a dark semi-overlay `rgba(0,0,0,0.3–0.45)` on the background div, ensuring all text meets WCAG AA (4.5:1 for normal, 3:1 for large).

2. **White text on periwinkle `#8093F1`:** Contrast ratio = ~3.2:1. This PASSES for large text (18px+ or 14px bold) but FAILS for small body text. Use bold/large text only on the colored buttons and card titles.

3. **Amber `#C4783A` on white `#FFFFFF`:** Contrast = ~4.6:1. Passes AA for normal text. Fine for link text at 14px+.

4. **Secondary text `#6B6760` on `#F7F4EE`:** Contrast = ~5.2:1. Passes AA. Fine.

5. **Vietnamese diacritics:** All recommended fonts (EB Garamond, Plus Jakarta Sans) have full Vietnamese character support. Test with actual Vietnamese text at every size — diacritics stack taller and can clip at tight `line-height` values. Minimum `line-height: 1.5` for body Vietnamese text.

6. **Dark hero (Image 4 pattern):** White 55% opacity text on dark background — contrast = ~5.4:1. Acceptable for body text. Keep body text at minimum `rgba(255,255,255,0.55)` on `#1E2440` dark background.

7. **Focus states:** Never remove `:focus-visible`. Use `outline: 2px solid #8093F1; outline-offset: 2px` as your universal focus ring. On dark surfaces, use `outline: 2px solid #FFFFFF`.

---

### Responsive Behavior Implied

From the 4 images:

- **Breakpoints:**
  - Desktop: `≥1024px` — 3-column layouts (Image 1), split-panel cards (Image 2), full hero (Images 3, 4)
  - Tablet: `768–1023px` — collapse sidebar to top nav; split-panel cards stack vertically (image top, content below); class card grid → 2 columns
  - Mobile: `<768px` — single column; nav collapses to hamburger or bottom tab bar; cards full-width; hero becomes scrollable (no full-bleed fixed height)

- **Image 1 specifics:** The 3-column sidebar+content+panel collapses to: panel hidden (→ drawer or modal), sidebar collapses (→ bottom tab bar or hamburger), content takes full width.

- **Image 2 (đề pane on mobile):** The left-image / right-form split becomes: image as header (aspect-ratio: 16/9, object-fit cover, full width), form below it. Card loses split layout, becomes single column.

- **Image 3+4 heroes on mobile:** The full-bleed hero becomes `min-height: 100svh` (safe area), text changes from left-aligned to centered, H1 font-size scales down to `36–42px`, the CTA email+button may stack vertically.

---

<a name="execution"></a>
## IMPLEMENTATION EXECUTION GUIDE

### How to Build Each Pattern in Next.js 16 + Tailwind CSS + shadcn/ui

---

### Step 1 — Token Setup in `tailwind.config.ts`

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette
        'brand-blue': '#8093F1',
        'brand-blue-hover': '#6B7FD4',
        'brand-blue-light': 'rgba(128,147,241,0.12)',
        'brand-amber': '#C4783A',
        'brand-amber-hover': '#A8632A',
        
        // Surfaces
        'surface-page': '#F7F4EE',
        'surface-card': '#FFFFFF',
        'surface-input': '#EEEBE3',
        
        // Text
        'text-primary': '#1C1A18',
        'text-secondary': '#6B6760',
        'text-tertiary': '#9E9A95',
        'text-white': '#FFFFFF',
        
        // Border
        'border-light': '#E5E1D8',
        'border-input': '#D9D4C7',
        
        // Subject cards
        'subject-accounting': '#8093F1',     // Kế toán
        'subject-finance': '#5B6CC7',         // Tài chính
        'subject-business': '#F4899A',        // QTKD
        
        // Dark hero surface
        'dark-hero': '#1E2440',
        'dark-hero-mid': '#2A3258',
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Schibsted Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['28px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        'body-md': ['15px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'label': ['13px', { lineHeight: '1.4' }],
        'caption': ['12px', { lineHeight: '1.3' }],
        'tiny': ['11px', { lineHeight: '1.3', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        'page': '20px',
        'card': '12px',
        'btn': '8px',
        'input': '8px',
        'pill': '999px',
        'sm': '6px',
      },
      boxShadow: {
        'subtle': '0 1px 4px rgba(28,26,24,0.06)',
        'card': '0 4px 16px rgba(28,26,24,0.10)',
        'lifted': '0 8px 32px rgba(28,26,24,0.14)',
        'over-image': '0 8px 40px rgba(0,0,0,0.18)',
      },
      backdropBlur: {
        'painting': '14px',
        'glass': '8px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### Step 2 — The Đề Pane Component (Image 2 Pattern)

```tsx
// components/DePaneCard.tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DePaneProps {
  title: string;
  subject: 'accounting' | 'finance' | 'business';
  questionCount: number;
  source: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  artworkSrc: string;      // The aesthetic painting/illustration
  artworkAlt: string;
  onStart: () => void;
  onViewAnswers: () => void;
}

const subjectLabel = {
  accounting: 'Kế toán',
  finance: 'Tài chính – Ngân hàng',
  business: 'Quản trị Kinh doanh',
};

export function DePaneCard({
  title,
  subject,
  questionCount,
  source,
  difficulty,
  tags,
  artworkSrc,
  artworkAlt,
  onStart,
  onViewAnswers,
}: DePaneProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card shadow-over-image',
        'grid grid-cols-[2fr_3fr]',   // 40% image / 60% content
        'bg-surface-card',
        'max-w-[720px] w-full',
      )}
    >
      {/* LEFT — Artwork Panel */}
      <div className="relative overflow-hidden">
        <img
          src={artworkSrc}
          alt={artworkAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Very subtle overlay */}
        <div className="absolute inset-0 bg-black/[0.06]" />
      </div>

      {/* RIGHT — Content Panel */}
      <div className="flex flex-col gap-4 p-8 bg-surface-page">
        {/* Pre-heading */}
        <span className="text-tiny font-sans font-medium text-text-secondary uppercase tracking-widest">
          {subjectLabel[subject]}
        </span>

        {/* Title */}
        <h2 className="font-serif text-display-md text-text-primary leading-snug">
          {title}
        </h2>

        {/* Metadata row */}
        <div className="flex items-center gap-3 text-label text-text-secondary">
          <span>{questionCount} câu</span>
          <span className="w-1 h-1 rounded-full bg-border-input" />
          <span>{source}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-3 py-1 rounded-pill text-label font-medium',
                'bg-brand-blue-light text-brand-blue',
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-label text-text-secondary">Độ khó</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full',
                  i < difficulty ? 'bg-brand-amber' : 'bg-border-light',
                )}
              />
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 mt-auto pt-2">
          <Button
            onClick={onStart}
            className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-btn px-5 py-2.5 text-body-sm font-semibold transition-all"
          >
            Làm bài
          </Button>
          <Button
            onClick={onViewAnswers}
            variant="outline"
            className="border-brand-blue text-brand-blue hover:bg-brand-blue-light rounded-btn px-5 py-2.5 text-body-sm transition-all"
          >
            Xem đáp án
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 3 — Full-Bleed Hero with Blurred Painting Background

```tsx
// components/HeroWithPainting.tsx
// Combines: Image 2 (blurred painting) + Image 3 (full-bleed) + Image 4 (left-aligned text)

interface HeroWithPaintingProps {
  paintingSrc: string;
  headline: string;
  italicWord?: string;     // The italic serif word (Image 4 technique)
  subheadline: string;
  ctaLabel: string;
  onCTA: () => void;
}

export function HeroWithPainting({
  paintingSrc,
  headline,
  italicWord,
  subheadline,
  ctaLabel,
  onCTA,
}: HeroWithPaintingProps) {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Blurred background */}
      <div
        className="absolute inset-0 scale-110"  /* scale prevents blur edge artifacts */
        style={{ filter: 'blur(14px) brightness(0.75)' }}
      >
        <img
          src={paintingSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="pl-[7%] max-w-[600px]">
          <h1 className="font-serif text-display-xl text-white leading-tight mb-6">
            {headline}{' '}
            {italicWord && (
              <em className="not-italic" style={{ fontStyle: 'italic', opacity: 0.85 }}>
                {italicWord}
              </em>
            )}
          </h1>
          <p className="font-sans text-body-lg text-white/70 mb-8 max-w-[420px] leading-relaxed">
            {subheadline}
          </p>
          <button
            onClick={onCTA}
            className={`
              font-sans font-semibold text-body-sm
              bg-brand-blue hover:bg-brand-blue-hover
              text-white rounded-btn px-6 py-3
              transition-all duration-150
            `}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
```

---

### Step 4 — Subject Class Cards (Image 1 Pattern)

```tsx
// components/SubjectCard.tsx
const subjectColors = {
  accounting: 'bg-subject-accounting',
  finance: 'bg-subject-finance',
  business: 'bg-subject-business',
};

interface SubjectCardProps {
  subject: 'accounting' | 'finance' | 'business';
  label: string;
  examCount: number;
  studentCount: number;
  avatars: string[];      // URLs of recent student avatars
}

export function SubjectCard({ subject, label, examCount, studentCount, avatars }: SubjectCardProps) {
  return (
    <div className={`${subjectColors[subject]} rounded-card p-5 text-white`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-sans font-bold text-display-sm leading-tight">{label}</h3>
      </div>

      {/* Avatar group */}
      <div className="flex items-center mb-4">
        {avatars.slice(0, 3).map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
            style={{ marginLeft: i > 0 ? '-8px' : '0', zIndex: 3 - i }}
          />
        ))}
        {studentCount > 3 && (
          <span
            className="w-7 h-7 rounded-full bg-white/20 border-2 border-white flex items-center justify-center"
            style={{ marginLeft: '-8px', fontSize: '10px', fontWeight: 700 }}
          >
            +{studentCount - 3}
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1 text-white/80 text-label">
        <span>{examCount} đề thi</span>
        <span>{studentCount} học sinh</span>
      </div>
    </div>
  );
}
```

---

### Step 5 — Frosted Glass Input+Button Pill (Image 3 Pattern)

```tsx
// components/EmailSignup.tsx — Frosted glass pill
import { useState } from 'react';

export function EmailSignupPill({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  return (
    <div
      className="flex items-center rounded-pill overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(8px)',
        height: '48px',
        maxWidth: '440px',
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email của bạn..."
        className="flex-1 bg-transparent text-white placeholder-white/50 px-5 text-body-sm outline-none"
      />
      <button
        onClick={() => onSubmit(email)}
        className="shrink-0 h-full px-5 rounded-pill font-sans font-semibold text-body-sm"
        style={{
          background: 'rgba(255,255,255,0.9)',
          color: '#1C1A18',
          margin: '4px',
          height: 'calc(100% - 8px)',
          borderRadius: '999px',
        }}
      >
        Bắt đầu
      </button>
    </div>
  );
}
```

---

<a name="feel"></a>
## HOW TO GET THE "FEEL" — THE INTANGIBLES

### Beyond Code: What Creates the Actual Aesthetic

---

### 1. The Warm Cream Foundation

The single biggest shift from generic SaaS to "academic editorial" is replacing `#FFFFFF` page backgrounds with `#F7F4EE`.

This one change makes everything feel like it was designed on paper first, then translated to screen. Every element sitting on this warm surface picks up a slight warmth. The academic connection is immediate — cream evokes printed documents, old books, exam papers.

**Implementation:** Set `body { background-color: #F7F4EE; }` globally. Use `bg-white` only for cards and surfaces that need to stand out against the page.

---

### 2. Serif + Sans-Serif Contrast is Non-Negotiable

Image 2 and Image 4 both use this technique: a large, commanding serif heading paired with restrained sans-serif body text. This is the typographic identity of academic design.

The rule: **Only one thing on screen should be in EB Garamond at any given moment.** It should be the most important thing — the exam title, the section heading, the hero headline. Everything else is Plus Jakarta Sans.

Do NOT use EB Garamond for:
- Button text
- Nav items
- Tags / badges
- Input labels
- Any text below 18px

DO use EB Garamond for:
- H1, H2 on landing page
- Đề title inside the pane card
- Section headings on the dashboard

---

### 3. The Painting as Content, Not Decoration

Images 2, 3, and 4 all use full-bleed atmospheric imagery as the structural foundation of their designs — NOT as decorative elements added after layout.

The approach: **Design the image surface first. Then design the UI layer on top.** The image is not a background. It is the dominant visual, and the UI is the frame.

For your đề pane: Each subject gets a distinct painting/illustration that is culturally resonant:
- Kế toán: Vietnamese marketplace or ledger-book texture
- Tài chính: Abstract architectural photography, banks, columns
- QTKD: Meeting table, overhead view, Vietnamese office aesthetic

These images are not decorative. They communicate the subject before a single word is read.

---

### 4. Hierarchy Through Opacity, Not Just Size

Image 4 demonstrates: body text at `rgba(255,255,255,0.55)` vs headline at `rgba(255,255,255,1.0)`. The eye immediately knows what is primary.

Apply this on light surfaces too:
- Primary heading: `opacity: 1.0` on `#1C1A18`
- Secondary text: `color: #6B6760` (same effect — reduced visual weight)
- Tertiary / metadata: `color: #9E9A95` (recedes further)

The hierarchy is built into the color system, not just font size. This is why the UI in Image 1 feels clean despite having a LOT of information — the information has clear weight levels.

---

### 5. Restraint in Color — The Amber Rule

Image 2 uses exactly ONE chromatic accent: amber `#C4783A` on the "Sign up" link. The entire rest of the card is achromatic (warm greys, near-black, warm cream).

This is why the amber link is noticeable without being visually aggressive. It earns its attention by being the only colored thing.

Apply this: In any single view of your app, limit chromatic accents to:
- 1 primary action (blue button `#8093F1`)
- 1 accent moment (amber `#C4783A` for a key link or difficulty indicator)
- Subject card colors (which are contained in their cards, not leaking across the UI)

If everything is colored, nothing is emphasized.

---

### 6. Shadows Are Temperature

Your shadows should be warm (`rgba(28,26,24,...)`), not neutral (`rgba(0,0,0,...)`). On a cream background, a cool grey shadow looks wrong — it creates a temperature mismatch that reads as "template."

Warm shadows blend into the surface naturally and make cards feel like they're physically lifted off paper.

---

### 7. The Blurred-Background Technique — Implementation Notes

```css
/* The correct way to do a blurred painting background */
.painting-bg-wrapper {
  position: relative;
  overflow: hidden;
}

.painting-bg-blur {
  position: absolute;
  inset: 0;
  transform: scale(1.1);  /* CRITICAL — prevents white blur edges */
  background-image: url('/path/to/painting.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(14px) brightness(0.78);
  z-index: 0;
}

.painting-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);  /* for text legibility */
  z-index: 1;
}

.painting-content {
  position: relative;
  z-index: 2;
}
```

The `scale(1.1)` is non-negotiable. Without it, you get white/transparent edges at the boundary of the blurred image where the filter extends beyond the element's natural bounds.

---

### 8. Vietnamese Diacritics and Typography

When using EB Garamond at large sizes with Vietnamese text, the diacritics (ắ, ề, ụ, etc.) add significant height above the base letterform. Ensure:
- `line-height: 1.35–1.5` even for display headings (not 1.1 like English)
- Test: "Đề thi Kế Toán Học Kỳ 2" at 36px — diacritics on Đ, ế, ế, ọ will be the visual test
- Add `overflow: visible` or adequate padding above heading elements

---

### 9. Image Choice for the Đề Pane Art

To match the Poieto aesthetic (Image 2), the left-panel art should be:
- **Classical or semi-classical in style** — impressionist, pointillist, ink wash, woodblock print
- **NOT** a photograph. Photography would look modern/stock-photo. Paintings read as academic/cultural.
- **Vietnamese options:** Bùi Xuân Phái urban paintings, Nguyễn Gia Trí lacquerware-style work, Đông Hồ folk print style (for a more indigenous aesthetic)
- **Neutral option:** Abstract texture — ink on paper, aged document texture, book page close-up
- **AI-generated option:** Prompt for "Vietnamese village scene, pointillist style, warm ochre and green palette, soft impressionist brush" to match the Poieto painting's register

---

### 10. What Image 3 (Mindloop) Specifically Adds

Image 3's key contribution is the **"aspirational student" positioning**. The character sitting on a hillside studying = your target user. This scene (studied alone, purposefully, in a beautiful space) is the emotional promise of your app.

If you use any illustration or photography in your app that shows a person, it should evoke this: a Vietnamese student, studying deliberately, in a calm or beautiful setting. NOT stock-photo-generic. NOT stressed or frantic.

This image also confirms: **the illustration can do 80% of the emotional work.** The UI only needs to be clean enough not to interfere.

---

## FINAL CHECKLIST — Before Any Screen is "Done"

- [ ] Page background is warm cream `#F7F4EE`, not white
- [ ] H1/H2 is in EB Garamond; everything else is Plus Jakarta Sans or Schibsted Grotesk
- [ ] There is at most ONE serif moment per viewport
- [ ] Amber accent `#C4783A` appears in at most 1–2 places per screen
- [ ] Cards have `border-radius: 12px` and `box-shadow: 0 4px 16px rgba(28,26,24,0.10)`
- [ ] Buttons have `border-radius: 8px` — not `4px`, not `999px`
- [ ] Shadow color is warm (`rgba(28,26,24,...)`), NOT cool (`rgba(0,0,0,...)`)
- [ ] Any image used as a background has `scale(1.1)` applied BEFORE `filter: blur()`
- [ ] Text over images has been contrast-tested
- [ ] Vietnamese diacritics render correctly at all heading sizes (line-height ≥ 1.4)
- [ ] Frosted-glass elements use `backdrop-filter: blur(8px)` with a semi-transparent bg
- [ ] The most important semantic element in the viewport is also the visually dominant one
- [ ] No unnecessary color — if a color doesn't add meaning, it is removed

---

*End of Design Extraction & Implementation Guide*
*Total coverage: 4 reference images, full palette extraction, typography system, layout patterns, component code, implementation guidance, intangibles*