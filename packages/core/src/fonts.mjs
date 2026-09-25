/**
 * Google Fonts loader — fetches woff2 and returns ArrayBuffer for Satori.
 * Results are cached in memory per process run.
 */

const cache = new Map();

export async function loadGoogleFont(family, weight) {
  const key = `${family}:${weight}`;
  if (cache.has(key)) return cache.get(key);

  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" },
  }).then((r) => r.text());

  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:woff2|woff|truetype|opentype)'\)/,
  );
  if (!match) throw new Error(`Font URL not found for ${family} ${weight}`);

  const buf = await fetch(match[1]).then((r) => r.arrayBuffer());
  cache.set(key, buf);
  return buf;
}

let _fonts;

export async function getFonts(family = "Inter", weights = [400, 700, 900]) {
  if (_fonts) return _fonts;

  process.stdout.write(`  Loading ${family} fonts… `);
  const loaded = await Promise.all(weights.map((w) => loadGoogleFont(family, w)));
  _fonts = weights.map((w, i) => ({
    name: family,
    data: loaded[i],
    weight: w,
    style: "normal",
  }));
  console.log("done.");
  return _fonts;
}

export function resetFontCache() {
  _fonts = undefined;
  cache.clear();
}
