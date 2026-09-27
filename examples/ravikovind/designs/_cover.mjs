// Shared builder for the LinkedIn cover (files starting with "_" are helpers, not rendered on their own).
// Layout, copy, colours and type are specified in ../plan.md (revision 4) on a 1584×396 canvas.

export const FONTS = [{ family: "Saira", weights: [400, 500, 600, 700, 800] }];

export const W = 1584;
export const H = 396;

const BG = "#000000";
const INK = "#F5F5F5";
const SECOND = "rgba(255,255,255,0.60)";
const RED = "#D83427"; // VoltVave's real brand red, sampled from their logo (voltvave.com/images/voltvave.png)
const CORE = "#141414";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);
const at = (left, top, style, children) => box({ position: "absolute", left, top, ...style }, children);
const el = (type, props) => ({ type, props });

const CX = 1450, CY = 198; // orbit centre
const pt = (r, deg) => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)];
const dot = (x, y, r, fill, opacity = 1) => el("circle", { cx: x, cy: y, r, fill, fillOpacity: opacity });
const ring = (cx, cy, r, opacity) => el("circle", { cx, cy, r, fill: "none", stroke: RED, strokeOpacity: opacity, strokeWidth: 1 });

const rings = () =>
  el("svg", {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: { position: "absolute", left: 0, top: 0, display: "flex" },
    children: [
      // profile-photo echo: two solid rings centred where LinkedIn places the avatar, one orbiting dot
      ring(160, 396, 140, 0.22), ring(160, 396, 175, 0.22),
      dot(160 + 175 * Math.cos((-40 * Math.PI) / 180), 396 + 175 * Math.sin((-40 * Math.PI) / 180), 3, RED),
      // orbit: three red rings fading outward
      ring(CX, CY, 235, 0.12), ring(CX, CY, 160, 0.20), ring(CX, CY, 90, 0.28),
      dot(...pt(90, 200), 3, RED), dot(...pt(160, 240), 2.5, "#FFFFFF", 0.4), dot(...pt(235, 150), 2.5, "#FFFFFF", 0.4),
      el("circle", { cx: CX, cy: CY, r: 34, fill: CORE, stroke: RED, strokeOpacity: 0.5, strokeWidth: 1 }),
    ],
  });

const label = (text) => txt(text, { fontSize: 13, fontWeight: 600, color: SECOND, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 });
const number = (text) => txt(text, { fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1 });
const stat = (value, caption) => box({ flexDirection: "column", gap: 5 }, [number(value), label(caption)]);
const rule = () => box({ width: 1, height: 28, background: "rgba(255,255,255,0.14)" });

export function cover() {
  return box({ width: W, height: H, background: BG, position: "relative", overflow: "hidden", fontFamily: "Saira" }, [
    at(CX - 520, 150 - 520, { width: 1040, height: 1040, background: "radial-gradient(circle, rgba(216,52,39,0.18) 0%, rgba(216,52,39,0) 65%)" }),
    rings(),

    // text block (starts at x = 420, stays inside x ≤ 1080)
    at(420, 81, { alignItems: "center", gap: 10, height: 16 }, [
      box({ width: 6, height: 6, borderRadius: 999, background: RED }),
      txt("FOUNDING ENGINEER", { fontSize: 13, fontWeight: 700, color: SECOND, letterSpacing: "2px", lineHeight: 1 }),
    ]),
    at(420, 105, { fontSize: 64, fontWeight: 800, color: INK, letterSpacing: "-1.5px", lineHeight: 1, whiteSpace: "nowrap" }, ["Ravi Kovind"]),
    at(420, 176, { alignItems: "center", gap: 9, fontSize: 24, fontWeight: 600, color: SECOND, lineHeight: 1, whiteSpace: "nowrap" }, [
      txt("Taking products from", {}), txt("0 → 1", { color: RED }), txt("· 5+ years", {}),
    ]),
    at(420, 216, { fontSize: 17, fontWeight: 400, color: SECOND, lineHeight: 1, whiteSpace: "nowrap" }, ["Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)"]),
    at(420, 253, { alignItems: "center", gap: 10, fontSize: 20, fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap" }, [
      txt("//", { color: RED }), txt("readable over clever. predictable over magic.", { color: SECOND }),
    ]),
    at(420, 296, { alignItems: "center", gap: 24 }, [
      stat("30K+", "Users served"), rule(), stat("100K+", "Orders shipped"), rule(), stat("21.3K", "Weekly downloads"),
    ]),

    // monogram in the orbit core
    at(CX - 34, CY - 34, { width: 68, height: 68, alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: INK }, ["RK"]),
  ]);
}
