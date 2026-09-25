---
name: snap-x
description: Turn any project into a full image pack — OG cards, thumbnails, Twitter/X covers, Instagram posters, and GitHub README cards. Use when someone says "/snap-x", "generate images for this project", "make OG images", "create social images", or "snap this". Reads the project code directly — no live URL needed.
---

# /snap-x

You built it. Now frame it.

`/snap-x` reads the current project and generates a complete branded image pack:
OG (1200×630) · Thumbnail (1280×720) · Cover (1500×500) · Poster (1080×1920) · README card (1280×640)

HTML templates + Playwright rendering. Full CSS support. Templates are in `snap-x/templates/` — edit them directly.

---

## Invocation

```
/snap-x
/snap-x --theme light
/snap-x --format og
/snap-x --fast
/snap-x --title "My App" --desc "One-line description"
```

| Option | Values | Default |
|---|---|---|
| `--format` | `og`, `thumbnail`, `cover`, `poster`, `readme` | all |
| `--theme` | `dark`, `light` | `dark` |
| `--fast` | flag | off — uses Satori (no browser, for CI) |
| `--title` | string | inferred from project |
| `--desc` | string | inferred from project |
| `--domain` | string | inferred from project |
| `--tags` | comma-separated | inferred from project |
| `--font` | Google Font name | inferred or `Inter` |
| `--out` | directory path | `snap-output/` |

---

## Architecture

snap-x uses a Playwright pipeline:

1. `snap-x init` copies `default-templates/*.html` to `./snap-x/templates/`
2. `snap-x build` launches headless Chromium, loads each `template.html?title=...&description=...`
3. Templates read URL params via `new URLSearchParams(location.search)` and populate the DOM
4. Playwright screenshots each template at exact pixel dimensions → saves PNGs

Templates are plain HTML/CSS — users edit them directly. No framework, no build step.

`--fast` mode falls back to Satori (pure JS, no browser) using the legacy template modules.

---

## Output directory

Default: `snap-output/`. Use a timestamped directory `snap-output-YYYY-MM-DD-HHmmss/` when one already exists.

---

## Step 0 — Check initialization (new step)

Before running the build, check if `snap-x.config.json` exists in the project root.

If it does not exist:
1. Run `npx snap-x init` to scaffold the config and templates
2. Review `snap-x.config.json` and update title/description/domain/tags from the project
3. Then proceed to build

If it already exists, read it and use the values as the baseline.

**Gate:** `snap-x.config.json` exists with correct project metadata.

---

## Step 1 — Inspect the project

**Read:** `references/step-1-inspect.md`

Scan the project and answer the 7-question rubric before writing anything.

**Gate:** All 7 questions answered.

---

## Step 2 — Plan the image pack

**Read:** `references/step-2-plan.md`

Write `<out>/snap-plan.md`. Decide which formats to generate, what copy goes on each, and which theme fits.

**Gate:** `snap-plan.md` exists with per-format specs.

---

## Step 3 — Generate images

**Read:** `references/step-3-generate.md`

Run `npx snap-x build` with the resolved brief. If the project has custom branding, edit the HTML templates in `snap-x/templates/` before building.

**Gate:** All requested images exist in `<out>/`.

---

## Step 4 — Deliver

**Read:** `references/step-4-deliver.md`

Verify output, write `share-copy.txt`, tell the user where the images are and how to use them.

**Gate:** `share-copy.txt` exists. User is told exactly which file goes where (OG meta tag, Twitter card, GitHub README, etc.).

---

## Agent integration (MCP)

snap-x ships an MCP server at `packages/mcp/`. To use it with Cursor, Windsurf, or Claude Desktop:

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
- `generate_images` — build the full image pack
- `init_config` — scaffold config + templates
- `list_formats` — list formats with dimensions

---

## Template customization

After `snap-x init`, templates live in `./snap-x/templates/`:

```
snap-x/templates/
  og.html           ← 1200×630  Open Graph
  cover.html        ← 1500×500  GitHub/Twitter banner
  thumbnail.html    ← 1280×720  YouTube/blog thumbnail
  poster.html       ← 1080×1920 Instagram story
  readme-card.html  ← 1280×640  GitHub README card
```

Each template reads from URL params:
- `title`, `description`, `domain`, `tags` (comma-separated), `stack` (comma-separated)
- `theme` (`dark` / `light`)
- `font` (any Google Font name)

Preview locally: `npx snap-x preview`

---

## Install browser

If `snap-x build` fails with "No Chromium browser found":

```bash
npx snap-x install-browser
```

Or use `--fast` mode (Satori, no browser needed).
