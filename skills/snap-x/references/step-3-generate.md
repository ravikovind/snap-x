# Step 3: Generate images

## Primary — CLI (recommended)

```bash
npx snap-x build \
  --title "Your Title" \
  --desc "Your description" \
  --domain "yourdomain.com" \
  --tags "Tag1,Tag2,Tag3" \
  --theme dark \
  --out snap-output/
```

Add `--format og` to generate only one format.
Add `--fast` to use Satori (no browser, useful in CI).

## First-time setup

If the project hasn't been initialized:

```bash
npx snap-x init        # creates snap-x.config.json + snap-x/templates/*.html
npx snap-x build       # renders via Playwright
```

Install browser if needed:
```bash
npx snap-x install-browser
```

## Config-driven build (no CLI flags needed)

If `snap-x.config.json` exists at the project root, just run:

```bash
npx snap-x build
```

The config sets title, description, domain, tags, theme, font, outDir, and formats.

## Custom templates

Edit `snap-x/templates/*.html` directly to customize the visual design.
Templates are plain HTML/CSS — no build step required.

Each template receives data via URL search params:
- `?title=...&description=...&domain=...&tags=Tag1,Tag2&theme=dark&font=Inter`

Preview templates in browser:
```bash
npx snap-x preview
```

## What the output directory should contain after this step

```
snap-output/
  og.png           ← 1200×630
  thumbnail.png    ← 1280×720
  cover.png        ← 1500×500
  poster.png       ← 1080×1920
  readme-card.png  ← 1280×640
```
