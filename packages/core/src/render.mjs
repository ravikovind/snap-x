/**
 * render.mjs
 * Loads a design .mjs file → Satori (SVG) → resvg (PNG).
 *
 * Design files are fully self-contained and export:
 *   export const FORMAT = { width, height, name?, alpha? }   // alpha: false → opaque RGB PNG (App Store / Play)
 *   export const FONTS  = [{ family, weights? }]             // optional, defaults to Inter 400/700/900
 *   export default  tree (object) | function() → object      // no arguments
 */

import path from "path";
import fs from "fs/promises";
import { loadDesignModule } from "./load.mjs";
import { encodeRgbPng } from "./png.mjs";

/** A design module's tree: static object or (async) zero-arg factory. Pass `variant` for a VARIANTS row. */
export async function resolveTree(mod, variant) {
  return typeof mod.default === "function" ? await mod.default(variant) : mod.default;
}

/**
 * A design module's optional VARIANTS: undefined when the module doesn't export one (the design behaves
 * exactly as before — one zero-argument call, one output). Otherwise a validated array of rows, each with
 * a unique string `id` and optionally a `format` object that overrides FORMAT fields for that row.
 */
export async function resolveVariants(mod) {
  if (mod.VARIANTS === undefined) return undefined;
  const rows = typeof mod.VARIANTS === "function" ? await mod.VARIANTS() : mod.VARIANTS;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("VARIANTS must be a non-empty array (or a function returning one)");
  }
  const seen = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== "string" || row.id === "") {
      throw new Error(`Every VARIANTS row needs a unique, non-empty string id (got ${JSON.stringify(row?.id)})`);
    }
    if (seen.has(row.id)) throw new Error(`Duplicate VARIANTS id "${row.id}"`);
    seen.add(row.id);
  }
  return rows;
}

/** Insert a "@2x"-style suffix before a filename's extension. scale 1 returns name unchanged. */
export function withScaleSuffix(name, scale) {
  if (scale === 1) return name;
  const ext = path.extname(name);
  const base = ext ? name.slice(0, -ext.length) : name;
  return `${base}@${scale}x${ext}`;
}

/**
 * Any Satori tree → PNG buffer, with script-fallback fonts and emoji handled. Shared by render and guides.
 *
 * `scale` renders sharp, not upscaled: Satori still lays out the tree at the design's own width/height
 * (so nothing about the tree needs to know about scale), and only resvg's raster target grows to
 * width*scale — resvg re-rasterizes the same vector SVG (embedFont: true keeps text as real glyphs, not
 * pre-rendered paths) at the larger pixel size, the same way a browser re-renders an SVG sharply at any zoom.
 */
export async function renderTree(tree, { width, height, alpha = true }, fonts, { scale = 1 } = {}) {
  const satori = (await import("satori")).default;
  const { Resvg } = await import("@resvg/resvg-js");
  const { loadFallbackFonts } = await import("./fallback.mjs");
  const { loadAdditionalAsset } = await import("./emoji.mjs");

  // Primary fonts first so they win; fallbacks only fill glyphs they can't draw.
  const allFonts = [...fonts, ...(await loadFallbackFonts(tree, fonts))];
  const svg = await satori(tree, { width, height, fonts: allFonts, embedFont: true, loadAdditionalAsset });
  const image = new Resvg(svg, { fitTo: { mode: "width", value: width * scale } }).render();
  return alpha === false ? encodeRgbPng(image.width, image.height, image.pixels) : image.asPng();
}

const splitExt = (name) => {
  const ext = path.extname(name);
  return [ext ? name.slice(0, -ext.length) : name, ext];
};

async function writeOne(outDir, outName, tree, format, fonts, scale, log) {
  const png = await renderTree(tree, format, fonts, { scale });
  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, png);
  log(`  ✅  ${outName}  (${Math.round(png.length / 1024)} KB)${format.alpha === false ? "  no alpha" : ""}`);
  return outPath;
}

/**
 * Renders a design to PNG(s).
 * - No VARIANTS export: the classic zero-argument call, one file — returns its path (a string), unchanged
 *   from before this feature existed.
 * - With VARIANTS: the default export is called once per row (receiving that row), each written as
 *   `<name-stem>-<id>.<ext>` (a row's optional `format.name` is used exactly as given instead) — returns
 *   an array of paths, one per row, in VARIANTS order. `only` (an array of ids) renders just those rows;
 *   it's ignored for a design without VARIANTS.
 * - `log` (default `console.log`) receives each file's progress line; pass a no-op to render quietly
 *   (used by pool.mjs's worker threads, whose own stdout would otherwise print out of order).
 */
export async function renderDesign(designPath, outDir, fonts, { scale = 1, only, log = console.log } = {}) {
  const mod = await loadDesignModule(designPath);

  if (!mod.FORMAT) throw new Error(`${path.basename(designPath)}: missing export FORMAT`);
  if (!mod.default) throw new Error(`${path.basename(designPath)}: missing default export`);

  const baseName = mod.FORMAT.name ?? path.basename(designPath, ".mjs") + ".png";
  const variants = await resolveVariants(mod);

  if (!variants) {
    return writeOne(outDir, withScaleSuffix(baseName, scale), await resolveTree(mod), mod.FORMAT, fonts, scale, log);
  }

  const rows = only ? variants.filter((r) => only.includes(r.id)) : variants;
  if (only && rows.length === 0) {
    throw new Error(`--only ${only.join(",")} matched no VARIANTS row in ${path.basename(designPath)} (ids: ${variants.map((r) => r.id).join(", ")})`);
  }

  const [stem, ext] = splitExt(baseName);
  const outPaths = [];
  for (const row of rows) {
    const rowFormat = { ...mod.FORMAT, ...(row.format ?? {}) };
    const rowName = withScaleSuffix(row.format?.name ?? `${stem}-${row.id}${ext}`, scale);
    outPaths.push(await writeOne(outDir, rowName, await resolveTree(mod, row), rowFormat, fonts, scale, log));
  }
  return outPaths;
}
