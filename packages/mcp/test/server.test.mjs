import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SERVER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/index.mjs");
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let client, dir, cacheDir, fontsReachable = false;

const design = (name, body) => `export const FORMAT = { width: 200, height: 80, name: "${name}.png" };\nexport default ${body};`;
const okTree = (text) => `{ type: "div", props: { style: { display: "flex", fontFamily: "Inter", fontSize: 24, width: 200, height: 80 }, children: [${JSON.stringify(text)}] } }`;
const call = (name, args) => client.callTool({ name, arguments: args });
const text = (r) => r.content.map((c) => c.text).join("\n");

before(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "snapx-mcp-"));
  cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), "snapx-mcp-cache-"));
  await fs.writeFile(path.join(dir, "ok.mjs"), design("ok", okTree("Hello")));
  await fs.writeFile(path.join(dir, "grid.mjs"), design("grid", `{ type: "div", props: { style: { display: "grid" }, children: [] } }`));
  await fs.writeFile(path.join(dir, "li.mjs"), design("li", okTree("banner")).replace("width: 200, height: 80 }", "width: 1584, height: 396 }").replace("{ width: 200, height: 80,", "{ width: 1584, height: 396,"));
  await fs.writeFile(path.join(dir, "glyph.mjs"), design("glyph", okTree("Sent ◷")));
  try {
    const res = await fetch("https://fonts.googleapis.com/css2?family=Inter:wght@400", { signal: AbortSignal.timeout(5000) });
    fontsReachable = res.ok;
  } catch {}
  client = new Client({ name: "snapx-mcp-test", version: "1.0.0" });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [SERVER], env: { ...process.env, SNAP_X_CACHE_DIR: cacheDir } }));
});

after(async () => {
  await client?.close();
  await fs.rm(dir, { recursive: true, force: true });
  await fs.rm(cacheDir, { recursive: true, force: true });
});

// Tools that load fonts need Google Fonts; skip (not fail) offline.
const needsFonts = (name, fn) => test(name, async (t) => { if (!fontsReachable) return t.skip("Google Fonts unreachable"); await fn(); });

test("advertises tools, resources and prompts", () => {
  const caps = client.getServerCapabilities();
  assert.ok(caps.tools && caps.resources && caps.prompts);
});

test("lists render_designs, check_designs, preview_guides and list_formats; file tools require `files`", async () => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), ["check_designs", "list_formats", "preview_guides", "render_designs"]);
  for (const name of ["render_designs", "check_designs", "preview_guides"]) {
    assert.deepEqual(tools.find((t) => t.name === name).inputSchema.required, ["files"]);
  }
});

test("render_designs points agents at the design guide", async () => {
  const { tools } = await client.listTools();
  assert.match(tools.find((t) => t.name === "render_designs").description, /snap-x:\/\/design-guide/);
});

test("list_formats returns the platform table with sizes and no-alpha flags", async () => {
  const r = await call("list_formats", {});
  assert.ok(!r.isError);
  const t = text(r);
  for (const id of ["youtube-thumbnail", "x-header", "linkedin-cover", "google-play-feature-graphic", "app-store-iphone-6.9"]) assert.match(t, new RegExp(id));
  assert.match(t, /app-store-iphone-6\.9\s+1320×2868\s+App Store iPhone 6\.9″? screenshot\s+\[no-alpha\]|1320×2868/);
  assert.match(t, /no-alpha/);
});

test("list_formats with `format` returns notes and placement zones; aliases work; unknown is an error", async () => {
  const d = text(await call("list_formats", { format: "linkedin-cover" }));
  assert.match(d, /circle \(160,396\) r=115/);
  assert.match(d, /safe/);
  assert.match(d, /mobile crop/);
  assert.match(text(await call("list_formats", { format: "thumbnail" })), /youtube-thumbnail/);
  assert.match(text(await call("list_formats", { format: "app-store-iphone-6.9" })), /no alpha channel/);
  const bad = await call("list_formats", { format: "nope" });
  assert.equal(bad.isError, true);
});

test("unknown tool is an error result, not a crash", async () => {
  const r = await call("nope", {});
  assert.equal(r.isError, true);
  assert.match(text(r), /Unknown tool/);
});

test("check_designs and render_designs reject an empty file list", async () => {
  for (const name of ["check_designs", "render_designs", "preview_guides"]) {
    const r = await call(name, { files: [] });
    assert.equal(r.isError, true, name);
    assert.match(text(r), /No files/);
  }
});

