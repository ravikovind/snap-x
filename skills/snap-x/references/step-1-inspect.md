# Step 1: Inspect the project

Read the project directory. Answer all 8 questions before writing anything.

## Rubric

1. **Name** — What is the project called? (from package.json `name`, README h1, or directory name)
2. **Description** — One sentence: what does it do? (package.json `description` or README first paragraph)
3. **Domain / brand** — What URL or brand name goes at the bottom? (homepage field, custom domain, GitHub URL)
4. **Tags** — 2–3 short labels. (keywords from package.json, tech stack, category)
5. **Stack** — What tech is it built with? (dependencies in package.json, next.config.*, framework files)
6. **Font** — Is there a custom font? Check `app/globals.css` or `styles/globals.css` for `--font-sans`. If it's a `var(--font-…)` reference (Next.js `next/font`), the real family is set in `app/layout.tsx` — look for `import { Space_Grotesk } from "next/font/google"` and use that family name (`Space_Grotesk` → `"Space Grotesk"`). Fallback: Inter.
7. **Accent color** — Is there a brand color? Check CSS for `--accent`, `--primary`, `--color-brand`. Fallback: use theme default.
8. **Theme** — Dark or light? Look at the site's color scheme. Default: dark.

## What to read

- `package.json` — name, description, keywords, homepage, dependencies
- `README.md` — first heading, first paragraph, badges
- `app/globals.css` or `styles/globals.css` — font vars, color vars
- `next.config.*` — framework detection

There's no config file to fall back on — snap-x has no auto-detection layer. Whatever you find here gets hardcoded directly into the design files in Step 3.

## Output

Do not write anything yet. Carry the answers into Step 2.
