# Plan: LinkedIn Cover Photo for Ravi Kovind

> **For the executing agent:** Follow this plan top to bottom. Every decision about content, layout, colour and type is already made below. Do not invent new copy, stats, logos or claims. If something is ambiguous, pick the more minimal option.

**Revision 2** — fonts changed to Nunito Sans + Saira; palette changed to the Open Notifier look (pure black, one accent) with the accent moved from green to yellow; unclear decorative elements removed (see §5.4).

---

## 1. Goal

Produce a clean, premium, developer-flavoured LinkedIn banner that tells a recruiter or founder in under 3 seconds:

1. **Who:** Ravi Kovind, Founding Engineer
2. **What:** takes products from 0 → 1 across Full-Stack, Mobile, Backend, Infrastructure (and AI/MCP)
3. **Why trust him:** proof numbers + engineering philosophy

Tone: calm, confident, engineered. Not flashy, no stock "hacker" imagery, no neon matrix rain. **Every element must have an obvious purpose** — if a viewer would ask "what is that?", it does not belong.

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
| Brand mark             | "RK" monogram (text)                                                                       |

Do **not** include phone number or email on the banner.

---

## 3. Canvas spec

- **Size:** `1584 × 396 px` (LinkedIn standard, 4:1). Also export a `3168 × 792 px` @2x version.
- **Format:** PNG (snap-x outputs PNG). Keep file < 8 MB.
- **Colour space:** sRGB.

### 3.1 Danger zones (must stay empty of text / important content)

LinkedIn overlays the profile photo and crops on mobile. Treat these as hard rules:

| Zone                                | Coordinates (on 1584×396)                                                             | Rule                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Profile-photo overlap (desktop)** | Circle centred ≈ `(160, 396)`, radius ≈ `115 px` → affects box `x: 0–320, y: 250–396` | No text, no logos. Decorative only (see rings in §5.2). |
| **Mobile side crop**                | ~`x: 0–200` and `x: 1384–1584` may be cut                                             | Nothing essential here.                                |
| **Top edge**                        | `y: 0–30`                                                                             | Keep clear (UI chrome on some clients).                |
| **Bottom edge**                     | `y: 366–396`                                                                          | Keep clear.                                            |

### 3.2 Safe content area

`x: 380 → 1384`, `y: 50 → 346`. **All text lives inside this box.**

---

## 4. Style direction

**Name:** "Quiet Systems, Yellow" — the Open Notifier look: pure black, one confident accent, generous empty space. Orbit/circle geometry hints at connected systems (customers ↔ stores ↔ riders, MCP clients ↔ servers).

### 4.1 Colour palette (Open Notifier's structure, accent moved green → yellow)

