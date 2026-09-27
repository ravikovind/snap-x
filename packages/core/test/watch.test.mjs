import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { startWatch } from "../src/watch.mjs";
import { resolveFonts, collectFontsSpec } from "../src/fonts.mjs";
import { makeTmpDir, writeFiles, validDesign, isolateCache } from "./helpers.mjs";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (url) => { const r = await fetch(url); return { status: r.status, body: await r.text() }; };
const getBuf = async (url) => { const r = await fetch(url); return { status: r.status, contentType: r.headers.get("content-type"), buf: Buffer.from(await r.arrayBuffer()) }; };

let dir, cacheCtx, fontsReachable = false;

before(async () => {
  cacheCtx = await isolateCache();
  dir = await makeTmpDir();
  await writeFiles(dir, {
    "designs/og.mjs": validDesign({ name: "og.png", width: 100, height: 60 }),
    "designs/li.mjs": validDesign({ name: "li.png", width: 1584, height: 396 }),
    "designs/broken.mjs": `export const FORMAT = { width: 10, height: 10 };
export default function () { throw new Error("boom"); }`,
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

const needsFonts = (name, fn) => test(name, async (t) => { if (!fontsReachable) return t.skip("Google Fonts unreachable"); await fn(t); });

needsFonts("renders once on start and serves the index page, the PNG, and /version", async () => {
  const outDir = path.join(dir, "watch-out-1");
  const fonts = await resolveFonts(await collectFontsSpec([path.join(dir, "designs/og.mjs")]));
  const w = await startWatch([path.join(dir, "designs/og.mjs")], fonts, { outDir, guidesDir: path.join(outDir, "guides"), port: 0 });
  try {
    const index = await get(`http://localhost:${w.port}/`);
    assert.equal(index.status, 200);
    assert.match(index.body, /og\.png/);

    const version = await get(`http://localhost:${w.port}/version`);
    assert.equal(version.body, "1");

    const png = await getBuf(`http://localhost:${w.port}/files/og.png`);
    assert.equal(png.status, 200);
    assert.equal(png.contentType, "image/png");
    assert.deepEqual(png.buf.subarray(0, 8), PNG_SIGNATURE);

    const missing = await get(`http://localhost:${w.port}/files/nope.png`);
    assert.equal(missing.status, 404);
  } finally {
    await w.stop();
  }
});

needsFonts("re-renders (debounced) and bumps /version when the design file changes", async () => {
  const outDir = path.join(dir, "watch-out-2");
  const src = path.join(dir, "designs/og.mjs");
  const fonts = await resolveFonts(await collectFontsSpec([src]));
  const w = await startWatch([src], fonts, { outDir, guidesDir: path.join(outDir, "guides"), port: 0 });
  try {
    assert.equal((await get(`http://localhost:${w.port}/version`)).body, "1");

    // A single edit can fire fs.watch more than once; confirm it still lands on exactly one bump.
    await fs.writeFile(src, validDesign({ name: "og.png", width: 100, height: 60 }));
    await fs.writeFile(src, validDesign({ name: "og.png", width: 100, height: 60 }));
    await sleep(600); // > the 80ms debounce, generous for a slow CI disk

    assert.equal((await get(`http://localhost:${w.port}/version`)).body, "2");
  } finally {
    await w.stop();
  }
});

needsFonts("--guides mode also serves guide overlays for a zoned design", async () => {
  const outDir = path.join(dir, "watch-out-3");
  const guidesDir = path.join(outDir, "guides");
  const fonts = await resolveFonts(await collectFontsSpec([path.join(dir, "designs/li.mjs")]));
  const w = await startWatch([path.join(dir, "designs/li.mjs")], fonts, { outDir, guidesDir, guides: true, port: 0 });
  try {
    const index = await get(`http://localhost:${w.port}/`);
    assert.match(index.body, /li\.guides\.png/);
    const overlay = await getBuf(`http://localhost:${w.port}/guides/li.guides.png`);
    assert.equal(overlay.status, 200);
    assert.deepEqual(overlay.buf.subarray(0, 8), PNG_SIGNATURE);
  } finally {
    await w.stop();
  }
});

needsFonts("a broken design logs a warning instead of crashing the watcher", async () => {
  const outDir = path.join(dir, "watch-out-4");
  const fonts = await resolveFonts(await collectFontsSpec([path.join(dir, "designs/broken.mjs")]));
  const lines = [];
  const w = await startWatch([path.join(dir, "designs/broken.mjs")], fonts, { outDir, guidesDir: path.join(outDir, "guides"), log: (l) => lines.push(l) });
  try {
    assert.ok(lines.some((l) => l.includes("boom")));
    assert.equal((await get(`http://localhost:${w.port}/version`)).body, "1"); // still served, just with no output files
  } finally {
    await w.stop();
  }
});

needsFonts("stop() closes the server", async () => {
  const outDir = path.join(dir, "watch-out-5");
  const fonts = await resolveFonts(await collectFontsSpec([path.join(dir, "designs/og.mjs")]));
  const w = await startWatch([path.join(dir, "designs/og.mjs")], fonts, { outDir, guidesDir: path.join(outDir, "guides") });
  await w.stop();
  await assert.rejects(() => fetch(`http://localhost:${w.port}/version`, { signal: AbortSignal.timeout(500) }));
});
