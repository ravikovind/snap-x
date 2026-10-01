#!/usr/bin/env node
/**
 * snap-x CLI.
 *
 *   snap-x render  <paths...> [--out <dir>] [--format <png|svg>] [--scale <n>] [--only <id,id>] [--jobs <n>]   design .mjs → PNG or SVG via Satori
 *   snap-x check   <paths...> [--scale <n>]                 validate design .mjs files
 *   snap-x guides  <paths...> [--format <id>] [--out <dir>] draw a platform's danger zones over each design
 *   snap-x formats [id|WxH] [--json]                        list platform formats, sizes and placement zones
 *   snap-x watch   <paths...> [--out <dir>] [--guides]      re-render on change, serve a local preview page
 *   snap-x version                                          print the version
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
const SUBCMDS = ["render", "check", "guides", "formats", "watch", "version"];
const VALUE_FLAGS = new Set(["--out", "--format", "--scale", "--only", "--port", "--jobs"]);

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

function getOnly() {
  const raw = get("--only");
  return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
}

function getOutputFormat() {
  const raw = get("--format");
  if (!raw || raw === "png") return "png";
  if (raw === "svg") return "svg";
  console.error(`  render --format must be "png" or "svg", got "${raw}"\n`);
  process.exit(1);
}

function getJobs() {
  const raw = get("--jobs");
  if (raw === null) return undefined; // let the pool pick its own CPU-count-based default
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    console.error(`  --jobs must be a positive integer, got "${raw}"\n`);
    process.exit(1);
  }
  return n;
}

function getScale() {
  const raw = get("--scale");
  if (raw === null) return 1;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    console.error(`  --scale must be a positive integer, got "${raw}"\n`);
    process.exit(1);
  }
  return n;
}

const HELP = `
  snap-x — render self-contained Satori .mjs design files to PNG or SVG (no browser)

  Usage
    snap-x render  <paths...> [--out <dir>] [--format <png|svg>] [--scale <n>] [--only <id,id>] [--jobs <n>]
    snap-x check   <paths...> [--scale <n>]                  validate designs (structure, real render, blank-box glyphs)
    snap-x guides  <paths...> [--format <id>] [--out <dir>]  overlay a platform's danger zones (+ mobile crop) on each design
    snap-x formats [id|WxH] [--json]                         list platform formats (YouTube, X, LinkedIn, Play Store, App Store …)
    snap-x watch   <paths...> [--out <dir>] [--guides] [--port <n>]   re-render on save; serves a local preview page
    snap-x version                                           print the installed version

  <paths...> = a file, a directory, or a glob like designs/*.mjs (files starting with "_" are helpers, never rendered)

  A design file exports FORMAT = { width, height, name, alpha? }, optionally FONTS, and a zero-argument default export.
  Set alpha: false for App Store / Google Play graphics (they must have no alpha channel).

  render's --format <png|svg>  output format (default: png). svg skips the resvg raster step and writes
               the Satori SVG string directly — useful for editors, vector workflows, or when you want
               to post-process the SVG. --scale is ignored for svg (SVG is resolution-independent).
               Note: on the guides command, --format takes a platform format id (e.g. youtube-thumbnail),
               not an output format.

  --scale <n>  renders sharp at n× resolution (Satori's layout is unchanged; only the raster output grows).
               Output is named "<name>@<n>x.png" unless n is 1. check --scale <n> also verifies resvg
               can encode the design at that size. Ignored when --format svg is set.

  render's --jobs <n> renders that many files concurrently in a small worker_threads pool (default:
               your CPU count). --jobs 1 renders one file at a time on the main thread, as before this
               existed. Console output always lists files in their original order either way, and a
               failing file is reported without stopping the others.

  A design can export VARIANTS = [{ id, ... }, ...] (or an async function returning that) to render many
  images from one file — the default export is called once per row, output named "<name>-<id>.png" (or .svg).
  render's --only <id,id> renders just those rows; check and guides always run every row.

  watch is a dev tool: it renders once, opens a local page (prints the URL) listing every output image,
  then re-renders whenever a design file changes and auto-reloads the page. --guides also runs the
  placement check on every change and shows those overlays too. --port picks a fixed port (default: any free one).

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

if (sub === "version") {
  console.log(`snap-x ${version()}`);
  process.exit(0);
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
if (sub === "watch")  await runWatch(files);

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
    if (f.maxBytes) console.log(`  max size: ${(f.maxBytes / (1024 * 1024)).toFixed(f.maxBytes % (1024 * 1024) === 0 ? 0 : 1)} MB`);
    if (f.types) console.log(`  types: ${f.types.join(", ")}`);
    for (const z of f.avoid ?? []) console.log(`  avoid  ${z.type === "circle" ? `circle (${z.cx},${z.cy}) r=${z.r}` : `rect x=${z.x} y=${z.y} ${z.w}×${z.h}`}  ${z.label ?? ""}`);
    if (f.safe) console.log(`  safe   rect x=${f.safe.x} y=${f.safe.y} ${f.safe.w}×${f.safe.h}  ${f.safe.label ?? ""}`);
    if (f.mobileCrop) console.log(`  mobile crop: x ${f.mobileCrop.x} → ${f.mobileCrop.x + f.mobileCrop.w}`);
    console.log("");
    return;
  }
  const w = Math.max(...FORMATS.map((f) => f.id.length));
  for (const f of FORMATS) {
    const flagsText = [f.alpha === false ? "no-alpha" : "", f.avoid || f.safe ? "zones" : "", f.maxBytes || f.types ? "limits" : "", f.verified ? "" : "unverified"].filter(Boolean).join(" ");
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
  const scale = getScale();
  const only = getOnly();
  const jobs = getJobs();
  const outputFormat = getOutputFormat();
  await fs.mkdir(outDir, { recursive: true });

  const { resolveFonts, resetFontCache, collectFontsSpec } = await import("./fonts.mjs");
  resetFontCache();

  const fontsSpec = await collectFontsSpec(files);
  const fonts = await resolveFonts(fontsSpec);

  const { renderPool, defaultJobs } = await import("./pool.mjs");
  const activeJobs = Math.max(1, Math.min(jobs ?? defaultJobs(), files.length));
  const fmtNote = outputFormat !== "png" ? `  (--format ${outputFormat})` : "";
  const scaleNote = outputFormat !== "svg" && scale !== 1 ? `  (--scale ${scale})` : "";
  console.log(`\n  Rendering ${files.length} file(s) → ${outDir}/  (${activeJobs} job${activeJobs === 1 ? "" : "s"})${scaleNote}${fmtNote}${only ? `  (--only ${only.join(",")})` : ""}\n`);

  let failed = false;
  await renderPool(files, outDir, fonts, {
    scale, only, outputFormat, jobs,
    onResult: async (i, r) => {
      const name = path.basename(files[i]);
      if (!r.ok) {
        failed = true;
        console.log(`  ❌  ${name}: ${r.error}`);
        return;
      }
      for (const p of Array.isArray(r.result) ? r.result : [r.result]) {
        const buf = await fs.readFile(p);
        // IHDR colour type at byte 25: 2 = RGB (opaque, FORMAT.alpha: false), 6 = RGBA — see png.test.mjs
        const noAlpha = outputFormat === "png" && buf[25] === 2 ? "  no alpha" : "";
        console.log(`  ✅  ${path.basename(p)}  (${Math.round(buf.length / 1024)} KB)${noAlpha}`);
      }
    },
  });

  console.log(failed ? `\n  Some files failed to render (see above).\n` : `\n  Done.\n`);
  if (failed) process.exit(1);
}

// ─── check ───────────────────────────────────────────────────────────────────

async function runCheck(files) {
  const scale = getScale();
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
    const result = await checkDesign(f, { fonts, scale });
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

// ─── watch ───────────────────────────────────────────────────────────────────

async function runWatch(files) {
  const outDir = path.resolve(get("--out") ?? "./snap-output");
  const guidesDir = path.join(outDir, "guides");
  const useGuides = has("--guides");
  const portArg = get("--port");
  const port = portArg ? Number(portArg) : 0;
  if (portArg && (!Number.isInteger(port) || port < 1)) {
    console.error(`  --port must be a positive integer, got "${portArg}"\n`);
    process.exit(1);
  }

  const { resolveFonts, resetFontCache, collectFontsSpec } = await import("./fonts.mjs");
  resetFontCache();
  const fonts = await resolveFonts(await collectFontsSpec(files));

  const { startWatch } = await import("./watch.mjs");
  const { port: boundPort, stop } = await startWatch(files, fonts, {
    outDir, guidesDir, guides: useGuides, port,
    log: (line) => console.log(line),
  });

  console.log(`\n  Watching ${files.length} file(s). Preview: http://localhost:${boundPort}\n  Press Ctrl+C to stop.\n`);

  process.on("SIGINT", async () => {
    console.log("\n  Stopping…\n");
    await stop();
    process.exit(0);
  });

  await new Promise(() => {}); // keep the process alive; the server itself already does this too
}
