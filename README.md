# snap-x

![snap-x](.github/og.png)

Turn any project into a full social image pack — one command.

OG card · Thumbnail · Cover banner · Poster · README card

```bash
npx snap-x init    # scaffold config + HTML templates
npx snap-x build   # render all images via Playwright
```

---

## What it generates

| Format | Size | Use case |
|---|---|---|
| `og.png` | 1200×630 | Open Graph / Twitter card |
| `thumbnail.png` | 1280×720 | YouTube / blog header |
| `cover.png` | 1500×500 | GitHub / Twitter/X banner |
| `poster.png` | 1080×1920 | Instagram story / vertical |
| `readme-card.png` | 1280×640 | GitHub README social preview |

---

## How it works

snap-x uses a Playwright pipeline — your templates are plain HTML/CSS files you own and edit directly.

```
snap-x init   →  copies default-templates/*.html  →  snap-x/templates/
snap-x build  →  Playwright loads each template   →  screenshots  →  PNGs
```

Templates receive data via URL search params:

```
file:///your-project/snap-x/templates/og.html?title=My+App&description=...&domain=myapp.com
```

A `<script>` block in each template reads `URLSearchParams` and populates the DOM. No server, no build step — just HTML and CSS.

---

## Quick start

```bash
# 1. Install
npm install -g @snap-x/core

# 2. Install browser (once)
snap-x install-browser

# 3. Init your project
cd your-project
snap-x init

# 4. Edit snap-x.config.json with your project details
# 5. Customize snap-x/templates/*.html  (optional)

# 6. Build
snap-x build
```

Output lands in `./snap-output/`.

---

## CLI

```
snap-x init [--force]
snap-x build [--format <id>] [--theme dark|light] [--fast] [--out <dir>]
snap-x preview
snap-x install-browser
```

| Flag | Default | Description |
|---|---|---|
| `--format` | all | One format: `og`, `cover`, `thumbnail`, `poster`, `readme` |
| `--theme` | `dark` | Visual theme passed to templates |
| `--fast` | off | Satori fallback — no browser, CI-friendly |
| `--out` | `./snap-output` | Output directory |
| `--title` | auto-detected | Override project title |
| `--desc` | auto-detected | Override description |
| `--domain` | auto-detected | Override domain/brand |
| `--tags` | auto-detected | Comma-separated tags |
| `--font` | `Inter` | Any Google Font family name |
| `--project` | `cwd` | Path to project directory |

---

## Config file

`snap-x init` creates `snap-x.config.json` at your project root:

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
  "formats": ["og", "cover", "thumbnail", "poster", "readme"]
}
```

snap-x also auto-detects from `package.json`, `README.md`, Next.js config, and `globals.css` (font + accent color).

---

## Template customization

After `snap-x init`, templates live in `./snap-x/templates/`. Edit them freely — they're plain HTML/CSS.

Each template exposes CSS custom properties for theming:

```css
:root {
  --bg: #0a0a0a;
  --text: #ffffff;
  --accent: #e5383b;
  --font: 'Inter', sans-serif;
}
```

Preview all templates in your browser:

```bash
snap-x preview
```

Prints `file://` URLs with your project data pre-injected. Open in a browser, edit HTML, refresh — instant feedback.

---

## Auto-detection

snap-x reads your project before generating:

- **`package.json`** — name, description, keywords → title, description, tags
- **`README.md`** — first heading + paragraph → title, description
- **`next.config.*`** — detects Next.js, adds to stack
- **`app/globals.css`** — `--font-sans`, accent color → font + theme override

`snap-x build` works out of the box with no config.

---

## CI / no-browser mode

Use `--fast` to render via [Satori](https://github.com/vercel/satori) instead of Playwright:

```bash
snap-x build --fast
```

No browser download. Works in GitHub Actions and any headless environment.

---

## MCP server

snap-x ships an [MCP](https://modelcontextprotocol.io) server so AI agents (Cursor, Windsurf, Claude Desktop) can generate images directly.

```bash
npm install -g @snap-x/mcp
```

Add to your MCP client config:

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

Available MCP tools:

| Tool | Description |
|---|---|
| `generate_images` | Build the full image pack for a project |
| `init_config` | Scaffold `snap-x.config.json` + templates |
| `list_formats` | List all formats with dimensions |

---

## Claude Code skill

snap-x ships a `/snap-x` skill for [Claude Code](https://claude.ai/code).

Copy `skills/snap-x/` into your Claude Code skills directory, then:

```
/snap-x
/snap-x --theme light
/snap-x --format og
/snap-x --fast
```

The skill inspects your project, plans the image pack, runs `snap-x build`, and tells you exactly where to use each image — OG meta tag, Twitter card, GitHub README, etc.

---

## Packages

| Package | Description |
|---|---|
| [`@snap-x/core`](packages/core) | CLI + Playwright renderer + HTML templates |
| [`@snap-x/mcp`](packages/mcp) | MCP server for AI agent integration |

---

## License

MIT © [VoltVave Innovations](https://voltvave.com)
