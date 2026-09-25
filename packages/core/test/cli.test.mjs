import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { makeTmpDir, writeFiles, validDesign, isolateCache } from "./helpers.mjs";

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/cli.mjs");
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let dir;
let cacheCtx;
let fontsReachable = false;

const run = (...args) =>
  spawnSync(process.execPath, [CLI, ...args], {
    cwd: dir,
    encoding: "utf-8",
    timeout: 60_000,
    env: { ...process.env, SNAP_X_CACHE_DIR: cacheCtx.dir },
  });

before(async () => {
  cacheCtx = await isolateCache(); // spawned CLIs share one throwaway cache, never the user's
  dir = await makeTmpDir();
  await writeFiles(dir, {
    "designs/og.mjs": validDesign({ name: "og.png", width: 300, height: 150 }),
    "designs/thumb.mjs": validDesign({ name: "thumb.png", width: 160, height: 90 }),
    "broken/grid.mjs": `export const FORMAT = { width: 10, height: 10 };
export default { type: "div", props: { style: { display: "grid" }, children: [] } };`,
  });
  try {
    const res = await fetch("https://fonts.googleapis.com/css2?family=Inter:wght@400", { signal: AbortSignal.timeout(5000) });
    fontsReachable = res.ok;
  } catch {}
});

after(async () => {
  await fs.rm(dir, { recursive: true, force: true });
  await cacheCtx.cleanup();
});

// Real renders need Google Fonts; skip (not fail) when the network is unavailable.
const needsFonts = (name, fn) =>
  test(name, async (t) => {
    if (!fontsReachable) return t.skip("Google Fonts unreachable");
    await fn(t);
  });

test("no subcommand prints usage and exits 1", () => {
  const r = run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Usage: snap-x/);
});

test("removed subcommands are not recognised", () => {
  const r = run("init");
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Usage/);
});

test("render with no matching files exits 1", () => {
  const r = run("render", "nothing/*.mjs");
  assert.equal(r.status, 1);
  assert.match(r.stderr, /No design files matched/);
});

test("check exits 1 and names the problem for a broken design", () => {
  const r = run("check", "broken");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /grid\.mjs/);
  assert.match(r.stdout, /display:"grid" not supported/);
});

test("check exits 0 for valid designs (a directory argument)", () => {
  const r = run("check", "designs");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /og\.mjs/);
  assert.match(r.stdout, /thumb\.mjs/);
  assert.match(r.stdout, /All designs valid/);
});

needsFonts("render writes a valid PNG named by FORMAT.name into --out", async () => {
  const r = run("render", "designs/og.mjs", "--out", "out-one");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const png = await fs.readFile(path.join(dir, "out-one", "og.png"));
  assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
});

needsFonts("render accepts a glob and renders every match", async () => {
  const r = run("render", "designs/*.mjs", "--out", "out-glob");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const files = (await fs.readdir(path.join(dir, "out-glob"))).sort();
  assert.deepEqual(files, ["og.png", "thumb.png"]);
});

needsFonts("--out defaults to ./snap-output", async () => {
  const r = run("render", "designs/thumb.mjs");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  await fs.access(path.join(dir, "snap-output", "thumb.png"));
});

needsFonts("non-Latin text triggers an automatic fallback font and still renders", async () => {
  await writeFiles(dir, {
    "cjk/jp.mjs": `export const FORMAT = { width: 200, height: 80, name: "jp.png" };
export default { type: "div", props: { style: { display: "flex", fontSize: 30, width: 200, height: 80 }, children: ["こんにちは"] } };`,
  });
  const r = run("render", "cjk/jp.mjs", "--out", "out-jp");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /fallback: Noto Sans JP/);
  const png = await fs.readFile(path.join(dir, "out-jp", "jp.png"));
  assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
});

needsFonts("rendered image has the FORMAT dimensions", async () => {
  run("render", "designs/og.mjs", "--out", "out-dim");
  const png = await fs.readFile(path.join(dir, "out-dim", "og.png"));
  assert.equal(png.readUInt32BE(16), 300);
  assert.equal(png.readUInt32BE(20), 150);
});
