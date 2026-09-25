#!/usr/bin/env node

/**
 * snap-x CLI
 *
 * Subcommands:
 *   snap-x init [--force]                     scaffold config + templates
 *   snap-x build [--format X] [--fast] [--out dir] [--config path]
 *   snap-x preview                            open templates in browser
 *   snap-x install-browser                    install Playwright Chromium
 *
 * Legacy (no subcommand): runs build for backwards compat
 */

import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { loadConfig } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_TEMPLATES_DIR = path.resolve(__dirname, "../default-templates");

// ─── Arg parsing ─────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2);

// Subcommand detection
const SUBCOMMANDS = ["init", "build", "preview", "install-browser"];
const subcommand =
  rawArgs[0] && SUBCOMMANDS.includes(rawArgs[0]) ? rawArgs[0] : "build";
const args = subcommand === "build" && !SUBCOMMANDS.includes(rawArgs[0])
  ? rawArgs          // legacy: no subcommand
  : rawArgs.slice(1);

const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] ?? null : null;
};
const has = (flag) => args.includes(flag);

// ─── Dispatch ────────────────────────────────────────────────────────────────

console.log("\n  snap-x\n");

if (subcommand === "init") {
  await runInit();
} else if (subcommand === "build") {
  await runBuild();
} else if (subcommand === "preview") {
  await runPreview();
} else if (subcommand === "install-browser") {
  await runInstallBrowser();
}

// ─── init ────────────────────────────────────────────────────────────────────

async function runInit() {
  const force = has("--force");
  const projectDir = get("--project") ?? process.cwd();

  console.log("  Initializing snap-x in:", projectDir, "\n");

  // Write config
  const configPath = path.join(projectDir, "snap-x.config.json");
  if (!existsSync(configPath) || force) {
    // Try to auto-detect for better defaults
    let detected = {};
    try {
      const { detectProject } = await import("./adapters/index.mjs");
      detected = await detectProject(projectDir);
    } catch {}

    const { DEFAULT_CONFIG, writeConfig } = await import("./config.mjs");
    const config = {
      ...DEFAULT_CONFIG,
      title: detected.name || DEFAULT_CONFIG.title,
      description: detected.description || DEFAULT_CONFIG.description,
      domain: detected.domain || DEFAULT_CONFIG.domain,
      tags: detected.tags?.length ? detected.tags : DEFAULT_CONFIG.tags,
      stack: detected.stack?.length ? detected.stack : DEFAULT_CONFIG.stack,
      font: detected.fontDisplay || DEFAULT_CONFIG.font,
    };
    await writeConfig(projectDir, config);
    console.log("  Created: snap-x.config.json");
  } else {
    console.log("  Skipped: snap-x.config.json (already exists, use --force to overwrite)");
  }

  // Copy default templates
  const templateDest = path.join(projectDir, "snap-x", "templates");
  await fs.mkdir(templateDest, { recursive: true });

  const templateFiles = await fs.readdir(DEFAULT_TEMPLATES_DIR);
  const htmlFiles = templateFiles.filter((f) => f.endsWith(".html"));

  for (const file of htmlFiles) {
    const dest = path.join(templateDest, file);
    if (!existsSync(dest) || force) {
      await fs.copyFile(path.join(DEFAULT_TEMPLATES_DIR, file), dest);
      console.log(`  Created: snap-x/templates/${file}`);
    } else {
      console.log(`  Skipped: snap-x/templates/${file} (already exists, use --force)`);
    }
  }

  console.log(`
  Done! Edit snap-x.config.json to set your project details,
  then customize snap-x/templates/*.html to match your brand.

  Run: npx snap-x build
`);
}

// ─── build ───────────────────────────────────────────────────────────────────

