# @snap-x/core

The engine behind [snap-x](https://github.com/ravikovind/snap-x): renders a self-contained Satori `.mjs` design file to PNG. No browser, no config.

**Want the command?** Use [`@snap-x/cli`](https://www.npmjs.com/package/@snap-x/cli): `npx @snap-x/cli render designs/*.mjs`.

This package is the library:

```js
import { renderDesign, checkDesign, resolveFonts, collectFontsSpec } from "@snap-x/core";

const files = ["designs/og.mjs"];
const fonts = await resolveFonts(await collectFontsSpec(files));
await renderDesign(files[0], "snap-output", fonts);
```

A design file exports `FORMAT`, optionally `FONTS`, and a zero-argument default export (a Satori tree, or a function returning one):

```js
export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Inter", weights: [400, 700, 900] }]; // optional

export default function () {
  return { type: "div", props: { style: { width: 1200, height: 630, background: "#000", display: "flex" }, children: [] } };
}
```

Fonts are fetched from Google Fonts and cached on disk; non-Latin scripts get automatic fallback fonts.

Full docs: https://github.com/ravikovind/snap-x#readme
