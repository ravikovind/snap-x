import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { resolveDesignFiles } from "../src/resolve.mjs";
import { makeTmpDir, writeFiles } from "./helpers.mjs";

let dir;
const base = (files) => files.map((f) => path.basename(f));

before(async () => {
  dir = await makeTmpDir();
  await writeFiles(dir, {
    "og.mjs": "",
    "cover.mjs": "",
    "poster.mjs": "",
    "notes.txt": "",
    "readme.md": "",
    "sub/nested.mjs": "",
  });
});

after(() => fs.rm(dir, { recursive: true, force: true }));

test("resolves a literal file path", async () => {
  const out = await resolveDesignFiles([path.join(dir, "og.mjs")]);
  assert.deepEqual(base(out), ["og.mjs"]);
});

test("expands a directory to its .mjs files only, non-recursively", async () => {
  const out = await resolveDesignFiles([dir]);
  assert.deepEqual(base(out), ["cover.mjs", "og.mjs", "poster.mjs"]);
});

test("expands a trailing-* glob", async () => {
  const out = await resolveDesignFiles([path.join(dir, "*.mjs")]);
  assert.deepEqual(base(out), ["cover.mjs", "og.mjs", "poster.mjs"]);
});

test("glob with a prefix only matches that prefix", async () => {
  const out = await resolveDesignFiles([path.join(dir, "p*.mjs")]);
  assert.deepEqual(base(out), ["poster.mjs"]);
});

test("glob never matches non-.mjs files", async () => {
  const out = await resolveDesignFiles([path.join(dir, "*")]);
  assert.ok(base(out).every((f) => f.endsWith(".mjs")));
});

test("ignores paths that do not exist", async () => {
  const out = await resolveDesignFiles([path.join(dir, "missing.mjs"), path.join(dir, "nope", "*.mjs")]);
  assert.deepEqual(out, []);
});

test("dedupes overlapping patterns", async () => {
  const out = await resolveDesignFiles([dir, path.join(dir, "*.mjs"), path.join(dir, "og.mjs")]);
  assert.equal(out.length, 3);
});

test("returns absolute paths", async () => {
  const out = await resolveDesignFiles([path.join(dir, "og.mjs")]);
  assert.ok(path.isAbsolute(out[0]));
});

test("regex metacharacters in a glob are treated literally", async () => {
  await writeFiles(dir, { "a.b.mjs": "", "axb.mjs": "" });
  const out = await resolveDesignFiles([path.join(dir, "a.b*")]);
  assert.deepEqual(base(out), ["a.b.mjs"]);
});

test("underscore-prefixed helper files are skipped in directories and globs", async () => {
  await writeFiles(dir, { "_shared.mjs": "", "sub/_helper.mjs": "", "sub/real.mjs": "" });
  assert.ok(!base(await resolveDesignFiles([dir])).includes("_shared.mjs"));
  assert.ok(!base(await resolveDesignFiles([path.join(dir, "*.mjs")])).includes("_shared.mjs"));
  assert.ok(!base(await resolveDesignFiles([path.join(dir, "*")])).includes("_shared.mjs"));
  const sub = base(await resolveDesignFiles([path.join(dir, "sub")]));
  assert.ok(sub.includes("real.mjs") && !sub.includes("_helper.mjs"));
});

test("an underscore file passed explicitly is still resolved", async () => {
  assert.deepEqual(base(await resolveDesignFiles([path.join(dir, "_shared.mjs")])), ["_shared.mjs"]);
});
