import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { makeTmpDir, writeFiles, validDesign, isolateCache } from "./helpers.mjs";
import { withScaleSuffix } from "../src/render.mjs";

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

test("withScaleSuffix: 1 is unchanged, >1 inserts @NxEXT, and it handles no-extension names", () => {
  assert.equal(withScaleSuffix("og.png", 1), "og.png");
  assert.equal(withScaleSuffix("og.png", 2), "og@2x.png");
  assert.equal(withScaleSuffix("og.png", 3), "og@3x.png");
  assert.equal(withScaleSuffix("noext", 2), "noext@2x");
});

test("--scale rejects non-integers and values below 1", () => {
  for (const bad of ["0", "-1", "1.5", "abc"]) {
    const r = run("render", "designs/og.mjs", "--scale", bad);
    assert.equal(r.status, 1, bad);
    assert.match(r.stderr, /--scale must be a positive integer/);
  }
});

test("--jobs rejects non-integers and values below 1", () => {
  for (const bad of ["0", "-1", "1.5", "abc"]) {
    const r = run("render", "designs/og.mjs", "--jobs", bad);
    assert.equal(r.status, 1, bad);
    assert.match(r.stderr, /--jobs must be a positive integer/);
  }
});

needsFonts("render with default --jobs (parallel) produces byte-identical output to --jobs 1", async () => {
  const seq = run("render", "designs/*.mjs", "--out", "out-jobs-seq", "--jobs", "1");
  assert.equal(seq.status, 0, seq.stdout + seq.stderr);
  const par = run("render", "designs/*.mjs", "--out", "out-jobs-par"); // default: CPU-count-based
  assert.equal(par.status, 0, par.stdout + par.stderr);
  assert.match(par.stdout, /\(\d+ jobs?\)/);

  for (const name of ["og.png", "thumb.png"]) {
    const [a, b] = await Promise.all([
      fs.readFile(path.join(dir, "out-jobs-seq", name)),
      fs.readFile(path.join(dir, "out-jobs-par", name)),
    ]);
    assert.deepEqual(a, b, `${name} differs between --jobs 1 and the default pool`);
  }
});

needsFonts("render logs stay in file order under the parallel pool, even with a VARIANTS design mixed in", async () => {
  await writeFiles(dir, {
    "designs/a-og.mjs": validDesign({ name: "a-og.png", width: 100, height: 60 }),
    "designs/b-series.mjs": `export const FORMAT = { width: 40, height: 30, name: "b-series.png" };
export const VARIANTS = [{ id: "1" }, { id: "2" }];
export default function () { return { type: "div", props: { style: { display: "flex" }, children: [] } }; }`,
    "designs/c-thumb.mjs": validDesign({ name: "c-thumb.png", width: 90, height: 50 }),
  });
  const r = run("render", "designs/a-og.mjs", "designs/b-series.mjs", "designs/c-thumb.mjs", "--out", "out-jobs-order", "--jobs", "3");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  // onResult is chained in index order regardless of which worker finishes first (pool.mjs) — the
  // ✅ lines must therefore list a-og before b-series's rows before c-thumb, every run.
  const lines = r.stdout.split("\n").filter((l) => l.includes("✅"));
  const order = lines.map((l) => l.trim().split(/\s+/)[1]);
  assert.deepEqual(order, ["a-og.png", "b-series-1.png", "b-series-2.png", "c-thumb.png"]);
});

needsFonts("render's parallel pool reports a bad file without aborting the others, and exits 1", async () => {
  await writeFiles(dir, {
    "designs/good1.mjs": validDesign({ name: "good1.png" }),
    "designs/zzz-bad.mjs": `export const FORMAT = { width: 10, height: 10 };
export default function () { throw new Error("boom"); }`,
    "designs/good2.mjs": validDesign({ name: "good2.png" }),
  });
  const r = run("render", "designs/good1.mjs", "designs/zzz-bad.mjs", "designs/good2.mjs", "--out", "out-jobs-fail", "--jobs", "3");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /❌\s+zzz-bad\.mjs.*boom/);
  await fs.access(path.join(dir, "out-jobs-fail", "good1.png"));
  await fs.access(path.join(dir, "out-jobs-fail", "good2.png"));
});

