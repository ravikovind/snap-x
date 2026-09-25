# snap-x design guide

snap-x renders a self-contained Satori `.mjs` design file to a PNG. It only renders: **you** decide what the image says and looks like. Write the files, then use `check_designs`, `render_designs` and (for banners, covers, thumbnails, stories) `preview_guides`.

## Workflow
1. **Inspect the source** — a repo, a website (fetch its HTML/CSS), or the user's brief. Get the name, one-line description, real copy, brand colors, fonts and the official logo/icon. Use only facts you found or were given; never invent stats, customers or quotes, and label anything illustrative as mock. If the source is a brief and you can't ask questions, decide sensibly and write your assumptions down. Omit anything you have no real value for (no domain → no domain line).
2. **Pick the format(s)** with `list_formats` — sizes, whether the platform forbids an alpha channel, and placement zones for YouTube, X, LinkedIn, Play Store, App Store and more. Only make the formats the project needs.
3. **Write** one design file per format. `check_designs` until there are no errors, and read every warning.
4. **Render** with `render_designs`, then **look at every PNG** and fix what you see. For banners, covers, thumbnails and stories also run `preview_guides` and move anything out of the red zones. `check` passing does not mean it looks right.

## A design file
```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };   // add alpha: false for App Store / Google Play
export const FONTS  = [{ family: "Inter", weights: [400, 700, 900] }]; // optional; default Inter

export default function () {                   // zero arguments; may be async
  return { type: "div", props: { style: { width: 1200, height: 630, display: "flex", background: "#000" },
    children: [{ type: "div", props: { style: { display: "flex", color: "#fff", fontSize: 64 }, children: ["Hello"] } }] } };
}
```
Hardcode the brand's colors, fonts and copy in the file. Nothing is passed in; there is no config. Files whose names start with `_` are helpers other designs can import — never rendered, even when a shell expands `designs/*.mjs`.

## Rules
- Every container needs `display: "flex"`. `children` is always an array; text is a string in it. No `z-index`, CSS grid, animations or `position: "fixed"`. Never an `undefined` style value (omit the key).
- The root has an explicit `width`/`height` equal to `FORMAT`. `transform: scale(n)` works (for an `@2x` export).
- **Alpha:** App Store and Google Play graphics must have no alpha channel. Set `FORMAT.alpha = false` (renders an opaque RGB PNG); `check_designs` warns when a store size is missing it.
- **Fonts:** any Google Font via `FONTS`; `fontWeight` must be one you declared. Code-like text needs a monospace font (sans fonts confuse `I l 1`). CJK, Korean, Arabic, Hebrew, Thai, Devanagari and Bengali get a Noto fallback automatically.
- **Emoji work** (drawn as Twemoji images, cached). Other symbols a font lacks (`✓ ◷`, and `→` in some fonts) render as **blank boxes** — `check_designs` warns; draw those as inline SVG or shapes.
- **Fit the text.** Headlines: `whiteSpace: "nowrap"`, sized so the longest line fits (bold display type ≈ 0.5 em per character). If a line wraps mid-word or content is pushed off the canvas, reduce the size. `nowrap` collapses the space before a coloured span — use `whiteSpace: "pre"` or a `gap` there.
- **Logos:** use the brand's real logo, never a redrawn one; pick the variant for the card's background; no logo → a text wordmark (decorative illustration is fine, just don't present it as the logo). Embed as a base64 `<img>` (async default export; read the file relative to the design with `import.meta.url`) with `width` AND `height` in the true aspect ratio. PNG/JPEG/SVG only — convert AVIF/WebP; rasterise SVGs that contain `<text>`; for icon SVGs replace `currentColor` with a hex first.
- **Contrast:** body text ≥ 4.5:1 against its background. Keep one accent dominant.
- **Placement:** keep text out of the platform's `avoid` zones (profile photo, duration badge, mobile crops, story UI); decoration may go anywhere. Store screenshots: a short headline plus the app UI, consistent across the set.

## Common sizes
OG 1200×630 · YouTube thumbnail 1280×720 · X header 1500×500 · LinkedIn cover 1584×396 · Play feature graphic 1024×500 · Play phone screenshot 1080×1920 · App Store iPhone 6.9″ 1320×2868 · poster/story 1080×1920 · portrait post 1080×1350 — see `list_formats` for the full, sourced table.
