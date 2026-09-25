# @snap-x/core

Render-only Satori pipeline: a self-contained `.mjs` design file in, a PNG out. No browser, no config.

```bash
npm install -g @snap-x/core   # or use the `snap-x` package: npx snap-x …

snap-x check  designs/*.mjs
snap-x render designs/*.mjs --out snap-output
```

A design file exports `FORMAT`, optionally `FONTS`, and a zero-argument default export (a Satori tree, or a function returning one):

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Inter", weights: [400, 700, 900] }]; // optional

export default function () {
  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" },
      children: [{ type: "div", props: { style: { color: "#fff", fontSize: 56, display: "flex" }, children: ["Hello"] } }],
    },
  };
}
```

Fonts are fetched from Google Fonts and cached on disk; non-Latin scripts get automatic fallback fonts.

Full docs: https://github.com/ravikovind/snap-x#readme
