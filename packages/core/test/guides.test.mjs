import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { matchFormat, guidesTree, mobileTree, renderGuides } from "../src/guides.mjs";
import { findFormat } from "../src/formats.mjs";
import { loadGoogleFont } from "../src/fonts.mjs";
import { makeTmpDir, writeFiles, isolateCache } from "./helpers.mjs";

const li = findFormat("linkedin-cover");
const leaf = { type: "div", props: { style: { display: "flex" }, children: ["x"] } };
const kids = (node) => node.props.children;

test("matchFormat: exact size, explicit id, uniformly scaled size, and unknown", () => {
  assert.deepEqual(matchFormat(1584, 396), { format: li, scale: 1 });
  assert.equal(matchFormat(3168, 792).format.id, "linkedin-cover");
  assert.equal(matchFormat(3168, 792).scale, 2);
  assert.equal(matchFormat(999, 999, "linkedin-cover").scale, 999 / 1584);
  assert.equal(matchFormat(999, 999), null);
  assert.equal(matchFormat(1584, 396, "not-a-format"), null);
});

test("guidesTree keeps the design first and adds one overlay layer with a box per zone", () => {
  const t = guidesTree(leaf, li, { width: 1584, height: 396, scale: 1, fontFamily: "Inter" });
  assert.equal(kids(t)[0], leaf, "the original design is untouched and underneath");
  const layer = kids(kids(t)[1]);
  assert.equal(layer.length, li.avoid.length + 1, "avoid zones + the safe area");
});

test("circle zones are round and positioned by their bounding box", () => {
  const t = guidesTree(leaf, li, { width: 1584, height: 396, scale: 1, fontFamily: "Inter" });
  const circle = kids(kids(t)[1]).find((n) => n.props.style.borderRadius === 9999);
  assert.equal(circle.props.style.left, 160 - 115);
  assert.equal(circle.props.style.top, 396 - 115);
  assert.equal(circle.props.style.width, 230);
});

test("zone coordinates scale for an @2x design", () => {
  const t = guidesTree(leaf, li, { width: 3168, height: 792, scale: 2, fontFamily: "Inter" });
  const circle = kids(kids(t)[1]).find((n) => n.props.style.borderRadius === 9999);
  assert.equal(circle.props.style.left, (160 - 115) * 2);
  assert.equal(circle.props.style.width, 460);
});

test("the safe area is drawn dashed", () => {
  const t = guidesTree(leaf, li, { width: 1584, height: 396, scale: 1, fontFamily: "Inter" });
  assert.ok(kids(kids(t)[1]).some((n) => /dashed/.test(n.props.style.border ?? "")));
});

test("mobileTree crops to the format's visible strip", () => {
  const t = mobileTree(leaf, li, { width: 1584, height: 396, scale: 1 });
  assert.equal(t.props.style.width, 1184);
  assert.equal(t.props.style.overflow, "hidden");
  assert.equal(kids(t)[0].props.style.left, -200);
  const t2 = mobileTree(leaf, li, { width: 3168, height: 792, scale: 2 });
  assert.equal(t2.props.style.width, 2368);
  assert.equal(kids(t2)[0].props.style.left, -400);
});

// ── end to end (needs Google Fonts for a real render; skipped offline) ──
let dir, cache, inter = null;
before(async () => {
  dir = await makeTmpDir();
  cache = await isolateCache();
  try { inter = [{ name: "Inter", weight: 400, style: "normal", data: await Promise.race([loadGoogleFont("Inter", 400), new Promise((_, r) => setTimeout(() => r(new Error("t")), 8000))]) }]; } catch {}
  const d = (w, h, name) => `export const FORMAT = { width: ${w}, height: ${h}, name: "${name}" };
export default { type: "div", props: { style: { display: "flex", width: ${w}, height: ${h}, background: "#123", color: "#fff", fontFamily: "Inter", fontSize: 30 }, children: ["hello"] } };`;
  await writeFiles(dir, { "li.mjs": d(1584, 396, "li.png"), "odd.mjs": d(777, 333, "odd.png"), "og.mjs": d(1200, 630, "og.png") });
});
after(async () => { await fs.rm(dir, { recursive: true, force: true }); await cache.cleanup(); });
const gated = (name, fn) => test(name, async (t) => { if (!inter) return t.skip("Google Fonts unreachable"); await fn(); });
const pngSize = async (p) => { const b = await fs.readFile(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

gated("renderGuides writes an overlay at the design's size and a mobile crop at the crop's size", async () => {
  const out = path.join(dir, "o1"); await fs.mkdir(out);
  const written = await renderGuides(path.join(dir, "li.mjs"), out, inter);
  assert.deepEqual(written.map((p) => path.basename(p)), ["li.guides.png", "li.mobile.png"]);
  assert.deepEqual(await pngSize(written[0]), [1584, 396]);
  assert.deepEqual(await pngSize(written[1]), [1184, 396]);
});

gated("an unknown size is skipped with a hint; --format forces a match", async () => {
  const out = path.join(dir, "o2"); await fs.mkdir(out);
  assert.deepEqual(await renderGuides(path.join(dir, "odd.mjs"), out, inter), []);
  const forced = await renderGuides(path.join(dir, "odd.mjs"), out, inter, { formatId: "linkedin-cover" });
  assert.equal(forced.length, 2);
});

gated("a format with no placement zones (og) writes nothing", async () => {
  const out = path.join(dir, "o3"); await fs.mkdir(out);
  assert.deepEqual(await renderGuides(path.join(dir, "og.mjs"), out, inter), []);
  assert.deepEqual(await fs.readdir(out), []);
});