needsFonts("check_designs passes a valid design", async () => {
  const r = await call("check_designs", { files: [path.join(dir, "ok.mjs")] });
  assert.ok(!r.isError, text(r));
  assert.match(text(r), /✅\s+ok\.mjs/);
});

needsFonts("check_designs reports structural errors and sets isError", async () => {
  const r = await call("check_designs", { files: [path.join(dir, "grid.mjs")] });
  assert.equal(r.isError, true);
  assert.match(text(r), /display:"grid" not supported/);
});

needsFonts("check_designs warns about characters no font can draw (blank boxes)", async () => {
  const r = await call("check_designs", { files: [path.join(dir, "glyph.mjs")] });
  assert.ok(!r.isError, "a warning is not an error");
  assert.match(text(r), /"◷"/);
  assert.match(text(r), /blank boxes/);
});

needsFonts("render_designs writes a real PNG named by FORMAT.name into outDir", async () => {
  const outDir = path.join(dir, "out");
  const r = await call("render_designs", { files: [path.join(dir, "ok.mjs")], outDir });
  assert.ok(!r.isError, text(r));
  assert.match(text(r), /ok\.png/);
  const png = await fs.readFile(path.join(outDir, "ok.png"));
  assert.deepEqual(png.subarray(0, 8), PNG);
  assert.equal(png.readUInt32BE(16), 200);
  assert.equal(png.readUInt32BE(20), 80);
});

needsFonts("preview_guides writes a guides overlay and a mobile crop for a LinkedIn-size design", async () => {
  const outDir = path.join(dir, "guides");
  const r = await call("preview_guides", { files: [path.join(dir, "li.mjs")], outDir });
  assert.ok(!r.isError, text(r));
  assert.match(text(r), /li\.guides\.png/);
  assert.deepEqual((await fs.readdir(outDir)).sort(), ["li.guides.png", "li.mobile.png"]);
});

needsFonts("preview_guides says so when no design matches a format with zones", async () => {
  const r = await call("preview_guides", { files: [path.join(dir, "ok.mjs")], outDir: path.join(dir, "guides2") });
  assert.ok(!r.isError);
  assert.match(text(r), /No guide images written/);
});

needsFonts("check_designs lets emoji through but warns about symbols no font has", async () => {
  await fs.writeFile(path.join(dir, "emoji.mjs"), design("emoji", okTree("Ship 🚀")));
  const r = await call("check_designs", { files: [path.join(dir, "emoji.mjs")] });
  assert.ok(!r.isError);
  assert.doesNotMatch(text(r), /blank boxes/);
});

test("exposes the design guide as a markdown resource", async () => {
  const { resources } = await client.listResources();
  const guide = resources.find((r) => r.uri === "snap-x://design-guide");
  assert.ok(guide);
  assert.equal(guide.mimeType, "text/markdown");
  const { contents } = await client.readResource({ uri: "snap-x://design-guide" });
  const body = contents[0].text;
  for (const must of ["display: \"flex\"", "blank box", "whiteSpace: \"nowrap\"", "import.meta.url", "FORMAT", "invent", "alpha: false", "preview_guides", "list_formats", "Emoji work"]) {
    assert.ok(body.includes(must), `guide should mention ${must}`);
  }
});

test("reading an unknown resource fails", async () => {
  await assert.rejects(client.readResource({ uri: "snap-x://nope" }), /Unknown resource/);
});

test("design_cards prompt embeds the source, formats and the guide", async () => {
  const { prompts } = await client.listPrompts();
  const p = prompts.find((x) => x.name === "design_cards");
  assert.ok(p);
  assert.deepEqual(p.arguments.filter((a) => a.required).map((a) => a.name), ["source"]);
  const r = await client.getPrompt({ name: "design_cards", arguments: { source: "https://example.com", formats: "OG 1200x630" } });
  const msg = r.messages[0].content.text;
  assert.equal(r.messages[0].role, "user");
  assert.match(msg, /https:\/\/example\.com/);
  assert.match(msg, /OG 1200x630/);
  assert.match(msg, /snap-x design guide/);
  assert.match(msg, /check_designs/);
});

test("design_cards works without optional arguments, and unknown prompts fail", async () => {
  const r = await client.getPrompt({ name: "design_cards", arguments: { source: "my repo" } });
  assert.ok(!/Formats:/.test(r.messages[0].content.text));
  await assert.rejects(client.getPrompt({ name: "nope" }), /Unknown prompt/);
});