needsFonts("render --scale 2 writes a sharp 2x PNG named og@2x.png", async () => {
  const r = run("render", "designs/og.mjs", "--out", "out-scale", "--scale", "2");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const png = await fs.readFile(path.join(dir, "out-scale", "og@2x.png"));
  assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
  assert.equal(png.readUInt32BE(16), 600); // 300 * 2
  assert.equal(png.readUInt32BE(20), 300); // 150 * 2
});

needsFonts("check --scale 2 still passes for a valid design (exercises the resvg path too)", async () => {
  const r = run("check", "designs/og.mjs", "--scale", "2");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /All designs valid/);
});

needsFonts("VARIANTS: render writes one file per row, named <stem>-<id>.<ext>", async () => {
  await writeFiles(dir, {
    "designs/episode.mjs": `export const FORMAT = { width: 100, height: 100, name: "episode.png" };
export const VARIANTS = [{ id: "ep-01", title: "Setting up" }, { id: "ep-02", title: "First render" }];
export default function (variant) {
  return { type: "div", props: { style: { display: "flex", width: 100, height: 100, fontSize: 14 }, children: [variant.title] } };
}`,
  });
  const r = run("render", "designs/episode.mjs", "--out", "out-variants");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const files = (await fs.readdir(path.join(dir, "out-variants"))).sort();
  assert.deepEqual(files, ["episode-ep-01.png", "episode-ep-02.png"]);
  for (const f of files) {
    const png = await fs.readFile(path.join(dir, "out-variants", f));
    assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
  }
});

needsFonts("VARIANTS: a row's format override changes that row's output name and size", async () => {
  await writeFiles(dir, {
    "designs/shot.mjs": `export const FORMAT = { width: 100, height: 100, name: "shot.png" };
export const VARIANTS = [
  { id: "en", title: "Hello" },
  { id: "fr", title: "Bonjour", format: { name: "shot-francais.png", width: 120 } },
];
export default function (variant) {
  return { type: "div", props: { style: { display: "flex", fontSize: 14 }, children: [variant.title] } };
}`,
  });
  const r = run("render", "designs/shot.mjs", "--out", "out-variant-format");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const files = (await fs.readdir(path.join(dir, "out-variant-format"))).sort();
  assert.deepEqual(files, ["shot-en.png", "shot-francais.png"]);
  const fr = await fs.readFile(path.join(dir, "out-variant-format", "shot-francais.png"));
  assert.equal(fr.readUInt32BE(16), 120); // overridden width
  assert.equal(fr.readUInt32BE(20), 100); // height falls back to the base FORMAT
});

needsFonts("VARIANTS: --scale composes with the per-row name (episode-ep-01@2x.png)", async () => {
  await writeFiles(dir, {
    "designs/ep.mjs": `export const FORMAT = { width: 100, height: 100, name: "ep.png" };
export const VARIANTS = [{ id: "01" }];
export default function () { return { type: "div", props: { style: { display: "flex" }, children: [] } }; }`,
  });
  const r = run("render", "designs/ep.mjs", "--out", "out-variant-scale", "--scale", "2");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const png = await fs.readFile(path.join(dir, "out-variant-scale", "ep-01@2x.png"));
  assert.equal(png.readUInt32BE(16), 200);
});

needsFonts("VARIANTS: guides runs once per row when the design matches a zoned format", async () => {
  await writeFiles(dir, {
    "designs/cover.mjs": `export const FORMAT = { width: 1584, height: 396, name: "cover.png" };
export const VARIANTS = [{ id: "a" }, { id: "b" }];
export default function () { return { type: "div", props: { style: { display: "flex", width: 1584, height: 396 }, children: [] } }; }`,
  });
  const r = run("guides", "designs/cover.mjs", "--out", "out-variant-guides");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const files = (await fs.readdir(path.join(dir, "out-variant-guides"))).sort();
  assert.deepEqual(files, ["cover-a.guides.png", "cover-a.mobile.png", "cover-b.guides.png", "cover-b.mobile.png"]);
});

needsFonts("VARIANTS: --only renders just the requested rows, and is ignored for a zero-arg design", async () => {
  await writeFiles(dir, {
    "designs/series.mjs": `export const FORMAT = { width: 10, height: 10, name: "series.png" };
export const VARIANTS = [{ id: "a" }, { id: "b" }, { id: "c" }];
export default function () { return { type: "div", props: { style: { display: "flex" }, children: [] } }; }`,
  });
  const r = run("render", "designs/series.mjs", "designs/og.mjs", "--out", "out-only", "--only", "a,c");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const files = (await fs.readdir(path.join(dir, "out-only"))).sort();
  assert.deepEqual(files, ["og.png", "series-a.png", "series-c.png"]); // designs/og.mjs (no VARIANTS) unaffected by --only
});

