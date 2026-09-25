import path from "path";
import fs from "fs/promises";
import { existsSync, statSync } from "fs";

/**
 * Expands literal files, directories, and single-`*`-wildcard globs into a flat, deduped list of absolute .mjs paths.
 * Files whose name starts with `_` are helpers (shared builders etc.) and are ALWAYS skipped — including when named
 * explicitly, because a shell expands `designs/*.mjs` into explicit paths before the CLI sees a glob.
 */
export async function resolveDesignFiles(patterns) {
  const out = [];
  for (const p of patterns) {
    const abs = path.resolve(p);

    if (p.includes("*")) {
      const dir = path.dirname(abs);
      const filePattern = path.basename(abs);
      const re = new RegExp("^" + filePattern.split("*").map(escapeRegExp).join(".*") + "$");
      const entries = existsSync(dir) ? await fs.readdir(dir) : [];
      for (const entry of entries.sort()) {
        if (isDesign(entry) && re.test(entry)) out.push(path.join(dir, entry));
      }
      continue;
    }

    if (!existsSync(abs)) continue;

    if (statSync(abs).isDirectory()) {
      const entries = await fs.readdir(abs);
      for (const entry of entries.sort()) {
        if (isDesign(entry)) out.push(path.join(abs, entry));
      }
      continue;
    }

    if (isDesign(path.basename(abs))) out.push(abs);
  }
  return [...new Set(out)];
}

const isDesign = (name) => name.endsWith(".mjs") && !name.startsWith("_");

function escapeRegExp(s) {
  return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}
