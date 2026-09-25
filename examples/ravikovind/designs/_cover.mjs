// Shared builder for the LinkedIn cover (files starting with "_" are helpers, not rendered on their own).
// Everything is laid out on a 1584×396 canvas exactly as specified in ../plan.md.

export const FONTS = [
  { family: "Inter", weights: [400, 500, 600, 700] },
  { family: "JetBrains Mono", weights: [400] },
];

export const W = 1584;
export const H = 396;

const BG = "#0A0A0B";
const INK = "#F5F5F4";
const SECOND = "#A1A1AA";
const PHIL = "#8B8B95"; // plan says #71717A (4.09:1) but its own QA gate needs ≥4.5:1 → lifted to 5.87:1
const LABEL = "#52525B"; // decorative node labels, as specified
const CYAN = "#22D3EE";
const VIOLET = "#A78BFA";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);
const at = (left, top, style, children) => box({ position: "absolute", left, top, ...style }, children);
const el = (type, props) => ({ type, props });

const CX = 1450, CY = 198; // centre of the big orbit system
const pt = (r, deg) => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)];

const dotGrid = () => {
  let d = "";
  for (let y = 12; y < H; y += 24) for (let x = 12; x < W; x += 24) d += `M${x} ${y}h0`;
  return d;
};

const dot = (x, y, r, fill, opacity = 1) => el("circle", { cx: x, cy: y, r, fill, fillOpacity: opacity });
const ring = (r, opacity, extra = {}) => el("circle", { cx: CX, cy: CY, r, fill: "none", stroke: "#FFFFFF", strokeOpacity: opacity, strokeWidth: 1, ...extra });
const line = (x1, y1, x2, y2) => el("line", { x1, y1, x2, y2, stroke: "#FFFFFF", strokeOpacity: 0.12, strokeWidth: 1 });

const graphic = () => {
  const [rx, ry] = pt(290, 180); // ring node that the node-graph flows into
  const nodes = { n1: [1118, 262], n2: [1118, 198], n3: [1118, 150], n4: [1210, 198], n5: [1210, 150] };
  return el("svg", {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: { position: "absolute", left: 0, top: 0, display: "flex" },
    children: [
      el("defs", { children: [
        el("linearGradient", { id: "orb", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
          el("stop", { offset: "0%", stopColor: CYAN }), el("stop", { offset: "100%", stopColor: VIOLET }),
        ] }),
      ] }),
      // dot grid
      el("path", { d: dotGrid(), stroke: "#FFFFFF", strokeOpacity: 0.06, strokeWidth: 1.2, strokeLinecap: "round", fill: "none" }),
      // profile-photo echo rings (centre = where LinkedIn puts the avatar)
      el("circle", { cx: 160, cy: 396, r: 140, fill: "none", stroke: "#FFFFFF", strokeOpacity: 0.1, strokeWidth: 1 }),
      el("circle", { cx: 160, cy: 396, r: 175, fill: "none", stroke: "#FFFFFF", strokeOpacity: 0.1, strokeWidth: 1, strokeDasharray: "4 6" }),
      dot(160 + 175 * Math.cos((-40 * Math.PI) / 180), 396 + 175 * Math.sin((-40 * Math.PI) / 180), 3, CYAN),
      // big orbit
      ring(290, 0.06), ring(215, 0.1),
      el("circle", { cx: CX, cy: CY, r: 150, fill: "none", stroke: "url(#orb)", strokeOpacity: 0.4, strokeWidth: 1 }),
      ring(90, 0.22),
      dot(...pt(90, 200), 3.5, CYAN), dot(...pt(150, 35), 3, "#FFFFFF", 0.4), dot(...pt(215, 120), 4, CYAN),
      dot(...pt(215, 300), 3, "#FFFFFF", 0.4), dot(...pt(290, 250), 3.5, "#FFFFFF", 0.4), dot(rx, ry, 3.5, CYAN),
      el("circle", { cx: CX, cy: CY, r: 34, fill: "#16161A", stroke: CYAN, strokeOpacity: 0.5, strokeWidth: 1 }),
      // node graph bridge → flows into the orbit's outer ring at (rx, ry)
      line(...nodes.n1, ...nodes.n2), line(...nodes.n3, ...nodes.n2), line(...nodes.n2, rx, ry),
      line(rx, ry, ...nodes.n4), line(...nodes.n4, ...nodes.n5),
      ...Object.values(nodes).map(([x, y]) => dot(x, y, 4, "#FFFFFF", 0.4)),
      // a few accent pixels in empty grid areas
      dot(252, 92, 1, CYAN, 0.9), dot(338, 176, 1, CYAN, 0.9), dot(232, 214, 1, CYAN, 0.9),
    ],
  });
};

