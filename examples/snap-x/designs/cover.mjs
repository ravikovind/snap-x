export const FORMAT = { width: 1500, height: 500, name: "cover.png" };
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

const step = (n, title, sub, hot) => box({ alignItems: "center", gap: 18 }, [
  txt(n, { fontFamily: "JetBrains Mono", fontSize: 14, fontWeight: 700, color: hot ? RED : MUTED, width: 26 }),
  box({ flexDirection: "column", gap: 2 }, [
    txt(title, { fontSize: 25, fontWeight: 700, color: hot ? RED : INK, letterSpacing: "-0.01em" }),
    txt(sub, { fontFamily: "JetBrains Mono", fontSize: 13, color: MUTED }),
  ]),
]);

export default function () {
  return root(1500, 500, { alignItems: "center", padding: "0 96px", gap: 90 }, [
    glow({ top: -300, right: 200, width: 800, height: 800 }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 5, background: RED }),
    box({ flexDirection: "column", gap: 30 }, [
      box({ flexDirection: "column" }, [
        txt("Claude writes it.", { ...H(100), color: INK }),
        box({ alignItems: "baseline", gap: 24 }, [txt("snap-x", { ...H(100), color: RED }), txt("renders it.", { ...H(100), color: INK })]),
      ]),
      command(15),
    ]),
    box({ width: 1, height: 300, background: LINE }),
    box({ flexDirection: "column", gap: 22 }, [
      step("01", "your project", "package.json · README · assets"),
      step("02", "Claude Code", "writes design.mjs  (/snap-x)"),
      step("03", "snap-x render", "Satori → resvg, no browser"),
      step("04", "PNG", "any format · any size", true),
    ]),
  ]);
}
