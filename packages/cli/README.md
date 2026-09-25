# @snap-x/cli

The `snap-x` command: render self-contained Satori `.mjs` design files to PNG. No browser, no config.

```bash
npx @snap-x/cli check  designs/*.mjs
npx @snap-x/cli render designs/*.mjs --out snap-output

# or install once and use the short command
npm install -g @snap-x/cli
snap-x render designs/*.mjs --out snap-output
```

The engine (renderer, font loader, programmatic API) is [`@snap-x/core`](https://www.npmjs.com/package/@snap-x/core). Docs and the design-file format: https://github.com/ravikovind/snap-x#readme
