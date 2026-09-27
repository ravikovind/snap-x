// The pack's brand file (improvements.md §10.3) — colors, fonts, spacing and the shared building
// blocks every design in this pack imports. A normal `_`-prefixed helper, never rendered.

export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "JetBrains Mono", weights: [400, 700] },
];

export const COLORS = {
  bg: "#070707",
  red: "#eb1d25",
  ink: "#f5f5f5",
  muted: "rgba(255,255,255,0.52)",
  line: "rgba(255,255,255,0.14)",
};

export const SPACING = 8; // base unit — this pack's canvases range 500–1920px, padding/gaps are multiples of it
export const TYPE_SCALE = { headline: 90, support: 24, detail: 14 }; // ≈ headline : support : detail, see og.mjs
export const RADIUS = 14;

export const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
export const txt = (text, style) => box(style, [text]);
export const H = (size) => ({ fontSize: size, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.035em", whiteSpace: "nowrap" });

export const chip = (label, filled, big) =>
  box({
    padding: big ? "10px 24px" : "7px 16px", borderRadius: 999, fontFamily: "JetBrains Mono", fontSize: big ? 20 : 14, fontWeight: 700,
    color: filled ? "#fff" : COLORS.ink, background: filled ? COLORS.red : "transparent", border: `1px solid ${filled ? COLORS.red : COLORS.line}`,
  }, [label]);
export const arrow = (size = 16, m = 10) => txt("→", { color: COLORS.muted, fontSize: size, margin: `0 ${m}px` });
export const brand = (size = 17) => box({ alignItems: "center", gap: 12 }, [
  box({ width: size * 0.8, height: size * 0.8, background: COLORS.red }),
  txt("SNAP-X", { fontSize: size, fontWeight: 700, letterSpacing: "0.24em", color: COLORS.ink }),
]);
export const glow = (extra) => box({ position: "absolute", width: 760, height: 760, background: "radial-gradient(circle, rgba(235,29,37,0.30) 0%, rgba(235,29,37,0) 62%)", ...extra });
export const command = (size = 14) => box({ fontFamily: "JetBrains Mono", fontSize: size, color: COLORS.muted, gap: 10 }, [
  txt("$", { color: COLORS.red, fontWeight: 700 }), txt("npx @snap-x/cli render designs/*.mjs", { color: COLORS.ink }),
]);
export const root = (w, h, style, children) => box({ width: w, height: h, background: COLORS.bg, fontFamily: "Saira", position: "relative", overflow: "hidden", ...style }, children);
