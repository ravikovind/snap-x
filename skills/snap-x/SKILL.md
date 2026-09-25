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

### Satori rules (must follow when writing trees)

- Every container must have `display: "flex"` — no block, grid, or inline
- `children` must always be an array
- `position: "absolute"` works; `position: "fixed"` does not
- No `z-index`, no CSS Grid, no animations
- Text is a string in the children array: `children: ["Hello"]`
- SVG icons: use `lucideIcon()` from `../src/icons.mjs`
- Themes: import `getTheme` from `../src/themes/index.mjs`

### Design file format

```js
// snap-x/designs/og.mjs
import { getTheme } from "../../../node_modules/@snap-x/core/src/themes/index.mjs";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default function (config) {
  const t = getTheme(config.theme);
  const { title, description, domain, tags } = config;
  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: t.bg, display: "flex", ... },
      children: [ ... ]
    }
  };
}
```

Or a static tree (no function) when Claude bakes values directly:

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export default {
  type: "div",
  props: { style: { width: 1200, height: 630, background: "#0a0a0a", display: "flex" }, children: [...] }
};
```

---

## Output directory

Default: `snap-output/`. Use a timestamped directory `snap-output-YYYY-MM-DD-HHmmss/` when one already exists.

---

## Step 1 — Inspect the project

**Read:** `references/step-1-inspect.md`

Scan the project and answer the 8-question rubric. Understand the brand: colors, fonts, product description, audience.

**Gate:** All 8 questions answered before writing any design.

---

## Step 2 — Plan the image pack

**Read:** `references/step-2-plan.md`

Write `<out>/snap-plan.md`. Decide layout, copy, and visual choices for each format. Commit to the creative direction.

**Gate:** `snap-plan.md` exists with per-format specs.

---

## Step 3 — Write the design files

**Read:** `references/step-3-design.md`

Write `snap-x/designs/*.mjs` — one file per format. Each file is a valid Satori tree. Follow the Satori rules above.

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
