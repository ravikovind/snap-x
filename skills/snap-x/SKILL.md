---
name: snap-x
description: Turn any project into a full image pack — OG cards, thumbnails, Twitter/X covers, Instagram posters, and GitHub README cards. Use when someone says "/snap-x", "generate images for this project", "make OG images", "create social images", or "snap this". Reads the project code directly — no live URL needed.
---

# /snap-x

You built it. Now frame it.

`/snap-x` reads the current project and generates a complete branded image pack:
OG (1200×630) · Thumbnail (1280×720) · Cover (1500×500) · Poster (1080×1080) · README card (1280×640)

Pure Node.js — Satori + Resvg. No headless browser. Runs anywhere.

---

## Invocation

```
/snap-x
/snap-x --theme light
/snap-x --format og
/snap-x --format og,thumbnail
/snap-x --tone minimal
/snap-x --title "My App" --desc "One-line description"
```

| Option | Values | Default |
|---|---|---|
| `--format` | `og`, `thumbnail`, `cover`, `poster`, `readme`, or comma-separated list | all |
| `--theme` | `dark`, `light`, `midnight`, `forest`, `minimal` | `dark` |
| `--tone` | `bold`, `minimal`, `branded` | inferred |
| `--title` | string | inferred from project |
| `--desc` | string | inferred from project |
| `--domain` | string | inferred from project |
| `--tags` | comma-separated | inferred from project |
| `--out` | directory path | `snap-output/` |

---

## Output directory

Default: `snap-output/`. Use a timestamped directory `snap-output-YYYY-MM-DD-HHmmss/` when one already exists.

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

Run `npx @snap-x/core` with the resolved brief, or write a custom generation script if the project has special requirements (e.g. pulling in a logo or screenshot).

**Gate:** All requested images exist in `<out>/`.

---

## Step 4 — Deliver

**Read:** `references/step-4-deliver.md`

Verify output, write `share-copy.txt`, tell the user where the images are and how to use them.

**Gate:** `share-copy.txt` exists. User is told exactly which file goes where (OG meta tag, Twitter card, GitHub README, etc.).
