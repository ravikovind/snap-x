#!/usr/bin/env node
/**
 * snap-x CLI
 *
 *   snap-x init [--force]                scaffold snap-x.config.json + designs/
 *   snap-x check [--format X]            validate design .mjs files
 *   snap-x render [--format X] [--out]   render designs → PNGs via Satori
 */

import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DESIGNS_DIR = path.resolve(__dirname, "../default-designs");

const rawArgs = process.argv.slice(2);
const SUBCMDS = ["init", "check", "render"];
const sub = rawArgs[0] && SUBCMDS.includes(rawArgs[0]) ? rawArgs[0] : "render";
const args = SUBCMDS.includes(rawArgs[0]) ? rawArgs.slice(1) : rawArgs;

const get = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] ?? null : null; };
const has = (f) => args.includes(f);

console.log("\n  snap-x\n");

if (sub === "init")   await runInit();
if (sub === "check")  await runCheck();
if (sub === "render") await runRender();

// ─── init ────────────────────────────────────────────────────────────────────

async function runInit() {
  const force = has("--force");
  const projectDir = get("--project") ?? process.cwd();

  const configPath = path.join(projectDir, "snap-x.config.json");
  if (!existsSync(configPath) || force) {
    let detected = {};
    try {
      const { detectProject } = await import("./adapters/index.mjs");
      detected = await detectProject(projectDir);
    } catch {}

    const config = {
      title: detected.name || "My Project",
      description: detected.description || "A short description.",
      domain: detected.domain || "myproject.com",
      tags: detected.tags?.length ? detected.tags : ["Open Source"],
      stack: detected.stack?.length ? detected.stack : [],
      theme: "dark",
      font: detected.fontDisplay || "Inter",
      outDir: "./snap-output",
      formats: ["og", "cover", "thumbnail", "poster", "readme"],
    };
    await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
    console.log("  Created: snap-x.config.json");
  } else {
    console.log("  Skipped: snap-x.config.json (use --force to overwrite)");
  }

  const designDest = path.join(projectDir, "snap-x", "designs");
  await fs.mkdir(designDest, { recursive: true });

  for (const file of await fs.readdir(DEFAULT_DESIGNS_DIR)) {
    if (!file.endsWith(".mjs")) continue;
    const dest = path.join(designDest, file);
    if (!existsSync(dest) || force) {
      await fs.copyFile(path.join(DEFAULT_DESIGNS_DIR, file), dest);
      console.log(`  Created: snap-x/designs/${file}`);
    } else {
      console.log(`  Skipped: snap-x/designs/${file} (use --force)`);
    }
  }

  console.log(`
  Done. Edit snap-x.config.json, then customize snap-x/designs/*.mjs.

  Run: npx snap-x check   (validate)
  Run: npx snap-x render  (generate PNGs)
`);
}

// ─── check ───────────────────────────────────────────────────────────────────

async function runCheck() {
  const projectDir = get("--project") ?? process.cwd();
  const formatFilter = get("--format");
  const designDir = resolveDesignDir(projectDir);

  const files = await getDesignFiles(designDir, formatFilter);
  if (files.length === 0) {
    console.error("  No design files found. Run: npx snap-x init\n");
    process.exit(1);
  }

  const { checkDesign } = await import("./check.mjs");
  let allOk = true;

  for (const f of files) {
    const result = await checkDesign(f.path);
    if (result.errors.length === 0) {
      console.log(`  ✅  ${f.name}`);
    } else {
      console.log(`  ❌  ${f.name}`);
      result.errors.forEach((e) => console.log(`       • ${e}`));
      allOk = false;
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach((w) => console.log(`       ⚠  ${w}`));
    }
  }

  if (!allOk) {
    console.log("\n  Fix errors above before rendering.\n");
    process.exit(1);
  }
  console.log("\n  All designs valid.\n");
}

// ─── render ──────────────────────────────────────────────────────────────────

async function runRender() {
  const projectDir = get("--project") ?? process.cwd();
  const formatFilter = get("--format");
  const designDir = resolveDesignDir(projectDir);

  const config = await loadConfig(projectDir);
  const outDir = path.resolve(projectDir, get("--out") ?? config.outDir ?? "./snap-output");

  console.log(`  Project : ${config.title}`);
  console.log(`  Font    : ${config.font}`);
  console.log(`  Theme   : ${config.theme}`);
  console.log(`  Output  : ${outDir}\n`);

  const files = await getDesignFiles(designDir, formatFilter);
  if (files.length === 0) {
    console.error("  No design files found. Run: npx snap-x init\n");
    process.exit(1);
  }

  const { getFonts, resetFontCache } = await import("./fonts.mjs");
  resetFontCache();
  const fonts = await getFonts(config.font, [400, 700, 900]);

  let allFonts = fonts;
  if (config.monoFont) {
    const { loadGoogleFont } = await import("./fonts.mjs");
    const [r, b] = await Promise.all([
      loadGoogleFont(config.monoFont, 400),
      loadGoogleFont(config.monoFont, 700),
    ]);
    allFonts = [
      ...fonts,
      { name: config.monoFont, data: r, weight: 400, style: "normal" },
      { name: config.monoFont, data: b, weight: 700, style: "normal" },
    ];
  }

  console.log(`  Generating ${files.length} image(s)…\n`);
  await fs.mkdir(outDir, { recursive: true });

  const { renderDesign } = await import("./render.mjs");
  for (const f of files) {
    await renderDesign(f.path, outDir, config, allFonts);
  }

  console.log(`\n  Done. Images saved to ${outDir}/\n`);
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function resolveDesignDir(projectDir) {
  const userDir = path.join(projectDir, "snap-x", "designs");
  return existsSync(userDir) ? userDir : DEFAULT_DESIGNS_DIR;
}

async function getDesignFiles(designDir, formatFilter) {
  const NAME_MAP = {
    "og.mjs": "og",
    "cover.mjs": "cover",
    "thumbnail.mjs": "thumbnail",
    "poster.mjs": "poster",
    "readme-card.mjs": "readme",
    "readme.mjs": "readme",
  };
  const all = await fs.readdir(designDir);
  return all
    .filter((f) => f.endsWith(".mjs"))
    .filter((f) => !formatFilter || NAME_MAP[f] === formatFilter || f === `${formatFilter}.mjs`)
    .map((f) => ({ name: f, path: path.join(designDir, f) }));
}

async function loadConfig(projectDir) {
  const configPath = path.join(projectDir, "snap-x.config.json");
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    const file = JSON.parse(raw);
    return {
      ...file,
      title: get("--title") ?? file.title ?? "Untitled",
      description: get("--desc") ?? file.description ?? "",
      domain: get("--domain") ?? file.domain ?? "",
      theme: get("--theme") ?? file.theme ?? "dark",
      font: get("--font") ?? file.font ?? "Inter",
    };
  } catch {
    try {
      const { detectProject } = await import("./adapters/index.mjs");
      const d = await detectProject(projectDir);
      return {
        title: get("--title") ?? d.name ?? "Untitled",
        description: get("--desc") ?? d.description ?? "",
        domain: get("--domain") ?? d.domain ?? "",
        tags: d.tags ?? [],
        stack: d.stack ?? [],
        theme: get("--theme") ?? "dark",
        font: get("--font") ?? d.fontDisplay ?? "Inter",
        outDir: "./snap-output",
        themeOverride: d.themeOverride ?? {},
      };
    } catch {
      return { title: "Untitled", description: "", domain: "", tags: [], stack: [], theme: "dark", font: "Inter", outDir: "./snap-output", themeOverride: {} };
    }
  }
}
