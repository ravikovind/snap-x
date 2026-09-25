/**
 * Script fallback fonts.
 *
 * Satori falls back per glyph across every loaded font, regardless of the
 * `fontFamily` a node names. So when a design's text contains characters the
 * primary font can't draw (CJK, Arabic, Devanagari, …), we append a Noto Sans
 * subset containing just those characters — a few KB, fetched on demand.
 * Designs need no changes; primary fonts stay first so they always win.
 */

import { loadGoogleFontSubset } from "./fonts.mjs";

const SCRIPTS = [
  { family: "Noto Sans JP", re: /[　-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/g },
  { family: "Noto Sans KR", re: /[ᄀ-ᇿ㄰-㆏가-힯]/g },
  { family: "Noto Sans Arabic", re: /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g },
  { family: "Noto Sans Hebrew", re: /[֐-׿]/g },
  { family: "Noto Sans Thai", re: /[฀-๿]/g },
  { family: "Noto Sans Devanagari", re: /[ऀ-ॿ]/g },
  { family: "Noto Sans Bengali", re: /[ঀ-৿]/g },
  // Latin-extended / Greek / Cyrillic / Vietnamese, for primary fonts that lack them
  { family: "Noto Sans", re: /[Ā-ɏͰ-ϿЀ-ԯḀ-ỿ]/g },
];

/** Concatenates every text node in a Satori tree. */
export function collectText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  return collectText(node.props?.children);
}

/**
 * @param {object} tree          Satori node tree
 * @param {object[]} primaryFonts  fonts already loaded for the design (their weights are mirrored)
 * @returns {Promise<object[]>}  extra Satori font entries (possibly empty)
 */
export async function loadFallbackFonts(tree, primaryFonts = []) {
  const text = collectText(tree);
  const weights = [...new Set(primaryFonts.map((f) => f.weight))];
  if (weights.length === 0) weights.push(400, 700);

  const extra = [];
  for (const { family, re } of SCRIPTS) {
    const chars = [...new Set(text.match(re) ?? [])].join("");
    if (!chars) continue;

    try {
      const loaded = await Promise.all(weights.map((w) => loadGoogleFontSubset(family, w, chars)));
      weights.forEach((w, i) => extra.push({ name: family, data: loaded[i], weight: w, style: "normal" }));
      console.log(`      fallback: ${family} (${[...chars].length} glyphs)`);
    } catch (err) {
      console.warn(`      ⚠  fallback font "${family}" unavailable (${err.message}) — those characters may render as blank boxes.`);
    }
  }
  return extra;
}
