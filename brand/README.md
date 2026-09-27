# snap-x logo / app icon

Concept: three solid rectangles at different aspect ratios (portrait, square, landscape), fanned out —
"one source, exact size for every platform." White shapes on snap-x's own brand red (`#eb1d25`).

Solid fills, no thin strokes, so **one composition holds up cleanly from a 16px favicon to a 1024px
logo** — checked by rendering real 16px/32px PNGs before committing to this concept, not assumed. An
earlier concept (Lucide's `image`/`image-plus` icons, stacked) read well at 48px+ but needed a separate,
simplified fallback below that; this one didn't need one, so it's what's here.

Regenerate: `npx -y @snap-x/cli render brand/designs/logo.mjs --out brand`

## Files

| File | Size | Use |
|---|---|---|
| `logo-512.png` | 512×512 | General brand asset — README, npm/social listings |
| `logo-1024.png` | 1024×1024 | 2× version of the above |
| `icon-512.png` | 512×512 | → `apps/web/app/icon.png` |
| `apple-icon-180.png` | 180×180 | → `apps/web/app/apple-icon.png` — **no rounded corners**: iOS applies its own mask, a pre-rounded image would double-round |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | — | Combined into `favicon.ico` |
| `favicon.ico` | multi-res | → `apps/web/app/favicon.ico` |

`favicon.ico` isn't produced by snap-x (PNG-only renderer) — it's built from the three favicon PNGs with ImageMagick:

```
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

After regenerating, re-copy the three files Next.js reads by convention:

```
cp brand/favicon.ico apps/web/app/favicon.ico
cp brand/icon-512.png apps/web/app/icon.png
cp brand/apple-icon-180.png apps/web/app/apple-icon.png
```
