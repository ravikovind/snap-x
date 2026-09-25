#!/usr/bin/env node

/**
 * snap-x CLI
 *
 * Usage:
 *   npx snap-x                          # auto-detect project, generate all formats
 *   npx snap-x --format og              # generate only OG image
 *   npx snap-x --theme light            # use light theme
 *   npx snap-x --out ./my-images        # custom output directory
 *   npx snap-x --title "My App" --desc "..." --domain "myapp.com"
 */

import path from "path";
import { renderAll } from "./render.mjs";
import { detectProject } from "./adapters/index.mjs";
import { ogCard, FORMAT as OG_FORMAT } from "./templates/og.mjs";
import { thumbnailCard, FORMAT as THUMB_FORMAT } from "./templates/thumbnail.mjs";
import { coverCard, FORMAT as COVER_FORMAT } from "./templates/cover.mjs";
import { posterCard, FORMAT as POSTER_FORMAT } from "./templates/poster.mjs";
import { readmeCard, FORMAT as README_FORMAT } from "./templates/readme.mjs";
import { getFonts, resetFontCache } from "./fonts.mjs";

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const has = (flag) => args.includes(flag);

const formatFilter = get("--format");
const theme = get("--theme") ?? "dark";
const outDir = get("--out") ?? "./snap-output";
const projectDir = get("--project") ?? process.cwd();

// Manual overrides
const titleOverride = get("--title");
const descOverride = get("--desc");
const domainOverride = get("--domain");
const tagsOverride = get("--tags")?.split(",").map((t) => t.trim());

console.log("\n📸  snap-x image generator\n");

const meta = await detectProject(projectDir);

const title = titleOverride ?? meta.name ?? "Untitled";
const description = descOverride ?? meta.description ?? "";
const domain = domainOverride ?? meta.domain ?? "";
const tags = tagsOverride ?? meta.tags ?? [];
const stack = meta.stack ?? [];

console.log(`  Project : ${title}`);
console.log(`  Theme   : ${theme}`);
console.log(`  Output  : ${path.resolve(outDir)}\n`);

const fontFamily = "Inter";
const fontWeights = [400, 700, 900];
const fonts = await getFonts(fontFamily, fontWeights);

const all = [
  {
    id: "og",
    name: "og.png",
    node: ogCard({ label: domain || title, title, description, tags, domain, theme }),
    ...OG_FORMAT,
  },
  {
    id: "thumbnail",
    name: "thumbnail.png",
    node: thumbnailCard({ eyebrow: domain || "", title, subtitle: description, tag: tags[0] ?? "", theme }),
    ...THUMB_FORMAT,
  },
  {
    id: "cover",
    name: "cover.png",
    node: coverCard({ name: title, tagline: description, domain, theme }),
    ...COVER_FORMAT,
  },
  {
    id: "poster",
    name: "poster.png",
    node: posterCard({ eyebrow: domain || "", title, subtitle: description, footer: domain, theme }),
    ...POSTER_FORMAT,
  },
  {
    id: "readme",
    name: "readme-card.png",
    node: readmeCard({ name: title, description, stack, domain, theme }),
    ...README_FORMAT,
  },
];

const items = formatFilter ? all.filter((i) => i.id === formatFilter) : all;

if (items.length === 0) {
  console.error(`  Unknown format: ${formatFilter}. Options: og, thumbnail, cover, poster, readme`);
  process.exit(1);
}

console.log(`  Generating ${items.length} image(s)…\n`);
await renderAll(items, outDir, { fonts });

console.log(`\n  Done. Images saved to ${path.resolve(outDir)}/\n`);
