# snap-x design guide

snap-x renders a self-contained Satori `.mjs` design file to a PNG. It only renders: **you** decide what the image says and looks like. Write the files, then call `check_designs` and `render_designs`.

## Workflow
1. **Inspect the source** (a repo, a website — fetch its HTML/CSS — or the user's brief): name, one-line description, real copy, brand colors, fonts, and the official logo/icon. Use only facts you found or were given. Never invent stats, customers or quotes; label anything illustrative as mock.
2. **Plan**: the hook, copy per format, palette, fonts, which logo variant goes where. Only make the formats the project needs. Banners (e.g. LinkedIn 1584×396) have platform danger zones (the avatar covers ≈ a Ø230 circle at (160,396); mobile crops x<200 and x>1384) — keep text out of them.
3. **Write** one design file per format. Call `check_designs`; fix every error.
4. **Render** with `render_designs`, then **look at every PNG** and fix what you see. `check` passing does not mean it looks right.

## A design file
```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Inter", weights: [400, 700, 900] }]; // optional; default Inter

export default function () {                   // zero arguments; may be async
  return { type: "div", props: { style: { width: 1200, height: 630, display: "flex", background: "#000" },
    children: [{ type: "div", props: { style: { display: "flex", color: "#fff", fontSize: 64 }, children: ["Hello"] } }] } };
}
```
Hardcode the brand's colors, fonts and copy in the file. Nothing is passed in; there is no config. Files whose names start with `_` are helpers other designs can import (not rendered on their own).

## Rules
- Every container needs `display: "flex"`. `children` is always an array; text is a string in it. No `z-index`, CSS grid, animations or `position: "fixed"`. Never an `undefined` style value (omit the key).
- The root has an explicit `width`/`height` equal to `FORMAT`. `transform: scale(n)` works (for an `@2x` export).
- **Fonts:** any Google Font via `FONTS`; `fontWeight` must be one you declared. CJK, Korean, Arabic, Hebrew, Thai, Devanagari and Bengali text gets a Noto fallback automatically.
- **Draw symbols, don't type them.** A character no loaded font has renders as a **blank box** (emoji always; `✔ ✉ ★`, sometimes `→`). `check_designs` warns about these. Use inline SVG, shapes, numerals.
- **Fit the text.** Headlines: `whiteSpace: "nowrap"`, sized so the longest line fits — bold display type is ≈ 0.5 em per character. If a line wraps mid-word or content is pushed off the canvas, reduce the size.
- **Logos:** use the brand's real logo, never a redrawn one; pick the variant for the card's background. Embed as a base64 `<img>` (async default export, read the file relative to the design with `import.meta.url`) with `width` AND `height` in the file's true aspect ratio. PNG/JPEG/SVG only — convert AVIF/WebP; rasterise SVGs that contain `<text>`. No logo → a text wordmark.
- **Contrast:** body text ≥ 4.5:1 against its background. Keep one accent dominant.

## Common sizes
OG 1200×630 · README card 1280×640 · thumbnail 1280×720 · X/GitHub cover 1500×500 · LinkedIn cover 1584×396 · poster 1080×1920 · portrait post 1080×1350.
