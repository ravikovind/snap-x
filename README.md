# snap-x

![snap-x](.github/og.png)

Turn any project into a full social image pack — one command. No browser. Pure Node.js.

Any size. Any format. Add a `.mjs` file, get a PNG.

```bash
npx snap-x init    # scaffold config + design files
npx snap-x check   # validate designs
npx snap-x render  # Satori → PNG
```

---

## Examples

> All generated with `snap-x render --font Saira` — snap-x's own images, made by snap-x.

**OG card** — 1200×630

![og](examples/og.png)

**Thumbnail** — 1280×720

![thumbnail](examples/thumbnail.png)

**Cover banner** — 1500×500

![cover](examples/cover.png)

**README card** — 1280×640

![readme-card](examples/readme-card.png)

<details>
<summary>Poster — 1080×1920</summary>

![poster](examples/poster.png)

</details>

---

## What it generates

Any format you define. Add a `.mjs` file → get a PNG.

**Default designs (scaffolded by `snap-x init`):**

| Format | Size | Use case |
|---|---|---|
| `og.png` | 1200×630 | Open Graph / Twitter card |
| `thumbnail.png` | 1280×720 | YouTube / blog header |
| `cover.png` | 1500×500 | GitHub / Twitter/X banner |
| `poster.png` | 1080×1920 | Instagram story / vertical |
| `readme-card.png` | 1280×640 | GitHub README social preview |

**Add your own — any size, any name:**

```js
// snap-x/designs/linkedin-cover.mjs
export const FORMAT = { width: 1584, height: 396, name: "linkedin-cover.png" };
export default function (config) { ... }
```

```bash
snap-x render --format linkedin-cover
```

---

## How it works

snap-x uses a **Satori pipeline** — the same approach React uses to render without a browser.

```
snap-x init    →  writes snap-x/designs/*.mjs  (Satori trees — edit freely)
snap-x check   →  validates CSS rules Satori requires
snap-x render  →  Satori (SVG) → resvg (PNG)
```

Design files are plain `.mjs` — you own them, edit them, commit them. Re-render any time.

### Claude Code skill

The `/snap-x` skill takes this further: Claude **writes the design files for you**, tailored to your project's brand, fonts, and content — then renders them. Same philosophy as `/brag` for videos, but for static images.

```
/snap-x  →  Claude inspects project
         →  Claude plans copy per format
         →  Claude writes snap-x/designs/*.mjs
         →  snap-x check + snap-x render → PNGs
```

---

## Quick start

```bash
# 1. Install
npm install -g @snap-x/core

# 2. Init your project
cd your-project
snap-x init

# 3. Edit snap-x.config.json
# 4. Customize snap-x/designs/*.mjs  (or let Claude do it with /snap-x)

# 5. Validate + render
snap-x check
snap-x render
```

Output lands in `./snap-output/`.

---

## CLI

```
snap-x init [--force]
snap-x check [--format <id>]
snap-x render [--format <id>] [--theme dark|light] [--out <dir>]
```

| Flag | Default | Description |
|---|---|---|
| `--format` | all | One format: `og`, `cover`, `thumbnail`, `poster`, `readme` |
| `--theme` | `dark` | Visual theme (`dark`, `light`, `midnight`, `forest`, `minimal`) |
| `--out` | `./snap-output` | Output directory |
| `--title` | auto-detected | Override project title |
| `--desc` | auto-detected | Override description |
| `--domain` | auto-detected | Override domain/brand |
| `--tags` | auto-detected | Comma-separated tags |
| `--font` | `Inter` | Any Google Font family name |
| `--project` | `cwd` | Path to project directory |

---

## Config file

`snap-x init` creates `snap-x.config.json`:

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

snap-x auto-detects from `package.json`, `README.md`, Next.js config, and `globals.css`.

---

## Design files

After `snap-x init`, designs live in `./snap-x/designs/`. Each is a Satori tree:

```js
// snap-x/designs/og.mjs
export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default function (config) {
  const accent = config.themeOverride?.accent ?? "#6366f1";
  const accentMuted = config.themeOverride?.accentMuted ?? "rgba(99,102,241,0.25)";
  const borderAccent = config.themeOverride?.borderAccent ?? "rgba(99,102,241,0.35)";
  const bg = "#000000";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.50)";
  const { title, description, domain, tags } = config;

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: bg, display: "flex" },
      children: [
        // your layout here
      ],
    },
  };
}
```

**Satori rules** (the only constraints):
- Every container needs `display: "flex"` — no block, grid, or inline
- `children` must be an array
- `position: "absolute"` works; `position: "fixed"` does not
- No `z-index`, no CSS Grid, no CSS animations
- Text goes directly in `children`: `children: ["Hello"]`

Run `snap-x check` to catch any violations before rendering.

---

