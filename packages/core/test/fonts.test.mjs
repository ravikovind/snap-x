import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { resolveFonts, loadGoogleFont, resetFontCache, collectFontsSpec } from "../src/fonts.mjs";
import { makeTmpDir, writeFiles, validDesign } from "./helpers.mjs";

const realFetch = globalThis.fetch;
let fontFileRequests;
let unavailable;

// Fake Google Fonts: CSS endpoint returns a font URL; font URL returns bytes naming family+weight.
function installFetchMock() {
  fontFileRequests = [];
  unavailable = new Set();
  globalThis.fetch = async (url) => {
    const u = new URL(url);
    if (u.hostname === "fonts.googleapis.com") {
      const [family, weight] = [u.searchParams.get("family").split(":")[0], u.searchParams.get("family").match(/wght@(\d+)/)[1]];
      if (unavailable.has(family)) return new Response("nope", { status: 400 });
      return new Response(`src: url(https://fonts.test/${encodeURIComponent(family)}/${weight}.woff2) format('woff2');`);
    }
    fontFileRequests.push(u.pathname);
    return new Response(Buffer.from(`font:${decodeURIComponent(u.pathname.slice(1))}`));
  };
}

const bytes = (entry) => Buffer.from(entry.data).toString();

beforeEach(() => {
  resetFontCache();
  installFetchMock();
  // Silence only resolveFonts' progress line; the test reporter also writes to stdout.
  const realWrite = process.stdout.write.bind(process.stdout);
  mock.method(process.stdout, "write", (chunk, ...rest) =>
    typeof chunk === "string" && chunk.startsWith("  Loading") ? true : realWrite(chunk, ...rest));
  mock.method(console, "log", () => {});
  mock.method(console, "warn", () => {});
});

afterEach(() => {
  globalThis.fetch = realFetch;
  mock.restoreAll();
});

test("defaults to Inter 400/700/900 when no spec is given", async () => {
  const fonts = await resolveFonts();
  assert.deepEqual(fonts.map((f) => [f.name, f.weight]), [["Inter", 400], ["Inter", 700], ["Inter", 900]]);
  assert.ok(fonts.every((f) => f.style === "normal"));
});

test("an empty spec also defaults to Inter", async () => {
  const fonts = await resolveFonts([]);
  assert.equal(fonts[0].name, "Inter");
});

test("weights default to 400/700/900 per family", async () => {
  const fonts = await resolveFonts([{ family: "Saira" }]);
  assert.deepEqual(fonts.map((f) => f.weight), [400, 700, 900]);
});

test("honours the requested weights and families", async () => {
  const fonts = await resolveFonts([
    { family: "Saira", weights: [400] },
    { family: "JetBrains Mono", weights: [700] },
  ]);
  assert.deepEqual(fonts.map((f) => [f.name, f.weight]), [["Saira", 400], ["JetBrains Mono", 700]]);
  assert.equal(bytes(fonts[1]), "font:JetBrains Mono/700.woff2");
});

test("merges repeated families and dedupes overlapping weights", async () => {
  const fonts = await resolveFonts([
    { family: "Saira", weights: [400, 700] },
    { family: "Saira", weights: [700, 900] },
  ]);
  assert.deepEqual(fonts.map((f) => f.weight).sort(), [400, 700, 900]);
  assert.equal(fontFileRequests.length, 3, "each family+weight is downloaded once");
});

test("caches across calls within a run", async () => {
  await resolveFonts([{ family: "Saira", weights: [400] }]);
  await resolveFonts([{ family: "Saira", weights: [400] }]);
  assert.equal(fontFileRequests.length, 1);
});

test("resetFontCache forces a re-download", async () => {
  await resolveFonts([{ family: "Saira", weights: [400] }]);
  resetFontCache();
  await resolveFonts([{ family: "Saira", weights: [400] }]);
  assert.equal(fontFileRequests.length, 2);
});

test("an unavailable family falls back to Inter data under the requested name", async () => {
  unavailable.add("Ghost Font");
  const fonts = await resolveFonts([{ family: "Ghost Font", weights: [400] }]);
  assert.equal(fonts[0].name, "Ghost Font", "name stays as requested so the design's fontFamily still matches");
  assert.equal(bytes(fonts[0]), "font:Inter/400.woff2");
  assert.equal(console.warn.mock.callCount(), 1);
});

test("if Inter itself is unavailable the error propagates", async () => {
  unavailable.add("Inter");
  await assert.rejects(loadGoogleFont("Inter", 400), /HTTP 400/);
});

test("a css response with no font url is treated as unavailable", async () => {
  globalThis.fetch = async (url) =>
    new URL(url).hostname === "fonts.googleapis.com"
      ? new Response("/* nothing */")
      : new Response(Buffer.from("x"));
  await assert.rejects(loadGoogleFont("Inter", 400), /font URL not found/);
});

test("collectFontsSpec gathers FONTS exports across files and skips files without one", async () => {
  const dir = await makeTmpDir();
  try {
    await writeFiles(dir, {
      "a.mjs": validDesign({ fonts: [{ family: "Saira", weights: [400] }] }),
      "b.mjs": validDesign({ fonts: [{ family: "Inter", weights: [700] }, { family: "Lora" }] }),
      "c.mjs": validDesign(),
    });
    const spec = await collectFontsSpec(["a.mjs", "b.mjs", "c.mjs"].map((f) => path.join(dir, f)));
    assert.deepEqual(spec.map((s) => s.family), ["Saira", "Inter", "Lora"]);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
