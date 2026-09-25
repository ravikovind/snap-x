import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { loadDesignModule } from "../src/load.mjs";
import { checkDesign } from "../src/check.mjs";
import { collectFontsSpec } from "../src/fonts.mjs";
import { makeTmpDir, writeFiles } from "./helpers.mjs";

let dir;
const counter = () => globalThis.__snapxLoads ?? 0;
const design = (label = "a") => `globalThis.__snapxLoads = (globalThis.__snapxLoads ?? 0) + 1;
export const FORMAT = { width: 10, height: 10, name: "${label}.png" };
export const FONTS = [{ family: "Saira" }];
export default { type: "div", props: { style: { display: "flex" }, children: [] } };`;

before(async () => { dir = await makeTmpDir(); });
after(() => fs.rm(dir, { recursive: true, force: true }));
beforeEach(() => { globalThis.__snapxLoads = 0; });

test("loading an unchanged file repeatedly runs its top-level code once", async () => {
  const p = path.join(dir, "once.mjs");
  await writeFiles(dir, { "once.mjs": design() });
  await loadDesignModule(p);
  await loadDesignModule(p);
  await loadDesignModule(p);
  assert.equal(counter(), 1);
});

test("collecting fonts and checking the same design imports it once", async () => {
  const p = path.join(dir, "shared.mjs");
  await writeFiles(dir, { "shared.mjs": design() });
  await collectFontsSpec([p]);
  await checkDesign(p);
  assert.equal(counter(), 1);
});

test("an edited file is re-imported and returns its new exports", async () => {
  const p = path.join(dir, "edited.mjs");
  await writeFiles(dir, { "edited.mjs": design("v1") });
  assert.equal((await loadDesignModule(p)).FORMAT.name, "v1.png");
  await fs.writeFile(p, design("version-two")); // different size ⇒ different cache key even on coarse mtimes
  assert.equal((await loadDesignModule(p)).FORMAT.name, "version-two.png");
  assert.equal(counter(), 2);
});

test("different files never share a module", async () => {
  await writeFiles(dir, { "x.mjs": design("x"), "y.mjs": design("y") });
  const [x, y] = await Promise.all(["x.mjs", "y.mjs"].map((f) => loadDesignModule(path.join(dir, f))));
  assert.notEqual(x.FORMAT.name, y.FORMAT.name);
});

test("a missing file rejects", async () => {
  await assert.rejects(loadDesignModule(path.join(dir, "nope.mjs")), { code: "ENOENT" });
});
