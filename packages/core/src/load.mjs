import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { pathToFileURL } from "url";

const JSX_RUNTIME_URL = new URL("./jsx-runtime.mjs", import.meta.url).href;

/**
 * .jsx/.tsx design files are transformed at load time with esbuild's transform() API (no bundling,
 * no filesystem resolution — just syntax) against a tiny JSX factory (jsx-runtime.mjs) that returns
 * Satori's own { type, props } tree shape directly. No React dependency.
 *
 * The transformed code is written to a real, colocated temp file (not a data: URL) so relative
 * imports inside the design — e.g. `import { COLORS } from "./_theme.mjs"` — still resolve against
 * the design's own directory, exactly as they do for a .mjs file. The temp file is `_`-prefixed (so
 * resolve.mjs's helper-skipping rule would exclude it even if cleanup below were ever skipped) and
 * removed in a `finally` right after the import resolves.
 */
async function loadJsxModule(designPath) {
  const { transform } = await import("esbuild");
  const source = await fs.readFile(designPath, "utf8");
  const { code } = await transform(source, {
    loader: designPath.endsWith(".tsx") ? "tsx" : "jsx",
    jsx: "transform",
    jsxFactory: "__jsxH",
    jsxFragment: "__jsxFrag",
    format: "esm",
    sourcefile: path.basename(designPath),
  });

  const preamble = `import { h as __jsxH, Fragment as __jsxFrag } from ${JSON.stringify(JSX_RUNTIME_URL)};\n`;
  const stem = path.basename(designPath, path.extname(designPath));
  const tmpPath = path.join(path.dirname(designPath), `_${stem}.${crypto.randomBytes(6).toString("hex")}.snapx-jsx.mjs`);

  await fs.writeFile(tmpPath, preamble + code);
  try {
    return await import(pathToFileURL(tmpPath).href);
  } finally {
    await fs.unlink(tmpPath).catch(() => {});
  }
}

/**
 * Imports a design module once per file version.
 *
 * The query string is derived from the file's mtime+size, so repeated loads of an
 * unchanged file hit Node's module cache (top-level code runs once per run), while
 * an edited file gets a fresh import — which matters for long-lived callers such as
 * the MCP server, where the same path is rendered again after being modified.
 *
 * .jsx/.tsx files are always freshly transformed and imported under a unique temp
 * filename (see loadJsxModule), so they never hit — and never need — that cache.
 */
export async function loadDesignModule(designPath) {
  if (designPath.endsWith(".jsx") || designPath.endsWith(".tsx")) return loadJsxModule(designPath);
  const { mtimeMs, size } = await fs.stat(designPath);
  return import(`${designPath}?v=${mtimeMs}-${size}`);
}
