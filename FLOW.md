# snap-x — Current Flow & Architecture

> Last updated: 2026-09-25

---

## What it is

snap-x turns any project into a full branded image pack — no browser, pure Node.js.

**5 formats generated in one command:**

| Format            | Size       | Use case                          |
|-------------------|------------|-----------------------------------|
| `og.png`          | 1200×630   | Open Graph / Twitter card         |
| `thumbnail.png`   | 1280×720   | YouTube / blog header             |
| `cover.png`       | 1500×500   | GitHub / Twitter/X banner         |
| `poster.png`      | 1080×1920  | Instagram story / vertical        |
| `readme-card.png` | 1280×640   | GitHub README social preview      |

---

## Pipeline

```
snap-x init    →  scaffold snap-x.config.json + snap-x/designs/*.mjs
snap-x check   →  validate Satori CSS rules in design files
snap-x render  →  design function → Satori (SVG) → resvg (PNG)
```

Detailed render path:

```
snap-x render
  ├── loadConfig()              reads snap-x.config.json (or auto-detects from package.json / README.md)
  ├── getFonts()                downloads + caches Google Font (weights: 400, 700, 900)
  ├── getDesignFiles()          reads snap-x/designs/*.mjs (or packages/core/default-designs/)
  └── for each design file:
        import(designPath)      dynamic ESM import
        await mod.default(config)    call design function (sync or async)
        satori(tree, {w,h,fonts})    tree → SVG string
        Resvg(svg).render()          SVG → PNG buffer
        fs.writeFile(outDir/name)    write PNG
```

---

## CLI reference

```
snap-x init   [--project <dir>] [--force]
snap-x check  [--project <dir>] [--format <id>]
snap-x render [--project <dir>] [--format <id>] [--font <name>]
              [--theme dark|light] [--out <dir>]
              [--title <str>] [--desc <str>] [--domain <str>] [--tags <csv>]
```

| Flag        | Default         | Description                                           |
|-------------|-----------------|-------------------------------------------------------|
| `--project` | `cwd`           | Path to project directory                             |
| `--format`  | all             | One format: `og` `cover` `thumbnail` `poster` `readme` |
| `--font`    | `Inter`         | Any Google Font family name                           |
| `--theme`   | `dark`          | Visual theme hint (passed to config)                  |
| `--out`     | `./snap-output` | Output directory                                      |
| `--title`   | auto-detected   | Override project title                                |
| `--desc`    | auto-detected   | Override description                                  |
| `--domain`  | auto-detected   | Override domain/brand                                 |
| `--tags`    | auto-detected   | Comma-separated tags                                  |
| `--force`   | false           | Overwrite existing files on init                      |

---

## Config file — snap-x.config.json

```json
{
  "title": "My Project",
  "description": "A short description of what this project does.",
  "domain": "myproject.com",
  "tags": ["Open Source", "TypeScript", "Node.js"],
  "stack": ["Node.js", "TypeScript"],
  "theme": "dark",
  "font": "Inter",
  "outDir": "./snap-output",
  "themeOverride": {
    "accent": "#6366f1",
    "accentMuted": "rgba(99,102,241,0.25)",
    "borderAccent": "rgba(99,102,241,0.35)"
  }
}
```

All fields are optional. Without a config file, snap-x auto-detects from:
- `package.json` — name, description, keywords → title, description, tags
- `README.md` — first heading + paragraph → title, description
- `next.config.*` — detects Next.js, adds to stack
- `app/globals.css` — `--font-sans`, accent color → font + themeOverride

---

## Design files

After `snap-x init`, designs live in `snap-x/designs/`. Each file:
- exports `FORMAT` (dimensions + output filename)
- exports a default function (or static object)
- is plain ESM — no framework, no build step

**Design files are yours.** snap-x is just the renderer. Edit, version-control, re-render any time.

### File structure

```
snap-x/
└── designs/
    ├── og.mjs           1200×630
    ├── thumbnail.mjs    1280×720
    ├── cover.mjs        1500×500
    ├── poster.mjs       1080×1920
    └── readme-card.mjs  1280×640
```

### Standard (sync) design file

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default function (config) {
  const accent       = config.themeOverride?.accent       ?? "#6366f1";
  const accentMuted  = config.themeOverride?.accentMuted  ?? "rgba(99,102,241,0.25)";
  const borderAccent = config.themeOverride?.borderAccent ?? "rgba(99,102,241,0.35)";
  const bg           = "#000000";
  const text         = "rgba(255,255,255,0.95)";
  const textMuted    = "rgba(255,255,255,0.50)";
  const { title, description, domain, tags, stack } = config;

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: bg, display: "flex" },
      children: [
        // Satori tree here
      ],
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

