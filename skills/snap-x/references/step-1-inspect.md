# Step 1: Inspect the project

Read the project directory to understand what you're framing.

## Priority read order

1. `package.json` — name, description, keywords, version
2. `README.md` — project name, one-liner, feature list, tech stack mentions
3. `data/site.ts` or `lib/site.ts` or `config/site.ts` — site metadata (name, url, tagline)
4. `app/page.tsx` or `index.html` — hero headline, tagline, CTA copy
5. `globals.css` or `tailwind.config` — color palette, font families

## What to skip

- `node_modules/`, `.next/`, `dist/`, `build/`
- Lock files, test files, `.git/`

## The 7-question rubric

Answer all seven before moving to Step 2.

```
1. What is the project?
   One sentence — what does it actually do?

2. What is the strongest one-line claim?
   The headline or tagline that earns attention.

3. What visual identity does the project have?
   Background color, primary text color, accent/brand color, font families.
   Extract exact CSS values when possible.

4. What domain or brand name appears most?
   The URL, product name, or studio name to show on cards.

5. What tags or keywords describe it best?
   3–4 short labels (e.g. "Open Source", "Node.js", "AI", "Zoho Partner").

6. What theme fits the project's personality?
   dark / light / midnight / forest / minimal
   Match to the project's own color choices — don't impose a theme.

7. What formats are most valuable for this project?
   - Always: og (every site needs an OG image)
   - Developer tool / OSS: readme card
   - Blog or content site: thumbnail
   - Personal brand / studio: cover + poster
   - All: generate all five unless the user specifies
```

## Color extraction

Look for CSS custom properties, Tailwind config `colors`, or `globals.css`:

```css
:root {
  --background: #000000;
  --foreground: rgba(255,255,255,0.95);
  --accent: #eb1d25;
}
```

If no exact values, use the most common colors from background/color/border rules.

Map to the nearest built-in theme (`dark`, `light`, `midnight`, `forest`, `minimal`) and note any overrides.
