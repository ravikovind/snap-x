#!/usr/bin/env node
// Idempotent publish: for each package (in dependency order — core before cli/mcp, which depend on
// it), publishes only if the local version isn't already on the registry. Safe to run on every push
// to main; a no-op unless package.json's version was actually bumped in a "chore(release)" commit.
import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const order = ["core", "cli", "mcp"];

let failed = false;

for (const name of order) {
  const dir = path.join(root, "packages", name);
  const pkg = JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));

  const view = spawnSync("npm", ["view", `${pkg.name}@${pkg.version}`, "version"], { encoding: "utf8" });
  const alreadyPublished = view.status === 0 && view.stdout.trim() === pkg.version;

  if (alreadyPublished) {
    console.log(`  •  ${pkg.name}@${pkg.version} already published — skipping`);
    continue;
  }

  console.log(`  →  publishing ${pkg.name}@${pkg.version}`);
  const res = spawnSync("npm", ["publish"], { cwd: dir, encoding: "utf8", stdio: "inherit" });
  if (res.status !== 0) {
    failed = true;
    console.error(`  ✖  npm publish failed for ${pkg.name}`);
  }
}

process.exit(failed ? 1 : 0);
