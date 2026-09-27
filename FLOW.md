# snap-x — Current Flow & Architecture

> Last updated: 2026-09-27

---

## What it is

snap-x is a **render-only** Satori pipeline: a self-contained `.mjs` design file goes in, a PNG comes out. No browser, pure Node.js.

There is no config file, no auto-detection, no scaffolding step. A design file declares everything it needs (`FORMAT`, optionally `FONTS`, optionally `VARIANTS`) and nothing external is merged into it. Deciding *what the image should say and look like* is not core's job — that's either a human writing the file by hand, or the `/snap-x` Claude Code skill inspecting the project and writing it. A design file is `.mjs`, `.jsx` or `.tsx` — the latter two are transformed at load time (esbuild, no React) but export the exact same contract.

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
snap-x render <paths...> [--out <dir>] [--scale <n>] [--only <id,id>]
  ├── resolveDesignFiles(paths)     expand literal files / directories / `*` globs to a flat design list
  │                                 (.mjs, .jsx, .tsx — files starting with `_` always skipped)
  ├── collectFontsSpec(files)       read each file's FONTS export, merge into one spec
  ├── resolveFonts(spec)            fetch + cache Google Fonts (dedup by family+weight; falls back to Inter on failure)
  └── for each design file:
        loadDesignModule(designPath)  dynamic ESM import (once per file version); .jsx/.tsx are
                                      transformed with esbuild first, against jsx-runtime.mjs (no React)
        resolveVariants(mod)        undefined (no VARIANTS) → one row; else the validated VARIANTS rows
                                    (--only <id,id> filters rows here); a row's `format` can override FORMAT
        for each row (or just once):
          await mod.default(row)   call design function — no arguments unless VARIANTS
          loadFallbackFonts(tree)  Noto subsets for any non-Latin scripts in the text
          satori(tree, {w,h,fonts})   tree → SVG string (Satori's layout stays at the design's own size)
          Resvg(svg, {fitTo: width*scale}).render()   SVG re-rasterized at n× for a sharp --scale export
          fs.writeFile(outDir/name)   write PNG — `<name>-<id>.<ext>` per row when VARIANTS, `@nx` suffix when scaled
