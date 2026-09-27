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

/** A design module's tree: static object or (async) zero-arg factory. */
export async function resolveTree(mod) {
  return typeof mod.default === "function" ? await mod.default() : mod.default;
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

export async function renderDesign(designPath, outDir, fonts, { scale = 1 } = {}) {
  const mod = await loadDesignModule(designPath);

  if (!mod.FORMAT) throw new Error(`${path.basename(designPath)}: missing export FORMAT`);
  if (!mod.default) throw new Error(`${path.basename(designPath)}: missing default export`);

  const { name } = mod.FORMAT;
  const outName = withScaleSuffix(name ?? path.basename(designPath, ".mjs") + ".png", scale);
  const png = await renderTree(await resolveTree(mod), mod.FORMAT, fonts, { scale });

  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, png);

  console.log(`  ✅  ${outName}  (${Math.round(png.length / 1024)} KB)${mod.FORMAT.alpha === false ? "  no alpha" : ""}`);
  return outPath;
}
