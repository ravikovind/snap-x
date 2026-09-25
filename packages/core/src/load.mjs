import fs from "fs/promises";

/**
 * Imports a design module once per file version.
 *
 * The query string is derived from the file's mtime+size, so repeated loads of an
 * unchanged file hit Node's module cache (top-level code runs once per run), while
 * an edited file gets a fresh import — which matters for long-lived callers such as
 * the MCP server, where the same path is rendered again after being modified.
 */
export async function loadDesignModule(designPath) {
  const { mtimeMs, size } = await fs.stat(designPath);
  return import(`${designPath}?v=${mtimeMs}-${size}`);
}
