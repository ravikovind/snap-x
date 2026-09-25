// Shared builder for the LinkedIn cover (files starting with "_" are helpers, not rendered on their own).
// Layout, copy, colours and type are specified in ../plan.md (revision 2) on a 1584×396 canvas.

export const FONTS = [
  { family: "Nunito Sans", weights: [400, 600, 700, 800] },
  { family: "Saira", weights: [500, 800] }, // the "mono role" font in the plan
];

export const W = 1584;
export const H = 396;

const BG = "#000000";
const INK = "#F5F5F5";
const SECOND = "rgba(255,255,255,0.60)";
const YELLOW = "#FAC800"; // the single accent (open-notifier's yellow)
const GREEN = "#10B981"; // used once: start of the gradient ring
const CORE = "#141414";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);
const at = (left, top, style, children) => box({ position: "absolute", left, top, ...style }, children);
const el = (type, props) => ({ type, props });

const CX = 1450, CY = 198; // orbit centre
const pt = (r, deg) => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)];
const dot = (x, y, r, fill, opacity = 1) => el("circle", { cx: x, cy: y, r, fill, fillOpacity: opacity });
const ring = (cx, cy, r, opacity) => el("circle", { cx, cy, r, fill: "none", stroke: YELLOW, strokeOpacity: opacity, strokeWidth: 1 });

const rings = () =>
  el("svg", {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: { position: "absolute", left: 0, top: 0, display: "flex" },
    children: [
      el("defs", { children: [
        el("linearGradient", { id: "orb", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
          el("stop", { offset: "0%", stopColor: GREEN }), el("stop", { offset: "100%", stopColor: YELLOW }),
        ] }),
      ] }),
      // profile-photo echo: two solid rings centred where LinkedIn places the avatar, one orbiting dot
      ring(160, 396, 140, 0.22), ring(160, 396, 175, 0.22),
      dot(160 + 175 * Math.cos((-40 * Math.PI) / 180), 396 + 175 * Math.sin((-40 * Math.PI) / 180), 3, YELLOW),
      // orbit: three rings fading outward; the middle one is the only green → yellow gradient
      ring(CX, CY, 235, 0.12),
      el("circle", { cx: CX, cy: CY, r: 160, fill: "none", stroke: "url(#orb)", strokeOpacity: 0.55, strokeWidth: 1 }),
      ring(CX, CY, 90, 0.28),
      dot(...pt(90, 200), 3, YELLOW), dot(...pt(160, 240), 2.5, "#FFFFFF", 0.4), dot(...pt(235, 150), 2.5, "#FFFFFF", 0.4),
      el("circle", { cx: CX, cy: CY, r: 34, fill: CORE, stroke: YELLOW, strokeOpacity: 0.5, strokeWidth: 1 }),
    ],
  });

const label = (text) => txt(text, { fontSize: 13, fontWeight: 600, color: SECOND, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 });
const number = (text) => txt(text, { fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1 });
const stat = (value, caption) => box({ flexDirection: "column", gap: 5 }, [number(value), label(caption)]);
const rule = () => box({ width: 1, height: 28, background: "rgba(255,255,255,0.14)" });

// drawn, not a font glyph, so it can never fall back to a blank box
const star = () => el("svg", { width: 22, height: 22, viewBox: "0 0 24 24", style: { display: "flex" }, children: [
  el("path", { d: "M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7-6-3.4-6 3.4 1.3-6.7-5-4.7 6.8-.8z", fill: INK }),
] });

export function cover() {
  return box({ width: W, height: H, background: BG, position: "relative", overflow: "hidden", fontFamily: "Nunito Sans" }, [
    at(CX - 520, 150 - 520, { width: 1040, height: 1040, background: "radial-gradient(circle, rgba(250,200,0,0.18) 0%, rgba(250,200,0,0) 65%)" }),
    rings(),

    // text block (starts at x = 420, stays inside x ≤ 1080)
    at(420, 81, { alignItems: "center", gap: 10, height: 16 }, [
      box({ width: 6, height: 6, borderRadius: 999, background: YELLOW }),
      txt("FOUNDING ENGINEER", { fontSize: 13, fontWeight: 700, color: SECOND, letterSpacing: "2px", lineHeight: 1 }),
    ]),
    at(420, 105, { fontSize: 64, fontWeight: 800, color: INK, letterSpacing: "-1.5px", lineHeight: 1, whiteSpace: "nowrap" }, ["Ravi Kovind"]),
    at(420, 176, { alignItems: "center", gap: 9, fontSize: 24, fontWeight: 600, color: SECOND, lineHeight: 1, whiteSpace: "nowrap" }, [
      txt("Taking products from", {}), txt("0 → 1", { color: YELLOW }), txt("· 5+ years", {}),
    ]),
    at(420, 216, { fontSize: 17, fontWeight: 400, color: SECOND, lineHeight: 1, whiteSpace: "nowrap" }, ["Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)"]),
    at(420, 253, { alignItems: "center", gap: 10, fontFamily: "Saira", fontSize: 20, fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap" }, [
      txt("//", { color: YELLOW }), txt("readable over clever. predictable over magic.", { color: SECOND }),
    ]),
    at(420, 296, { alignItems: "center", gap: 24 }, [
      stat("30K+", "Users served"), rule(), stat("80K+", "Orders shipped"), rule(),
      box({ flexDirection: "column", gap: 5 }, [box({ alignItems: "center", gap: 6 }, [star(), number("6.8K")]), label("Open-source stars")]),
    ]),

    // monogram in the orbit core
    at(CX - 34, CY - 34, { width: 68, height: 68, alignItems: "center", justifyContent: "center", fontFamily: "Saira", fontSize: 24, fontWeight: 800, color: INK }, ["RK"]),
  ]);
}
