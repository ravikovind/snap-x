export const FORMAT = { width: 1280, height: 640, name: "readme-card.png" };
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

const chip = (label, filled) =>
  box({
    padding: "7px 16px", borderRadius: 999, fontFamily: "JetBrains Mono", fontSize: 14, fontWeight: 700,
    color: filled ? "#fff" : INK, background: filled ? RED : "transparent",
    border: `1px solid ${filled ? RED : LINE}`,
  }, [label]);

const arrow = () => txt("→", { color: MUTED, fontSize: 16, margin: "0 10px" });

export default function () {
  return box({
    width: 1280, height: 640, background: "#070707", fontFamily: "Saira", position: "relative",
    overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "56px 72px 52px",
  }, [
    // glow + hairline
    box({ position: "absolute", top: -220, right: -160, width: 760, height: 760, background: "radial-gradient(circle, rgba(235,29,37,0.30) 0%, rgba(235,29,37,0) 62%)" }),
    box({ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: RED }),

    // top bar
    box({ alignItems: "center", justifyContent: "space-between" }, [
      box({ alignItems: "center", gap: 12 }, [
        box({ width: 14, height: 14, background: RED }),
        txt("SNAP-X", { fontSize: 17, fontWeight: 700, letterSpacing: "0.24em", color: INK }),
      ]),
      txt("OPEN SOURCE · MIT", { fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: MUTED }),
    ]),

    // headline
    box({ flexDirection: "column" }, [
      txt("Claude writes it.", { fontSize: 112, fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.045em", color: INK }),
      box({ alignItems: "baseline", gap: 26 }, [
        txt("snap-x", { fontSize: 112, fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.045em", color: RED }),
        txt("renders it.", { fontSize: 112, fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.045em", color: INK }),
      ]),
      txt("Point Claude Code at any project. It writes a design.mjs; snap-x turns it into a PNG. Any format, any size, no browser.", {
        marginTop: 26, fontSize: 22, lineHeight: 1.45, color: MUTED, maxWidth: 780, flexWrap: "wrap",
      }),
    ]),

    // pipeline + command
    box({ alignItems: "center", justifyContent: "space-between" }, [
      box({ alignItems: "center" }, [chip("your project"), arrow(), chip("Claude Code"), arrow(), chip("design.mjs"), arrow(), chip("PNG", true)]),
      box({ fontFamily: "JetBrains Mono", fontSize: 14, color: MUTED, gap: 10 }, [
        txt("$", { color: RED, fontWeight: 700 }),
        txt("npx @snap-x/cli render designs/*.mjs", { color: INK }),
      ]),
    ]),
  ]);
}
