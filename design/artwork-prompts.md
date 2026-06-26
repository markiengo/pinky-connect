# Artwork Prompts — AI Exam Prep App

Production-grade prompts for generating subject-specific artwork panels used in `DePaneCard` (library page cards). Each prompt is tuned for a 4:3 (400×300) image that can be exported as a PNG and dropped into `/public/artwork/{subject-slug}.png`.

## Global style bible

Use these rules for every subject so the three cards feel like a single set:

- **Aesthetic**: Minimalist editorial illustration, flat design with one soft 3D accent, warm academic mood
- **Color model**: Subject color as the dominant gradient; white/cream as the illustration color; no extra colors
- **Lighting**: Soft top-left ambient light, subtle drop shadow on the main object, no harsh contrast
- **Background**: Smooth vertical gradient, darker/deeper at the top-left, lighter at the bottom-right, with a faint paper-grain texture overlay
- **Composition**: Focal object sits in the left 60% of the frame; the right 40% is clean gradient negative space for text overlays if needed
- **Illustration style**: Rounded geometric shapes, clean vector-like edges, no realistic textures, no photography, no human figures
- **Texture**: 2–3% subtle noise grain, warm cream paper feel, soft anti-aliased edges
- **No text**: No labels, numbers, watermarks, letters, or icons that read as text

## Production specs

| Output | Value |
|---|---|
| Aspect ratio | 4:3 (landscape) |
| Base size | 400×300 px (generate at 800×600 or higher, then export 400×300) |
| Format | PNG-24 with transparent background only if the illustration needs to float; otherwise opaque PNG on the subject gradient |
| Color profile | sRGB |
| Max file size | ≤ 80 KB each (use TinyPNG or Squoosh if needed) |
| Naming | `/public/artwork/ke-toan.png`, `/public/artwork/tai-chinh-ngan-hang.png`, `/public/artwork/quan-tri-kinh-doanh.png` |

## Common negative prompt

Paste this at the end of every generation to keep the output clean and consistent:

```
No text, no letters, no numbers, no watermark, no signature, no photography, no human faces, no realistic textures, no 3D render, no hard shadows, no black outlines, no neon colors, no clutter, no frames, no borders, no UI elements, no logos, no abstract swirls without subject meaning.
```

## Subject prompts

### Kế toán (Accounting) — #9F7AEA

**Primary prompt**
```
A minimalist editorial illustration for an accounting subject card. Center-left: an open hardcover ledger book with cream pages, subtle ruled lines, and a few neat cream-grey rows suggesting handwritten numbers. Above the book, a small cream-colored abacus with rounded beads floats at a slight angle. A vintage cream fountain pen rests diagonally across the lower-right corner of the book. Soft top-left ambient light creates a gentle drop shadow beneath the book. Background: a smooth blue-purple gradient from #9F7AEA at the top-left to a lighter lavender-tinted cream at the bottom-right. Warm cream paper-grain texture overlay. Clean vector-like shapes with rounded edges. No text, no numbers, no realistic details. 4:3, 800x600, flat design with one soft 3D accent, subtle noise grain, high-quality illustration.
```

**Color check**: dominant `#9F7AEA`, illustration elements `#FFFCF7` or `#FFFFFF`, shadow `rgba(30,27,58,0.10)`.

---

### Tài chính – Ngân hàng (Finance & Banking) — #7C6FDB

**Primary prompt**
```
A minimalist editorial illustration for a finance and banking subject card. Center-left: a clean white candlestick chart with rounded wicks rising diagonally from lower-left to upper-right. Three overlapping cream-colored coin circles float near the upper-right of the chart, one slightly behind the others. A small, soft upward-trending arrow curves above the chart. Background: a smooth deep blue-purple gradient from #7C6FDB at the top-left to a lighter periwinkle-cream at the bottom-right. Warm cream paper-grain texture overlay. Geometric, flat design with one soft 3D accent, clean vector edges, subtle drop shadow on the chart. No text, no dollar signs, no realistic coins, no numbers. 4:3, 800x600, subtle noise grain, high-quality illustration.
```

**Color check**: dominant `#7C6FDB`, chart/coins `#FFFCF7` or `#FFFFFF`, shadow `rgba(30,27,58,0.10)`.

---

### Quản trị Kinh doanh (Business Management) — #F4899A

**Primary prompt**
```
A minimalist editorial illustration for a business management subject card. Center-left: a bold white growth arrow curving upward from lower-left to upper-right, passing through three rounded white bar-chart bars of increasing height. A small white target bullseye with three soft rings sits in the upper-right quadrant. The arrow and bars have a gentle drop shadow toward the lower-right. Background: a smooth pink-coral gradient from #F4899A at the top-left to a lighter blush-cream at the bottom-right. Warm cream paper-grain texture overlay. Clean geometric shapes, rounded caps, no realistic details. No text, no numbers, no human figures. 4:3, 800x600, flat design with one soft 3D accent, subtle noise grain, high-quality illustration.
```

**Color check**: dominant `#F4899A`, arrow/bars/target `#FFFCF7` or `#FFFFFF`, shadow `rgba(30,27,58,0.10)`.

## Generation checklist

Before accepting a generated image, verify:

- [ ] No visible text, numbers, or watermarks
- [ ] Subject color matches the hex code above
- [ ] Illustration elements are white/cream, not multicolored
- [ ] Right side of the frame has clean negative space
- [ ] Edges are smooth and anti-aliased
- [ ] File size is under 80 KB after compression
- [ ] Image looks good at both 400×300 and when scaled to 2× on retina screens

## Usage

1. Generate images with Midjourney, DALL·E 3, Ideogram, or any AI image tool that supports negative prompts and aspect ratios.
2. Export at 800×600 or higher, then compress and resize to 400×300 PNG.
3. Save to `/public/artwork/{subject-slug}.png`:
   - `ke-toan.png`
   - `tai-chinh-ngan-hang.png`
   - `quan-tri-kinh-doanh.png`
4. Replace the `SubjectArtwork` component in `src/components/de-pane-card.tsx` with an `<Image>` tag referencing the slug.
5. Keep the SVG pattern fallbacks as loading-state or error-state placeholders.