export default async function (config) {
  const accent = config.themeOverride?.accent ?? "#6366f1";
  // ... other colors

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

### Static tree (baked, no config)

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

Run `snap-x check` to catch violations before rendering.

---

## Config object passed to design functions

```ts
{
  title: string
  description: string
  domain: string
  tags: string[]
  stack: string[]
  theme: "dark" | "light"
  font: string              // Google Font name
  outDir: string
  themeOverride: {
    accent?: string
    accentMuted?: string
    borderAccent?: string
    bg?: string             // optional, define inline in design
    text?: string           // optional
    textMuted?: string      // optional
  }
}
```

---

## Theme tokens (inline in design files)

Colors are **not imported from core** — defined inline using `config.themeOverride` with fallbacks:

```js
const accent       = config.themeOverride?.accent       ?? "#yourDefault";
const accentMuted  = config.themeOverride?.accentMuted  ?? "rgba(...)";
const borderAccent = config.themeOverride?.borderAccent ?? "rgba(...)";
const bg           = "#000000";
const text         = "rgba(255,255,255,0.95)";
const textMuted    = "rgba(255,255,255,0.50)";
```

Override per-project in `snap-x.config.json` → `themeOverride`.

---

## Fonts

Any [Google Font](https://fonts.google.com) via `--font` or `"font"` in config.

snap-x downloads and caches 3 weights automatically: **400, 700, 900**.
Use `fontWeight: 400 | 700 | 900` in your designs.

```bash
snap-x render --font "Saira"
snap-x render --font "Space Grotesk"
snap-x render --font "DM Mono"
```

For a second (mono) font, add `"monoFont": "JetBrains Mono"` to config — weights 400 + 700 are loaded.

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

Load PNG, JPG, or SVG from disk and embed as base64 `<img>` nodes.
Both PNG and SVG are confirmed working.

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
| Brand colors | `themeOverride` in config or hardcoded per-design |
| Typography | `--font` for any Google Font; `fontWeight`, `fontSize`, `letterSpacing` per element |
| Icons | Emoji, inline SVG paths, or any icon package |
| Logos & images | `async` design + `fs.readFile` → base64 `<img>` |
| Copy & content | All config fields: `title`, `description`, `tags`, `domain`, `stack` |
| Per-format design | Each `.mjs` is independent — poster can look nothing like OG |
| Output filename | `FORMAT.name` |
| Canvas size | `FORMAT.width` / `FORMAT.height` — any size Satori supports |
| Sections | Services, stats bar, locations, CTA — anything baked in or driven by config |
| Mono font | `"monoFont"` in config for a second typeface |
| Static vs dynamic | Export a plain object (static) or function (dynamic/async) |

---

## Auto-detection (no config needed)

| Source | What's extracted |
|--------|-----------------|
| `package.json` | name → title, description, keywords → tags |
| `README.md` | first heading → title, first paragraph → description |
| `next.config.*` | framework → added to stack |
| `app/globals.css` | `--font-sans` → font, CSS accent color → themeOverride |

---

## /snap-x Claude Code skill

The `/snap-x` skill lets Claude **write the design files for you**:

```
/snap-x               generate all 5 formats
/snap-x --format og   single format
/snap-x --font Saira  specific font
/snap-x --theme light light theme
```

### Skill workflow

```
Step 1 — Inspect project
  Read package.json, README, globals.css, public/assets
  Identify: brand colors, fonts, tagline, stack, local images

Step 2 — Plan the image pack
  Write snap-output/snap-plan.md
  Decide copy, layout, icons, assets per format

Step 3 — Write design files
  Write snap-x/designs/*.mjs (one per format)
  Run: snap-x check  →  fix any Satori errors

Step 4 — Render and deliver
  Run: snap-x render
  Verify all PNGs exist
  Write snap-output/share-copy.txt (where to use each image)
```

Skill files: `skills/snap-x/SKILL.md` + `skills/snap-x/references/`

---

## Packages

| Package | Description |
|---------|-------------|
| `@snap-x/core` | CLI + Satori renderer + default designs |
| `@snap-x/mcp` | MCP server for AI agent integration |

---

## MCP server

Lets Cursor, Windsurf, Claude Desktop, and other agents call snap-x directly:

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
| `generate_images` | Build the full image pack for a project |
| `init_config` | Scaffold config + design files |
| `list_formats` | List formats with dimensions |

---

## Repo structure

```
snap-x/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── cli.mjs           entry — init / check / render
│   │       ├── render.mjs        Satori → resvg → PNG
│   │       ├── check.mjs         Satori CSS validator
│   │       ├── fonts.mjs         Google Fonts loader + cache
│   │       ├── config.mjs        config loader
│   │       ├── adapters/         auto-detection (package.json, Next.js, CSS)
│   │       └── templates/        default-designs fallback
│   └── mcp/                      MCP server
├── snap-x/
│   └── designs/                  snap-x's own example designs
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
├── snap-x.config.json            snap-x's own config (generates examples/)
├── FLOW.md                       this file
└── README.md
```

---

## Quick start

```bash
npm install -g @snap-x/core

cd your-project
snap-x init                            # scaffold config + designs
snap-x check                           # validate
snap-x render --font "Space Grotesk"   # generate PNGs → ./snap-output/
```

Or let Claude do it:

```
/snap-x
```
