# Plan: LinkedIn Cover Photo for Ravi Kovind

> **For the executing agent:** Follow this plan top to bottom. Every decision about content, layout, colour and type is already made below. Do not invent new copy, stats, logos or claims. If something is ambiguous, pick the more minimal option.

**Revision 2** — fonts changed to Nunito Sans + Saira; palette changed to the Open Notifier look (pure black, one accent) with the accent moved from green to yellow; unclear decorative elements removed (see §5.4).

**Revision 3** — refreshed with Ravi's current facts from ravikovind.com (was ravikovind.github.io): title changed from "Founding Engineer" to "Co-founder, VoltVave Innovations" (his real company, active since Mar 2025); TingTing's order count updated 80K+ → 100K+ per the current site. The open-source stat was replaced: the previous "★6.8K" GitHub star claim didn't check out — `gh api repos/ravikovind/flutter_lucide` shows 25 stars — so it's now the package's actual, verified pub.dev metric (21.3K weekly downloads) instead, with the star icon dropped since the stat is no longer about stars.

**Revision 4** — per Ravi's explicit direction: the banner drops all "Co-founder"/"VoltVave" framing and reverts to plain **"Founding Engineer"** (no company named), and switches to VoltVave's real brand colours (red `#D83427` / black — sampled directly from their logo, not the `#eb1d25` the diwali-poster pack had mislabeled as "VoltVave red") as the single accent, replacing yellow. The green gradient-ring accent is dropped along with it (it existed only to nod at the old palette). Typography unified onto **Saira** throughout (previously Nunito Sans for the primary type, Saira only for a "mono role"); Nunito Sans is no longer used anywhere in this design. Stats content is unchanged from revision 3.

---

## 1. Goal

Produce a clean, premium, developer-flavoured LinkedIn banner that tells a recruiter or founder in under 3 seconds:

1. **Who:** Ravi Kovind, Founding Engineer
2. **What:** takes products from 0 → 1 across Full-Stack, Mobile, Backend, Infrastructure (and AI/MCP)
3. **Why trust him:** proof numbers + engineering philosophy

Tone: calm, confident, engineered. Not flashy, no stock "hacker" imagery, no neon matrix rain. **Every element must have an obvious purpose** — if a viewer would ask "what is that?", it does not belong.

---

## 2. Source facts (from ravikovind.com — use only these)

| Field                  | Value                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Name                   | Ravi Kovind                                                                                |
| Title (shown on banner) | Founding Engineer — per Ravi's explicit direction, no company named. (The site currently also lists him as Co-founder, VoltVave Innovations, active since Mar 2025 — the banner deliberately omits that.) |
| Experience             | 5+ years (since 2020), 0 → 1 products                                                     |
| Scope                  | Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)                                  |
| Philosophy             | "Readable over clever. Predictable over magic."                                            |
| Proof stats (TingTing) | 30K+ users · 100K+ orders · 35+ live stores · ₹1.5Cr+ GMV (Founding Engineer, 2022–25)      |
| Open source            | flutter_lucide — 21.3K weekly downloads on pub.dev, verified publisher (github.com/ravikovind/flutter_lucide has 25 stars — not the metric to lead with) |
| Education              | NIT Allahabad (MNNIT)                                                                       |
| Location               | Bengaluru, India                                                                           |
| Core stack             | Flutter, Dart, Node.js, TypeScript, Python (FastAPI), PostgreSQL, AWS, Kafka, Redis         |
| AI work                | MCP client engine (MCPVave, Claude/GPT/Gemini across 6 platforms), Open Notifier (MCP push) |
| Handle / site          | ravikovind.com · @ravi_kovind                                                               |
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

