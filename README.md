# snap-x

Turn any project into a full image pack — OG cards, thumbnails, Twitter/X covers, Instagram posters, and GitHub README cards. One command. Pure Node.js. No headless browser.

```bash
npx snap-x
```

## What it generates

| Format | Size | Use |
|---|---|---|
| `og.png` | 1200×630 | `og:image` meta tag, social share |
| `thumbnail.png` | 1280×720 | Blog header, YouTube thumbnail |
| `cover.png` | 1500×500 | Twitter/X header, LinkedIn banner |
| `poster.png` | 1080×1080 | Instagram, WhatsApp, square share |
| `readme-card.png` | 1280×640 | GitHub social preview |

## Usage

```bash
# Auto-detect project metadata, generate all formats
npx snap-x

# Single format
npx snap-x --format og

# Custom title + theme
npx snap-x --title "My App" --desc "One-line description" --theme light

# All options
npx snap-x --format og,thumbnail --theme dark --domain myapp.com --tags "Open Source,Node.js" --out ./images
```

## Themes

`dark` · `light` · `midnight` · `forest` · `minimal`

## Claude Code skill

```bash
claude plugin add voltvave/snap-x
```

Then use `/snap-x` in any project.

## Stack

- [Satori](https://github.com/vercel/satori) — JSX → SVG
- [@resvg/resvg-js](https://github.com/yisibl/resvg-js) — SVG → PNG
- Zero headless browser. Works on Linux, macOS, Windows, Android/Termux.

## License

MIT — [VoltVave Innovations](https://voltvave.com)
