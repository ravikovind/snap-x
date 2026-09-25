/**
 * check.mjs
 * Validates a snap-x design .mjs file before rendering.
 * Rules: must export FORMAT + default, tree must use display:flex only.
 */

import path from "path";

const UNSUPPORTED_DISPLAY = new Set(["block", "inline", "inline-block", "grid", "inline-flex"]);
const UNSUPPORTED_PROPS = ["zIndex", "z-index"];

export async function checkDesign(designPath) {
  const errors = [];
  const warnings = [];

  let mod;
  try {
    mod = await import(`${designPath}?check=${Date.now()}`);
  } catch (err) {
    return { errors: [`Cannot import file: ${err.message}`], warnings };
  }

  // Check exports
  if (!mod.FORMAT) {
    errors.push('Missing: export const FORMAT = { width, height }');
  } else {
    if (!mod.FORMAT.width)  errors.push("FORMAT.width is required");
    if (!mod.FORMAT.height) errors.push("FORMAT.height is required");
  }

  if (!mod.default) {
    errors.push("Missing: export default (tree object or function)");
    return { errors, warnings };
  }

  // Resolve tree
  let tree;
  try {
    tree = typeof mod.default === "function"
      ? mod.default({ title: "Test", description: "", domain: "", tags: [], stack: [], theme: "dark", font: "Inter", themeOverride: {} })
      : mod.default;
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

  return { errors, warnings };
}

function traverseNode(node, errors, warnings, path) {
  if (!node || typeof node !== "object") return;
  if (typeof node === "string") return;

  const style = node.props?.style ?? {};

  // display must be flex (or absent, which Satori treats as flex)
  if (style.display && UNSUPPORTED_DISPLAY.has(style.display)) {
    errors.push(`${path}: display:"${style.display}" not supported — use "flex"`);
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
