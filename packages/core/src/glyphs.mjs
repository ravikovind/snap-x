import opentype from "@shuding/opentype.js";
import { coveredByFallback } from "./fallback.mjs";

const parsed = new WeakMap(); // font data → parsed font (or null if unparseable)

function parseFont(data) {
  if (parsed.has(data)) return parsed.get(data);
  let font = null;
  try {
    const buf = data instanceof ArrayBuffer ? data : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    font = opentype.parse(buf);
  } catch {}
  parsed.set(data, font);
  return font;
}

// Whitespace, control characters, zero-width joiners and variation selectors never draw a glyph.
const INVISIBLE = /[\p{White_Space}\p{Cc}​-‏⁠︀-️]/u;

/**
 * Characters in `text` that none of the loaded Satori `fonts` can draw and that the automatic script
 * fallback (CJK, Arabic, …) won't cover — they would render as blank boxes.
 * If a font can't be parsed we assume it covers everything (never warn on a guess).
 */
export function findUncoveredChars(text, fonts) {
  const faces = [];
  const seen = new Set();
  for (const f of fonts ?? []) {
    if (seen.has(f.data)) continue;
    seen.add(f.data);
    const face = parseFont(f.data);
    if (!face) return []; // unknown coverage → stay silent
    faces.push(face);
  }
  if (faces.length === 0) return [];

  const missing = [];
  for (const ch of new Set([...text])) {
    if (INVISIBLE.test(ch) || coveredByFallback(ch)) continue;
    if (!faces.some((face) => face.charToGlyphIndex(ch) > 0)) missing.push(ch);
  }
  return missing;
}
