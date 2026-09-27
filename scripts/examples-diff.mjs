#!/usr/bin/env node
// Usage: node scripts/examples-diff.mjs
// Visual regression for examples/ and templates/: renders every examples/<name>/designs (plus the
// flat templates/ pack) to a temp dir and compares each output pixel-by-pixel against the committed
// PNG at the same path, using a
// pure-JS diff (pixelmatch + pngjs — no native image libraries). A small per-pixel threshold plus a
// small overall-differing-pixels budget absorb anti-aliasing noise between runs; anything past that
// is a real visual change. Writes a diff image for every failure under .examples-diff/ (gitignored).
//
// An intended visual change: run `npm run examples` and commit the new PNGs — this script then
// passes again since "committed" and "fresh" match.
//
// Out of scope: the guides/mobile-crop overlays some packs render via example.json (a separate step
// from the plain render this script exercises), and any example without designs/ yet.
import { spawnSync } from "child_process";
import { existsSync, readdirSync, readFileSync, mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "packages/core/src/cli.mjs");
const diffDir = path.join(root, ".examples-diff");

const PIXEL_THRESHOLD = 0.1; // pixelmatch's own per-pixel colour-difference sensitivity (0-1)
const MAX_DIFF_RATIO = 0.005; // fraction of an image's pixels allowed to differ before it's a real regression

const exampleNames = readdirSync(path.join(root, "examples"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(path.join(root, "examples", d.name, "designs")))
  .map((d) => d.name);

const packs = exampleNames.map((name) => ({ label: `examples/${name}`, dir: path.join(root, "examples", name), designsDir: path.join(root, "examples", name, "designs") }));
if (existsSync(path.join(root, "templates"))) {
  packs.push({ label: "templates", dir: path.join(root, "templates"), designsDir: path.join(root, "templates") });
}

const tmp = mkdtempSync(path.join(os.tmpdir(), "snapx-diff-"));
rmSync(diffDir, { recursive: true, force: true });

let failed = false;
let compared = 0;

for (const { label, dir, designsDir } of packs) {
  const outDir = path.join(tmp, label.replace("/", "-"));
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(process.execPath, [cli, "render", designsDir, "--out", outDir], { stdio: "inherit" });
  if (r.status !== 0) { failed = true; continue; }

  for (const file of readdirSync(outDir).sort()) {
    if (!file.endsWith(".png")) continue;
    const committedPath = path.join(dir, file);
    const freshPath = path.join(outDir, file);
    if (!existsSync(committedPath)) {
      console.log(`  ⚠  ${file}: rendered but no committed PNG at this path (new file — nothing to diff against)`);
      continue;
    }

    compared++;
    const committed = PNG.sync.read(readFileSync(committedPath));
    const fresh = PNG.sync.read(readFileSync(freshPath));

    if (committed.width !== fresh.width || committed.height !== fresh.height) {
      failed = true;
      console.log(`  ❌  ${file}: size differs — committed ${committed.width}×${committed.height}, fresh ${fresh.width}×${fresh.height}`);
      continue;
    }

    const diffPng = new PNG({ width: committed.width, height: committed.height });
    const diffPixels = pixelmatch(committed.data, fresh.data, diffPng.data, committed.width, committed.height, { threshold: PIXEL_THRESHOLD });
    const ratio = diffPixels / (committed.width * committed.height);

    if (ratio > MAX_DIFF_RATIO) {
      failed = true;
      mkdirSync(path.join(diffDir, label), { recursive: true });
      const diffPath = path.join(diffDir, label, file);
      writeFileSync(diffPath, PNG.sync.write(diffPng));
      console.log(`  ❌  ${file}: ${diffPixels} px differ (${(ratio * 100).toFixed(2)}%) — diff written to ${path.relative(root, diffPath)}`);
    } else {
      console.log(`  ✅  ${file}${diffPixels ? ` (${diffPixels} px, within anti-aliasing tolerance)` : ""}`);
    }
  }
}

rmSync(tmp, { recursive: true, force: true });

console.log(`\n${compared} image(s) compared.`);
if (failed) {
  console.log("Some images changed. If intended: `npm run examples` and commit the new PNGs. See .examples-diff/ for what changed.\n");
  process.exit(1);
}
console.log("Every committed example image matches a fresh render.\n");
