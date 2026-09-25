/**
 * render-playwright.mjs
 * Renders HTML templates to PNG using Playwright (headless Chromium).
 *
 * Each item: { id, name, templatePath, data, width, height }
 * templatePath: absolute path to .html file
 * data: object of URL params to inject (title, description, domain, tags, theme, font, …)
 */

import path from "path";
import fs from "fs/promises";

/**
 * @param {Array<{id:string, name:string, templatePath:string, data:object, width:number, height:number}>} items
 * @param {string} outDir
 * @param {object} options
 * @returns {Promise<string[]>}
 */
export async function renderWithPlaywright(items, outDir, options = {}) {
  let chromium;
  try {
    // Playwright-core rejects 'android' platform (Termux/Android).
    // Temporarily spoof process.platform to 'linux' for the import.
    const originalPlatform = process.platform;
    const isAndroid = originalPlatform === "android";
    if (isAndroid) {
      Object.defineProperty(process, "platform", { value: "linux", configurable: true });
    }
    try {
      const pw = await import("playwright-core");
      chromium = pw.chromium;
    } finally {
      if (isAndroid) {
        Object.defineProperty(process, "platform", { value: originalPlatform, configurable: true });
      }
    }
  } catch {
    throw new Error(
      "playwright-core is not installed. Run: npm install playwright-core"
    );
  }

  // Try to find a usable browser executable
  const executablePath = await findBrowserExecutable();

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: executablePath ?? undefined,
    });
  } catch (err) {
    const hint = executablePath
      ? `Browser at ${executablePath} failed to launch.`
      : "No Chromium browser found.";
    throw new Error(
      `${hint}\n\nRun: npx snap-x install-browser\n\nOriginal error: ${err.message}`
    );
  }

  await fs.mkdir(outDir, { recursive: true });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const results = [];

  for (const item of items) {
    const page = await context.newPage();
    await page.setViewportSize({ width: item.width, height: item.height });

    // Build URL with query params
    const params = buildParams(item.data);
    const url = `file://${item.templatePath}?${params}`;

    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for any custom fonts to load if possible
    try {
      await page.waitForFunction(() => document.fonts.ready, { timeout: 5000 });
    } catch {
      // ignore font timeout — render anyway
    }

    const buffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: item.width, height: item.height },
      fullPage: false,
    });

    const outPath = path.join(outDir, item.name);
    await fs.writeFile(outPath, buffer);

    const kb = Math.round(buffer.length / 1024);
    console.log(`  \u2705  ${item.name}  (${kb} KB)`);
    results.push(outPath);
    await page.close();
  }

  await browser.close();
  return results;
}

/**
 * Convert a data object to URLSearchParams string.
 * Arrays are joined with commas.
 */
function buildParams(data) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      if (v.length > 0) p.set(k, v.join(","));
    } else {
      p.set(k, String(v));
    }
  }
  return p.toString();
}

/**
 * Attempt to find a usable system Chromium / Chrome executable.
 * Returns null if none found — playwright will try its own internal path.
 */
async function findBrowserExecutable() {
  // 1. Check PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH env
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  // 2. Check SNAP_X_BROWSER env
  if (process.env.SNAP_X_BROWSER) {
    return process.env.SNAP_X_BROWSER;
  }

  // 3. Common system paths (Linux / Android Termux proot)
  const candidates = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/data/data/com.termux/files/usr/bin/chromium",
    "/usr/local/bin/chromium",
    "/snap/bin/chromium",
  ];

  for (const p of candidates) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // not found, continue
    }
  }

  // 4. Let playwright-core handle it (uses its own cached browser if installed)
  return null;
}
