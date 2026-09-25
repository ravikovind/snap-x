# snap-x — Current Flow & Architecture

> Last updated: 2026-09-25

---

## What it is

snap-x is a **render-only** Satori pipeline: a self-contained `.mjs` design file goes in, a PNG comes out. No browser, pure Node.js.

There is no config file, no auto-detection, no scaffolding step. A design file declares everything it needs (`FORMAT`, optionally `FONTS`) and nothing external is merged into it. Deciding *what the image should say and look like* is not core's job — that's either a human writing the file by hand, or the `/snap-x` Claude Code skill inspecting the project and writing it.

```
project or prompt  →  agent (or you) decides content  →  writes a self-contained .mjs  →  snap-x renders it  →  PNG
```

---

## Pipeline

```
you write designs/*.mjs   →  self-contained Satori trees (FORMAT, optional FONTS, default export)
snap-x check               →  validate Satori CSS rules + attempt a real Satori render
snap-x render               →  design function → Satori (SVG) → resvg (PNG)
```

Detailed render path:

```
snap-x render <paths...> [--out <dir>]
  ├── resolveDesignFiles(paths)     expand literal files / directories / `*` globs to a flat .mjs list
  ├── collectFontsSpec(files)       read each file's FONTS export, merge into one spec
  ├── resolveFonts(spec)            fetch + cache Google Fonts (dedup by family+weight; falls back to Inter on failure)
  └── for each design file:
        import(designPath)          dynamic ESM import
        await mod.default()         call design function — no arguments
        satori(tree, {w,h,fonts})   tree → SVG string
        Resvg(svg).render()         SVG → PNG buffer
        fs.writeFile(outDir/name)   write PNG
```

`snap-x check <paths...>` follows the same resolve → collect fonts → resolve fonts path, then for each file: validates structural Satori rules (display:flex only, no z-index/position:fixed/grid) and, if fonts loaded successfully, actually runs the tree through `satori()` to catch runtime-only errors (bad image data URIs, invalid font weights, malformed SVG paths) before you spend time on a full render.

---

## CLI reference

```
snap-x check  <paths...>
snap-x render <paths...> [--out <dir>]
```

`<paths...>` accepts any mix of:
- a literal file — `designs/og.mjs`
- a directory — `designs/` (expands to every `.mjs` inside)
- a glob with one trailing `*` — `designs/*.mjs`

| Flag | Default | Description |
|------|---------|-------------|
| `--out` | `./snap-output` | Output directory (render only) |

Nothing else. No `--title`, `--font`, `--theme`, `--project` — a design file is self-contained, so there's nothing left for a flag to override.

---

## Design files

A design file exports `FORMAT`, optionally `FONTS`, and a default export — a static tree object, or a **zero-argument** (optionally async) function returning one. No config object is ever passed in.

### Standard (sync)

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Saira", weights: [400, 700, 900] }]; // optional, defaults to Inter 400/700/900

export default function () {
  const accent      = "#eb1d25"; // hardcode whatever you want — no themeOverride, no config
  const accentMuted = "rgba(235,29,37,0.25)";
  const bg          = "#000000";
  const text        = "rgba(255,255,255,0.95)";

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: bg, display: "flex" },
      children: [ /* Satori tree here */ ],
    },
  };
}
```

### Async design file (local image assets)

```js
import fs from "fs/promises";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

async function loadBase64(filePath, mime) {
  const buf = await fs.readFile(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function () {
  const logo  = await loadBase64("./public/logo.png", "image/png");
  const badge = await loadBase64("./public/badge.svg", "image/svg+xml");

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: "#000", display: "flex" },
      children: [
        { type: "img", props: { src: logo,  width: 200, height: 60, style: { display: "flex" } } },
        { type: "img", props: { src: badge, width: 160, height: 48, style: { display: "flex" } } },
      ],
    },
  };
}
```

### Static tree (baked, no function)

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export default {
  type: "div",
  props: { style: { width: 1200, height: 630, background: "#000", display: "flex" }, children: [] },
};
```

---

## Satori rules

These are the only constraints. Everything else is normal CSS-in-JS.

| Rule | Detail |
|------|--------|
| `display: "flex"` required | Every container — no block, grid, or inline |
| `children` is always an array | Even a single child: `children: ["text"]` |
| `position: "absolute"` | Works fine |
| `position: "fixed"` | Not supported |
| `z-index` | Not supported |
| CSS Grid | Not supported |
| CSS animations | Not supported |
| Text | String directly in children array: `children: ["Hello"]` |

`snap-x check` catches the structural violations above, plus (when fonts load successfully) runtime-only Satori errors via an actual render attempt.

---

## Fonts

Declared per-file via `FONTS`, not passed in from outside:

```js
export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "JetBrains Mono", weights: [400] }, // a second family — no special "monoFont" concept, just another entry
];
```

Omitted → defaults to `[{ family: "Inter", weights: [400, 700, 900] }]`.