```

`snap-x guides <paths...>` reuses the same pipeline (`renderTree`) on the design wrapped in a zone overlay, once per VARIANTS row; `snap-x formats` prints the table in `formats.mjs` (now with optional `maxBytes`/`types` limits alongside size/zones, filled in only from a format's own official source). `snap-x check <paths...> [--scale <n>]` also **warns** when the design's text contains characters none of the loaded fonts can draw (`glyphs.mjs`, via the parser Satori bundles) — they would render as blank boxes. It follows the same resolve → collect fonts → resolve fonts path, then for each file (each VARIANTS row labeled `[id] ...` in errors/warnings, one row's failure doesn't stop the others): validates structural Satori rules (display:flex only, no z-index/position:fixed/grid — including inside a JSX function component, which is called eagerly before this check ever sees the tree) and, if fonts loaded successfully, actually runs the tree through `satori()` to catch runtime-only errors (bad image data URIs, invalid font weights, malformed SVG paths) before you spend time on a full render; `--scale <n>` additionally runs the full Satori+resvg pipeline to catch resvg-side failures a large raster target can hit.

`snap-x watch <paths...> [--guides]` is a dev tool (`watch.mjs`): renders once, serves a local preview page (`fs.watch` + Node's `http`, no new deps), then re-renders (debounced) and auto-reloads the page on every save.

---

## CLI reference

```
snap-x check   <paths...> [--scale <n>]
snap-x render  <paths...> [--out <dir>] [--scale <n>] [--only <id,id>]
snap-x guides  <paths...> [--format <id>] [--out <dir>]    danger-zone overlay + mobile crop (default --out ./snap-guides)
snap-x formats [id|WxH] [--json]                           platform formats, sizes, no-alpha rules, limits, zones
snap-x watch   <paths...> [--out <dir>] [--guides] [--port <n>]   dev tool — re-render on save, local preview page
snap-x --help | --version
```

`<paths...>` accepts any mix of:
- a literal file — `designs/og.mjs` (or `.jsx`/`.tsx`)
- a directory — `designs/` (expands to every design file inside)
- a glob with one trailing `*` — `designs/*.mjs`

| Flag | Default | Description |
|------|---------|-------------|
| `--out` | `./snap-output` (render/watch) · `./snap-guides` (guides) | Output directory |
| `--scale` | `1` | Render/check at n× resolution — sharp, not upscaled; output named `<name>@nx.png` |
| `--only` | every row | `render` only: a comma-separated list of `VARIANTS` row ids to render (ignored for a design without `VARIANTS`) |
| `--format` | inferred from `FORMAT` size | Format id for `guides` (see `snap-x formats`) |
| `--guides` | off | `watch` only: also run the placement check on every change |
| `--port` | any free port | `watch` only: fix the preview server's port |
| `--json` | — | Machine-readable output for `formats` |

No `--title`, `--font`, `--theme`, `--project` — a design file is self-contained, so there's nothing left for a flag to override. Every flag above is either an output-shape option (`--out`, `--scale`, `--only`) or a dev-tool convenience (`watch`'s own flags) — none of them change what a design *says*.

---

## Design files

A design file exports `FORMAT`, optionally `FONTS`, and a default export — a static tree object, or a **zero-argument** (optionally async) function returning one. No config object is ever passed in.

### Standard (sync)

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };            // alpha: false → opaque RGB PNG (App Store / Play)
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

### VARIANTS (one design, many images)

```js
export const FORMAT = { width: 1280, height: 720, name: "episode.png" };
export const VARIANTS = [
  { id: "ep-01", title: "Setting up" },      // each row needs a unique string id
  { id: "ep-02", title: "First render", format: { name: "ep-02-custom.png" } }, // a row can override FORMAT
];
export default function (variant) { /* uses variant.title */ }  // called once per row
```

Output is `<name-stem>-<id>.<ext>` (`episode-ep-01.png`) unless a row's `format.name` overrides it. `render --only <id,id>` renders a subset; `check` and `guides` always run every row. No `VARIANTS` export → the classic zero-argument call, unchanged.

### .jsx / .tsx (no React)

```jsx
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export default function () {
  return <div style={{ width: 1200, height: 630, background: "#000", display: "flex" }} />;
}
```

Transformed at load time (`load.mjs`, esbuild's `transform()` — no bundling, no filesystem resolution) against `jsx-runtime.mjs`, a tiny classic-JSX factory that returns Satori's own tree shape directly. Function components are called immediately with their props (no reconciliation to defer to for a one-shot render), so `check`'s structural walk sees the same fully-resolved tree it would for `.mjs`. A `_`-prefixed helper resolves with a normal relative import, same as `.mjs` — the transformed code is written to a real, colocated temp file (not a `data:` URL) so relative paths still work, then removed right after import.

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
| `@snap-x/cli` | The `snap-x` command (`check` / `render` / `guides` / `formats` / `watch`) — thin package that owns the bin and runs `@snap-x/core`'s `./cli` |
| `@snap-x/core` | The engine: Satori renderer, Google Font loader, checker, guides overlay, dev watch server, programmatic API (the CLI implementation lives here as `./cli`) |
| `@snap-x/mcp` | MCP server exposing `render_designs` / `check_designs` / `preview_guides` / `list_formats` as agent tools |

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
| `render_designs` | Render one or more design files to PNG. Optional `scale: n` for a sharp `@nx` export. A `VARIANTS` design renders once per row and reports every output path |
| `check_designs` | Validate one or more design files. A `VARIANTS` design is checked once per row, failures labeled by row id |
| `preview_guides` | Draw a platform format's danger zones over a design (and its mobile crop, where the format has one) |
| `list_formats` | The full `formats.mjs` table: sizes, no-alpha rules, upload limits where documented, notes, placement zones. Pass `format` for one entry's full detail |

`@snap-x/mcp` imports `renderDesign`/`checkDesign`/`resolveFonts`/`renderGuides` directly from `@snap-x/core` (no subprocess/CLI shelling), so the two packages can never drift out of sync on their function contracts the way the old CLI-shelling MCP server did. It also serves a `snap-x://design-guide` resource and a `design_cards` prompt, for agents that don't have the `/snap-x` skill.

**Security.** Design files are JavaScript: their top-level code runs with the server's own permissions when a tool renders or checks them — same as running `node designs/og.mjs` yourself. Only point the server at design files you trust. The optional `SNAP_X_ROOT` env var restricts every tool (including a tool's `outDir`) to paths inside one directory; symlinks are resolved first, so a symlink inside the root can't point outside it undetected. Unset by default — existing setups are unaffected.

