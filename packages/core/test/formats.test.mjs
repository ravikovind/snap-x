import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMATS, findFormat } from "../src/formats.mjs";

test("every format has a unique id, a positive integer size and notes", () => {
  const ids = new Set();
  for (const f of FORMATS) {
    assert.ok(f.id && !ids.has(f.id), `duplicate or missing id ${f.id}`);
    ids.add(f.id);
    assert.ok(Number.isInteger(f.width) && f.width > 0 && Number.isInteger(f.height) && f.height > 0, f.id);
    assert.ok(f.platform && f.notes, `${f.id} needs platform and notes`);
  }
});

test("aliases never collide with another format's id or alias", () => {
  const seen = new Map(FORMATS.map((f) => [f.id, f.id]));
  for (const f of FORMATS) for (const a of f.aliases ?? []) {
    assert.ok(!seen.has(a), `alias "${a}" of ${f.id} collides with ${seen.get(a)}`);
    seen.set(a, f.id);
  }
});

test("verified formats cite an official source URL; unverified ones don't pretend to", () => {
  for (const f of FORMATS) {
    if (f.verified) assert.match(f.source ?? "", /^https:\/\//, `${f.id} is verified but has no source`);
    else assert.equal(f.source, undefined, `${f.id} is unverified but lists a source`);
  }
});

test("App Store and Google Play graphics are flagged no-alpha (per the official docs)", () => {
  for (const id of ["app-store-iphone-6.9", "app-store-iphone-6.5", "app-store-ipad-13", "app-store-mac", "google-play-feature-graphic", "google-play-phone"]) {
    assert.equal(findFormat(id).alpha, false, id);
  }
  assert.equal(findFormat("google-play-icon").alpha, undefined, "the Play icon is 32-bit PNG *with* alpha");
});

test("the official sizes are what Apple / Google / YouTube document", () => {
  const size = (id) => { const f = findFormat(id); return `${f.width}x${f.height}`; };
  assert.equal(size("app-store-iphone-6.9"), "1320x2868");
  assert.equal(size("app-store-iphone-6.5"), "1284x2778");
  assert.equal(size("app-store-ipad-13"), "2064x2752");
  assert.equal(size("google-play-feature-graphic"), "1024x500");
  assert.equal(size("google-play-icon"), "512x512");
  assert.equal(size("youtube-thumbnail"), "1280x720");
  assert.equal(size("og"), "1200x630");
});

test("Play phone screenshots satisfy Google's own rules (9:16, sides 320–3840, long ≤ 2× short)", () => {
  for (const id of ["google-play-phone", "google-play-phone-landscape"]) {
    const { width: w, height: h } = findFormat(id);
    const [short, long] = [Math.min(w, h), Math.max(w, h)];
    assert.ok(short >= 320 && long <= 3840 && long <= 2 * short, id);
    assert.ok(Math.abs(long / short - 16 / 9) < 0.01, `${id} should be 16:9`);
  }
});

test("findFormat resolves ids, aliases, 'WxH' strings, (w, h) numbers and is case-insensitive", () => {
  assert.equal(findFormat("youtube-thumbnail").id, "youtube-thumbnail");
  assert.equal(findFormat("YT-Thumbnail").id, "youtube-thumbnail");
  assert.equal(findFormat("readme-card").id, "github-social-preview");
  assert.equal(findFormat("1584x396").id, "linkedin-cover");
  assert.equal(findFormat("1584 × 396").id, "linkedin-cover");
  assert.equal(findFormat(1320, 2868).id, "app-store-iphone-6.9");
  assert.equal(findFormat("does-not-exist"), undefined);
  assert.equal(findFormat(1, 1), undefined);
});

test("zones are well-formed and inside their format", () => {
  for (const f of FORMATS) {
    for (const z of [...(f.avoid ?? []), ...(f.safe ? [f.safe] : [])]) {
      if (z.type === "circle") assert.ok(z.r > 0 && z.cx >= 0 && z.cx <= f.width && z.cy >= 0 && z.cy <= f.height, `${f.id} circle`);
      else assert.ok(z.w > 0 && z.h > 0 && z.x >= 0 && z.y >= 0 && z.x + z.w <= f.width && z.y + z.h <= f.height, `${f.id} rect ${z.label}`);
    }
    if (f.mobileCrop) assert.ok(f.mobileCrop.x >= 0 && f.mobileCrop.x + f.mobileCrop.w <= f.width, `${f.id} mobileCrop`);
  }
});

test("the YouTube channel-art safe area is the centred 1546×423 box", () => {
  const f = findFormat("youtube-channel-art");
  assert.equal(f.safe.w, 1546); assert.equal(f.safe.h, 423);
  assert.ok(Math.abs(f.safe.x - (f.width - 1546) / 2) <= 1 && Math.abs(f.safe.y - (f.height - 423) / 2) <= 1);
});
