#!/usr/bin/env node
/**
 * snap-x CLI.
 *
 *   snap-x render  <paths...> [--out <dir>]                 design .mjs → PNG via Satori
 *   snap-x check   <paths...>                               validate design .mjs files
 *   snap-x guides  <paths...> [--format <id>] [--out <dir>] draw a platform's danger zones over each design
 *   snap-x formats [id|WxH] [--json]                        list platform formats, sizes and placement zones
 *
 * <paths...> accept a literal file, a directory (expands to every .mjs inside), or a glob with a single
 * trailing `*` (e.g. designs/*.mjs). Files starting with `_` are helpers and are never rendered.
 * Design files are self-contained: they export FORMAT, optionally FONTS, and a zero-argument default export.
 */

import path from "path";
import fs from "fs/promises";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolveDesignFiles } from "./resolve.mjs";

const rawArgs = process.argv.slice(2);
const SUBCMDS = ["render", "check", "guides", "formats"];
const VALUE_FLAGS = new Set(["--out", "--format"]);

const flags = new Map();
const positional = [];
for (let i = 0; i < rawArgs.length; i++) {
  const a = rawArgs[i];
  if (VALUE_FLAGS.has(a)) flags.set(a, rawArgs[++i] ?? null);
  else if (a.startsWith("-")) flags.set(a, true);
  else positional.push(a);
}
const get = (f) => (typeof flags.get(f) === "string" ? flags.get(f) : null);
const has = (f) => flags.has(f);
const sub = SUBCMDS.includes(positional[0]) ? positional[0] : null;
const patterns = sub ? positional.slice(1) : positional;

const HELP = `
  snap-x — render self-contained Satori .mjs design files to PNG (no browser)

  Usage
    snap-x render  <paths...> [--out <dir>]                  render designs to PNG (default --out ./snap-output)
    snap-x check   <paths...>                                validate designs (structure, real render, blank-box glyphs)
    snap-x guides  <paths...> [--format <id>] [--out <dir>]  overlay a platform's danger zones (+ mobile crop) on each design
    snap-x formats [id|WxH] [--json]                         list platform formats (YouTube, X, LinkedIn, Play Store, App Store …)

  <paths...> = a file, a directory, or a glob like designs/*.mjs (files starting with "_" are helpers, never rendered)

  A design file exports FORMAT = { width, height, name, alpha? }, optionally FONTS, and a zero-argument default export.
  Set alpha: false for App Store / Google Play graphics (they must have no alpha channel).

  Options   -h, --help   show this help      -v, --version   print the version
`;

function version() {
  try { return JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8")).version; } catch { return "unknown"; }
}

if (has("--version") || has("-v")) { console.log(`snap-x (core ${version()})`); process.exit(0); }
if (has("--help") || has("-h")) { console.log(HELP); process.exit(0); }

console.log("\n  snap-x\n");

if (!sub) {
  console.error("  Usage: snap-x <render|check|guides|formats> [paths...] [--out <dir>]   (snap-x --help for details)\n");
  process.exit(1);
}

if (sub === "formats") {
  await runFormats();
  process.exit(0);
}

const files = await resolveDesignFiles(patterns);
if (files.length === 0) {
  console.error("  No design files matched. Pass a file, a directory, or a glob like designs/*.mjs\n");
  process.exit(1);
}

if (sub === "render") await runRender(files);
if (sub === "check")  await runCheck(files);
if (sub === "guides") await runGuides(files);

// ─── formats ─────────────────────────────────────────────────────────────────

async function runFormats() {
  const { FORMATS, findFormat } = await import("./formats.mjs");
  const query = patterns[0];
  const list = query ? [findFormat(query)].filter(Boolean) : FORMATS;
  if (query && list.length === 0) {
    console.error(`  Unknown format "${query}". Run \`snap-x formats\` to list them.\n`);
    process.exit(1);
  }
  if (has("--json")) { console.log(JSON.stringify(list, null, 2)); return; }

  if (query) {
    const f = list[0];
    console.log(`  ${f.id}   ${f.width}×${f.height}${f.alpha === false ? "   (no alpha)" : ""}`);
    console.log(`  ${f.platform}${f.verified ? "" : "   [not verified against official docs]"}`);
    console.log(`  ${f.notes}`);
    if (f.source) console.log(`  source: ${f.source}`);
    for (const z of f.avoid ?? []) console.log(`  avoid  ${z.type === "circle" ? `circle (${z.cx},${z.cy}) r=${z.r}` : `rect x=${z.x} y=${z.y} ${z.w}×${z.h}`}  ${z.label ?? ""}`);
    if (f.safe) console.log(`  safe   rect x=${f.safe.x} y=${f.safe.y} ${f.safe.w}×${f.safe.h}  ${f.safe.label ?? ""}`);
    if (f.mobileCrop) console.log(`  mobile crop: x ${f.mobileCrop.x} → ${f.mobileCrop.x + f.mobileCrop.w}`);
    console.log("");
    return;
  }
  const w = Math.max(...FORMATS.map((f) => f.id.length));
  for (const f of FORMATS) {
    const flagsText = [f.alpha === false ? "no-alpha" : "", f.avoid || f.safe ? "zones" : "", f.verified ? "" : "unverified"].filter(Boolean).join(" ");
    console.log(`  ${f.id.padEnd(w)}  ${`${f.width}×${f.height}`.padEnd(10)}  ${f.platform}${flagsText ? `  [${flagsText}]` : ""}`);
  }
  console.log("\n  snap-x formats <id>   details, notes and placement zones\n");
}

// ─── guides ──────────────────────────────────────────────────────────────────

async function runGuides(files) {
  const outDir = path.resolve(get("--out") ?? "./snap-guides");
  await fs.mkdir(outDir, { recursive: true });
  const { resolveFonts, resetFontCache, collectFontsSpec } = await import("./fonts.mjs");
  resetFontCache();
  const fonts = await resolveFonts(await collectFontsSpec(files));
  const { renderGuides } = await import("./guides.mjs");

  console.log(`\n  Guides → ${outDir}/   (red = avoid, dashed cyan = safe area)\n`);
  for (const f of files) await renderGuides(f, outDir, fonts, { formatId: get("--format") });
  console.log("");
}

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
