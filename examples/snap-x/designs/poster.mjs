export const FORMAT = { width: 1080, height: 1920, name: "poster.png" };
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

const row = (n, label, hot) => box({ alignItems: "center", justifyContent: "space-between", padding: "22px 30px", border: `1px solid ${hot ? RED : LINE}`, background: hot ? RED : "rgba(255,255,255,0.03)", borderRadius: 16 }, [
  txt(label, { fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: hot ? "#fff" : INK }),
  txt(n, { fontFamily: "JetBrains Mono", fontSize: 20, fontWeight: 700, color: hot ? "rgba(255,255,255,0.8)" : MUTED }),
]);

export default function () {
  return root(1080, 1920, { flexDirection: "column", justifyContent: "space-between", padding: "84px 88px 84px" }, [
    glow({ top: -260, right: -300, width: 1100, height: 1100 }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 8, background: RED }),
    box({ alignItems: "center", justifyContent: "space-between" }, [
      brand(26),
      txt("OPEN SOURCE · MIT", { fontSize: 18, fontWeight: 700, letterSpacing: "0.2em", color: MUTED }),
    ]),
    box({ flexDirection: "column" }, [
      txt("Claude", { ...H(164), color: INK }),
      txt("writes it.", { ...H(164), color: INK }),
      txt("snap-x", { ...H(164), color: RED, marginTop: 24 }),
      txt("renders it.", { ...H(164), color: INK }),
      txt("Point Claude Code at any project. It writes a design.mjs; snap-x turns it into a PNG. Any format, any size, no browser.", {
        marginTop: 44, fontSize: 32, lineHeight: 1.4, color: MUTED, maxWidth: 820, flexWrap: "wrap",
      }),
    ]),
    box({ flexDirection: "column", gap: 14 }, [
      row("01", "your project"), row("02", "Claude Code  →  design.mjs"), row("03", "snap-x render"), row("04", "PNG", true),
      box({ marginTop: 26, justifyContent: "center" }, [command(24)]),
    ]),
  ]);
}
