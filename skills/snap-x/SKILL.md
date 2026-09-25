---
name: snap-x
description: Turn any project into a full branded image pack — OG cards, thumbnails, Twitter/X covers, Instagram posters, and GitHub README cards. Use when someone says "/snap-x", "generate images for this project", "make OG images", "create social images", or "snap this". Reads the project code directly — no live URL needed.
---

# /snap-x

You built it. Now frame it.

`/snap-x` generates a complete branded image pack by writing Satori design trees and rendering them — no browser, pure Node.js.

**Formats:** OG (1200×630) · Thumbnail (1280×720) · Cover (1500×500) · Poster (1080×1920) · README card (1280×640)

---

## Invocation

```
/snap-x
/snap-x --theme light
/snap-x --format og
/snap-x --title "My App" --desc "One-line pitch"
/snap-x --font "Saira"
```

| Option | Values | Default |
|---|---|---|
| `--format` | `og`, `thumbnail`, `cover`, `poster`, `readme` | all |
| `--theme` | `dark`, `light` | `dark` |
| `--title` | string | inferred from project |
| `--desc` | string | inferred from project |
| `--domain` | string | inferred from project |
| `--tags` | comma-separated | inferred from project |
| `--font` | Google Font name | inferred or `Inter` |
| `--out` | directory path | `snap-output/` |

---

## Architecture

snap-x uses a **Satori pipeline** — no browser, pure Node.js:

1. Claude inspects the project and plans the design
2. Claude writes **Satori JSX trees** to `snap-x/designs/*.mjs`
3. `snap-x check` validates the trees (Satori CSS rules)
4. `snap-x render` runs Satori → SVG → resvg → PNG

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

### Standard (sync)

Design files are standalone — no imports from `@snap-x/core`. Define colors inline from `config.themeOverride`:

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default function (config) {
  const accent      = config.themeOverride?.accent      ?? "#6366f1";
  const accentMuted = config.themeOverride?.accentMuted ?? "rgba(99,102,241,0.25)";
  const borderAccent= config.themeOverride?.borderAccent?? "rgba(99,102,241,0.35)";
  const bg          = "#000000";
  const text        = "rgba(255,255,255,0.95)";
  const textMuted   = "rgba(255,255,255,0.50)";
  const { title, description, domain, tags, stack } = config;

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

When the project has logos, partner badges, or product images, make the function async:

```js
import fs from "fs/promises";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

async function loadBase64(filePath, mime) {
  const buf = await fs.readFile(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function (config) {
  const accent = config.themeOverride?.accent ?? "#6366f1";
  // ... other colors

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

### Static tree (baked values)

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
import { getIcon } from "my-icon-pack"; // user's choice
```

---

## Fonts

Any Google Font works via `--font` or in `snap-x.config.json`. snap-x downloads and caches all 4 weights automatically (Regular 400, Medium 500, Bold 700, ExtraBold 800).

```bash
snap-x render --font "Saira"
snap-x render --font "Space Grotesk"
snap-x render --font "DM Mono"
```

Use `fontWeight` freely in your design — all weights are loaded.

---

## Theme tokens

Colors are defined inline in each design file from `config.themeOverride`. Standard set:

| Variable | Description |
|---|---|
| `accent` | Brand accent color |
| `accentMuted` | Accent with low opacity (glows, fills) |
| `borderAccent` | Accent border color |
| `bg` | Background color |
| `text` | Primary text |
| `textMuted` | Secondary / muted text |

All are overridable via `themeOverride` in `snap-x.config.json`:

```json
{
  "themeOverride": {
    "accent": "#eb1d25",
    "accentMuted": "rgba(235,29,37,0.25)",
    "borderAccent": "rgba(235,29,37,0.30)"
  }
}
```

---

## Customization surface

Everything is customizable. Here's what Claude controls when writing design files:

| Layer | How |
|---|---|
| Layout | Full Satori tree — any composition of flex containers |
| Colors | `themeOverride` in config or hardcoded in design |
| Typography | Font via `--font`; `fontWeight`, `fontSize`, `letterSpacing` per element |
| Icons | Emoji, inline SVG paths, or any icon package |
| Logos & images | `async` function + `fs.readFile` → base64 `<img>` nodes |
| Copy | All config fields: `title`, `description`, `domain`, `tags`, `stack` |
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

Write `<out>/snap-plan.md`. Decide layout, copy, icons, assets, and visual choices for each format. Commit to the creative direction.

**Gate:** `snap-plan.md` exists with per-format specs.

---

## Step 3 — Write the design files

**Read:** `references/step-3-design.md`

Write `snap-x/designs/*.mjs` — one file per format. Each file is a valid Satori tree. Follow the Satori rules above. Use async functions when loading local assets.

Run `npx snap-x check` after writing. Fix any errors before proceeding.

**Gate:** `snap-x check` passes with zero errors.

---

## Step 4 — Render and deliver

**Read:** `references/step-4-render.md`

Run `npx snap-x render`, verify output images, write `share-copy.txt` with placement instructions.

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

MCP tools: `generate_images`, `init_config`, `list_formats`
