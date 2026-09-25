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
        loadDesignModule(designPath)  dynamic ESM import — once per file version, so top-level code runs once
        await mod.default()         call design function — no arguments
        loadFallbackFonts(tree)     Noto subsets for any non-Latin scripts in the text
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
import { fileURLToPath } from "url";

// Resolve assets relative to THIS file, so it renders correctly from any working directory.
const asset = async (rel, mime) =>
  `data:${mime};base64,${(await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)))).toString("base64")}`;

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default async function () {
  const logo  = await asset("../assets/logo.png", "image/png");
  const badge = await asset("../assets/badge.svg", "image/svg+xml");

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

### Shared helpers (`_` prefix)

A file whose name starts with `_` (e.g. `_cover.mjs`) is a helper: `snap-x render`/`check` skip it when expanding a directory or glob, but other designs can `import` it. `examples/ravikovind/` uses this to build one composition and render it several ways (1×, @2×, QA overlay, mobile crop). Each design file still exports its own `FORMAT` and `FONTS`.

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

### Font cache

`fonts.mjs` has two layers: an in-memory map (per process) and a persistent disk cache, keyed by `sha256(family, weight, text)` → `<hash>.ttf` in `$SNAP_X_CACHE_DIR` / `$XDG_CACHE_HOME/snap-x/fonts` / `~/.cache/snap-x/fonts`. A cached font needs no network, so renders work offline after the first run. Rules: writes are write-then-rename (safe with concurrent runs); an empty/corrupt file is treated as a miss; failed downloads (including a non-2xx font file) are never written; an Inter *fallback* is stored as Inter, never under the missing family's key; any cache read/write error silently falls back to the network. `resetFontCache()` clears memory only. Clear the cache by deleting the directory.

### Script fallback (automatic)

Satori falls back per glyph across *every* loaded font, whatever `fontFamily` a node names. `renderDesign` uses that: after building a design's tree it collects the text (`fallback.mjs › collectText`), and for each script the text contains that isn't Latin/Latin-1 (CJK → Noto Sans JP, Hangul → KR, Arabic, Hebrew, Thai, Devanagari, Bengali, plus Cyrillic/Greek/Latin-ext → Noto Sans) it fetches a **subset containing only those characters** via Google's `text=` parameter (a few KB), at the same weights as the primary fonts, and appends it *after* the primary fonts so they always win. A fallback that can't be fetched warns and is skipped. Emoji are not covered.

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

Load PNG, JPG, or SVG from disk and embed as base64 `<img>` nodes. Resolve the path from the design file (`new URL("../assets/logo.png", import.meta.url)`), not the cwd, so it renders identically from any directory. AVIF/WebP are not supported (convert to PNG); an SVG with `<text>` must be rasterised first (SVG text can't load webfonts when embedded).

```js
const logo = await asset("../assets/logo.png", "image/png"); // helper shown above
{ type: "img", props: { src: logo, width: 231, height: 44, style: { display: "flex" } } } // width AND height, true aspect ratio
```

**Brand assets** — the skill's Step 1 finds a project's logo/icon (repo files, favicons, manifest icons; or on a website: `<link rel="icon">`, header logo, `/brand`/`/press` pages), picks the variant for the card's background, and records origins in `assets/SOURCES.md`. See `skills/snap-x/references/step-1-inspect.md`.

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

Input can be a repo, a website URL, or a written brief. `SKILL.md` is a lean workflow (54 lines) — each step has a reference file and a gate.

```
Step 1 — Inspect      copy, colors, fonts (repo files, or curl the site's HTML/CSS), and the real logo/brand assets
                      → assets/ + SOURCES.md.   Facts rule: nothing invented.
Step 2 — Plan         snap-plan.md: hook, copy per format, palette, fonts, assets, facts ledger, banner safe zones
Step 3 — Write        designs/*.mjs — self-contained; draw symbols as SVG; fit text (nowrap, ≈0.5em/char); `check` passes
Step 4 — Render       render, then LOOK at every PNG (blank boxes, wrapping, clipping, contrast, logo visibility);
                      banners also get a danger-zone overlay + mobile-crop render; write share-copy.txt
```

Skill files: `skills/snap-x/SKILL.md` + `skills/snap-x/references/`

---

## Packages

| Package | Description |
|---------|-------------|
| `@snap-x/cli` | The `snap-x` command (`check` / `render`) — thin package that owns the bin and runs `@snap-x/core`'s `./cli` |
| `@snap-x/core` | The engine: Satori renderer, Google Font loader, checker, programmatic API (the CLI implementation lives here as `./cli`) |
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
│   ├── cli/                      bin.mjs → @snap-x/core/cli (owns the `snap-x` command)
│   ├── core/
│   │   ├── src/
│   │   │   ├── cli.mjs           entry — check / render
│   │   │   ├── resolve.mjs       files / directories / `*` globs → .mjs paths
│   │   │   ├── render.mjs        Satori → resvg → PNG
│   │   │   ├── check.mjs         structural validation + real Satori render check
│   │   │   ├── load.mjs          imports a design once per file version (mtime-keyed)
│   │   │   ├── fonts.mjs         Google Fonts loader/cache, FONTS-spec resolution
│   │   │   ├── fallback.mjs      per-design script fallback fonts (CJK, Arabic, …)
│   │   │   └── index.mjs         programmatic API (used by @snap-x/mcp)
│   │   └── test/                 node:test suites (resolve, check, fonts, fallback, load, cli) + helpers.mjs — `npm test`
│   └── mcp/                      MCP server — imports @snap-x/core directly
├── examples/
│   └── snap-x/                   dogfood: the /snap-x skill's output for this repo
│       ├── designs/*.mjs         og · thumbnail · cover · poster · readme-card (self-contained)
│       ├── *.png                 rendered images (committed; readme-card.png is the README header)
│       ├── snap-plan.md          the skill's plan (Step 2)
│       └── share-copy.txt        where each image goes (Step 4)
│                                 regenerate: `npm run examples`
│   ├── open-notifier/            second example, built from a website (no repo): og + notifications
│   ├── heyreach/                 third example, from a website: og + senders
│   └── ravikovind/               personal LinkedIn cover from a written spec (plan.md): 1x, @2x, QA overlay, mobile crop; shared `_cover.mjs` builder
│                                 each folder: designs/*.mjs · *.png · snap-plan.md · share-copy.txt
├── scripts/
│   └── examples.mjs              `npm run examples` — renders/checks every examples/*/designs
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
npm install -g @snap-x/cli

# write designs/og.mjs by hand, or let Claude do it:
```

```
/snap-x
```

```bash
snap-x check  designs/*.mjs
snap-x render designs/*.mjs --out snap-output
```
