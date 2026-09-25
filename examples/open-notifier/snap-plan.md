# snap-plan — Open Notifier (https://open-notifier.io) — /snap-x example #2

Inspected from the live site (HTML meta + its stylesheet), not a repo — snap-x works from any source of facts.

## Step 1 — inspect
1. Name: Open Notifier (wordmark: **open** white + **notifier** green)
2. Description: Send push, Telegram, WhatsApp and email notifications from one simple API. Built for developers and AI agents. Free to start.
3. Domain: open-notifier.io  (built by Workrush)
4. Tags: MCP-native · <200 ms delivery · Free forever on push
5. Stack / integrations: REST API, MCP (Claude Desktop · Cursor · Windsurf), Push, Telegram, WhatsApp, Email
6. Font: Saira (from the site's CSS) + a mono for code
7. Accent: `#0b9444` (their `--accent`), brighter `#10b981` for small text; card `#141414`; background `#000`
8. Theme: dark
9. Brand assets: found `favicon.svg` (round icon — black circle, "open" white over "notifier" green in Saira 900, green dot), `apple-touch-icon.png`, `favicon-96x96.png`, `/site.webmanifest`. No /brand or /press page (404). The SVG uses `<text>`, which can't load Saira when embedded, so it was rasterised once to `assets/icon.png` (512px) with Saira 900. Origins in `assets/SOURCES.md`.

## Step 2 — plan (2 cards, chosen for value)
Hook: **"Your agents work. You stay informed."** (their tagline)

| Card | Size | Why | Composition |
|---|---|---|---|
| og | 1200×630 | link previews everywhere | wordmark bar · 2-line headline · description + chips · terminal card with the real `curl` call and "delivered · 142 ms" |
| notifications | 1080×1350 | LinkedIn / Instagram portrait | headline · a stack of four notifications arriving (Push, Telegram, WhatsApp, Claude MCP) · stats row · "Built by Workrush" |

Assets: `assets/icon.png` in a green-ringed circle (the icon is black on a black card) next to a text lockup "Open Notifier / open-notifier.io". Glyphs: no emoji; `•` only (Saira/JetBrains Mono).