const stat = (value, label) => box({ flexDirection: "column", gap: 4 }, [
  txt(value, { fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1 }),
  txt(label, { fontSize: 13, fontWeight: 500, color: SECOND, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }),
]);
const rule = () => box({ width: 1, height: 28, background: "rgba(255,255,255,0.12)" });

const star = () => el("svg", { width: 22, height: 22, viewBox: "0 0 24 24", style: { display: "flex", marginTop: 1 }, children: [
  el("path", { d: "M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7-6-3.4-6 3.4 1.3-6.7-5-4.7 6.8-.8z", fill: INK }),
] });

export function cover() {
  return box({ width: W, height: H, background: BG, position: "relative", overflow: "hidden", fontFamily: "Inter" }, [
    at(300, -320, { width: 1040, height: 1040, background: "radial-gradient(circle, #121216 0%, rgba(18,18,22,0) 70%)" }),
    graphic(),

    // text block (starts at x = 420, stays inside x ≤ 1080)
    at(420, 81, { alignItems: "center", gap: 10, height: 16 }, [
      box({ width: 6, height: 6, borderRadius: 999, background: CYAN }),
      txt("FOUNDING ENGINEER", { fontSize: 13, fontWeight: 600, color: SECOND, letterSpacing: "2px", lineHeight: 1 }),
    ]),
    at(420, 103, { fontSize: 64, fontWeight: 700, color: INK, letterSpacing: "-1.5px", lineHeight: 1, whiteSpace: "nowrap" }, ["Ravi Kovind"]),
    at(420, 175, { alignItems: "center", gap: 9, fontSize: 24, fontWeight: 500, color: SECOND, lineHeight: 1, whiteSpace: "nowrap" }, [
      txt("Taking products from", {}), txt("0 → 1", { color: CYAN }), txt("· 5+ years", {}),
    ]),
    at(420, 215, { fontSize: 17, fontWeight: 400, color: "#8D8D94", lineHeight: 1, whiteSpace: "nowrap" }, ["Full-Stack · Mobile · Backend · Infrastructure · AI (MCP)"]),
    at(420, 254, { alignItems: "center", gap: 10, fontFamily: "JetBrains Mono", fontSize: 18, lineHeight: 1, whiteSpace: "nowrap" }, [
      txt("//", { color: CYAN }), txt("readable over clever. predictable over magic.", { color: PHIL }),
    ]),
    at(420, 299, { alignItems: "center", gap: 24 }, [
      stat("30K+", "Users served"), rule(), stat("80K+", "Orders shipped"), rule(),
      box({ flexDirection: "column", gap: 4 }, [
        box({ alignItems: "center", gap: 6 }, [star(), txt("6.8K", { fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1 })]),
        txt("Open-source stars", { fontSize: 13, fontWeight: 500, color: SECOND, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }),
      ]),
    ]),

    // node labels + monogram + footer tag
    at(1128, 254, { fontFamily: "JetBrains Mono", fontSize: 11, color: LABEL }, ["app"]),
    at(1128, 132, { fontFamily: "JetBrains Mono", fontSize: 11, color: LABEL }, ["api"]),
    at(1218, 132, { fontFamily: "JetBrains Mono", fontSize: 11, color: LABEL }, ["mcp"]),
    at(CX - 34, CY - 34, { width: 68, height: 68, alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: INK }, ["RK"]),
    box({ position: "absolute", right: 214, top: 338, fontFamily: "JetBrains Mono", fontSize: 12, color: LABEL }, ["ravikovind.github.io"]),
  ]);
}

// Debug layer for the QA overlay: LinkedIn avatar circle, mobile side crops, top/bottom chrome, safe area.
export function qaLayer() {
  const band = (l, t, w, h) => at(l, t, { width: w, height: h, background: "rgba(255,40,60,0.16)" });
  return box({ position: "absolute", left: 0, top: 0, width: W, height: H }, [
    band(0, 0, 200, H), band(1384, 0, 200, H), band(200, 0, 1184, 30), band(200, 366, 1184, 30),
    at(160 - 115, 396 - 115, { width: 230, height: 230, borderRadius: 999, border: "2px solid rgba(255,40,60,0.9)", background: "rgba(255,40,60,0.14)" }),
    at(380, 50, { width: 1004, height: 296, border: "1px dashed rgba(34,211,238,0.9)" }),
  ]);
}
