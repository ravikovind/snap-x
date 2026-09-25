# Step 3: Write the design files

Write one `.mjs` file per format in `snap-x/designs/`. Each file is a Satori tree.

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

## Import paths from snap-x/designs/

```js
// Themes (color tokens)
import { getTheme } from "../../node_modules/@snap-x/core/src/themes/index.mjs";
// OR use relative path if installed locally:
// import { getTheme } from "../../../packages/core/src/themes/index.mjs";

// Lucide icons (returns a Satori svg node)
import { lucideIcon } from "../../node_modules/@snap-x/core/src/icons.mjs";
```

Available icons: `Zap`, `Globe`, `Layers`, `Rocket`, `ArrowUpRight`

## Theme tokens

```js
const t = getTheme("dark"); // or "light", "midnight", "forest", "minimal"
t.bg            // background color
t.text          // primary text
t.textMuted     // secondary text (rgba)
t.accent        // brand accent (red by default)
t.accentMuted   // accent at low opacity
t.borderAccent  // accent border
t.fontDisplay   // font family string
```

## File template

```js
import { getTheme } from "../../node_modules/@snap-x/core/src/themes/index.mjs";
import { lucideIcon } from "../../node_modules/@snap-x/core/src/icons.mjs";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };
  const { title, description, domain, tags, stack } = config;

  return {
    type: "div",
    props: {
      style: {
        width: 1200, height: 630,
        background: t.bg,
        display: "flex",
        fontFamily: t.fontDisplay,
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

## After writing all files

Run `npx snap-x check` and fix every error before proceeding to Step 4.

Common fixes:
- `display:"block"` → `display:"flex"`
- `position:"fixed"` → `position:"absolute"`
- Missing `children: []` on leaf nodes → add empty array
- Children not array → wrap in `[]`
