# Plan: LinkedIn Cover Photo for Ravi Kovind

> **For the executing agent:** Follow this plan top to bottom. Every decision about content, layout, colour and type is already made below. Do not invent new copy, stats, logos or claims. If something is ambiguous, pick the more minimal option.

---

## 1. Goal

Produce a clean, premium, developer-flavoured LinkedIn banner that tells a recruiter or founder in under 3 seconds:

1. **Who:** Ravi Kovind, Founding Engineer
2. **What:** takes products from 0 → 1 across Full-Stack, Mobile, Backend, Infrastructure (and AI/MCP)
3. **Why trust him:** proof numbers + engineering philosophy

Tone: calm, confident, engineered. Not flashy, no stock "hacker" imagery, no neon matrix rain.

---

## 2. Source facts (from ravikovind.github.io — use only these)

| Field                  | Value                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Name                   | Ravi Kovind                                                                                |
| Title                  | Founding Engineer                                                                          |
| Experience             | 5+ years, 0 → 1 products                                                                   |
| Scope                  | Full-Stack · Mobile · Backend · Infrastructure                                             |
| Philosophy             | "Readable over clever. Predictable over magic."                                            |
| Proof stats (TingTing) | 30K+ users · 80K+ orders · 35+ live stores                                                 |
| Open source            | flutter_lucide — ★ 6.8K                                                                    |
| Education              | NIT Allahabad                                                                              |
| Location               | Bengaluru, India                                                                           |
| Core stack             | Flutter, Dart, Node.js, TypeScript, Python, Next.js, MongoDB, PostgreSQL, AWS, GCP, Docker |
| AI work                | MCP client engine (MCPVave), Open Notifier (MCP push)                                      |
| Handle / site          | ravikovind.github.io · @ravi_kovind                                                        |
| Brand colour hint      | site theme colour is `#000000` (black), logo mark "RK"                                     |

Do **not** include phone number or email on the banner.

---

## 3. Canvas spec

- **Size:** `1584 × 396 px` (LinkedIn standard, 4:1). Also export a `3168 × 792 px` @2x version.
- **Format:** PNG (primary), plus JPG at quality 92 as a fallback. Keep file < 8 MB.
- **Colour space:** sRGB.

### 3.1 Danger zones (must stay empty of text / important content)

LinkedIn overlays the profile photo and crops on mobile. Treat these as hard rules:

| Zone                                | Coordinates (on 1584×396)                                                             | Rule                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Profile-photo overlap (desktop)** | Circle centred ≈ `(160, 396)`, radius ≈ `115 px` → affects box `x: 0–320, y: 250–396` | No text, no logos. Decorative only (see ring in §5.2). |
| **Mobile side crop**                | ~`x: 0–200` and `x: 1384–1584` may be cut                                             | Nothing essential here.                                |
| **Top edge**                        | `y: 0–30`                                                                             | Keep clear (UI chrome on some clients).                |
| **Bottom edge**                     | `y: 366–396`                                                                          | Keep clear.                                            |

### 3.2 Safe content area

`x: 380 → 1384`, `y: 50 → 346`. **All text lives inside this box.**

---

## 4. Style direction

**Name:** "Quiet Systems" — dark, minimal, blueprint-precise, with orbit/circle geometry hinting at connected systems (customers ↔ stores ↔ riders, MCP clients ↔ servers).

### 4.1 Colour palette

| Role                 | Hex                      | Use                                                     |
| -------------------- | ------------------------ | ------------------------------------------------------- |
| Background base      | `#0A0A0B`                | Main fill (near-black, echoes site `#000`)              |
| Background lift      | `#121216`                | Subtle radial glow behind text                          |
| Grid / hairlines     | `#FFFFFF` @ 5–7% opacity | Dot grid, rings                                         |
| Primary text         | `#F5F5F4`                | Name                                                    |
| Secondary text       | `#A1A1AA`                | Title line, stats labels                                |
| Accent               | `#22D3EE` (cyan)         | Single accent: small dots, one keyword, ring highlights |
| Accent 2 (sparingly) | `#A78BFA` (soft violet)  | Only in the gradient of the large ring, max 1 use       |

