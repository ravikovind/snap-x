/**
 * render.mjs
 * Loads a design .mjs file → Satori (SVG) → resvg (PNG).
 *
 * Design files are fully self-contained and export:
 *   export const FORMAT = { width, height, name? }
 *   export const FONTS  = [{ family, weights? }]   // optional, defaults to Inter 400/700/900
 *   export default  tree (object) | function() → object   // no arguments
 */

import path from "path";
import fs from "fs/promises";

export async function renderDesign(designPath, outDir, fonts) {
  const mod = await import(`${designPath}?t=${Date.now()}`);

  if (!mod.FORMAT) throw new Error(`${path.basename(designPath)}: missing export FORMAT`);
  if (!mod.default) throw new Error(`${path.basename(designPath)}: missing default export`);

  const { width, height, name } = mod.FORMAT;
  const outName = name ?? path.basename(designPath, ".mjs") + ".png";

  // Static tree or factory function (supports async)
  const tree = typeof mod.default === "function" ? await mod.default() : mod.default;

  const satori = (await import("satori")).default;
  const { Resvg } = await import("@resvg/resvg-js");
  const { loadFallbackFonts } = await import("./fallback.mjs");

  // Primary fonts first so they win; fallbacks only fill glyphs they can't draw.
  const allFonts = [...fonts, ...(await loadFallbackFonts(tree, fonts))];

  const svg = await satori(tree, { width, height, fonts: allFonts, embedFont: true });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();

  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, png);

  console.log(`  ✅  ${outName}  (${Math.round(png.length / 1024)} KB)`);
  return outPath;
}
