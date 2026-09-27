#!/usr/bin/env node
// Usage: node scripts/examples.mjs <render|check>
// Runs the snap-x CLI over every examples/<name>/designs folder (output goes to examples/<name>/),
// plus templates/ itself (a flat pack — no nested designs/ subfolder; output goes to templates/).
// An example may add examples/<name>/example.json = { "guides": ["designs/cover.mjs"] } to also run `snap-x guides`
// on those designs (placement overlays + mobile crops go to examples/<name>/guides/). An entry can instead be
// { "file": "designs/x.mjs", "format": "instagram-story" } to force a format id when a design's exact width/height
// matches more than one platform format (auto-match otherwise picks whichever one is listed first).
import { spawnSync } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "packages/core/src/cli.mjs");
const mode = process.argv[2];
if (!["render", "check"].includes(mode)) {
  console.error("Usage: node scripts/examples.mjs <render|check>");
  process.exit(1);
}

const exampleNames = readdirSync(path.join(root, "examples"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(path.join(root, "examples", d.name, "designs")))
  .map((d) => d.name);

const packs = exampleNames.map((name) => ({
  label: `examples/${name}`,
  designsDir: path.join(root, "examples", name, "designs"),
  outDir: path.join(root, "examples", name),
  exampleJson: path.join(root, "examples", name, "example.json"),
}));

if (existsSync(path.join(root, "templates"))) {
  packs.push({ label: "templates", designsDir: path.join(root, "templates"), outDir: path.join(root, "templates"), exampleJson: null });
}

let failed = false;
for (const { label, designsDir, outDir, exampleJson } of packs) {
  const args = [cli, mode, designsDir, ...(mode === "render" ? ["--out", outDir] : [])];
  console.log(`\n=== ${label} (${mode}) ===`);
  if (spawnSync(process.execPath, args, { stdio: "inherit" }).status !== 0) failed = true;

  if (mode === "render" && exampleJson && existsSync(exampleJson)) {
    const { guides = [] } = JSON.parse(readFileSync(exampleJson, "utf8"));
    for (const entry of guides) {
      const { file, format } = typeof entry === "string" ? { file: entry } : entry;
      const g = [cli, "guides", path.join(outDir, file), ...(format ? ["--format", format] : []), "--out", path.join(outDir, "guides")];
      if (spawnSync(process.execPath, g, { stdio: "inherit" }).status !== 0) failed = true;
    }
  }
}
process.exit(failed ? 1 : 0);
