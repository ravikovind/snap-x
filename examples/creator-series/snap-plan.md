# snap-plan — creator-series (fictional channel demo)

**"Sawdust & Coffee" is a made-up woodworking channel for this example
only** — no real channel, video, or subscriber/view count behind it. All tool
icons are flat drawn shapes, not photos or footage.

Goal: show a **YouTube-series use case** — one shared template
(`designs/_creator-series.mjs`), a batch of episode thumbnails.

## Step 1 — inspect (9-question rubric)
1. Name: Sawdust & Coffee (fictional)
2. Description: woodworking build series
3. Domain: n/a (demo channel, no real handle)
4. Tags: YouTube, creator, episode series
5. Stack: n/a (demo brand)
6. Font: Archivo (700/900) — condensed, sturdy, reads at thumbnail size
7. Accent: warm gold `#E8A33D` on dark walnut `#1B120C`, cream text
8. Theme: dark

## Step 2 — plan
Hook: **one template, one episode number + title + icon changed per file.**

Shared system: dark walnut background, gold left rail, episode number label,
huge bold title (headline column, x 64–784), a flat tool icon in a rounded
panel on the right (x ≈800–1160, y ≈210–570), and the channel wordmark under
the title.

| Design | Size | Format id | Episode |
|---|---|---|---|
| ep1-cutting-the-legs | 1280×720 | `youtube-thumbnail` | "Cutting the legs" (saw) |
| ep2-gluing-the-top | 1280×720 | `youtube-thumbnail` | "Gluing the top" (glue) |
| ep3-first-finish-coat | 1280×720 | `youtube-thumbnail` | "First finish coat" (brush) |

## Step 3 — placement check (`snap-x guides`)
`ep1.mjs` exact-matches `youtube-thumbnail`, which has one real avoid zone
(the duration badge, bottom-right). The headline column and icon panel were
placed by construction to stay clear of it; `snap-x guides` confirms nothing
overlaps.

Regenerate everything: `npm run examples`.
