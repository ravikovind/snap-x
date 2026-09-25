# Step 1: Inspect the source

The source is a **repo**, a **website URL**, or a **written brief**. Answer all 9 questions before writing anything.

**Facts rule:** only use facts you actually found — a real number, quote, customer or claim from the source, or from the user's brief. Never invent stats or testimonials. Anything illustrative (a sample notification, a mock inbox) is allowed only if it's obviously generic and you say so in `share-copy.txt`. **When sources disagree** (README says 1,854 icons, the API description says 1,776), prefer the primary source — the README or package manifest — and note the choice in the plan.

## Rubric

1. **Name** — repo: `package.json` `name`, README h1, directory; site: `<title>`, `og:title`, header wordmark
2. **Description** — one sentence: repo: `package.json` `description` / README intro; site: `<meta name="description">`, hero copy
3. **Domain / brand** — the URL or brand name for the footer (homepage, custom domain, GitHub URL)
4. **Tags / proof** — 2–3 short labels or real proof points (keywords, stack, category; stats the source actually states)
5. **Stack / surface** — what it's built with or what it does (dependencies, framework files; features listed on the site)
6. **Font** — see "Fonts and colors" below. Fallback: Inter
7. **Accent color** — see below. Fallback: a neutral accent
8. **Theme** — dark or light (the source's own scheme). Default: dark
9. **Logo & brand assets** — official logo / icon / wordmark, saved to `assets/` (see "Finding brand assets"). None found → a text wordmark, never a redrawn logo

## Where to read

**Repo** (any ecosystem): the manifest — `package.json`, `pubspec.yaml` (Flutter/Dart), `Cargo.toml`, `pyproject.toml`, `go.mod`, `composer.json`, … — for name and description; `README.md` (h1 + first paragraph) for the pitch; and for web projects `app/globals.css` / `styles/globals.css` / `next.config.*` for fonts and colors.

**A library with no brand of its own** (most packages): use the brand of its homepage/docs site or of the thing it wraps (e.g. a Flutter port of Lucide → Lucide's coral accent and logo), and say so in the plan. Otherwise pick a restrained neutral palette.

**Website** — fetch the HTML and its stylesheet:

```bash
curl -sL -A "Mozilla/5.0" https://example.com -o index.html
grep -oE '<(title|meta)[^>]*(description|og:[a-z:]+|theme-color)[^>]*>' index.html   # copy + og:image
grep -oE 'href="[^"]+\.css[^"]*"' index.html                                         # stylesheet URLs (relative? prefix the site origin)
curl -sL "<css url>" | grep -oE '\-\-[a-zA-Z0-9-]+:#[0-9a-fA-F]{3,8}' | sort -u        # CSS variables: --accent, --background …
curl -sL "<css url>" | grep -oE 'font-family:[^;}]{1,60}' | sort | uniq -c | sort -rn   # fonts
curl -sL "<css url>" | grep -oE '#[0-9a-fA-F]{6}\b' | sort | uniq -c | sort -rn | head  # dominant colors
```

Also fetch the page text (WebFetch) for exact headline/feature copy, and **look at the `og:image`** (download + Read it) as a style reference — the new cards should feel like the same brand, not copy that image.

**Brief only:** the user's words are the source. Ask for anything missing (name, one-line pitch, colors) rather than guessing.

## Fonts and colors

- Repo font: `--font-sans` in `globals.css`. If it's a `var(--font-…)` reference (Next.js `next/font`), the real family is in `app/layout.tsx` — e.g. `import { Space_Grotesk } from "next/font/google"` → `"Space Grotesk"`.
- Site font: the `font-family` list above. A non-Google font → pick the closest Google Font and say so in the plan.
- Accent: `--accent`, `--primary`, `--brand` (or the most frequent saturated hex). Use the brand's own palette — including its semantic colors for tags/pills — instead of inventing one.

There's no config to fall back on: whatever you find here is hardcoded into the design files in Step 3.

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
- Look at the file (Read it) before using it — check it isn't a tiny 16px favicon or an all-black mark on a black card. **Too small?** Look for a vector or larger version on the project's homepage/docs site: `/logo.svg`, `/logo.dark.svg`, `/favicon.svg`, `/apple-touch-icon.png`, or the header `<img>`; if none, use a text wordmark

**Format rules** (Satori `<img>`): PNG / JPEG / SVG work. **AVIF and WebP do not** — convert to PNG first (e.g. `sharp`, ImageMagick `magick in.avif out.png`). An **SVG that contains `<text>`** can't load webfonts when embedded — rasterise it once (`@resvg/resvg-js` with `font.fontFiles`) and save the PNG. Prefer ≥2× the display size.

**Don't**
- redraw, recolour, stretch or "improve" a logo; if there's no official file, use a plain text wordmark in the brand font
- use third-party/customer logos (e.g. a "trusted by" strip) unless the user asked for them
- hotlink remote images — download them so the design is reproducible offline

## Output

Do not write anything yet. Carry the answers into Step 2.
