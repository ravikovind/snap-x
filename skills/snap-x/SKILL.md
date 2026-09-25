---
name: snap-x
description: Turn any project into a full branded image pack — OG cards, thumbnails, Twitter/X covers, Instagram posters, and GitHub README cards. Use when someone says "/snap-x", "generate images for this project", "make OG images", "create social images", or "snap this". Reads the project code directly — no live URL needed.
---

# /snap-x

You built it. Now frame it.

`/snap-x` generates a complete branded image pack by writing self-contained Satori design files and rendering them — no browser, pure Node.js.

**Formats:** Any size, any name — write a `.mjs` file, get a PNG.

Suggested defaults: OG (1200×630) · Thumbnail (1280×720) · Cover (1500×500) · Poster (1080×1920) · README card (1280×640)

Custom examples: LinkedIn cover (1584×396) · App Store screenshot (1290×2796) · Twitter header (1500×500) · Discord banner (960×540) — or any dimension you need.

---

## Invocation

```
/snap-x
/snap-x --font "Saira"
```

There's no `--format`, `--title`, `--desc`, `--theme` flag surface — those are decisions you make while writing the design files, not CLI options. `--font` is a suggestion for the default font family to use across the pack; nothing stops you from picking a different one per file.

---

## Architecture

snap-x is **render-only** — it has no config, no auto-detection, no scaffolding. It does exactly one thing: turn a self-contained `.mjs` file into a PNG. Everything else is your job:

1. Inspect the project and plan the design
2. Write self-contained **Satori JSX trees** to `designs/*.mjs` — no config object, no external state
3. `snap-x check designs/*.mjs` validates the trees (Satori CSS rules + an actual render attempt)
4. `snap-x render designs/*.mjs --out <dir>` runs Satori → SVG → resvg → PNG

Design files are plain `.mjs` — version-controllable, editable, re-renderable any time.

---

## Satori rules (must follow when writing trees)

- Every container must have `display: "flex"` — no block, grid, or inline
- `children` must always be an array
- `position: "absolute"` works; `position: "fixed"` does not
- No `z-index`, no CSS Grid, no animations
- Text is a string in the children array: `children: ["Hello"]`

---

## Design file format

Every file exports `FORMAT`, optionally `FONTS`, and a default export that takes **no arguments** — nothing is passed in, so hardcode everything the file needs directly.

### Standard (sync)

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Inter", weights: [400, 700, 900] }]; // optional — omit to default to Inter 400/700/900

export default function () {
  const accent      = "#6366f1"; // whatever brand color you found while inspecting — no config, just hardcode it
  const accentMuted = "rgba(99,102,241,0.25)";
  const borderAccent= "rgba(99,102,241,0.35)";
  const bg          = "#000000";
  const text        = "rgba(255,255,255,0.95)";
  const textMuted   = "rgba(255,255,255,0.50)";

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: bg, display: "flex" },
      children: [ ... ]
    }
  };
}
```

### With local assets (async)

When the project has logos, partner badges, or product images, make the function async — still zero arguments:

```js
import fs from "fs/promises";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

async function loadBase64(filePath, mime) {
  const buf = await fs.readFile(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function () {
  const accent = "#6366f1";
  const logo  = await loadBase64("./public/logo.png", "image/png");
  const badge = await loadBase64("./public/partner-badge.svg", "image/svg+xml");

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: "#000", display: "flex" },
      children: [
        { type: "img", props: { src: logo,  width: 200, height: 60,  style: { display: "flex", objectFit: "contain" } } },
        { type: "img", props: { src: badge, width: 160, height: 48,  style: { display: "flex", objectFit: "contain" } } },
      ]
    }
  };
}
```

Relative paths in `fs.readFile` resolve from the directory you **run `snap-x` in**, not from the design file — so run it from the project root (where `./public/logo.png` lives), or use absolute paths.

### Static tree (no function needed)

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export default {
  type: "div",
  props: { style: { width: 1200, height: 630, background: "#0a0a0a", display: "flex" }, children: [...] }
};
```

---

## Icons

Design files are plain JavaScript — use any icon source:

**Emoji** (zero deps):
```js
{ type: "div", props: { style: { fontSize: 24, display: "flex" }, children: ["⚡"] } }
{ type: "div", props: { style: { fontSize: 16, display: "flex" }, children: ["📍"] } }
```

**Inline SVG path** (any icon library — Lucide, Heroicons, Phosphor, etc.):
```js
{
  type: "svg",
  props: {
    width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
    stroke: accent, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    children: [{ type: "path", props: { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" } }],
  },
}
```