---

## Repo structure

```
snap-x/
├── packages/
│   ├── cli/                      bin.mjs → @snap-x/core/cli (owns the `snap-x` command)
│   ├── core/
│   │   ├── src/
│   │   │   ├── cli.mjs           entry — check / render / guides / formats / watch
│   │   │   ├── resolve.mjs       files / directories / `*` globs → design paths (.mjs/.jsx/.tsx)
│   │   │   ├── render.mjs        Satori → resvg → PNG; VARIANTS looping, --scale, withScaleSuffix
│   │   │   ├── check.mjs         structural validation + real Satori render check, per VARIANTS row
│   │   │   ├── load.mjs          imports a design once per file version (mtime-keyed); .jsx/.tsx via esbuild
│   │   │   ├── jsx-runtime.mjs   the no-React JSX factory .jsx/.tsx compile against
│   │   │   ├── watch.mjs         dev tool: re-render on change + a local preview page (fs.watch + http)
│   │   │   ├── fonts.mjs         Google Fonts loader/cache, FONTS-spec resolution
│   │   │   ├── fallback.mjs      per-design script fallback fonts (CJK, Arabic, …)
│   │   │   ├── glyphs.mjs        which characters no loaded font can draw (used by check)
│   │   │   ├── emoji.mjs         Twemoji SVGs for Satori's loadAdditionalAsset (memo + disk cache)
│   │   │   ├── cache.mjs         shared best-effort disk cache (fonts, emoji)
│   │   │   ├── formats.mjs       platform formats: sizes, no-alpha rules, maxBytes/types, zones (verified + source)
│   │   │   ├── guides.mjs        overlay a format's zones on a design (+ mobile-crop), per VARIANTS row
│   │   │   ├── png.mjs           opaque RGB PNG encoder (for FORMAT.alpha: false)
│   │   │   └── index.mjs         programmatic API (used by @snap-x/mcp)
│   │   └── test/                 node:test suites (one file per src module + helpers.mjs) — `npm test`
│   └── mcp/                      MCP server — imports @snap-x/core directly; 4 tools + `snap-x://design-guide` resource + `design_cards` prompt; test/ (node:test over stdio)
├── examples/                     complete packs (designs/*.png/snap-plan.md/share-copy.txt), auto-discovered
│   ├── snap-x/                   dogfood: the /snap-x skill's output for this repo
│   ├── open-notifier/            built from a website (no repo): og + notifications
│   ├── heyreach/                 built from a website: og + senders
│   ├── kite/                     store-listing pack from a brief: App Store shots, Play feature graphic, YouTube thumbnail
│   ├── ravikovind/                personal LinkedIn cover from a written spec: 1x, @2x, guides overlay, mobile crop
│   ├── storefront/                fictional e-commerce brand: designs/banners.mjs uses VARIANTS (one row per product)
│   ├── creator-series/            fictional YouTube channel: designs/episodes.mjs uses VARIANTS (one row per episode)
│   └── jsx-demo/                  feature demo (not a brand pack): a .jsx and a .tsx design
├── templates/                     6 brand-neutral starter designs (an "edit these values" block each); flat pack, included in the same regenerate/check/diff tooling as examples/
├── scripts/
│   ├── examples.mjs               `npm run examples`/`examples:check` — every examples/*/designs, plus templates/
│   ├── examples-diff.mjs          `npm run examples:diff` — pixel-diffs every committed image against a fresh render
│   └── check-packages.mjs         publish dry-run guard: fails on npm manifest warnings / bad bin paths
├── .github/
│   ├── workflows/ci.yml           tests (Node 20/22/24) + example check + visual diff + package guard
│   ├── ISSUE_TEMPLATE/            add-format / bug / feature issue forms
│   └── PULL_REQUEST_TEMPLATE.md
├── skills/
│   └── snap-x/
│       ├── SKILL.md               Claude Code skill definition
│       └── references/            step-by-step guides for the skill, incl. design-principles.md
├── FLOW.md                        this file
├── PRINCIPLES.md                  what fits in snap-x at all
├── CONTRIBUTING.md                 setup, repo layout, how to add a format/example/template
├── SHOWCASE.md                     real (and fictional-demo) packs made with snap-x
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
