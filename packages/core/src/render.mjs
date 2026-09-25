/**
 * render.mjs
 * Loads a design .mjs file → Satori (SVG) → resvg (PNG).
 *
 * Design files export:
 *   export const FORMAT = { width, height, name? }
 *   export default  tree (object) | function(config) → object
 */

import path from "path";
import fs from "fs/promises";

export async function renderDesign(designPath, outDir, config, fonts) {
  const mod = await import(`${designPath}?t=${Date.now()}`);

  if (!mod.FORMAT) throw new Error(`${path.basename(designPath)}: missing export FORMAT`);
  if (!mod.default) throw new Error(`${path.basename(designPath)}: missing default export`);

  const { width, height, name } = mod.FORMAT;
  const outName = name ?? path.basename(designPath, ".mjs") + ".png";

  // Static tree or factory function (supports async)
  const tree = typeof mod.default === "function" ? await mod.default(config) : mod.default;

  const satori = (await import("satori")).default;
  const { Resvg } = await import("@resvg/resvg-js");

  const svg = await satori(tree, { width, height, fonts, embedFont: true });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();

  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, png);

  console.log(`  ✅  ${outName}  (${Math.round(png.length / 1024)} KB)`);
  return outPath;
}
