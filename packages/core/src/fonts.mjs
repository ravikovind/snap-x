/**
 * Google Fonts loader — returns font data for Satori.
 *
 * Two cache layers: an in-memory map (per process) and a persistent disk cache
 * so repeat runs — and offline runs — never touch the network for fonts already
 * fetched. Disk location: $SNAP_X_CACHE_DIR, else $XDG_CACHE_HOME/snap-x/fonts,
 * else ~/.cache/snap-x/fonts. Delete that directory to clear it. Disk caching is
 * strictly best-effort: any read/write problem silently falls back to the network.
 */

import fs from "fs/promises";
import os from "os";
import path from "path";
import { createHash } from "crypto";
import { loadDesignModule } from "./load.mjs";

const cache = new Map();

function cacheDir() {
  return (
    process.env.SNAP_X_CACHE_DIR ??
    path.join(process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"), "snap-x", "fonts")
  );
}

function diskPath(family, weight, text) {
  const hash = createHash("sha256").update(`${family}\0${weight}\0${text ?? ""}`).digest("hex");
  return path.join(cacheDir(), `${hash}.ttf`);
}

async function readDisk(file) {
  try {
    const b = await fs.readFile(file);
    if (b.length === 0) return null;
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  } catch {
    return null;
  }
}

async function writeDisk(file, arrayBuffer) {
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`; // write-then-rename so concurrent runs never see a partial file
    await fs.writeFile(tmp, Buffer.from(arrayBuffer));
    await fs.rename(tmp, file);
  } catch {}
}

async function fetchCached(family, weight, text) {
  const file = diskPath(family, weight, text);
  const hit = await readDisk(file);
  if (hit) return hit;
  const buf = await fetchGoogleFont(family, weight, text);
  await writeDisk(file, buf);
  return buf;
}

export async function loadGoogleFont(family, weight) {
  const key = `${family}:${weight}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const buf = await fetchCached(family, weight);
    cache.set(key, buf);
    return buf;
  } catch (err) {
    if (family === "Inter") throw err;
    console.warn(
      `\n  ⚠  Font "${family}" (weight ${weight}) unavailable (${err.message}) — falling back to Inter.`,
    );
    const buf = await loadGoogleFont("Inter", weight);
    cache.set(key, buf);
    return buf;
  }
}

/**
 * Fetches a glyph subset of a family (only `text`'s characters — a few KB even for CJK).
 * Used for script fallbacks; unlike loadGoogleFont it never substitutes Inter, since
 * Inter can't cover the scripts this exists for — callers decide how to handle failure.
 */
export async function loadGoogleFontSubset(family, weight, text) {
  const key = `${family}:${weight}:subset:${text}`;
  if (cache.has(key)) return cache.get(key);
  const buf = await fetchCached(family, weight, text);
  cache.set(key, buf);
  return buf;
}

async function fetchGoogleFont(family, weight, text) {
  const textParam = text ? `&text=${encodeURIComponent(text)}` : "";
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}${textParam}&display=swap`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" },
  });
  if (!res.ok) throw new Error(`Google Fonts returned HTTP ${res.status}`);
  const css = await res.text();

  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:woff2|woff|truetype|opentype)'\)/,
  );
  if (!match) throw new Error(`font URL not found for ${family} ${weight}`);

  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`font file returned HTTP ${fontRes.status}`);
  return fontRes.arrayBuffer();
}

const DEFAULT_FONTS = [{ family: "Inter", weights: [400, 700, 900] }];

/**
 * Resolves a design file's `FONTS` export (or the default) into a flat,
 * Satori-ready fonts array: [{ name, data, weight, style }, ...].
 * Dedupes by family+weight across a batch via the in-memory cache above,
 * so rendering many files that share a font only fetches it once.
 *
 * @param {Array<{ family: string, weights?: number[] }>} [fontsSpec]
 */
export async function resolveFonts(fontsSpec) {
  const spec = fontsSpec?.length ? fontsSpec : DEFAULT_FONTS;

  // Merge weight lists for repeated families before fetching/printing anything.
  const byFamily = new Map();
  for (const { family, weights = [400, 700, 900] } of spec) {
    const existing = byFamily.get(family) ?? new Set();
    weights.forEach((w) => existing.add(w));
    byFamily.set(family, existing);
  }

  const entries = [];
  for (const [family, weightSet] of byFamily) {
    const weights = [...weightSet];
    process.stdout.write(`  Loading ${family} (${weights.join(",")})… `);
    const loaded = await Promise.all(weights.map((w) => loadGoogleFont(family, w)));
    console.log("done.");
    weights.forEach((w, i) => entries.push({ name: family, data: loaded[i], weight: w, style: "normal" }));
  }

  return entries;
}

export function resetFontCache() {
  cache.clear();
}

/** Reads each design file's FONTS export and merges them into one spec for resolveFonts(). */
export async function collectFontsSpec(designPaths) {
  const spec = [];
  for (const p of designPaths) {
    const mod = await loadDesignModule(p);
    if (mod.FONTS?.length) spec.push(...mod.FONTS);
  }
  return spec;
}
