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

test(".jsx compiles to Satori's tree shape: fragments splice in, falsy children are dropped, numbers become text", async () => {
  const p = path.join(dir, "comp.jsx");
  await writeFiles(dir, {
    "comp.jsx": `export const FORMAT = { width: 10, height: 10, name: "jsx.png" };
export default function () {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex" }}>{1 + 1}</div>
      {false}
      {null}
      <>
        <div style={{ display: "flex" }}>a</div>
        <div style={{ display: "flex" }}>b</div>
      </>
    </div>
  );
}`,
  });
  const mod = await loadDesignModule(p);
  const tree = mod.default();
  assert.equal(tree.type, "div");
  assert.equal(tree.props.children.length, 3); // the "2" node + the 2 fragment children; false/null dropped
  assert.equal(tree.props.children[0].props.children[0], "2");
  assert.equal(tree.props.children[1].props.children[0], "a");
  assert.equal(tree.props.children[2].props.children[0], "b");
});

test(".tsx strips type annotations and supports a local component", async () => {
  const p = path.join(dir, "comp.tsx");
  await writeFiles(dir, {
    "comp.tsx": `interface Props { label: string }
export const FORMAT = { width: 10, height: 10 };
function Label({ label }: Props) { return <div style={{ display: "flex" }}>{label}</div>; }
export default () => <div style={{ display: "flex" }}><Label label="hi" /></div>;`,
  });
  const tree = (await loadDesignModule(p)).default();
  assert.equal(tree.props.children[0].props.children[0], "hi");
});

test(".jsx resolves a relative helper import against its own directory, like .mjs", async () => {
  await writeFiles(dir, {
    "jsxhelper/_theme.mjs": `export const BG = "#123456";`,
    "jsxhelper/og.jsx": `import { BG } from "./_theme.mjs";
export const FORMAT = { width: 10, height: 10 };
export default () => <div style={{ display: "flex", background: BG }} />;`,
  });
  const tree = (await loadDesignModule(path.join(dir, "jsxhelper/og.jsx"))).default();
  assert.equal(tree.props.style.background, "#123456");
});

test(".jsx leaves no temp file behind in its directory after loading", async () => {
  const jsxDir = path.join(dir, "jsxtemp");
  await writeFiles(dir, { "jsxtemp/og.jsx": `export const FORMAT = { width: 10, height: 10 };
export default () => <div style={{ display: "flex" }} />;` });
  await loadDesignModule(path.join(jsxDir, "og.jsx"));
  assert.deepEqual(await fs.readdir(jsxDir), ["og.jsx"]);
});

test("a .jsx syntax error rejects with a message naming the file and the problem", async () => {
  await writeFiles(dir, { "broken.jsx": `export default () => <div>unterminated` });
  await assert.rejects(loadDesignModule(path.join(dir, "broken.jsx")), /broken\.jsx.*Unexpected end of file/s);
});
