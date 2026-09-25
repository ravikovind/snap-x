# Step 3: Generate images

## Option A — CLI (recommended for standard projects)

```bash
npx @snap-x/core \
  --title "Your Title" \
  --desc "Your description" \
  --domain "yourdomain.com" \
  --tags "Tag1,Tag2,Tag3" \
  --theme dark \
  --out snap-output/
```

Add `--format og` to generate only one format.

## Option B — Custom script (when you need logo, screenshot, or non-standard layout)

Write a `snap-output/generate.mjs` script:

```js
import { renderAll } from "@snap-x/core/render";
import { ogCard } from "@snap-x/core/templates/og";
import { getFonts } from "@snap-x/core/fonts";

const fonts = await getFonts("Inter", [400, 700, 900]);

await renderAll([
  {
    name: "og.png",
    node: ogCard({
      label: "My Project",
      title: "Your Title Here",
      description: "One strong supporting claim.",
      tags: ["Open Source", "Node.js"],
      domain: "myproject.com",
      theme: "dark",
    }),
    width: 1200,
    height: 630,
  },
], "snap-output/", { fonts });
```

Run: `node snap-output/generate.mjs`

## Theme override example

To use the project's exact brand colors instead of a built-in theme:

```js
ogCard({
  title: "...",
  theme: "dark",
  themeOverride: {
    accent: "#eb1d25",
    bg: "#000000",
    surface: "#141414",
  },
})
```

## Install snap-x/core locally

```bash
npm install @snap-x/core
# or
npx @snap-x/core --help
```

## What the output directory should contain after this step

```
snap-output/
  og.png           ← 1200×630
  thumbnail.png    ← 1280×720
  cover.png        ← 1500×500
  poster.png       ← 1080×1080
  readme-card.png  ← 1280×640
```
