#!/usr/bin/env node
// Runs before `next build` (package.json's "prebuild" script — improvements.md §11.3): every page's
// OG image is rendered by snap-x itself from og-designs/*.mjs into public/og/. check runs first, so
// a broken design fails the build instead of silently shipping a stale or missing OG image.
import { checkDesign, renderDesign, resolveFonts, collectFontsSpec, resetFontCache } from "@snap-x/core";
import { readdirSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const designsDir = path.join(root, "og-designs");
const outDir = path.join(root, "public", "og");

const files = readdirSync(designsDir)
  .filter((f) => f.endsWith(".mjs") && !f.startsWith("_"))
  .map((f) => path.join(designsDir, f));

console.log(`\n  snap-x — rendering ${files.length} OG design file(s) for this site's own pages\n`);

resetFontCache();
const fonts = await resolveFonts(await collectFontsSpec(files));

let failed = false;
for (const f of files) {
  const result = await checkDesign(f, { fonts });
  if (result.errors.length > 0) {
    failed = true;
    console.error(`  ❌  ${path.basename(f)}`);
    for (const e of result.errors) console.error(`       • ${e}`);
  }
  for (const w of result.warnings) console.warn(`       ⚠  ${w}`);
}
if (failed) {
  console.error("\n  OG design check failed — fix the errors above before building.\n");
  process.exit(1);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
for (const f of files) {
  const out = await renderDesign(f, outDir, fonts);
  for (const p of Array.isArray(out) ? out : [out]) console.log(`  ✅  ${path.basename(p)}`);
}

console.log("\n  Done.\n");
