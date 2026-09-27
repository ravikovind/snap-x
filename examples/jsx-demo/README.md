# jsx-demo

A feature demo, not a brand pack: shows `.jsx`/`.tsx` design files
(improvements.md §6.1) working exactly like `.mjs` — same `FORMAT`/`FONTS`/
default-export contract, a shared `_theme.mjs` helper, fragments, and a
function sub-component — transformed at load time with esbuild against a
tiny no-React JSX runtime (`packages/core/src/jsx-runtime.mjs`).

- `designs/og.jsx` — fragments + a `Chip` sub-component.
- `designs/card.tsx` — typed props (`interface StatProps`), stripped at load
  time (not type-checked).

The `/snap-x` skill still writes `.mjs` by default; JSX/TSX is available for
anyone who prefers writing designs that way by hand.

Regenerate: `npm run examples`.
