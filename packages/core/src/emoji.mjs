/**
 * Emoji support. Satori has no emoji font: for each emoji grapheme it calls loadAdditionalAsset("emoji", segment)
 * and draws whatever image we return. We return the matching Twemoji SVG (cached in memory and on disk, so repeat
 * renders work offline). If it can't be fetched we warn and return nothing, which leaves a blank box.
 */
import { cachePath, readDisk, writeDisk } from "./cache.mjs";

const SOURCES = [
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg",
];

const memo = new Map(); // segment → data URI | null
const warned = new Set();

const ZWJ = String.fromCodePoint(0x200d); // zero-width joiner
const VS16 = String.fromCodePoint(0xfe0f); // emoji variation selector

/** Twemoji file name for a grapheme: hex code points joined by "-", FE0F stripped unless the sequence has a ZWJ. */
export function emojiCode(segment) {
  const s = segment.includes(ZWJ) ? segment : segment.replaceAll(VS16, "");
  return [...s].map((c) => c.codePointAt(0).toString(16)).join("-");
}

const toDataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export async function loadEmoji(segment) {
  if (memo.has(segment)) return memo.get(segment);
  const code = emojiCode(segment);
  const file = cachePath("svg", "twemoji", code);

  let uri = null;
  const hit = await readDisk(file);
  if (hit) uri = toDataUri(Buffer.from(hit));

  for (const base of hit ? [] : SOURCES) {
    try {
      const res = await fetch(`${base}/${code}.svg`);
      if (!res.ok) continue;
      const svg = await res.text();
      if (!svg.includes("<svg")) continue;
      await writeDisk(file, Buffer.from(svg));
      uri = toDataUri(svg);
      break;
    } catch {}
  }

  if (!uri && !warned.has(segment)) {
    warned.add(segment);
    console.warn(`      ⚠  couldn't load emoji "${segment}" (${code}.svg) — it will render as a blank box.`);
  }
  memo.set(segment, uri);
  return uri;
}

/** Satori `loadAdditionalAsset` hook: emoji → Twemoji image; anything else → no extra assets (script fonts are handled in fallback.mjs). */
export async function loadAdditionalAsset(code, segment) {
  if (code !== "emoji") return [];
  return (await loadEmoji(segment)) ?? [];
}

export function resetEmojiCache() {
  memo.clear();
  warned.clear();
}
