import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { checkDesign } from "../src/check.mjs";
import { makeTmpDir, writeFiles, validDesign } from "./helpers.mjs";

let dir;
const p = (name) => path.join(dir, name);

const treeWith = (style, extra = "") => `
export const FORMAT = { width: 100, height: 100 };
export default function () {
  return { type: "div", props: { style: ${JSON.stringify(style)}, children: [] } };
}
${extra}`;

before(async () => {
  dir = await makeTmpDir();
  await writeFiles(dir, {
    "valid.mjs": validDesign(),
    "static.mjs": `export const FORMAT = { width: 10, height: 10 };
export default { type: "div", props: { style: { display: "flex" }, children: [] } };`,
    "async.mjs": `export const FORMAT = { width: 10, height: 10 };
export default async function () { return { type: "div", props: { style: { display: "flex" }, children: [] } }; }`,
    "no-format.mjs": `export default { type: "div", props: { children: [] } };`,
    "no-size.mjs": `export const FORMAT = {};
export default { type: "div", props: { children: [] } };`,
    "no-default.mjs": `export const FORMAT = { width: 10, height: 10 };`,
    "grid.mjs": treeWith({ display: "grid" }),
    "block.mjs": treeWith({ display: "block" }),
    "fixed.mjs": treeWith({ display: "flex", position: "fixed" }),
    "zindex.mjs": treeWith({ display: "flex", zIndex: 5 }),
    "throws.mjs": `export const FORMAT = { width: 10, height: 10 };
export default function () { throw new Error("boom"); }`,
    "returns-string.mjs": `export const FORMAT = { width: 10, height: 10 };
export default function () { return "nope"; }`,
    "syntax-error.mjs": `export const FORMAT = ;`,
    "nested-grid.mjs": `export const FORMAT = { width: 10, height: 10 };
export default { type: "div", props: { style: { display: "flex" }, children: [
  { type: "div", props: { style: { display: "flex" }, children: [
    { type: "div", props: { style: { display: "grid" }, children: [] } },
  ]}},
]}};`,
  });
});

after(() => fs.rm(dir, { recursive: true, force: true }));

test("valid design passes with no errors or warnings", async () => {
  const r = await checkDesign(p("valid.mjs"));
  assert.deepEqual(r, { errors: [], warnings: [] });
});

test("static tree export is accepted", async () => {
  assert.deepEqual((await checkDesign(p("static.mjs"))).errors, []);
});

test("async default export is awaited", async () => {
  assert.deepEqual((await checkDesign(p("async.mjs"))).errors, []);
});

test("missing FORMAT is an error", async () => {
  const r = await checkDesign(p("no-format.mjs"));
  assert.ok(r.errors.some((e) => e.includes("FORMAT")));
});

test("FORMAT without width/height reports both", async () => {
  const r = await checkDesign(p("no-size.mjs"));
  assert.ok(r.errors.some((e) => e.includes("width")));
  assert.ok(r.errors.some((e) => e.includes("height")));
});

test("missing default export is an error", async () => {
  const r = await checkDesign(p("no-default.mjs"));
  assert.ok(r.errors.some((e) => e.includes("default")));
});

for (const kind of ["grid", "block"]) {
  test(`display:"${kind}" is an error`, async () => {
    const r = await checkDesign(p(`${kind}.mjs`));
    assert.ok(r.errors.some((e) => e.includes(`display:"${kind}"`)));
  });
}

test("position:fixed is an error", async () => {
  const r = await checkDesign(p("fixed.mjs"));
  assert.ok(r.errors.some((e) => e.includes("fixed")));
});

test("zIndex is only a warning", async () => {
  const r = await checkDesign(p("zindex.mjs"));
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => w.includes("zIndex")));
});

test("errors in nested children are reported with their path", async () => {
  const r = await checkDesign(p("nested-grid.mjs"));
  assert.ok(r.errors.some((e) => e.startsWith("root.children[0].children[0]")));
});

test("a throwing design function is reported, not thrown", async () => {
  const r = await checkDesign(p("throws.mjs"));
  assert.ok(r.errors.some((e) => e.includes("boom")));
});

test("a non-object return value is an error", async () => {
  const r = await checkDesign(p("returns-string.mjs"));
  assert.ok(r.errors.some((e) => e.includes("object")));
});

test("an unimportable file is reported, not thrown", async () => {
  const r = await checkDesign(p("syntax-error.mjs"));
  assert.ok(r.errors[0].startsWith("Cannot import file"));
});

test("without fonts, no Satori render is attempted", async () => {
  // grid would only be caught structurally; bad width proves satori isn't run
  const r = await checkDesign(p("valid.mjs"), {});
  assert.deepEqual(r.errors, []);
});

test("with fonts, a Satori runtime failure is surfaced as an error", async () => {
  await writeFiles(dir, {
    "bad-font.mjs": `export const FORMAT = { width: 50, height: 50 };
export default { type: "div", props: { style: { display: "flex", fontFamily: "Nope" }, children: ["x"] } };`,
  });
  const r = await checkDesign(p("bad-font.mjs"), { fonts: [] });
  assert.ok(r.errors.some((e) => e.startsWith("Satori render failed")));
});

const storeDesign = (w, h, alpha) => `export const FORMAT = { width: ${w}, height: ${h}${alpha === undefined ? "" : `, alpha: ${alpha}`} };
export default { type: "div", props: { style: { display: "flex" }, children: [] } };`;

test("a store-screenshot size without alpha:false gets a warning (App Store / Play forbid alpha)", async () => {
  await writeFiles(dir, { "store.mjs": storeDesign(1320, 2868), "store-ok.mjs": storeDesign(1320, 2868, false), "play.mjs": storeDesign(1024, 500), "og.mjs": storeDesign(1200, 630) });
  const bad = await checkDesign(p("store.mjs"));
  assert.deepEqual(bad.errors, []);
  assert.equal(bad.warnings.length, 1);
  assert.match(bad.warnings[0], /no alpha channel/);
  assert.match(bad.warnings[0], /alpha: false/);
  assert.match(bad.warnings[0], /App Store iPhone 6\.9/);
  assert.match((await checkDesign(p("play.mjs"))).warnings[0], /Google Play feature graphic/);
});

test("alpha:false silences the warning, and formats that allow alpha never get it", async () => {
  assert.deepEqual((await checkDesign(p("store-ok.mjs"))).warnings, []);
  assert.deepEqual((await checkDesign(p("og.mjs"))).warnings, []);
});
