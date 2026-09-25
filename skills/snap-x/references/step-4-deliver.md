# Step 4: Deliver

## Verify output

Check all requested images exist and are non-zero:

```bash
ls -lh snap-output/*.png
```

## Write share-copy.txt

```
snap-output/share-copy.txt
```

1–2 sentences. Tone-matched to the project. No "excited to share". Use the project's own language.

Example:
```
22 branded images generated from one command. OG, thumbnail, cover, poster — all from your project code.
npx snap-x
```

## Tell the user where each image goes

After delivery, explain the usage for each format:

| File | Where it goes |
|---|---|
| `og.png` | `<meta property="og:image">` and `<meta name="twitter:image">` in `<head>` |
| `thumbnail.png` | Blog post header, YouTube thumbnail, article cover |
| `cover.png` | Twitter/X profile header (upload at 1500×500), LinkedIn banner |
| `poster.png` | Instagram post, WhatsApp status, square social share |
| `readme-card.png` | GitHub repo → Settings → Social preview (upload as repository image) |

## Final output structure

```
snap-output/
  og.png
  thumbnail.png
  cover.png
  poster.png
  readme-card.png
  snap-plan.md
  share-copy.txt
```
