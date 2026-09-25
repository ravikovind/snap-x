/**
 * Google Fonts loader — fetches woff2 and returns ArrayBuffer for Satori.
 * Results are cached in memory per process run.
 */

const cache = new Map();

export async function loadGoogleFont(family, weight) {
  const key = `${family}:${weight}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const buf = await fetchGoogleFont(family, weight);
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

async function fetchGoogleFont(family, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" },
  });
  if (!res.ok) throw new Error(`Google Fonts returned HTTP ${res.status}`);
  const css = await res.text();

  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:woff2|woff|truetype|opentype)'\)/,
  );
  if (!match) throw new Error(`font URL not found for ${family} ${weight}`);

  return fetch(match[1]).then((r) => r.arrayBuffer());
}

const DEFAULT_FONTS = [{ family: "Inter", weights: [400, 700, 900] }];

/**
 * Resolves a design file's `FONTS` export (or the default) into a flat,
 * Satori-ready fonts array: [{ name, data, weight, style }, ...].
 * Dedupes by family+weight across a batch via the module-level cache above,
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
    const mod = await import(`${p}?fonts=${Date.now()}`);
    if (mod.FONTS?.length) spec.push(...mod.FONTS);
  }
  return spec;
}