async function runBuild() {
  const fast = has("--fast");
  const projectDir = get("--project") ?? process.cwd();
  const configPath = get("--config") ?? null;

  const cliOverrides = {
    title: get("--title"),
    description: get("--desc"),
    domain: get("--domain"),
    tags: get("--tags")?.split(",").map((t) => t.trim()),
    theme: get("--theme"),
    font: get("--font"),
    outDir: get("--out"),
    format: get("--format"),
  };
  // Remove nulls
  for (const k of Object.keys(cliOverrides)) {
    if (cliOverrides[k] == null) delete cliOverrides[k];
  }

  const config = await loadConfig(
    configPath ? path.dirname(path.resolve(configPath)) : projectDir,
    cliOverrides
  );

  const outDir = path.resolve(projectDir, config.outDir);

  console.log(`  Project : ${config.title}`);
  console.log(`  Theme   : ${config.theme}`);
  console.log(`  Font    : ${config.font}`);
  console.log(`  Output  : ${outDir}`);
  console.log(`  Mode    : ${fast ? "fast (Satori)" : "Playwright"}\n`);

  // Resolve template directory
  const userTemplateDir = config.templateDir
    ? path.resolve(projectDir, config.templateDir)
    : path.join(projectDir, "snap-x", "templates");

  const templateDir = existsSync(userTemplateDir)
    ? userTemplateDir
    : DEFAULT_TEMPLATES_DIR;

  if (templateDir === DEFAULT_TEMPLATES_DIR) {
    console.log("  Using default templates (run `snap-x init` to customize)\n");
  }

  // Format → filename + dimensions map
  const FORMAT_MAP = {
    og: { file: "og.html", width: 1200, height: 630, out: "og.png" },
    cover: { file: "cover.html", width: 1500, height: 500, out: "cover.png" },
    thumbnail: { file: "thumbnail.html", width: 1280, height: 720, out: "thumbnail.png" },
    poster: { file: "poster.html", width: 1080, height: 1920, out: "poster.png" },
    readme: { file: "readme-card.html", width: 1280, height: 640, out: "readme-card.png" },
  };

  const items = config.formats
    .filter((f) => FORMAT_MAP[f])
    .map((f) => {
      const fmt = FORMAT_MAP[f];
      return {
        id: f,
        name: fmt.out,
        templatePath: path.join(templateDir, fmt.file),
        data: {
          title: config.title,
          description: config.description,
          domain: config.domain,
          tags: config.tags,
          stack: config.stack,
          theme: config.theme,
          font: config.font,
        },
        width: fmt.width,
        height: fmt.height,
      };
    })
    .filter((item) => {
      if (!existsSync(item.templatePath)) {
        console.warn(`  Warning: template not found: ${item.templatePath}`);
        return false;
      }
      return true;
    });

  if (items.length === 0) {
    console.error("  No valid templates found. Run: npx snap-x init");
    process.exit(1);
  }

  console.log(`  Generating ${items.length} image(s)…\n`);

  if (fast) {
    await runFastBuild(items, outDir, config);
  } else {
    await runPlaywrightBuild(items, outDir, config);
  }

  console.log(`\n  Done. Images saved to ${outDir}/\n`);
}

async function runPlaywrightBuild(items, outDir, config) {
  const { renderWithPlaywright } = await import("./render-playwright.mjs");
  try {
    await renderWithPlaywright(items, outDir);
  } catch (err) {
    if (
      err.message.includes("install-browser") ||
      err.message.includes("No Chromium") ||
      err.message.includes("failed to launch")
    ) {
      console.error(`\n  Error: ${err.message}`);
      console.error("  Run: npx snap-x install-browser\n");
      process.exit(1);
    }
    throw err;
  }
}

async function runFastBuild(items, outDir, config) {
  // Fast path: Satori + Resvg (no browser needed)
  // Import the old template modules and render via Satori
  let renderAll, satoriFns;
  try {
    const mod = await import("./render-fast.mjs");
    renderAll = mod.renderAll;
  } catch (err) {
    console.error(
      "  Error: --fast mode requires satori and @resvg/resvg-js.\n" +
        "  Install them: npm install satori @resvg/resvg-js\n"
    );
    process.exit(1);
  }

  // Load font data for Satori
  let fonts;
  try {
    const { getFonts, resetFontCache } = await import("./fonts.mjs");
    resetFontCache();
    fonts = await getFonts(config.font, [400, 700, 900]);
  } catch (err) {
    console.warn("  Warning: Could not load fonts for fast mode:", err.message);
    fonts = [];
  }

  // Build Satori node items (use legacy templates)
  const satoriItems = [];
  for (const item of items) {
    const node = await buildSatoriNode(item.id, config);
    if (node) {
      satoriItems.push({
        id: item.id,
        name: item.name,
        node,
        width: item.width,
        height: item.height,
      });
    }
  }

  if (satoriItems.length === 0) {
    console.error("  Error: No Satori templates available for --fast mode.");
    process.exit(1);
  }

  await renderAll(satoriItems, outDir, { fonts });
}

async function buildSatoriNode(id, config) {
  const { theme, themeOverride = {} } = config;
  const cardProps = { theme, themeOverride };

  try {
    if (id === "og") {
      const { ogCard } = await import("./templates/og.mjs");
      return ogCard({
        label: config.domain || config.title,
        title: config.title,
        description: config.description,
        tags: config.tags,
        domain: config.domain,
        ...cardProps,
      });
    }
    if (id === "cover") {
      const { coverCard } = await import("./templates/cover.mjs");
      return coverCard({
        name: config.title,
        tagline: config.description,
        domain: config.domain,
        ...cardProps,
      });
    }
    if (id === "thumbnail") {
      const { thumbnailCard } = await import("./templates/thumbnail.mjs");
      return thumbnailCard({
        eyebrow: config.domain || "",
        title: config.title,
        subtitle: config.description,
        tag: config.tags[0] ?? "",
        ...cardProps,
      });
    }
    if (id === "poster") {
      const { posterCard } = await import("./templates/poster.mjs");
      return posterCard({
        eyebrow: config.domain || "",
        title: config.title,
        subtitle: config.description,
        footer: config.domain,
        ...cardProps,
      });
    }
    if (id === "readme") {
      const { readmeCard } = await import("./templates/readme.mjs");
      return readmeCard({
        name: config.title,
        description: config.description,
        stack: config.stack,
        domain: config.domain,
        ...cardProps,
      });
    }
  } catch (err) {
    console.warn(`  Warning: Could not load Satori template for ${id}:`, err.message);
    return null;
  }
  return null;
}