Rule: **one accent colour dominates**. No rainbow, no more than 2 accent uses in text.

### 4.2 Typography

- **Name:** `Inter` (or `Geist`) — weight 700, 64 px, letter-spacing −1.5 px
- **Title line:** `Inter` 500, 24 px, secondary colour
- **Philosophy / code-ish line:** `JetBrains Mono` 400, 18 px
- **Stats numbers:** `Inter` 700, 26 px; labels `Inter` 500, 13 px, uppercase, letter-spacing +1.5 px

Load from Google Fonts. Fallback: `system-ui, -apple-system, Segoe UI, sans-serif` and `ui-monospace, Menlo, monospace`.

### 4.3 Texture

- Full-canvas **dot grid**: 24 px spacing, 1.2 px dots, white @ 6% opacity.
- Soft **radial glow** `#121216 → transparent`, centred ≈ `(820, 200)`, radius 520 px, behind the text block.
- Optional very faint noise/grain (2–3%) to avoid banding. No photos.

---

## 5. Layout & elements (exact placement)

```
 0                320  380                                   1110        1384      1584
 +-----------------+---+--------------------------------------+-----------+----------+
 |  dot grid       |   |  RAVI KOVIND                          |           |  ◯ big   |
 |                 |   |  Founding Engineer · 0 → 1 products   |   node    |  orbit   |
 |                 |   |  Full-Stack · Mobile · Backend · Infra|   graph   |  rings   |
 |                 |   |  // readable over clever ...          |           |          |
 |   ( ring around |   |  30K+ USERS  80K+ ORDERS  ★6.8K OSS   |           |          |
 |   profile pic ) |   |                                       |           |          |
 +-----------------+---+--------------------------------------+-----------+----------+
```

### 5.1 Text block (left-aligned, starts at `x = 420`)

| Line       | y (baseline) | Content                                                     | Style                                                   |
| ---------- | ------------ | ----------------------------------------------------------- | ------------------------------------------------------- |
| Eyebrow    | 92           | `● FOUNDING ENGINEER` — dot is accent cyan                  | Inter 600, 13 px, uppercase, +2 px tracking, secondary  |
| Name       | 158          | `Ravi Kovind`                                               | Inter 700, 64 px, primary                               |
| Title      | 196          | `Taking products from 0 → 1 · 5+ years`                     | Inter 500, 24 px, secondary; the `0 → 1` in accent cyan |
| Scope      | 230          | `Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)` | Inter 400, 17 px, secondary @ 80%                       |
| Philosophy | 270          | `// readable over clever. predictable over magic.`          | JetBrains Mono 18 px, `//` in accent, rest `#71717A`    |
| Stats row  | 322          | three stat pairs, 48 px gap between groups                  | see below                                               |

**Stats row** (number on top, label below — or inline `number LABEL`):

- `30K+` USERS SERVED
- `80K+` ORDERS SHIPPED
- `★ 6.8K` OPEN-SOURCE STARS

Separate groups with a thin vertical hairline (1 px, white @ 12%, 28 px tall).

Keep the whole text block within `x ≤ 1080`.

### 5.2 Circle / ring elements (the "circles in particular areas")

1. **Profile-photo echo ring (bottom-left)**
   - Centre `(160, 396)` — same as LinkedIn avatar.
   - Two concentric rings: radius `140 px` and `175 px`, stroke 1 px, white @ 10%.
   - Outer ring is dashed (`4 6`).
   - One small accent dot (6 px, cyan) sitting on the 175 px ring at ~−40° (upper-right of the avatar), as if orbiting.
   - Purpose: frames the profile photo so the banner feels designed _around_ it.

