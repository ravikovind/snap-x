# Step 2: Plan the image pack

Write `<out>/snap-plan.md`. Commit to a creative direction before touching any design files.

## Planning rubric

Answer these for the full pack:

1. **Hook** — What is the single most important thing to communicate? This goes on every card.
2. **Copy per format** — For each format, what exact text goes where?
3. **Visual direction** — Any layout or style changes from the defaults? (centered vs left-aligned, large title vs balanced, etc.)
4. **Colors** — The brand accent hex (and any other colors) to hardcode directly into each design file.
5. **Fonts** — Confirmed Google Font family name(s) and weights — this becomes each file's `FONTS` export.
6. **Brand assets** — Which logo/icon file (and which *variant* for the card's background) goes on which format, at what size, and where (header lockup, watermark, footer). Note the file's origin in `assets/SOURCES.md`. If none was found, say "text wordmark".
7. **Facts ledger** — every number, quote or claim that will appear, with where it came from. Mark anything illustrative (mock notifications, sample names) as mock.
8. **Every element has a purpose** — if a viewer would ask "what is that?", cut it. Prefer one strong idea per card over many small decorations.
9. **Which formats** — only what the project needs. A CLI tool doesn't need a poster; a person needs a profile banner, not an OG card.

## Per-format specs (fill these in snap-plan.md)

```
### OG (1200×630)
label:       [domain or short name]
title:       [main headline — keep under 60 chars]
description: [one line — keep under 100 chars]
tags:        [2–3 pills, only real ones]
domain:      [bottom-right brand]

### Thumbnail (1280×720)
eyebrow:  [domain or category]
title:    [punchy, 3–6 words max]
subtitle: [optional one-liner]
tag:      [filled pill bottom-left]

### Cover (1500×500)
name:    [project name, left side]
tagline: [right side — split at —, &, ·, or |]
domain:  [below name]

### Poster (1080×1920)
eyebrow:  [short label]
title:    [2–4 words, big]
subtitle: [optional]
footer:   [domain]

### README card (1280×640)
name:        [project name]
description: [one line, ≤140 chars]
stack:       [2–4 real pills — tech, platform, license; skip pills if there's nothing true to say]
owner:       [optional — GitHub org or author]
```

## Banners and profile covers: plan the safe zones

Platforms overlay UI on banners. Write the danger zones into the plan and keep text out of them.

- **LinkedIn cover 1584×396:** the profile photo covers a circle ≈ Ø230 centred at (160, 396); mobile crops the sides (≈ x<200 and x>1384); keep the top/bottom ≈30 px clear. Safe content area ≈ x 380–1384, y 50–346. Keep decoration (not text) in the avatar zone.
- **Stories / vertical posters:** leave roughly 250 px clear at the top and bottom for platform UI.
- Other banners (X header, YouTube channel art): check the platform's current safe area before placing text.

For banners, also plan two QA renders (Step 4): a debug overlay showing the zones and a mobile-crop preview.

## Gate

`snap-plan.md` must exist with copy decided for every format before Step 3. Include the exact **regenerate command** (`npx -y @snap-x/cli render designs/*.mjs --out <dir>`) so anyone can rebuild the images.
