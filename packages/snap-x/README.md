# snap-x

Render a self-contained Satori `.mjs` design file to a PNG. No browser, no config.

```bash
npx snap-x check  designs/*.mjs
npx snap-x render designs/*.mjs --out snap-output
```

This package is the CLI entry point; the engine is [`@snap-x/core`](https://www.npmjs.com/package/@snap-x/core). Docs and the design-file format: https://github.com/ravikovind/snap-x#readme
