# Step 4: Render and deliver

## Render

```bash
npx snap-x render designs/*.mjs --out snap-output/
# or a single file:
npx snap-x render designs/og.mjs --out snap-output/
```

Expected output:
```
snap-output/
  og.png           ← 1200×630
  thumbnail.png    ← 1280×720
  cover.png        ← 1500×500
  poster.png       ← 1080×1920
  readme-card.png  ← 1280×640
```

## Verify

Read each PNG and confirm:
- Text is readable, not clipped
- Colors match the project brand
- No empty/white sections
- Accent color is correct

If any image has issues, go back to Step 3 and fix the design file, then re-render.

## Write share-copy.txt

Write `<out>/share-copy.txt` with placement instructions:

```
snap-x output — [Project Name]
Generated: [date]

og.png (1200×630)
  → <meta property="og:image" content="https://yourdomain.com/og.png" />
  → <meta name="twitter:image" content="https://yourdomain.com/og.png" />
  Use for: all social sharing (Twitter, LinkedIn, Slack unfurl)

thumbnail.png (1280×720)
  → Blog post featured image, YouTube thumbnail
  Use for: any 16:9 content slot

cover.png (1500×500)
  → Twitter/X header: Settings → Profile → Edit → Header
  → GitHub org banner
  Use for: profile/org banners

poster.png (1080×1920)
  → Instagram Stories, WhatsApp Status
  Use for: vertical social posts

readme-card.png (1280×640)
  → GitHub repo: Settings → Social preview → Upload image
  Use for: GitHub social preview card
  Add to README: ![cover](snap-output/readme-card.png)
```

## Deliver

Tell the user:
1. Where images are saved
2. The share-copy.txt location
3. One specific action to take first (e.g. "upload readme-card.png to GitHub social preview now")