## Customization

Design files are just JavaScript — anything you can compute, you can render.

### Fonts

Pass any [Google Font](https://fonts.google.com) name via `--font` or in config:

```bash
snap-x render --font "Saira"
snap-x render --font "Space Grotesk"
snap-x render --font "DM Sans"
```

snap-x downloads and caches the font automatically. All 4 weights (Regular, Medium, Bold, ExtraBold) are loaded so you can use `fontWeight: 400–800` freely in your designs.

### Icons

Design files are plain JavaScript — use any icon source you like.

**Emoji** (zero deps, works everywhere):
```js
{ type: "div", props: { style: { fontSize: 24, display: "flex" }, children: ["⚡"] } }
{ type: "div", props: { style: { fontSize: 16, display: "flex" }, children: ["📍"] } }
```

**Inline SVG path** (pixel-perfect, any icon library):
```js
// paste any SVG path from Lucide, Heroicons, Phosphor, etc.
{
  type: "svg",
  props: {
    width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
    stroke: accent, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    children: [{ type: "path", props: { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" } }],
  },
}
```

**Icon pack helper** (optional, install any package):
```js
import { getIcon } from "my-icon-pack"; // your choice
```

### Local images & assets

Design functions can be `async` — load any local PNG, JPG, or SVG from your project and embed it as base64:

```js
import fs from "fs/promises";

export default async function (config) {
  const logo = await fs.readFile("./public/logo.png");
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const icon = await fs.readFile("./public/icon.svg");
  const iconSrc = `data:image/svg+xml;base64,${icon.toString("base64")}`;

  return {
    type: "div",
    props: {
      style: { display: "flex" },
      children: [
        { type: "img", props: { src: logoSrc, width: 200, height: 60, style: { display: "flex" } } },
        { type: "img", props: { src: iconSrc, width: 48, height: 48, style: { display: "flex" } } },
      ],
    },
  };
}
```

Both PNG and SVG are confirmed working. Any file accessible on disk can be embedded.

### Theme overrides

Override any theme token per-project in `snap-x.config.json`:

```json
{
  "themeOverride": {
    "accent": "#eb1d25",
    "accentMuted": "rgba(235,29,37,0.25)",
    "borderAccent": "rgba(235,29,37,0.35)",
    "bg": "#050505",
    "text": "#ffffff",
    "textMuted": "#888888"
  }
}
```

Or apply overrides inside the design file itself for per-format control.

### What you can fully customize

| Layer | How |
|---|---|
| Layout & composition | Rewrite the `.mjs` tree entirely — it's just JavaScript |
| Brand colors | `themeOverride` in config or hardcoded in the design |
| Typography | `--font` flag for any Google Font; per-element `fontWeight`, `fontSize`, `letterSpacing` |
| Icons | Emoji, inline SVG paths, or any icon package — your choice |
| Logos & images | `async` design + `fs.readFile` → base64 `<img>` |
| Copy & content | All fields driven by `config` (title, description, tags, domain, stack) |
| Per-format design | Each `.mjs` is independent — poster can look completely different from OG |
| Output name | `FORMAT.name` controls the output filename |
| Dimensions | `FORMAT.width` / `FORMAT.height` — any size Satori supports |
| Static vs dynamic | Export a plain object (static) or a function (dynamic/async) |

The design files are yours. snap-x is just the renderer.

---

## Auto-detection

snap-x reads your project before generating:

- **`package.json`** — name, description, keywords → title, description, tags
- **`README.md`** — first heading + paragraph → title, description
- **`next.config.*`** — detects Next.js, adds to stack
- **`app/globals.css`** — `--font-sans`, accent color → font + theme override

`snap-x render` works out of the box with no config.

---

## MCP server

snap-x ships an [MCP](https://modelcontextprotocol.io) server so AI agents (Cursor, Windsurf, Claude Desktop) can generate images directly.

```bash
npm install -g @snap-x/mcp
```

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
|---|---|
| `generate_images` | Build the full image pack for a project |
| `init_config` | Scaffold config + design files |
| `list_formats` | List formats with dimensions |

---

## Claude Code skill

snap-x ships a `/snap-x` skill for [Claude Code](https://claude.ai/code).

Copy `skills/snap-x/` into your Claude Code skills directory, then:

```
/snap-x
/snap-x --theme light
/snap-x --format og
/snap-x --font "Saira"
```

Claude inspects your project, plans the design, writes the `.mjs` design files, validates them, renders, and tells you exactly where to use each image.

---

## Packages

| Package | Description |
|---|---|
| [`@snap-x/core`](packages/core) | CLI + Satori renderer + default designs |
| [`@snap-x/mcp`](packages/mcp) | MCP server for AI agent integration |

---

## License

MIT © [VoltVave Innovations](https://voltvave.com)
