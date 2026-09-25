#!/usr/bin/env node
// Guards against publishing broken manifests. For every package it runs `npm publish --dry-run` and fails on
// any "npm warn publish" line (e.g. npm 11 silently drops a `bin` path written as "./cli.mjs"), and checks
// that every bin target exists and starts with a shebang.
import { spawnSync } from "child_process";
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let failed = false;
const fail = (msg) => { console.error(`  ✖ ${msg}`); failed = true; };

for (const name of readdirSync(path.join(root, "packages"))) {
  const dir = path.join(root, "packages", name);
  const pkgPath = path.join(dir, "package.json");
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  console.log(`\n${pkg.name}@${pkg.version}`);

  const res = spawnSync("npm", ["publish", "--dry-run"], { cwd: dir, encoding: "utf8" });
  const out = `${res.stdout}\n${res.stderr}`;
  // An already-published version makes npm error even on --dry-run (after printing any manifest warnings): fine.
  const alreadyPublished = /cannot publish over the previously published/i.test(out);
  if (res.status !== 0 && !alreadyPublished) fail(`npm publish --dry-run exited ${res.status}\n${out}`);
  for (const line of out.split("\n").filter((l) => /npm warn publish/i.test(l))) fail(line.trim());

  for (const [cmd, target] of Object.entries(pkg.bin ?? {})) {
    const file = path.join(dir, target);
    if (target.startsWith("./")) fail(`bin "${cmd}" is "${target}" — write it without the leading "./"`);
    if (!existsSync(file)) fail(`bin "${cmd}" target ${target} does not exist`);
    else if (!readFileSync(file, "utf8").startsWith("#!")) fail(`bin "${cmd}" target ${target} has no shebang`);
  }
  if (!failed) console.log("  ✓ manifest OK");
}
process.exit(failed ? 1 : 0);
