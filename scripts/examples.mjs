#!/usr/bin/env node
// Usage: node scripts/examples.mjs <render|check>
// Runs the snap-x CLI over every examples/<name>/designs folder (output goes to examples/<name>/).
// An example may add examples/<name>/example.json = { "guides": ["designs/cover.mjs"] } to also run `snap-x guides`
// on those designs (placement overlays + mobile crops go to examples/<name>/guides/).
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

const examples = readdirSync(path.join(root, "examples"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(path.join(root, "examples", d.name, "designs")))
  .map((d) => d.name);

let failed = false;
for (const name of examples) {
  const dir = path.join(root, "examples", name);
  const args = [cli, mode, path.join(dir, "designs"), ...(mode === "render" ? ["--out", dir] : [])];
  console.log(`\n=== examples/${name} (${mode}) ===`);
  if (spawnSync(process.execPath, args, { stdio: "inherit" }).status !== 0) failed = true;

  const configPath = path.join(dir, "example.json");
  if (mode === "render" && existsSync(configPath)) {
    const { guides = [] } = JSON.parse(readFileSync(configPath, "utf8"));
    if (guides.length) {
      const g = [cli, "guides", ...guides.map((f) => path.join(dir, f)), "--out", path.join(dir, "guides")];
      if (spawnSync(process.execPath, g, { stdio: "inherit" }).status !== 0) failed = true;
    }
  }
}
process.exit(failed ? 1 : 0);
