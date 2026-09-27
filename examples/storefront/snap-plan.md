# snap-plan — storefront (fictional brand demo)

**"Salt & Pine" is a made-up home-goods brand for this example only** — no real
company, product, or working domain behind it. `saltandpine.example` uses the
IANA-reserved, non-resolving `.example` TLD on purpose. All product art is flat
drawn shapes (candle, folded throw, mug), not photos.

Goal: show a **catalogue/marketing use case** — one shared template
(`designs/_storefront.mjs`), several products and sizes.

## Step 1 — inspect (9-question rubric)
1. Name: Salt & Pine (fictional)
2. Description: home goods — candles, throws, mugs
3. Domain: saltandpine.example (placeholder, not real)
4. Tags: e-commerce, marketing banner, sale graphic
5. Stack: n/a (demo brand)
6. Font: Poppins (400/700/900) — warm, rounded, common for e-commerce
7. Accent: terracotta `#E1592C` on cream `#FBF3E7`, sage green `#6B8F71` secondary
8. Theme: light, warm

## Step 2 — plan
Hook: **one template, three products, five sizes.**

Shared system: cream background, sage top bar, a rounded "tag" pill (FALL SALE / NEW),
bold product name, price (+ struck-through original price when on sale), a small
flat product illustration, and a `saltandpine.example` footer line.

| Design | Size | Format id reused | Notes |
|---|---|---|---|
| banner-cedar-candle | 1200×630 | `og` | wide banner — candle, on sale |
| banner-wool-throw | 1200×630 | `og` | wide banner — throw, new (no strike price) |
| banner-enamel-mug | 1200×630 | `og` | wide banner — mug, on sale |
| instagram-post | 1080×1350 | `instagram-post` | portrait feed post |
| instagram-story | 1080×1920 | `instagram-story` | vertical layout, extra top/bottom padding for the app's UI |

There's no dedicated e-commerce/banner format in snap-x yet, so the 3 wide
banners reuse `og`'s 1200×630 — noted here rather than silently assumed.

## Step 3 — placement check (`snap-x guides`)
`instagram-story.mjs` is 1080×1920, which **three** formats share exactly
(`youtube-shorts-thumbnail`, `instagram-story`, `google-play-phone`) — auto-match
picks the first one in the list (`youtube-shorts-thumbnail`, which has no zones),
so the format id must be forced: `snap-x guides designs/instagram-story.mjs --format instagram-story`.
`example.json` does this via `{ "file": ..., "format": "instagram-story" }`
(added support for that in `scripts/examples.mjs`). Checked: the wordmark row
and all copy sit inside the safe "content" box, clear of both UI avoid bands.

Regenerate everything: `npm run examples`.
