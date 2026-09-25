export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "JetBrains Mono", weights: [400, 700] },
];

const RED = "#eb1d25";
const INK = "#f5f5f5";
const MUTED = "rgba(255,255,255,0.52)";
const LINE = "rgba(255,255,255,0.14)";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);
const H = (size) => ({ fontSize: size, fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.045em", whiteSpace: "nowrap" });

const chip = (label, filled, big) =>
  box({
    padding: big ? "10px 24px" : "7px 16px", borderRadius: 999, fontFamily: "JetBrains Mono", fontSize: big ? 20 : 14, fontWeight: 700,
    color: filled ? "#fff" : INK, background: filled ? RED : "transparent", border: `1px solid ${filled ? RED : LINE}`,
  }, [label]);
const arrow = (size = 16, m = 10) => txt("→", { color: MUTED, fontSize: size, margin: `0 ${m}px` });
const brand = (size = 17) => box({ alignItems: "center", gap: 12 }, [
  box({ width: size * 0.8, height: size * 0.8, background: RED }),
  txt("SNAP-X", { fontSize: size, fontWeight: 700, letterSpacing: "0.24em", color: INK }),
]);
const glow = (extra) => box({ position: "absolute", width: 760, height: 760, background: "radial-gradient(circle, rgba(235,29,37,0.30) 0%, rgba(235,29,37,0) 62%)", ...extra });
const command = (size = 14) => box({ fontFamily: "JetBrains Mono", fontSize: size, color: MUTED, gap: 10 }, [
  txt("$", { color: RED, fontWeight: 700 }), txt("npx @snap-x/cli render designs/*.mjs", { color: INK }),
]);
const root = (w, h, style, children) => box({ width: w, height: h, background: "#070707", fontFamily: "Saira", position: "relative", overflow: "hidden", ...style }, children);

export default function () {
  return root(1200, 630, { flexDirection: "column", justifyContent: "space-between", padding: "56px 72px 56px" }, [
    glow({ top: -260, right: -200 }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 6, background: RED }),
    box({ alignItems: "center", justifyContent: "space-between" }, [
      brand(),
      txt("OPEN SOURCE · MIT", { fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: MUTED }),
    ]),
    box({ flexDirection: "column" }, [
      txt("Claude writes it.", { ...H(118), color: INK }),
      box({ alignItems: "baseline", gap: 28 }, [
        txt("snap-x", { ...H(118), color: RED }),
        txt("renders it.", { ...H(118), color: INK }),
      ]),
    ]),
    box({ alignItems: "center", justifyContent: "space-between", padding: "16px 22px", border: `1px solid ${LINE}`, borderRadius: 14, background: "rgba(255,255,255,0.03)" }, [
      command(20),
      box({ alignItems: "center" }, [txt("any format", { fontSize: 15, fontWeight: 700, color: MUTED, letterSpacing: "0.14em" }), arrow(16, 12), txt("PNG", { fontSize: 15, fontWeight: 900, color: RED, letterSpacing: "0.14em" })]),
    ]),
  ]);
}