needsFonts("VARIANTS: --only with an id that matches nothing is a clear error", async () => {
  await writeFiles(dir, {
    "designs/series2.mjs": `export const FORMAT = { width: 10, height: 10 };
export const VARIANTS = [{ id: "a" }];
export default function () { return { type: "div", props: { style: { display: "flex" }, children: [] } }; }`,
  });
  const r = run("render", "designs/series2.mjs", "--out", "out-only-miss", "--only", "nope");
  assert.equal(r.status, 1);
  // render's pool (10.7) catches every per-file error and reports it as a clean stdout line instead
  // of letting it throw uncaught to stderr — this file's error is one of those, same as any other.
  assert.match(r.stdout, /❌\s+series2\.mjs.*--only nope matched no VARIANTS row/);
});

test("VARIANTS: check names the failing row and doesn't abort the others", async () => {
  await writeFiles(dir, {
    "designs/bad-variant.mjs": `export const FORMAT = { width: 10, height: 10 };
export const VARIANTS = [{ id: "ok" }, { id: "broken" }];
export default function (v) { return { type: "div", props: { style: { display: v.id === "broken" ? "grid" : "flex" }, children: [] } }; }`,
  });
  const r = run("check", "designs/bad-variant.mjs");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /\[broken\] root: display:"grid" not supported/);
});

needsFonts(".jsx design files render through the real CLI, glob and directory expansion included", async () => {
  await writeFiles(dir, {
    "jsxdesigns/_theme.mjs": `export const BG = "#101010";`,
    "jsxdesigns/og.jsx": `import { BG } from "./_theme.mjs";
export const FORMAT = { width: 100, height: 60, name: "og.png" };
export default function () {
  return <div style={{ width: 100, height: 60, background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ color: "#fff", fontSize: 14, display: "flex" }}>hi</div>
  </div>;
}`,
    "jsxdesigns/_helper.jsx": `throw new Error("helper should never be rendered");`,
  });
  const check = run("check", "jsxdesigns");
  assert.equal(check.status, 0, check.stdout + check.stderr);
  assert.match(check.stdout, /og\.jsx/);
  assert.doesNotMatch(check.stdout, /_helper/);

  const r = run("render", "jsxdesigns/*.jsx", "--out", "out-jsx");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const png = await fs.readFile(path.join(dir, "out-jsx", "og.png"));
  assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
});

needsFonts(".tsx design files render through the real CLI", async () => {
  await writeFiles(dir, {
    "designs/thumb.tsx": `export const FORMAT = { width: 80, height: 40, name: "thumb.png" };
interface Props { label: string }
function Label({ label }: Props) { return <div style={{ display: "flex", color: "#fff", fontSize: 12 }}>{label}</div>; }
export default function () {
  return <div style={{ width: 80, height: 40, background: "#222", display: "flex" }}><Label label="ok" /></div>;
}`,
  });
  const r = run("render", "designs/thumb.tsx", "--out", "out-tsx");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  await fs.access(path.join(dir, "out-tsx", "thumb.png"));
});

needsFonts(".jsx works with VARIANTS too", async () => {
  await writeFiles(dir, {
    "jsxvariants/series.jsx": `export const FORMAT = { width: 40, height: 30, name: "series.png" };
export const VARIANTS = [{ id: "a" }, { id: "b" }];
export default function (variant) {
  return <div style={{ width: 40, height: 30, display: "flex" }}>{variant.id}</div>;
}`,
  });
  const r = run("render", "jsxvariants/series.jsx", "--out", "out-jsx-variants");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const files = (await fs.readdir(path.join(dir, "out-jsx-variants"))).sort();
  assert.deepEqual(files, ["series-a.png", "series-b.png"]);
});

