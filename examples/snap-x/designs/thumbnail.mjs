export const FORMAT = { width: 1280, height: 720, name: "thumbnail.png" };
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
  return root(1280, 720, { flexDirection: "column", justifyContent: "space-between", padding: "60px 80px 60px" }, [
    glow({ top: -240, right: -180, width: 900, height: 900 }),
    box({ alignItems: "center", justifyContent: "space-between" }, [
      brand(20),
      txt("/snap-x · Claude Code skill", { fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", color: MUTED }),
    ]),
    box({ flexDirection: "column" }, [
      txt("Claude writes it.", { ...H(122), color: INK }),
      box({ alignItems: "baseline", gap: 28 }, [
        txt("snap-x", { ...H(122), color: RED }),
        txt("renders it.", { ...H(122), color: INK }),
      ]),
    ]),
    box({ alignItems: "center" }, [chip("your project", false, true), arrow(22, 14), chip("Claude Code", false, true), arrow(22, 14), chip("design.mjs", false, true), arrow(22, 14), chip("PNG", true, true)]),
  ]);
}