| Role                 | Hex                       | Use                                                          |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| Background           | `#000000`                 | Main fill (pure black, like open-notifier.io)                |
| Card / core fill     | `#141414`                 | The RK core disc                                             |
| Glow                 | `#FAC800` @ 18% → 0       | One soft radial glow behind the orbit (top-right), like open-notifier's OG |
| Primary text         | `#F5F5F5`                 | Name, stat numbers                                           |
| Secondary text       | `#FFFFFF` @ 60% (≈`#999`) | Title line, scope line, stat labels, philosophy              |
| **Accent (yellow)**  | `#FAC800`                 | The single accent: eyebrow dot, `0 → 1`, `//`, ring highlights, one orbit node |
| Accent 2 (sparingly) | `#10B981` (green)         | **Only** as the start of the one gradient ring (`#10B981 → #FAC800`) — the nod to the old green |
| Hairlines            | `#FAC800` @ 25–28%        | Rings, dividers (accent-tinted, like open-notifier's green borders) |

Rule: **yellow is the only accent.** Green appears once (the gradient ring). No rainbow; at most 3 accent uses in text.

### 4.2 Typography

- **Primary font: Nunito Sans** — all headings and body.
  - Name: 800, 64 px, letter-spacing −1.5 px
  - Title line: 600, 24 px, secondary colour
  - Scope line: 400, 17 px, secondary colour
  - Stats numbers: 800, 26 px; labels 600, 13 px, uppercase, letter-spacing +1.5 px
- **Mono role font: Saira** — used where the plan previously used a monospace: the philosophy line (Saira 500, 20 px) and the `RK` monogram (Saira 800, 24 px). (Saira is a squared display face, not a true monospace — this is a deliberate style choice.)
- Load both from Google Fonts (`FONTS` export: Nunito Sans 400/600/700/800, Saira 500/800). Check that neither falls back.

### 4.3 Texture

- **No dot grid, no noise.** Flat black plus a single soft yellow glow, centred ≈ `(1450, 150)`, radius ≈ 520 px, behind the orbit.

---

## 5. Layout & elements (exact placement)

```
 0                320  380                                   1110        1384      1584
 +-----------------+---+--------------------------------------+-----------+----------+
 |                 |   |  ● FOUNDING ENGINEER                  |           |  ◯ orbit |
 |                 |   |  Ravi Kovind                          |  (empty,  |  rings   |
 |                 |   |  Taking products from 0 → 1 · 5+ yrs |  calm)    |  + RK    |
 |   ( ring around |   |  Full-Stack · Mobile · Backend · ...  |           |          |
 |   profile pic ) |   |  // readable over clever ...          |           |          |
 |                 |   |  30K+ USERS   80K+ ORDERS   ★6.8K OSS |           |          |
 +-----------------+---+--------------------------------------+-----------+----------+
```

### 5.1 Text block (left-aligned, starts at `x = 420`)

| Line       | y (baseline) | Content                                                     | Style                                                          |
| ---------- | ------------ | ----------------------------------------------------------- | -------------------------------------------------------------- |
| Eyebrow    | 92           | `● FOUNDING ENGINEER` — dot is accent yellow                | Nunito Sans 700, 13 px, uppercase, +2 px tracking, secondary   |
| Name       | 158          | `Ravi Kovind`                                               | Nunito Sans 800, 64 px, primary                                |
| Title      | 196          | `Taking products from 0 → 1 · 5+ years`                     | Nunito Sans 600, 24 px, secondary; the `0 → 1` in accent yellow |
| Scope      | 230          | `Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)` | Nunito Sans 400, 17 px, secondary                              |
| Philosophy | 270          | `// readable over clever. predictable over magic.`          | Saira 500, 20 px, `//` in accent yellow, rest secondary        |
| Stats row  | 322          | three stacked stat pairs (number over label)                | see below                                                      |

**Stats row** (number on top, label below):

- `30K+` USERS SERVED
- `80K+` ORDERS SHIPPED
- `★ 6.8K` OPEN-SOURCE STARS (the star is drawn as a shape, not a font glyph)

Separate groups with a thin vertical hairline (1 px, white @ 14%, 28 px tall, 24 px either side).

Keep the whole text block within `x ≤ 1080`.

### 5.2 Circle / ring elements (the "circles in particular areas")

1. **Profile-photo echo ring (bottom-left)** — purpose: frames the profile photo so the banner feels designed _around_ it.
   - Centre `(160, 396)` — same as LinkedIn avatar.
   - Two concentric **solid** rings: radius `140 px` and `175 px`, stroke 1 px, accent yellow @ 22%.
   - One small accent dot (6 px, yellow) on the 175 px ring at ~−40° (upper-right of the avatar), as if orbiting.

2. **Orbit system (right side)** — purpose: the "connected systems" motif and the home of the `RK` monogram.
   - Centre `(1450, 198)`, partially bleeding off the right edge.
   - **Three** rings at radius `90`, `160`, `235` px, stroke 1 px, opacity fading outward: 28%, 20%, 12% (accent-tinted).
   - The `160 px` ring uses a gradient stroke `#10B981 → #FAC800` at 55% opacity (the only green).
   - **Three** small nodes on the rings: one accent yellow (6 px), two white @ 40% (5 px).
   - Inner core: a filled circle radius 34 px, `#141414`, 1 px yellow border @ 50%, containing the **`RK`** monogram (Saira 800, 24 px, primary colour).

### 5.3 Empty space is intentional

The area between the text block and the orbit (`x: 1080–1215`) stays empty. Do not fill it.

### 5.4 Things **not** to include

Removed in revision 2 because they were unclear or had no obvious purpose:

- ~~Node-graph bridge with `app` / `api` / `mcp` labels~~ — read as an unexplained diagram.
- ~~Scattered 2 px accent pixels~~ — looked like dust/artefacts.
- ~~Dot grid texture~~ — barely visible, added noise.
- ~~`ravikovind.github.io` footer tag~~ — tiny, low-contrast, sat on the safe-area edge.
- ~~Dashed outer ring~~ — replaced by a plain solid ring.

Still excluded: no photo of Ravi (the LinkedIn avatar covers that); no tech-logo wall / brand logos (Flutter, AWS, etc.); no "Open to Work" text; no phone, email, emojis beyond the drawn `★`, no generic laptop/code-screen stock imagery.

---

## 6. Build method

Build with snap-x (Satori → PNG). See `designs/`:

- `_cover.mjs` — the whole composition as one builder (helper; skipped by `snap-x render` because of the `_` prefix)
- `cover.mjs` → `ravi-kovind-linkedin-cover.png` (1584×396)
- `cover-2x.mjs` → `ravi-kovind-linkedin-cover@2x.png` (3168×792, the same tree with `transform: scale(2)`)
- `qa-overlay.mjs` → `qa-overlay.png` (danger zones drawn)
- `qa-mobile.mjs` → `qa-mobile-crop.png` (centre 1184×396)

Regenerate: `npm run examples`. **Never let an image model render the name or numbers.**

---

## 7. QA checklist (agent must verify before finishing)

- [ ] Dimensions exactly `1584×396` (and `3168×792` for @2x).
- [ ] QA overlay: a 230 px-diameter circle at `(160, 396)` and shaded bands for `x<200` and `x>1384`. Confirm **no text** falls inside any of them.
- [ ] Name is the most prominent element; readable at 50% zoom.
- [ ] Yellow is the only accent; green appears once (the gradient ring).
- [ ] Every element has an obvious purpose — nothing that needs explaining (§5.4 list is gone).
- [ ] All copy matches §2 exactly (spelling: "Ravi Kovind").
- [ ] Contrast: primary text vs background ≥ 7:1, secondary ≥ 4.5:1 (measure it).
- [ ] Preview a mobile crop (centre `1184×396` region) — name + title still fully visible.
- [ ] Fonts are Nunito Sans and Saira with no fallback visible; no blank-box glyphs.

---

## 8. Deliverables

```
examples/ravikovind/
  ravi-kovind-linkedin-cover.png       (1584×396)
  ravi-kovind-linkedin-cover@2x.png    (3168×792)
  qa-overlay.png                       (debug view with danger zones drawn)
  qa-mobile-crop.png                   (1184×396 phone view)
  designs/                             (source)
  share-copy.txt, build-notes.md
```

---

## 9. Variations (only if asked for more than one)

- **V2 – Light:** background `#FAFAF9`, text `#0A0A0B`, same layout; accent darkened to `#B45309` (amber) for contrast.
- **V3 – AI-forward:** swap the stats row for `MCP · LLM infra · Flutter · Node.js`.
