import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { collectText, loadFallbackFonts } from "../src/fallback.mjs";
import { resetFontCache } from "../src/fonts.mjs";
import { isolateCache } from "./helpers.mjs";

const realFetch = globalThis.fetch;
let cssRequests;
let failFamilies;
let cacheCtx;

const node = (...children) => ({ type: "div", props: { children } });
const inter = (...weights) => weights.map((weight) => ({ name: "Inter", data: new ArrayBuffer(1), weight, style: "normal" }));
const bytes = (entry) => Buffer.from(entry.data).toString();

beforeEach(async () => {
  cacheCtx = await isolateCache();
  resetFontCache();
  cssRequests = [];
  failFamilies = new Set();
  globalThis.fetch = async (url) => {
    const u = new URL(url);
    if (u.hostname === "fonts.googleapis.com") {
      const family = u.searchParams.get("family").split(":")[0];
      const weight = u.searchParams.get("family").match(/wght@(\d+)/)[1];
      cssRequests.push({ family, weight, text: u.searchParams.get("text") });
      if (failFamilies.has(family)) return new Response("no", { status: 400 });
      return new Response(`src: url(https://fonts.test/${encodeURIComponent(family)}/${weight}.ttf) format('truetype');`);
    }
    return new Response(Buffer.from(`font:${decodeURIComponent(u.pathname.slice(1))}`));
  };
  mock.method(console, "log", () => {});
  mock.method(console, "warn", () => {});
});

afterEach(async () => {
  globalThis.fetch = realFetch;
  mock.restoreAll();
  await cacheCtx.cleanup();
});

test("collectText walks nested children, arrays, numbers, and ignores null/boolean", () => {
  const tree = node("Hello ", node(42, [null, false, "wor"], node("ld")));
  assert.equal(collectText(tree), "Hello 42world");
});

test("collectText accepts a single non-array child", () => {
  assert.equal(collectText({ type: "div", props: { children: "solo" } }), "solo");
});

test("plain ASCII text needs no fallback and makes no requests", async () => {
  const extra = await loadFallbackFonts(node("Hello, world 123"), inter(400, 700));
  assert.deepEqual(extra, []);
  assert.equal(cssRequests.length, 0);
});

test("Japanese text loads Noto Sans JP, requesting only the characters used", async () => {
  const extra = await loadFallbackFonts(node("Hi 你好你好"), inter(400));
  assert.equal(extra.length, 1);
  assert.equal(extra[0].name, "Noto Sans JP");
  assert.equal(bytes(extra[0]), "font:Noto Sans JP/400.ttf");
  assert.deepEqual(cssRequests.map((r) => r.text), ["你好"], "deduped, script chars only");
});

test("fallback mirrors the primary fonts' weights", async () => {
  const extra = await loadFallbackFonts(node("你好"), inter(400, 700, 900));
  assert.deepEqual(extra.map((f) => f.weight), [400, 700, 900]);
});

test("with no primary fonts, falls back to weights 400 and 700", async () => {
  const extra = await loadFallbackFonts(node("你好"), []);
  assert.deepEqual(extra.map((f) => f.weight), [400, 700]);
});

test("each script maps to its own family", async () => {
  const cases = {
    "안녕": "Noto Sans KR",
    "مرحبا": "Noto Sans Arabic",
    "שלום": "Noto Sans Hebrew",
    "สวัสดี": "Noto Sans Thai",
    "नमस्ते": "Noto Sans Devanagari",
    "নমস্কার": "Noto Sans Bengali",
  };
  for (const [text, family] of Object.entries(cases)) {
    resetFontCache();
    const extra = await loadFallbackFonts(node(text), inter(400));
    assert.deepEqual([...new Set(extra.map((f) => f.name))], [family], text);
  }
});

test("Hangul is not sent to the Japanese font", async () => {
  const extra = await loadFallbackFonts(node("안녕"), inter(400));
  assert.ok(extra.every((f) => f.name !== "Noto Sans JP"));
});

test("mixed scripts load one family per script", async () => {
  const extra = await loadFallbackFonts(node("你好 مرحبا"), inter(400));
  assert.deepEqual(extra.map((f) => f.name).sort(), ["Noto Sans Arabic", "Noto Sans JP"]);
});

test("Cyrillic/Greek/Latin-extended use Noto Sans, for primary fonts that lack them", async () => {
  const extra = await loadFallbackFonts(node("Привет Γειά Zażółć"), inter(400));
  assert.deepEqual([...new Set(extra.map((f) => f.name))], ["Noto Sans"]);
});

test("an unavailable fallback font warns and is skipped instead of failing the render", async () => {
  failFamilies.add("Noto Sans JP");
  const extra = await loadFallbackFonts(node("你好 مرحبا"), inter(400));
  assert.deepEqual(extra.map((f) => f.name), ["Noto Sans Arabic"], "other scripts still load");
  assert.equal(console.warn.mock.callCount(), 1);
  assert.match(console.warn.mock.calls[0].arguments[0], /Noto Sans JP/);
});

test("results are cached, so a second design with the same text re-uses the download", async () => {
  await loadFallbackFonts(node("你好"), inter(400));
  await loadFallbackFonts(node("你好"), inter(400));
  assert.equal(cssRequests.length, 1);
});