**Icon pack** (install anything):
```js
import { getIcon } from "my-icon-pack"; // your choice
```

---

## Fonts

Declare exactly what each file needs via `FONTS` — any Google Font, any weights:

```js
export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "JetBrains Mono", weights: [400] }, // a second family, if the design needs one — just another entry
];
```

Omit `FONTS` entirely to default to Inter 400/700/900. Each file in a batch declares its own fonts independently — `og.mjs` can use Saira while `poster.mjs` uses Space Grotesk in the same `snap-x render` call. Fonts are fetched and deduped across the batch; an unavailable font falls back to Inter with a warning rather than failing the render.

Use `fontWeight` freely as long as it's one of the weights you declared.

Non-Latin copy (Japanese, Korean, Arabic, Hebrew, Thai, Devanagari, …) needs no extra `FONTS` entry — snap-x adds a matching Noto Sans subset automatically for the glyphs your font can't draw. Emoji aren't supported yet, so avoid them in copy.

---

## Colors

There's no theme system, no `themeOverride`, no config to merge. Pick real values while inspecting the project (brand accent from CSS, or a sensible default) and hardcode them directly in each design file — as plain consts, same as the accent/text example above. Each file is independent, so nothing stops one format using different colors than another if that's the right call.

---

## Customization surface

Everything is customizable, and none of it goes through a shared schema:

| Layer | How |
|---|---|
| Layout | Full Satori tree — any composition of flex containers |
| Colors | Hardcode hex/rgba values per file, based on what you found inspecting the project |
| Typography | `FONTS` export — any Google Font(s)/weights, per file; `fontWeight`, `fontSize`, `letterSpacing` per element |
| Icons | Emoji, inline SVG paths, or any icon package |
| Logos & images | `async` function + `fs.readFile` → base64 `<img>` nodes |
| Copy | Baked directly into the tree — you already read the real project |
| Per-format design | Each `.mjs` is independent — poster ≠ OG ≠ cover |
| Output filename | Set `FORMAT.name` |
| Canvas size | Set `FORMAT.width` / `FORMAT.height` |
| Sections / content | Services list, stats bar, location row, CTA — anything baked in |

---

## Output directory

Default: `snap-output/`. Use a timestamped directory `snap-output-YYYY-MM-DD-HHmmss/` when one already exists.

---

## Step 1 — Inspect the project

**Read:** `references/step-1-inspect.md`

Scan the project and answer the 8-question rubric. Understand the brand: colors, fonts, product description, audience. Look for local assets in `public/`, `assets/`, `static/` that could be embedded.

**Gate:** All 8 questions answered before writing any design.

---

## Step 2 — Plan the image pack

**Read:** `references/step-2-plan.md`

Write `<out>/snap-plan.md`. Decide layout, copy, icons, assets, colors, and fonts for each format. Commit to the creative direction.

**Gate:** `snap-plan.md` exists with per-format specs.

---

## Step 3 — Write the design files

**Read:** `references/step-3-design.md`

Write `designs/*.mjs` — one file per format needed, each self-contained (FORMAT, optional FONTS, zero-argument default export). Format names and dimensions are **not fixed** — choose what fits the project:

- Use the 5 suggested defaults when broad social coverage is needed
- Add `linkedin-cover.mjs` (1584×396), `app-screenshot.mjs` (1290×2796), or any custom size
- Skip formats that don't apply — a CLI tool doesn't need a poster

Each file is a valid Satori tree. Follow the Satori rules above. Use async functions when loading local assets.

Run `npx @snap-x/cli check designs/*.mjs` after writing. Fix any errors before proceeding.

**Gate:** `snap-x check` passes with zero errors.

---

## Step 4 — Render and deliver

**Read:** `references/step-4-render.md`

Run `npx @snap-x/cli render designs/*.mjs --out <dir>`, verify output images, write `share-copy.txt` with placement instructions.

**Gate:** All PNGs exist. `share-copy.txt` tells the user exactly where each image goes.

---

## Agent integration (MCP)

snap-x ships an MCP server at `packages/mcp/`:

```json
{
  "mcpServers": {
    "snap-x": {
      "command": "npx",
      "args": ["@snap-x/mcp"]
    }
  }
}
```

MCP tools: `render_designs`, `check_designs`, `list_formats`. The calling agent writes the `.mjs` files itself (following the same conventions as this skill) and hands their paths to these tools — the MCP server, like the CLI, only renders and validates.
