import { test } from "node:test";
import assert from "node:assert/strict";
import zlib from "zlib";
import { encodeRgbPng } from "../src/png.mjs";

const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function parse(png) {
  assert.deepEqual(png.subarray(0, 8), SIG);
  const chunks = []; let i = 8;
  while (i < png.length) { const len = png.readUInt32BE(i); chunks.push({ type: png.toString("ascii", i + 4, i + 8), data: png.subarray(i + 8, i + 8 + len), crc: png.readUInt32BE(i + 8 + len), raw: png.subarray(i + 4, i + 8 + len) }); i += 12 + len; }
  return chunks;
}
const crc32 = (buf) => { let c = ~0; for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1; } return ~c >>> 0; };

const rgba = (w, h, px) => { const b = Buffer.alloc(w * h * 4); for (let i = 0; i < w * h; i++) b.set(px(i), i * 4); return b; };

test("writes colour type 2 (RGB, no alpha) with the right dimensions and 8-bit depth", () => {
  const chunks = parse(encodeRgbPng(3, 2, rgba(3, 2, () => [10, 20, 30, 255])));
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  assert.equal(ihdr.readUInt32BE(0), 3); assert.equal(ihdr.readUInt32BE(4), 2);
  assert.equal(ihdr[8], 8); assert.equal(ihdr[9], 2);
  assert.deepEqual(chunks.map((c) => c.type), ["IHDR", "IDAT", "IEND"]);
});

test("every chunk has a valid CRC", () => {
  for (const c of parse(encodeRgbPng(4, 4, rgba(4, 4, (i) => [i * 10, 0, 255 - i, 255])))) assert.equal(c.crc, crc32(c.raw), c.type);
});

test("pixel data round-trips exactly for opaque input", () => {
  const w = 3, h = 2, px = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [1, 2, 3], [250, 200, 0], [9, 9, 9]];
  const png = encodeRgbPng(w, h, rgba(w, h, (i) => [...px[i], 255]));
  const raw = zlib.inflateSync(parse(png).find((c) => c.type === "IDAT").data);
  for (let y = 0; y < h; y++) {
    assert.equal(raw[y * (w * 3 + 1)], 0, "filter byte");
    for (let x = 0; x < w; x++) assert.deepEqual([...raw.subarray(y * (w * 3 + 1) + 1 + x * 3, y * (w * 3 + 1) + 4 + x * 3)], px[y * w + x]);
  }
});

test("transparency is composited over the background (white by default)", () => {
  const raw = zlib.inflateSync(parse(encodeRgbPng(2, 1, rgba(2, 1, (i) => (i === 0 ? [0, 0, 0, 0] : [0, 0, 0, 128])))).find((c) => c.type === "IDAT").data);
  assert.deepEqual([...raw.subarray(1, 4)], [255, 255, 255]);        // fully transparent → background
  assert.deepEqual([...raw.subarray(4, 7)], [127, 127, 127]);        // 50% black over white
});

test("a custom background is used", () => {
  const raw = zlib.inflateSync(parse(encodeRgbPng(1, 1, rgba(1, 1, () => [0, 0, 0, 0]), [10, 20, 30])).find((c) => c.type === "IDAT").data);
  assert.deepEqual([...raw.subarray(1, 4)], [10, 20, 30]);
});