needsFonts("a --scale 2 render's real pixel size is what matchFormat resolves as scale 2 of the base format", async () => {
  await writeFiles(dir, { "designs/li.mjs": validDesign({ name: "li.png", width: 1584, height: 396 }) });
  const r = run("render", "designs/li.mjs", "--out", "out-li-scale", "--scale", "2");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const png = await fs.readFile(path.join(dir, "out-li-scale", "li@2x.png"));
  const [w, h] = [png.readUInt32BE(16), png.readUInt32BE(20)];
  assert.deepEqual([w, h], [3168, 792]); // 1584×396 × 2 — the real file matchFormat would see if fed its size

  const { matchFormat } = await import("../src/guides.mjs");
  const match = matchFormat(w, h); // guides.test.mjs already covers this unit-level; this ties it to a real rendered file
  assert.equal(match.format.id, "linkedin-cover");
  assert.equal(match.scale, 2);
});

test("--help prints usage and exits 0; --version prints the core version", () => {
  const h = run("--help");
  assert.equal(h.status, 0);
  for (const cmd of ["render", "check", "guides", "formats", "watch", "alpha"]) assert.match(h.stdout, new RegExp(cmd));
  const v = run("--version");
  assert.equal(v.status, 0);
  assert.match(v.stdout, /^snap-x \(core \d+\.\d+\.\d+/);
});

test("formats lists every platform format and flags what matters", () => {
  const r = run("formats");
  assert.equal(r.status, 0);
  for (const id of ["youtube-thumbnail", "x-header", "linkedin-cover", "google-play-feature-graphic", "app-store-iphone-6.9"]) assert.match(r.stdout, new RegExp(id));
  assert.match(r.stdout, /1320×2868/);
  assert.match(r.stdout, /no-alpha/);
});

test("formats <id> shows details and zones; aliases and WxH work; --json is valid; unknown exits 1", () => {
  const d = run("formats", "linkedin-cover");
  assert.equal(d.status, 0);
  assert.match(d.stdout, /circle \(160,396\) r=115/);
  assert.match(d.stdout, /mobile crop/);
  assert.match(run("formats", "thumbnail").stdout, /youtube-thumbnail/);
  assert.match(run("formats", "1320x2868").stdout, /app-store-iphone-6\.9/);
  const json = JSON.parse(run("formats", "--json").stdout.slice(run("formats", "--json").stdout.indexOf("[")));
  assert.ok(Array.isArray(json) && json.some((f) => f.id === "og"));
  const bad = run("formats", "nope");
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /Unknown format/);
});

needsFonts("guides writes an overlay and a mobile crop for a LinkedIn-size design", async () => {
  await writeFiles(dir, { "li/cover.mjs": `export const FORMAT = { width: 1584, height: 396, name: "cover.png" };
export default { type: "div", props: { style: { display: "flex", width: 1584, height: 396, background: "#111" }, children: [] } };` });
  const r = run("guides", "li/cover.mjs", "--out", "guides-out");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /linkedin-cover/);
  const files = (await fs.readdir(path.join(dir, "guides-out"))).sort();
  assert.deepEqual(files, ["cover.guides.png", "cover.mobile.png"]);
});

needsFonts("FORMAT alpha:false renders a real RGB PNG (colour type 2, no alpha channel)", async () => {
  await writeFiles(dir, { "store/shot.mjs": `export const FORMAT = { width: 120, height: 200, name: "shot.png", alpha: false };
export default { type: "div", props: { style: { display: "flex", width: 120, height: 200, background: "#ff5a36" }, children: [] } };` });
  const r = run("render", "store/shot.mjs", "--out", "store-out");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const png = await fs.readFile(path.join(dir, "store-out", "shot.png"));
  assert.equal(png[25], 2, "IHDR colour type must be 2 (RGB), not 6 (RGBA)");
});

needsFonts("emoji render as Twemoji images: no blank-box warning and no load failure", async () => {
  await writeFiles(dir, { "emoji/e.mjs": `export const FORMAT = { width: 300, height: 80, name: "e.png" };
export default { type: "div", props: { style: { display: "flex", width: 300, height: 80, fontSize: 36, fontFamily: "Inter" }, children: ["Ship 🚀 ⚡ 🇮🇳"] } };` });
  const c = run("check", "emoji/e.mjs");
  assert.equal(c.status, 0, c.stdout);
  assert.doesNotMatch(c.stdout, /blank boxes/);
  const r = run("render", "emoji/e.mjs", "--out", "emoji-out");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.doesNotMatch(r.stdout + r.stderr, /couldn't load emoji/);
});
