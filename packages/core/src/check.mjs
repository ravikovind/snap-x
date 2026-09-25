/**
 * check.mjs
 * Validates a snap-x design .mjs file before rendering.
 * Rules: must export FORMAT + default, tree must use display:flex only.
 */

import { loadDesignModule } from "./load.mjs";
import { collectText } from "./fallback.mjs";
import { findUncoveredChars } from "./glyphs.mjs";
import { findFormat } from "./formats.mjs";

const UNSUPPORTED_DISPLAY = new Set([
  "block",
  "inline",
  "inline-block",
  "grid",
  "inline-flex",
]);
const UNSUPPORTED_PROPS = ["zIndex", "z-index"];

/**
 * @param {string} designPath
 * @param {object} [opts]
 * @param {object[]} [opts.fonts]  Resolved Satori fonts — when provided, the tree is actually
 *   rendered through Satori to catch runtime-only errors (bad image data, unsupported values)
 *   that pure structural checks miss. Omitted → structural checks only (no network needed).
 */
export async function checkDesign(designPath, { fonts } = {}) {
  const errors = [];
  const warnings = [];

  let mod;
  try {
    mod = await loadDesignModule(designPath);
  } catch (err) {
    return { errors: [`Cannot import file: ${err.message}`], warnings };
  }

  // Check exports
  if (!mod.FORMAT) {
    errors.push("Missing: export const FORMAT = { width, height }");
  } else {
    if (!mod.FORMAT.width) errors.push("FORMAT.width is required");
    if (!mod.FORMAT.height) errors.push("FORMAT.height is required");
  }

  if (!mod.default) {
    errors.push("Missing: export default (tree object or function)");
    return { errors, warnings };
  }

  // Resolve tree
  let tree;
  try {
    tree = typeof mod.default === "function" ? await mod.default() : mod.default;
  } catch (err) {
    errors.push(`Design function threw: ${err.message}`);
    return { errors, warnings };
  }

  if (!tree || typeof tree !== "object") {
    errors.push("Default export must return an object (Satori node tree)");
    return { errors, warnings };
  }

  // Traverse tree
  traverseNode(tree, errors, warnings, "root");

  // App Store / Google Play graphics must not have an alpha channel; resvg writes RGBA unless FORMAT.alpha === false.
  const preset = mod.FORMAT?.width && mod.FORMAT?.height ? findFormat(mod.FORMAT.width, mod.FORMAT.height) : undefined;
  if (preset?.alpha === false && mod.FORMAT.alpha !== false) {
    warnings.push(`${mod.FORMAT.width}×${mod.FORMAT.height} is the ${preset.platform} size, which must have no alpha channel — add alpha: false to FORMAT.`);
  }

  // Characters no loaded font can draw render as blank boxes (Satori doesn't error) — flag them.
  if (fonts?.length) {
    const missing = findUncoveredChars(collectText(tree), fonts);
    if (missing.length > 0) {
      warnings.push(`no loaded font has: ${missing.map((c) => `"${c}"`).join(" ")} — these render as blank boxes. Draw them as inline SVG/shapes, or pick a font that includes them.`);
    }
  }

  // Actual Satori render — catches errors structural checks can't see
  // (bad image data URIs, invalid font weights, malformed SVG paths, etc.)
  if (fonts && errors.length === 0 && mod.FORMAT?.width && mod.FORMAT?.height) {
    try {
      const satori = (await import("satori")).default;
      await satori(tree, {
        width: mod.FORMAT.width,
        height: mod.FORMAT.height,
        fonts,
        embedFont: true,
      });
    } catch (err) {
      errors.push(`Satori render failed: ${err.message}`);
    }
  }

  return { errors, warnings };
}

function traverseNode(node, errors, warnings, path) {
  if (!node || typeof node !== "object") return;
  if (typeof node === "string") return;

  const style = node.props?.style ?? {};

  // display must be flex (or absent, which Satori treats as flex)
  if (style.display && UNSUPPORTED_DISPLAY.has(style.display)) {
    errors.push(
      `${path}: display:"${style.display}" not supported — use "flex"`,
    );
  }

  // Unsupported props
  for (const prop of UNSUPPORTED_PROPS) {
    if (style[prop] !== undefined) {
      warnings.push(`${path}: "${prop}" is ignored by Satori`);
    }
  }

  // position:fixed not supported
  if (style.position === "fixed") {
    errors.push(`${path}: position:"fixed" not supported — use "absolute"`);
  }

  // Recurse children
  const children = node.props?.children ?? [];
  const arr = Array.isArray(children) ? children : [children];
  arr.forEach((child, i) => {
    if (child && typeof child === "object") {
      traverseNode(child, errors, warnings, `${path}.children[${i}]`);
    }
  });
}
