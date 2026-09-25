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

## Per-format specs (fill these in snap-plan.md)

```
### OG (1200×630)
label:       [domain or short name]
title:       [main headline — keep under 60 chars]
description: [one line — keep under 100 chars]
tags:        [2–3 pills]
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
stack:       [up to 6 pills]
owner:       [optional — GitHub org or author]
```

## Gate

`snap-plan.md` must exist with copy decided for every format before Step 3.
