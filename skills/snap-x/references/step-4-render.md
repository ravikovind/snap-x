# Step 4: Render, verify, deliver

## Render

```bash
npx @snap-x/cli render designs/*.mjs --out snap-output/     # or a single file
```

Output names come from each file's `FORMAT.name`. Use `--out` to keep results with the source (e.g. next to `designs/`).

## Verify — look at every PNG

`check` can't see visual problems, so open each rendered image (Read it) and go through this list:

- **Blank boxes** where a symbol/arrow/emoji should be → the font lacks the glyph; draw it as SVG (Step 3)
- **Wrapped or clipped text** — headlines broken mid-word, text running off an edge, content pushed off the canvas → reduce sizes
- **Elements clipped by the canvas edge** (an orbit node, an icon half off-screen)
- **Invisible logo** (dark on dark) or a stretched/blurry one
- **Contrast** — muted text readable against its background
- **Copy** matches the source exactly (names, numbers, spelling); nothing invented
- **Brand** — colors, font and logo look like the brand's own

Fix the design file and re-render until clean. Fix what you see, then look again — don't assume a re-render fixed it.

### Banners / covers: two extra renders

Add `qa-overlay.mjs` (the same composition with the danger zones drawn over it — avatar circle, side crops, top/bottom bands, safe area outlined) and `qa-mobile.mjs` (the centre crop a phone shows). Confirm no text lands in a danger zone and the name/title survive the mobile crop. Measure the text's pixel extent if it's close to a limit.

### `@2x` exports

A second design file that wraps the same tree in a `width×2` / `height×2` root with an inner box `transform: "scale(2)"`, `transformOrigin: "top left"` — vector-sharp, no upscaling.

## share-copy.txt

Write `<out>/share-copy.txt`: where each image goes, plus a note on anything mock or illustrative and where the brand assets came from.

```
<Project> — image pack (generated with /snap-x)

og.png (1200×630)         → <meta property="og:image"> / twitter:image; link previews
readme-card.png (1280×640)→ top of README; GitHub Settings → Social preview
cover.png (1500×500)      → X / GitHub org banner
<linkedin-cover>.png      → LinkedIn: Profile → banner (1584×396)
poster.png (1080×1920)    → Instagram / WhatsApp story

Regenerate: <command>
Note: <illustrative content, asset sources>
```

List only the images you actually made.

## Deliver

Tell the user (short): where the images are, what each is for, anything mock or assumed, and one first action (e.g. "upload readme-card.png as the GitHub social preview").
