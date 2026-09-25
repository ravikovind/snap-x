/**
 * config.mjs
 * Load and write snap-x.config.json, merging with auto-detected project metadata.
 */

import fs from "fs/promises";
import path from "path";
import { detectProject } from "./adapters/index.mjs";

/**
 * Load the effective config for a project directory.
 * Priority: CLI overrides > snap-x.config.json > auto-detected values > defaults
 *
 * @param {string} projectDir
 * @param {object} cliOverrides  Keys: title, description, domain, tags, theme, font, outDir, format
 * @returns {Promise<object>}
 */
export async function loadConfig(projectDir, cliOverrides = {}) {
  const configPath = path.join(projectDir, "snap-x.config.json");

  let fileConfig = {};
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    fileConfig = JSON.parse(raw);
  } catch {
    // No config file — that's fine, we'll auto-detect
  }

  // Auto-detect project metadata for any missing fields
  const detected = await detectProject(projectDir);

  return {
    title:
      cliOverrides.title ?? fileConfig.title ?? detected.name ?? "Untitled",
    description:
      cliOverrides.description ??
      fileConfig.description ??
      detected.description ??
      "",
    domain:
      cliOverrides.domain ?? fileConfig.domain ?? detected.domain ?? "",
    tags:
      cliOverrides.tags ?? fileConfig.tags ?? detected.tags ?? [],
    stack: fileConfig.stack ?? detected.stack ?? [],
    theme: cliOverrides.theme ?? fileConfig.theme ?? "dark",
    font:
      cliOverrides.font ??
      fileConfig.font ??
      detected.fontDisplay ??
      "Inter",
    outDir: cliOverrides.outDir ?? fileConfig.outDir ?? "./snap-output",
    formats: cliOverrides.format
      ? [cliOverrides.format]
      : fileConfig.formats ?? ["og", "cover", "thumbnail", "poster", "readme"],
    templateDir: fileConfig.templateDir ?? null,
    themeOverride: detected.themeOverride ?? {},
  };
}

/**
 * Write a snap-x.config.json file to projectDir.
 * @param {string} projectDir
 * @param {object} config
 */
export async function writeConfig(projectDir, config) {
  const configPath = path.join(projectDir, "snap-x.config.json");
  // Strip internal fields that shouldn't be in the file
  const { themeOverride, ...fileConfig } = config;
  await fs.writeFile(configPath, JSON.stringify(fileConfig, null, 2) + "\n");
}

/**
 * Default config for snap-x init.
 */
export const DEFAULT_CONFIG = {
  title: "My Project",
  description: "A short description of what this project does.",
  domain: "myproject.com",
  tags: ["Open Source", "TypeScript", "Node.js"],
  stack: ["Node.js", "TypeScript"],
  theme: "dark",
  font: "Inter",
  outDir: "./snap-output",
  formats: ["og", "cover", "thumbnail", "poster", "readme"],
};
