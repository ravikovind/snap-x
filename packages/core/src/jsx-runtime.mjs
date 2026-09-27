/**
 * jsx-runtime.mjs
 * The classic-JSX factory a transformed .jsx/.tsx design file is compiled against (see load.mjs).
 * No React: JSX compiles straight to Satori's own { type, props } tree shape.
 */

/** Marker passed as `type` for a JSX fragment (<>...</>) — h() special-cases it below. */
export function Fragment() {}

/** h(type, props, ...children) — what esbuild's classic JSX transform calls. */
export function h(type, props, ...children) {
  const kids = children.flat(Infinity).flatMap((c) => {
    if (c === null || c === undefined || typeof c === "boolean") return [];
    if (typeof c === "number") return [String(c)];
    return [c];
  });
  // A fragment has no node of its own — its children splice straight into the parent's children
  // array (kids.flat(Infinity) above already unwraps an array returned here).
  if (type === Fragment) return kids;
  const fullProps = { ...(props ?? {}), children: kids };
  // Function components (<Label .../>) are called immediately with their props — a one-shot render
  // has no reconciliation to lazily defer to, so this eagerly produces the real Satori node.
  if (typeof type === "function") return type(fullProps);
  return { type, props: fullProps };
}