`resolveFonts()` (in `fonts.mjs`) merges every file's `FONTS` in a batch, dedupes by family+weight, and fetches each exactly once regardless of how many files reference it. `loadGoogleFont()` falls back to Inter with a console warning if a requested family/weight can't be fetched, instead of aborting the whole render.

---

## Icons

Design files are plain JS — use any source:

**Emoji** (zero deps):
```js
{ type: "div", props: { style: { fontSize: 24, display: "flex" }, children: ["⚡"] } }
```

**Inline SVG path** (Lucide, Heroicons, Phosphor, etc. — copy any path):
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

**Icon package** (install anything):
```js
import { getIcon } from "your-icon-pack";
```

---

## Local images & assets

Load PNG, JPG, or SVG from disk and embed as base64 `<img>` nodes — unaffected by the render-only redesign, since this never depended on config.

```js
import fs from "fs/promises";

const buf = await fs.readFile("./public/logo.png");
const src = `data:image/png;base64,${buf.toString("base64")}`;

{ type: "img", props: { src, width: 200, height: 60, style: { display: "flex" } } }
```

---

## Full customization surface

| Layer | How |
|-------|-----|
| Layout & composition | Rewrite the `.mjs` tree entirely — it's just JavaScript |
| Colors | Hardcode whatever hex/rgba values you want, per file — no shared theme/config |
| Typography | `FONTS` export — any Google Font(s), any weights, per file; `fontWeight`, `fontSize`, `letterSpacing` per element |
| Icons | Emoji, inline SVG paths, or any icon package |
| Logos & images | `async` default export + `fs.readFile` → base64 `<img>` |
| Copy & content | Baked directly into the tree — the agent (or you) already knows the real project, no auto-detection layer to route through |
| Per-format design | Each `.mjs` is independent — poster can look nothing like OG |
| Output filename | `FORMAT.name` |
| Canvas size | `FORMAT.width` / `FORMAT.height` — any size Satori supports |
| Static vs dynamic | Export a plain object (static) or function (dynamic/async) |

---

## /snap-x Claude Code skill

The `/snap-x` skill is what actually decides content — core never does:

```
/snap-x               generate a design pack
/snap-x --font Saira  specific font
```

### Skill workflow

```
Step 1 — Inspect project
  Read package.json, README, globals.css, public/assets
  Identify: brand colors, fonts, tagline, stack, local images

Step 2 — Plan the image pack
  Write snap-output/snap-plan.md
  Decide copy, layout, icons, assets, and FONTS per format

Step 3 — Write design files
  Write designs/*.mjs (one per format) — self-contained, FORMAT + optional FONTS + zero-arg default export
  Run: snap-x check designs/*.mjs  →  fix any Satori errors

Step 4 — Render and deliver
  Run: snap-x render designs/*.mjs --out snap-output
  Verify all PNGs exist
  Write snap-output/share-copy.txt (where to use each image)
```

Skill files: `skills/snap-x/SKILL.md` + `skills/snap-x/references/`

---

## Packages

| Package | Description |
|---------|-------------|
| `@snap-x/core` | Render-only: `check` + `render` CLI, Satori renderer, Google Font loader |
| `@snap-x/mcp` | MCP server exposing `render_designs` / `check_designs` / `list_formats` as agent tools |

---

## MCP server

Lets Cursor, Windsurf, Claude Desktop, and other agents render/check design files directly — the calling agent is responsible for writing the `.mjs` files themselves:

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

| Tool | Description |
|------|-------------|
| `render_designs` | Render one or more `.mjs` design files to PNG |
| `check_designs` | Validate one or more `.mjs` design files |
| `list_formats` | Common social-image dimensions, for reference only — snap-x has no fixed format list |

`@snap-x/mcp` imports `renderDesign`/`checkDesign`/`resolveFonts` directly from `@snap-x/core` (no subprocess/CLI shelling), so the two packages can never drift out of sync on their function contracts the way the old CLI-shelling MCP server did.

---

## Repo structure

```
snap-x/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── cli.mjs           entry — check / render, path & glob resolution
│   │       ├── render.mjs        Satori → resvg → PNG
│   │       ├── check.mjs         structural validation + real Satori render check
│   │       ├── fonts.mjs         Google Fonts loader/cache, FONTS-spec resolution
│   │       └── index.mjs         programmatic API (used by @snap-x/mcp)
│   └── mcp/                      MCP server — imports @snap-x/core directly
├── snap-x/
│   └── designs/                  snap-x's own example designs (self-contained, hand-written)
│       ├── og.mjs
│       ├── thumbnail.mjs
│       ├── cover.mjs
│       ├── poster.mjs
│       └── readme-card.mjs
├── examples/                     rendered PNGs (committed)
├── skills/
│   └── snap-x/
│       ├── SKILL.md              Claude Code skill definition
│       └── references/           step-by-step guides for the skill
├── FLOW.md                       this file
└── README.md
```

---

## Quick start

```bash
npm install -g @snap-x/core

# write designs/og.mjs by hand, or let Claude do it:
```

```
/snap-x
```

```bash
snap-x check  designs/*.mjs
snap-x render designs/*.mjs --out snap-output
```
