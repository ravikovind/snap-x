import { readPackageJson } from "./package.mjs";
import { readReadme } from "./readme.mjs";
import { readNextJs } from "./nextjs.mjs";
import { readCss } from "./css.mjs";

/**
 * Auto-detect project type and extract metadata.
 * Returns a normalized ProjectMeta object.
 */
export async function detectProject(dir = process.cwd()) {
  const meta = {
    name: "",
    description: "",
    domain: "",
    tags: [],
    stack: [],
    theme: "dark",
    themeOverride: {},
    fontDisplay: null,
    fontMono: null,
  };

  const pkg = await readPackageJson(dir);
  if (pkg) {
    meta.name = pkg._displayName ?? pkg.name ?? "";
    meta.description = pkg.description ?? "";
    if (pkg.keywords) meta.tags = pkg.keywords.slice(0, 4);
  }

  const readme = await readReadme(dir);
  if (readme) {
    if (!meta.name && readme.name) meta.name = readme.name;
    if (!meta.description && readme.description) meta.description = readme.description;
    if (readme.stack?.length) meta.stack = readme.stack;
  }

  const next = await readNextJs(dir);
  if (next) {
    if (next.domain) meta.domain = next.domain;
    if (next.title && !meta.name) meta.name = next.title;
  }

  const css = await readCss(dir);
  if (css) {
    if (css.fontDisplay) meta.fontDisplay = css.fontDisplay;
    if (css.fontMono) meta.fontMono = css.fontMono;
    if (css.accent) meta.themeOverride.accent = css.accent;
    if (css.bg) meta.themeOverride.bg = css.bg;
  }

  return meta;
}
