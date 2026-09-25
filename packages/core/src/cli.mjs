#!/usr/bin/env node
/**
 * snap-x CLI — render-only.
 *
 *   snap-x render <paths...> [--out <dir>]   design .mjs → PNG via Satori
 *   snap-x check  <paths...>                 validate design .mjs files
 *
 * <paths...> accept a literal file, a directory (expands to every .mjs
 * inside), or a glob with a single trailing `*` (e.g. designs/*.mjs).
 * Design files are self-contained: no config, no auto-detection — they
 * export FORMAT, optionally FONTS, and a zero-argument default export.
 */

import path from "path";
import fs from "fs/promises";
import { resolveDesignFiles } from "./resolve.mjs";

const rawArgs = process.argv.slice(2);
const SUBCMDS = ["render", "check"];
const sub = rawArgs[0] && SUBCMDS.includes(rawArgs[0]) ? rawArgs[0] : null;
const args = sub ? rawArgs.slice(1) : rawArgs;

const get = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] ?? null : null; };
const patterns = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");

console.log("\n  snap-x\n");

if (!sub) {
  console.error("  Usage: snap-x <render|check> <paths...> [--out <dir>]\n");
  process.exit(1);
}

const files = await resolveDesignFiles(patterns);
if (files.length === 0) {
  console.error("  No design files matched. Pass a file, a directory, or a glob like designs/*.mjs\n");
  process.exit(1);
}

if (sub === "render") await runRender(files);
if (sub === "check")  await runCheck(files);

// ─── render ──────────────────────────────────────────────────────────────────

async function runRender(files) {
  const outDir = path.resolve(get("--out") ?? "./snap-output");
  await fs.mkdir(outDir, { recursive: true });

  const { resolveFonts, resetFontCache, collectFontsSpec } = await import("./fonts.mjs");
  resetFontCache();

  const fontsSpec = await collectFontsSpec(files);
  const fonts = await resolveFonts(fontsSpec);

  console.log(`\n  Rendering ${files.length} file(s) → ${outDir}/\n`);

  const { renderDesign } = await import("./render.mjs");
  for (const f of files) {
    await renderDesign(f, outDir, fonts);
  }

  console.log(`\n  Done.\n`);
}

// ─── check ───────────────────────────────────────────────────────────────────

async function runCheck(files) {
  const { resolveFonts, resetFontCache, collectFontsSpec } = await import("./fonts.mjs");
  resetFontCache();

  let fonts;
  try {
    const fontsSpec = await collectFontsSpec(files);
    fonts = await resolveFonts(fontsSpec);
  } catch (err) {
    console.log(`  ⚠  Could not load fonts (${err.message}) — checking structure only, skipping Satori render check.\n`);
  }

  const { checkDesign } = await import("./check.mjs");
  let allOk = true;

  for (const f of files) {
    const result = await checkDesign(f, { fonts });
    if (result.errors.length === 0) {
      console.log(`  ✅  ${path.basename(f)}`);
    } else {
      console.log(`  ❌  ${path.basename(f)}`);
      result.errors.forEach((e) => console.log(`       • ${e}`));
      allOk = false;
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach((w) => console.log(`       ⚠  ${w}`));
    }
  }

  console.log(allOk ? "\n  All designs valid.\n" : "\n  Fix errors above before rendering.\n");
  if (!allOk) process.exit(1);
}