2. **Big orbit system (right side)**
   - Centre `(1450, 198)`, partially bleeding off the right edge.
   - Rings at radius `90`, `150`, `215`, `290` px, stroke 1 px.
   - Ring opacity fades outward: 22%, 15%, 10%, 6%.
   - The `150 px` ring uses a conic/linear gradient stroke `#22D3EE → #A78BFA` at 40% opacity (the only violet use).
   - Place 4–5 small nodes (5–8 px dots) on the rings. 1–2 cyan, rest white @ 40%.
   - Inner core: a filled circle radius 34 px, `#16161A`, with a 1 px cyan border @ 50%, containing the **`RK`** monogram in Inter 700, 22 px, primary colour.

3. **Node graph bridge (between text and orbit)**
   - Region `x: 1110–1330, y: 110–290`.
   - 5–6 nodes (small circles, 4–6 px) connected by 1 px straight or 90°-elbow lines, white @ 12%.
   - Optionally label 3 nodes with tiny mono text (11 px, `#52525B`): `app`, `api`, `mcp`. No other labels.
   - One connection line from this graph flows into the big orbit's outer ring — ties the composition together.

4. **Tiny accent pixels** — at most 3 random 2 px cyan dots scattered in empty dot-grid areas (top-left quadrant, not in danger zones) for life.

### 5.3 Optional small footer tag

Bottom-right at `(1370, 350)`, right-aligned, only if it doesn't collide with rings:
`ravikovind.github.io` — JetBrains Mono 12 px, `#52525B`.
Skip it if it looks cluttered.

### 5.4 Things **not** to include

- No photo of Ravi (the LinkedIn avatar already covers that).
- No tech-logo wall / brand logos (Flutter, AWS, etc.) — trademark noise and visual clutter.
- No "Open to Work" text (LinkedIn has its own badge; banner should stay evergreen).
- No phone, email, emojis beyond `★`, no generic laptop/code-screen stock imagery.

---

## 6. Build method (recommended)

Build as code for pixel-exact control, then rasterise.

1. Create `cover.html` with a single `<div id="cover">` of `1584×396`, all elements as inline SVG + positioned HTML text. Load fonts from Google Fonts.
2. Set `body { margin:0; background:#0A0A0B; }`.
3. Render with Playwright/Puppeteer:
   - viewport `1584×396`, `deviceScaleFactor: 1` → `ravi-kovind-linkedin-cover.png`
   - `deviceScaleFactor: 2` → `ravi-kovind-linkedin-cover@2x.png`
   - Wait for `document.fonts.ready` before screenshot.
4. Also export `.jpg` (quality 92) from the @1x PNG.

**Alternative (image model):** only if coding is impossible. Generate background art only (grid + rings + glow, no text), then overlay text via code/Pillow. Never let an image model render the name or numbers.

---

## 7. QA checklist (agent must verify before finishing)

- [ ] Dimensions exactly `1584×396` (and `3168×792` for @2x).
- [ ] Draw a debug overlay: a 230 px-diameter circle at `(160, 396)` and shaded bands for `x<200` and `x>1384`. Confirm **no text** falls inside any of them. Remove overlay for final export.
- [ ] Name is the most prominent element; readable at 50% zoom.
- [ ] Only one accent colour dominates; violet appears once.
- [ ] All copy matches §2 exactly (spelling: "Ravi Kovind", "flutter_lucide").
- [ ] Contrast: primary text vs background ≥ 7:1, secondary ≥ 4.5:1.
- [ ] Preview a mobile crop (centre `1184×396` region) — name + title still fully visible.
- [ ] No font fallback visible (check Inter / JetBrains Mono actually loaded).

---

## 8. Deliverables

```
/output/
  ravi-kovind-linkedin-cover.png       (1584×396)
  ravi-kovind-linkedin-cover@2x.png    (3168×792)
  ravi-kovind-linkedin-cover.jpg       (1584×396, q92)
  cover.html                           (source)
  qa-overlay.png                       (debug view with danger zones drawn)
```

---

## 9. Variations (only if asked for more than one)

- **V2 – Light:** background `#FAFAF9`, text `#0A0A0B`, grid black @ 6%, same cyan accent darkened to `#0891B2`.
- **V3 – AI-forward:** swap the stats row for `MCP · LLM infra · Flutter · Node.js` and relabel graph nodes `client`, `server`, `llm`.
