import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import { emojiCode, loadEmoji, loadAdditionalAsset, resetEmojiCache } from "../src/emoji.mjs";
import { isolateCache } from "./helpers.mjs";

const realFetch = globalThis.fetch;
let requests, failFor, cacheCtx;
const svgFor = (code) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><!-- ${code} --></svg>`;
const decode = (uri) => Buffer.from(uri.split(",")[1], "base64").toString();

beforeEach(async () => {
  cacheCtx = await isolateCache();
  resetEmojiCache();
  requests = [];
  failFor = new Set();
  globalThis.fetch = async (url) => {
    requests.push(url);
    const m = String(url).match(/(jdecked|twitter)\/twemoji@latest\/assets\/svg\/(.+)\.svg$/);
    const code = m?.[2];
    if (!m || failFor.has(`${m[1]}:${code}`) || failFor.has(code)) return new Response("nope", { status: 404 });
    return new Response(svgFor(code));
  };
  mock.method(console, "warn", () => {});
});

afterEach(async () => {
  globalThis.fetch = realFetch;
  mock.restoreAll();
  await cacheCtx.cleanup();
});

test("emojiCode: hex code points joined by '-'", () => {
  assert.equal(emojiCode("🚀"), "1f680");
  assert.equal(emojiCode("🇮🇳"), "1f1ee-1f1f3");
});

test("emojiCode strips the variation selector, except inside ZWJ sequences", () => {
  assert.equal(emojiCode("❤️"), "2764");
  assert.equal(emojiCode("👩‍💻"), "1f469-200d-1f4bb");
  assert.equal(emojiCode("🏳️‍🌈"), "1f3f3-fe0f-200d-1f308");
});

test("loadEmoji returns a base64 SVG data URI of the matching Twemoji file", async () => {
  const uri = await loadEmoji("🚀");
  assert.match(uri, /^data:image\/svg\+xml;base64,/);
  assert.equal(decode(uri), svgFor("1f680"));
  assert.match(requests[0], /jdecked\/twemoji@latest\/assets\/svg\/1f680\.svg$/);
});

test("results are memoised: the same emoji is fetched once", async () => {
  await loadEmoji("🚀");
  await loadEmoji("🚀");
  assert.equal(requests.length, 1);
});

test("and cached on disk: a new process (memo cleared) needs no network", async () => {
  await loadEmoji("🚀");
  resetEmojiCache();
  globalThis.fetch = async () => { throw new Error("offline"); };
  assert.equal(decode(await loadEmoji("🚀")), svgFor("1f680"));
});

test("falls back to the second CDN source when the first 404s", async () => {
  failFor.add("jdecked:1f680");
  const uri = await loadEmoji("🚀");
  assert.equal(decode(uri), svgFor("1f680"));
  assert.equal(requests.length, 2);
  assert.match(requests[1], /twitter\/twemoji/);
});

test("if every source fails: null, one warning (even if asked repeatedly), and nothing cached", async () => {
  failFor.add("1f680");
  assert.equal(await loadEmoji("🚀"), null);
  assert.equal(await loadEmoji("🚀"), null);
  assert.equal(console.warn.mock.callCount(), 1);
  assert.match(console.warn.mock.calls[0].arguments[0], /1f680/);
  assert.deepEqual(await fs.readdir(cacheCtx.dir), []);
});

test("a response that isn't an SVG is rejected", async () => {
  globalThis.fetch = async () => new Response("<html>captcha</html>");
  assert.equal(await loadEmoji("🎉"), null);
});

test("loadAdditionalAsset: emoji → image, anything else → no assets", async () => {
  assert.match(await loadAdditionalAsset("emoji", "⚡"), /^data:image\/svg\+xml/);
  assert.deepEqual(await loadAdditionalAsset("ja-JP", "你"), []);
});

test("loadAdditionalAsset returns no assets (blank box) when the emoji can't be loaded", async () => {
  failFor.add("1f680");
  assert.deepEqual(await loadAdditionalAsset("emoji", "🚀"), []);
});
