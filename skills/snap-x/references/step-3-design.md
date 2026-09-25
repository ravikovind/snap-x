# Step 3: Write the design files

Write one `.mjs` file per format in `designs/`. Each file is a self-contained Satori tree: no imports from `@snap-x/core`, no config object, no themes module — that module doesn't exist. Hardcode everything the file needs directly, using the colors/fonts/copy you decided in Step 2.

## Satori rules — must follow

| Rule | Detail |
|---|---|
| `display: "flex"` | Every div/container needs this. No block, no grid, no inline. |
| `children: []` | Always an array. Never omit it on container nodes. |
| Text nodes | Plain strings inside children: `children: ["Hello"]` |
| `position: "absolute"` | OK. `position: "fixed"` → error. |
| No `z-index` | Ignored / causes issues. Layer via DOM order instead. |
| No CSS Grid | Flexbox only. |
| Width/height | Root node must have explicit `width` and `height` matching FORMAT. |
| `flexWrap: "wrap"` | Use for text that might overflow. |

## Icons

No `icons.mjs` helper exists — use emoji, or paste an inline SVG path from any icon library (Lucide, Heroicons, Phosphor):

```js
{
  type: "svg",
  props: {
    width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
    stroke: accent, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    children: [{ type: "path", props: { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" } }],
  },
}
```

## File template

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Saira", weights: [400, 700, 900] }]; // the font(s) you confirmed in Step 2; omit to default to Inter

export default function () {
  // hardcode the values you found in Step 1/2 — no config object is passed in
  const bg          = "#000000";
  const text        = "rgba(255,255,255,0.95)";
  const textMuted   = "rgba(255,255,255,0.50)";
  const accent      = "#eb1d25";
  const accentMuted = "rgba(235,29,37,0.25)";
  const borderAccent= "rgba(235,29,37,0.30)";

  return {
    type: "div",
    props: {
      style: {
        width: 1200, height: 630,
        background: bg,
        display: "flex",
        fontFamily: "Saira",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // ... your design nodes
      ],
    },
  };
}
```

## Local assets

Async designs may `fs.readFile("./public/logo.png")` and embed it as a base64 `<img>` (see SKILL.md). Paths resolve from the directory you run `snap-x` in, so run it from the project root.

## After writing all files

Run `npx @snap-x/cli check designs/*.mjs` and fix every error before proceeding to Step 4.

Common fixes:
- `display:"block"` → `display:"flex"`
- `position:"fixed"` → `position:"absolute"`
- Missing `children: []` on leaf nodes → add empty array
- Children not array → wrap in `[]`
- "Satori render failed" → usually a `fontWeight` not declared in `FONTS`, or a bad image data URI
