import fs from "fs";
import path from "path";

const CSS_CANDIDATES = [
  "app/globals.css", "src/app/globals.css",
  "styles/globals.css", "styles/global.css",
  "src/styles/globals.css", "src/index.css",
  "style.css", "styles.css",
];

/**
 * Extract font families and brand colors from project CSS.
 * Returns { fontDisplay, fontMono, accent, bg } or null.
 */
export async function readCss(dir) {
  let content = null;
  for (const c of CSS_CANDIDATES) {
    const p = path.join(dir, c);
    if (fs.existsSync(p)) { content = fs.readFileSync(p, "utf-8"); break; }
  }
  if (!content) return null;

  // Extract Google Fonts families from @import URL
  const importMatch = content.match(/googleapis\.com\/css2\?family=([^&"']+)/);
  const families = importMatch
    ? importMatch[1].split("|").map((f) => f.split(":")[0].replace(/\+/g, " "))
    : [];

  // Extract --font-sans and --font-mono CSS vars
  const fontSansMatch = content.match(/--font-sans[^:]*:\s*["']?([^,"';]+)/);
  const fontMonoMatch = content.match(/--font-mono[^:]*:\s*["']?([^,"';]+)/);

  const fontDisplay = fontSansMatch
    ? fontSansMatch[1].trim().replace(/['"]/g, "")
    : families[0] ?? null;

  const fontMono = fontMonoMatch
    ? fontMonoMatch[1].trim().replace(/['"]/g, "")
    : families[1] ?? null;

  // Extract accent color (look for --accent, --primary, --brand)
  const accentMatch = content.match(/--(?:accent|primary|brand)[^:]*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
  const bgMatch = content.match(/--(?:background|bg)[^:]*:\s*(#[0-9a-fA-F]{3,8})/);

  return {
    fontDisplay: fontDisplay || null,
    fontMono: fontMono || null,
    accent: accentMatch?.[1] ?? null,
    bg: bgMatch?.[1] ?? null,
  };
}
