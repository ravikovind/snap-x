# @snap-x/cli

Branded graphics for every platform, made by your AI agent.

The `snap-x` command: render and check self-contained Satori `.mjs` design files into platform-ready PNGs (thumbnails, covers, banners, store graphics, OG cards and more). Exact sizes, safe-zone guides, no browser.

```bash
npx @snap-x/cli check  designs/*.mjs
npx @snap-x/cli render designs/*.mjs --out snap-output

# or install once and use the short command
npm install -g @snap-x/cli
snap-x render designs/*.mjs --out snap-output
```

The engine (renderer, font loader, programmatic API) is [`@snap-x/core`](https://www.npmjs.com/package/@snap-x/core). Docs and the design-file format: https://github.com/ravikovind/snap-x#readme
