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

/** Any Satori tree → PNG buffer, with script-fallback fonts and emoji handled. Shared by render and guides. */
export async function renderTree(tree, { width, height, alpha = true }, fonts) {
  const satori = (await import("satori")).default;
  const { Resvg } = await import("@resvg/resvg-js");
  const { loadFallbackFonts } = await import("./fallback.mjs");
  const { loadAdditionalAsset } = await import("./emoji.mjs");

  // Primary fonts first so they win; fallbacks only fill glyphs they can't draw.
  const allFonts = [...fonts, ...(await loadFallbackFonts(tree, fonts))];
  const svg = await satori(tree, { width, height, fonts: allFonts, embedFont: true, loadAdditionalAsset });
  const image = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render();
  return alpha === false ? encodeRgbPng(image.width, image.height, image.pixels) : image.asPng();
}

export async function renderDesign(designPath, outDir, fonts) {
  const mod = await loadDesignModule(designPath);

  if (!mod.FORMAT) throw new Error(`${path.basename(designPath)}: missing export FORMAT`);
  if (!mod.default) throw new Error(`${path.basename(designPath)}: missing default export`);

  const { name } = mod.FORMAT;
  const outName = name ?? path.basename(designPath, ".mjs") + ".png";
  const png = await renderTree(await resolveTree(mod), mod.FORMAT, fonts);

  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, png);

  console.log(`  ✅  ${outName}  (${Math.round(png.length / 1024)} KB)${mod.FORMAT.alpha === false ? "  no alpha" : ""}`);
  return outPath;
}
