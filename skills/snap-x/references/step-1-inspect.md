# Step 1: Inspect the project

Read the project directory. Answer all 9 questions before writing anything.

## Rubric

1. **Name** — What is the project called? (from package.json `name`, README h1, or directory name)
2. **Description** — One sentence: what does it do? (package.json `description` or README first paragraph)
3. **Domain / brand** — What URL or brand name goes at the bottom? (homepage field, custom domain, GitHub URL)
4. **Tags** — 2–3 short labels. (keywords from package.json, tech stack, category)
5. **Stack** — What tech is it built with? (dependencies in package.json, next.config.*, framework files)
6. **Font** — Is there a custom font? Check `app/globals.css` or `styles/globals.css` for `--font-sans`. If it's a `var(--font-…)` reference (Next.js `next/font`), the real family is set in `app/layout.tsx` — look for `import { Space_Grotesk } from "next/font/google"` and use that family name (`Space_Grotesk` → `"Space Grotesk"`). Fallback: Inter.
7. **Accent color** — Is there a brand color? Check CSS for `--accent`, `--primary`, `--color-brand`. Fallback: use theme default.
8. **Theme** — Dark or light? Look at the site's color scheme. Default: dark.
9. **Logo & brand assets** — Is there an official logo / icon / wordmark? Find it and save it (see "Finding brand assets" below). None found → a text wordmark, never a redrawn logo.

## What to read

- `package.json` — name, description, keywords, homepage, dependencies
- `README.md` — first heading, first paragraph, badges
- `app/globals.css` or `styles/globals.css` — font vars, color vars
- `next.config.*` — framework detection

There's no config file to fall back on — snap-x has no auto-detection layer. Whatever you find here gets hardcoded directly into the design files in Step 3.

## Finding brand assets (question 9)

Real logos make a card look like the brand's own. Look in this order and stop when you have a usable file.

**In a project repo**
- `public/`, `static/`, `assets/`, `src/assets/`, `docs/`, `.github/` — files named `logo*`, `icon*`, `brand*`, `wordmark*`, `mark*`
- `favicon.svg`, `apple-touch-icon.png`, `app/icon.*`, `app/favicon.ico` (Next.js), `manifest.json` / `site.webmanifest` icons
- the README's top image or `<img>`

**On a website** (a URL instead of a repo — fetch the HTML with `curl -sL -A "Mozilla/5.0" <url>`)
- `<link rel="icon" | "apple-touch-icon" | "mask-icon">` and `/site.webmanifest` → icon files (prefer `.svg`, else the largest `.png`)
- `<img>` in the header/nav with `logo`/`brand` in `src` or `alt`; inline `<svg>` in the header
- `"logo":` in JSON-LD; `og:image` (a *card*, not a logo — use only as a style reference)
- brand/press pages: try `/brand`, `/press`, `/media-kit`, `/brand-assets` (often 404 — fine)
- links labelled "Brand assets" / "Press kit" / "Download logo", and CDN filenames like `Brand_Logo-Primary-Light.png`

**Pick the right variant.** Logo files are usually named for their *background*: `Primary-Light` / `light` / `white` = light-coloured logo for **dark** backgrounds; `Primary-Dark` / `dark` = dark logo for **light** backgrounds. Match the card's background.

**Save and record**
- Download into `<examples-or-out>/assets/` next to the designs, e.g. `curl -sL -o assets/logo.png "<url>"`
- Add `assets/SOURCES.md`: file → origin URL, plus "Logos and brand marks belong to their owners; used to demonstrate snap-x"
- Look at the file (Read it) before using it — check it isn't a tiny 16px favicon or an all-black mark on a black card

**Format rules** (Satori `<img>`): PNG / JPEG / SVG work. **AVIF and WebP do not** — convert to PNG first (e.g. `sharp`, ImageMagick `magick in.avif out.png`). An **SVG that contains `<text>`** can't load webfonts when embedded — rasterise it once (`@resvg/resvg-js` with `font.fontFiles`) and save the PNG. Prefer ≥2× the display size.

**Don't**
- redraw, recolour, stretch or "improve" a logo; if there's no official file, use a plain text wordmark in the brand font
- use third-party/customer logos (e.g. a "trusted by" strip) unless the user asked for them
- hotlink remote images — download them so the design is reproducible offline

## Output

Do not write anything yet. Carry the answers into Step 2.