**Name:** "Quiet Systems, Red" — pure black, one confident accent (VoltVave's real brand red), generous empty space. Orbit/circle geometry hints at connected systems (customers ↔ stores ↔ riders, MCP clients ↔ servers).

### 4.1 Colour palette (VoltVave's real brand colours — sampled from voltvave.com/images/voltvave.png, not guessed)

| Role                 | Hex                       | Use                                                          |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| Background           | `#000000`                 | Main fill (also VoltVave's logo-mark colour)                 |
| Card / core fill     | `#141414`                 | The RK core disc                                             |
| Glow                 | `#D83427` @ 18% → 0       | One soft radial glow behind the orbit (top-right)             |
| Primary text         | `#F5F5F5`                 | Name, stat numbers                                           |
| Secondary text       | `#FFFFFF` @ 60% (≈`#999`) | Title line, scope line, stat labels, philosophy              |
| **Accent (red)**     | `#D83427`                 | The single accent: eyebrow dot, `0 → 1`, `//`, ring highlights, orbit nodes |
| Hairlines            | `#D83427` @ 12–28%        | Rings, dividers (accent-tinted)                               |

Rule: **red is the only accent** (VoltVave's own red, verified by sampling their actual logo file — not the `#eb1d25` the diwali-poster pack's comments had mislabeled as "VoltVave red"). No rainbow, no second accent colour; at most 3 accent uses in text.

### 4.2 Typography

- **Saira, throughout** — the only font in this design (revision 4 dropped Nunito Sans, which previously carried the headings/body).
  - Name: 800, 64 px, letter-spacing −1.5 px
  - Title line: 600, 24 px, secondary colour
  - Scope line: 400, 17 px, secondary colour
  - Stats numbers: 800, 26 px; labels 600, 13 px, uppercase, letter-spacing +1.5 px
  - Philosophy line: 500, 20 px · `RK` monogram: 800, 24 px
- Load from Google Fonts (`FONTS` export: Saira 400/500/600/700/800). Check it doesn't fall back.

### 4.3 Texture

- **No dot grid, no noise.** Flat black plus a single soft red glow, centred ≈ `(1450, 150)`, radius ≈ 520 px, behind the orbit.

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
 |                 |   |  30K+ USERS  100K+ ORDERS  21.3K DL/WK|           |          |
 +-----------------+---+--------------------------------------+-----------+----------+
```

### 5.1 Text block (left-aligned, starts at `x = 420`)

| Line       | y (baseline) | Content                                                     | Style                                                          |
| ---------- | ------------ | ----------------------------------------------------------- | -------------------------------------------------------------- |
| Eyebrow    | 92           | `● FOUNDING ENGINEER` — dot is accent red                    | Saira 700, 13 px, uppercase, +2 px tracking, secondary         |
| Name       | 158          | `Ravi Kovind`                                               | Saira 800, 64 px, primary                                      |
| Title      | 196          | `Taking products from 0 → 1 · 5+ years`                     | Saira 600, 24 px, secondary; the `0 → 1` in accent red          |
| Scope      | 230          | `Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)` | Saira 400, 17 px, secondary                                    |
| Philosophy | 270          | `// readable over clever. predictable over magic.`          | Saira 500, 20 px, `//` in accent red, rest secondary            |
| Stats row  | 322          | three stacked stat pairs (number over label)                | see below                                                      |

**Stats row** (number on top, label below):

- `30K+` USERS SERVED
- `100K+` ORDERS SHIPPED
- `21.3K` WEEKLY DOWNLOADS (flutter_lucide, pub.dev — plain number, no icon)

Separate groups with a thin vertical hairline (1 px, white @ 14%, 28 px tall, 24 px either side).

Keep the whole text block within `x ≤ 1080`.

### 5.2 Circle / ring elements (the "circles in particular areas")

1. **Profile-photo echo ring (bottom-left)** — purpose: frames the profile photo so the banner feels designed _around_ it.
   - Centre `(160, 396)` — same as LinkedIn avatar.
   - Two concentric **solid** rings: radius `140 px` and `175 px`, stroke 1 px, accent red @ 22%.
   - One small accent dot (6 px, red) on the 175 px ring at ~−40° (upper-right of the avatar), as if orbiting.

2. **Orbit system (right side)** — purpose: the "connected systems" motif and the home of the `RK` monogram.
   - Centre `(1450, 198)`, partially bleeding off the right edge.
   - **Three** solid red rings at radius `90`, `160`, `235` px, stroke 1 px, opacity fading outward: 28%, 20%, 12%. (Revision 4 dropped the earlier gradient-stroke ring — it existed only to carry the old green accent, which is gone.)
   - **Three** small nodes on the rings: one accent red (6 px), two white @ 40% (5 px).
   - Inner core: a filled circle radius 34 px, `#141414`, 1 px red border @ 50%, containing the **`RK`** monogram (Saira 800, 24 px, primary colour).

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
- QA: `snap-x guides designs/cover.mjs` (configured in `example.json`) draws the LinkedIn danger zones and the mobile crop → `guides/…guides.png` and `guides/…mobile.png`

Regenerate: `npm run examples`. **Never let an image model render the name or numbers.**

---

## 7. QA checklist (agent must verify before finishing)

- [ ] Dimensions exactly `1584×396` (and `3168×792` for @2x).
- [ ] Guides overlay (`snap-x guides`): the profile-photo circle (Ø230 at `(160, 396)`) and the bands for `x<200` and `x>1384`. Confirm **no text** falls inside any of them.
- [ ] Name is the most prominent element; readable at 50% zoom.
- [ ] Red (VoltVave's real `#D83427`) is the only accent — no yellow, no green, no second accent colour.
- [ ] Every element has an obvious purpose — nothing that needs explaining (§5.4 list is gone).
- [ ] All copy matches §2 exactly (spelling: "Ravi Kovind"); title reads "Founding Engineer" only, no company named.
- [ ] Contrast: primary text vs background ≥ 7:1, secondary ≥ 4.5:1 (measure it).
- [ ] Preview a mobile crop (centre `1184×396` region) — name + title still fully visible.
- [ ] Saira loads for every piece of text (no other font, no fallback visible); no blank-box glyphs.

---

## 8. Deliverables

```
examples/ravikovind/
  ravi-kovind-linkedin-cover.png       (1584×396)
  ravi-kovind-linkedin-cover@2x.png    (3168×792)
  guides/…guides.png                   (danger zones drawn — `snap-x guides`)
  guides/…mobile.png                   (1184×396 phone view — `snap-x guides`)
  designs/                             (source)
  share-copy.txt, build-notes.md
```

---

## 9. Variations (only if asked for more than one)

- **V2 – Light:** background `#FAFAF9`, text `#0A0A0B`, same layout; accent darkened to `#B45309` (amber) for contrast.
- **V3 – AI-forward:** swap the stats row for `MCP · LLM infra · Flutter · Node.js`.
