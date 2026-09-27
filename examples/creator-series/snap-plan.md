# snap-plan — creator-series (fictional channel demo)

**"Sawdust & Coffee" is a made-up woodworking channel for this example
only** — no real channel, video, or subscriber/view count behind it. All tool
icons are flat drawn shapes, not photos or footage.

Goal: show a **YouTube-series use case** — one shared template
(`designs/_creator-series.mjs`), a batch of episode thumbnails. Since
improvements.md §4, the batch itself is `designs/episodes.mjs`'s `VARIANTS`
(one row per episode) rather than one `.mjs` file per episode — the real
"one template, many outputs" pattern the series was already demonstrating.

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

| VARIANTS row (`designs/episodes.mjs`) | Size | Format id | Episode |
|---|---|---|---|
| `ep1` → ep1-cutting-the-legs.png | 1280×720 | `youtube-thumbnail` | "Cutting the legs" (saw) |
| `ep2` → ep2-gluing-the-top.png | 1280×720 | `youtube-thumbnail` | "Gluing the top" (glue) |
| `ep3` → ep3-first-finish-coat.png | 1280×720 | `youtube-thumbnail` | "First finish coat" (brush) |

Each row overrides `format.name` to keep the original filenames; only
`episode`/`title`/`icon` change per row otherwise.

## Step 3 — placement check (`snap-x guides`)
`episodes.mjs` exact-matches `youtube-thumbnail`, which has one real avoid
zone (the duration badge, bottom-right). `snap-x guides` runs every VARIANTS
row automatically and confirms nothing overlaps for any of the 3 episodes —
the headline column and icon panel were placed by construction to stay clear
of it.

Regenerate everything: `npm run examples`.
