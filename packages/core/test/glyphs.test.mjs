import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { findUncoveredChars } from "../src/glyphs.mjs";
import { checkDesign } from "../src/check.mjs";
import { loadGoogleFont } from "../src/fonts.mjs";
import { makeTmpDir, writeFiles, isolateCache } from "./helpers.mjs";

// Real Inter (has A, é, →, ★, ✓; lacks ◷, ⌘-style oddities, CJK). Emoji are covered by the emoji renderer. Skipped, not failed, when Google Fonts is unreachable.
let inter = null;
let dir, cache;

before(async () => {
  dir = await makeTmpDir();
  cache = await isolateCache();
  try {
    inter = { name: "Inter", data: await Promise.race([loadGoogleFont("Inter", 400), new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 8000))]), weight: 400, style: "normal" };
  } catch {}
});
after(async () => {
  await fs.rm(dir, { recursive: true, force: true });
  await cache.cleanup();
});

const withFont = (name, fn) => test(name, async (t) => { if (!inter) return t.skip("Google Fonts unreachable"); await fn(); });

withFont("characters the font has are not reported", () => {
  assert.deepEqual(findUncoveredChars("Aé→★", [inter]), []);
});

withFont("characters no font has are reported once each, in order", () => {
  assert.deepEqual(findUncoveredChars("A◷B◷∎", [inter]), ["◷", "∎"]);
});

withFont("whitespace, control characters and zero-width joiners are ignored", () => {
  assert.deepEqual(findUncoveredChars("A B\n\t‍️", [inter]), []);
});

withFont("emoji (incl. flags and ZWJ sequences) are covered by the emoji renderer, not flagged", () => {
  assert.deepEqual(findUncoveredChars("Go 🚀 ⚡ ✔ 🇮🇳 👩‍💻 🎉", [inter]), []);
});

withFont("scripts handled by the automatic fallback are not reported", () => {
  assert.deepEqual(findUncoveredChars("A你こんにちはمرحبا", [inter]), []);
});

withFont("weights of the same family (same data) are parsed and counted once", () => {
  assert.deepEqual(findUncoveredChars("A◷", [inter, { ...inter, weight: 700 }]), ["◷"]);
});

test("an unparseable font makes it stay silent rather than guess", () => {
  assert.deepEqual(findUncoveredChars("◷", [{ name: "X", data: new ArrayBuffer(8), weight: 400, style: "normal" }]), []);
});

test("no fonts → nothing to report", () => {
  assert.deepEqual(findUncoveredChars("◷", []), []);
  assert.deepEqual(findUncoveredChars("◷", undefined), []);
});

const design = (text) => `export const FORMAT = { width: 200, height: 60 };
export default { type: "div", props: { style: { display: "flex", fontFamily: "Inter", fontSize: 24 }, children: [${JSON.stringify(text)}] } };`;

withFont("check warns (not errors) about blank-box characters when fonts are provided", async () => {
  await writeFiles(dir, { "bad.mjs": design("A◷"), "good.mjs": design("Aé→") });
  const bad = await checkDesign(path.join(dir, "bad.mjs"), { fonts: [inter] });
  assert.deepEqual(bad.errors, []);
  assert.equal(bad.warnings.length, 1);
  assert.match(bad.warnings[0], /"◷"/);
  assert.match(bad.warnings[0], /blank boxes/);
  const good = await checkDesign(path.join(dir, "good.mjs"), { fonts: [inter] });
  assert.deepEqual(good, { errors: [], warnings: [] });
});

test("without fonts, check makes no glyph claim", async () => {
  await writeFiles(dir, { "nofont.mjs": design("A◷") });
  const r = await checkDesign(path.join(dir, "nofont.mjs"));
  assert.deepEqual(r.warnings, []);
});
