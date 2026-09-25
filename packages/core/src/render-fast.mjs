import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { getFonts } from "./fonts.mjs";

/**
 * Render a Satori node tree to a PNG Buffer.
 * @param {object} node  - Satori JSX-compatible object tree
 * @param {object} opts  - { width, height, fonts? }
 */
export async function renderPng(node, opts = {}) {
  const { width = 1200, height = 630, fontFamily = "Inter", fontWeights = [400, 700, 900] } = opts;
  const fonts = opts.fonts ?? (await getFonts(fontFamily, fontWeights));
  const svg = await satori(node, { width, height, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: width } })
    .render()
    .asPng();
}

/**
 * Render multiple templates and save them to outDir.
 * @param {Array<{ name, node, width?, height? }>} items
 * @param {string} outDir
 * @param {object} opts
 */
export async function renderAll(items, outDir, opts = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const results = [];

  for (const item of items) {
    const png = await renderPng(item.node, {
      width: item.width,
      height: item.height,
      ...opts,
    });
    const outPath = path.join(outDir, item.name);
    fs.writeFileSync(outPath, png);
    const kb = Math.round(png.length / 1024);
    console.log(`  ✅  ${item.name}  (${kb} KB)`);
    results.push({ name: item.name, path: outPath, size: png.length });
  }

  return results;
}