// ─── preview ─────────────────────────────────────────────────────────────────

async function runPreview() {
  const projectDir = get("--project") ?? process.cwd();

  const { loadConfig } = await import("./config.mjs");
  const config = await loadConfig(projectDir, {});

  const userTemplateDir = config.templateDir
    ? path.resolve(projectDir, config.templateDir)
    : path.join(projectDir, "snap-x", "templates");

  const templateDir = existsSync(userTemplateDir)
    ? userTemplateDir
    : DEFAULT_TEMPLATES_DIR;

  const data = {
    title: config.title,
    description: config.description,
    domain: config.domain,
    tags: Array.isArray(config.tags) ? config.tags.join(",") : config.tags,
    stack: Array.isArray(config.stack) ? config.stack.join(",") : config.stack,
    theme: config.theme,
    font: config.font,
  };

  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(data).filter(([, v]) => v != null))
  ).toString();

  console.log("  Opening templates in browser...\n");

  const files = await fs.readdir(templateDir);
  const htmlFiles = files.filter((f) => f.endsWith(".html"));

  if (htmlFiles.length === 0) {
    console.error("  No HTML templates found. Run: npx snap-x init");
    process.exit(1);
  }

  // Print preview URLs
  for (const f of htmlFiles) {
    const url = `file://${path.join(templateDir, f)}?${params}`;
    console.log(`  ${f}:`);
    console.log(`  ${url}\n`);
  }

  // Try to open in browser
  try {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    const urls = htmlFiles.map(
      (f) => `"file://${path.join(templateDir, f)}?${params}"`
    );

    // Try common openers
    const openers = ["xdg-open", "open", "start"];
    for (const opener of openers) {
      try {
        await execAsync(`${opener} ${urls[0]}`);
        break;
      } catch {
        continue;
      }
    }
  } catch {
    console.log("  Could not open browser automatically. Copy a URL above to preview.");
  }
}

// ─── install-browser ─────────────────────────────────────────────────────────

async function runInstallBrowser() {
  console.log("  Installing Playwright Chromium browser...\n");

  // On Android/Termux, playwright-core rejects the 'android' platform string.
  // We use a platform-fix wrapper script to spoof 'linux'.
  const isAndroid = process.platform === "android";

  if (isAndroid) {
    console.log("  Detected Android/Termux — applying platform fix...\n");

    // Write a tiny wrapper script that spoofs the platform and then installs
    const wrapperPath = path.join(__dirname, "..", ".playwright-install-wrapper.mjs");
    const wrapperContent = `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// Spoof platform so playwright-core works on Android/Termux
Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find playwright-core CLI
const req = createRequire(import.meta.url);
const pwCorePath = req.resolve('playwright-core');
const pwCoreDir = path.dirname(pwCorePath);
const cliPath = path.join(pwCoreDir, '..', 'cli.js');

// Run: playwright install chromium
process.argv = [process.execPath, cliPath, 'install', 'chromium'];

try {
  await import('file://' + cliPath);
} catch(e) {
  // Try alternate path
  const cliPath2 = path.join(pwCoreDir, 'lib', 'cli', 'cli.js');
  process.argv = [process.execPath, cliPath2, 'install', 'chromium'];
  await import('file://' + cliPath2);
}
`.trim();

    await fs.writeFile(wrapperPath, wrapperContent);

    const { spawn } = await import("child_process");
    const proc = spawn("node", [wrapperPath], { stdio: "inherit" });
    proc.on("close", async (code) => {
      // Clean up wrapper
      try { await fs.unlink(wrapperPath); } catch {}
      if (code === 0) {
        console.log("\n  Browser installed. Run: npx snap-x build\n");
      } else {
        console.error(`\n  Installation failed (exit ${code}).`);
        console.error("  On Android/Termux, try installing chromium-browser via apt/pkg:");
        console.error("  pkg install chromium  (if in a proot Ubuntu environment)\n");
        process.exit(code ?? 1);
      }
    });
    return;
  }

  // Non-Android: standard playwright install
  const { spawn } = await import("child_process");
  const proc = spawn(
    "npx",
    ["playwright-core", "install", "chromium"],
    { stdio: "inherit", shell: true }
  );

  proc.on("close", (code) => {
    if (code === 0) {
      console.log("\n  Browser installed. Run: npx snap-x build\n");
    } else {
      console.error(`\n  Installation failed (exit ${code}).`);
      console.error("  Try manually: npx playwright install chromium\n");
      process.exit(code);
    }
  });
}
