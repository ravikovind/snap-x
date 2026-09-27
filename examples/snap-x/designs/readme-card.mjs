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
const H = (size) => ({ fontSize: size, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.035em", whiteSpace: "nowrap" });

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
    overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "52px 72px 48px",
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
      txt("Branded graphics", { ...H(86), color: INK }),
      box({ alignItems: "baseline", gap: 8 }, [
        txt("for", { ...H(86), color: INK }),
        txt("every platform,", { ...H(86), color: RED }),
      ]),
      txt("made by your AI agent.", { ...H(86), color: INK }),
      txt("Thumbnails, covers, banners, store graphics and more: sized right, checked, and repeatable.", {
        marginTop: 20, fontSize: 19, lineHeight: 1.4, color: MUTED, maxWidth: 900, flexWrap: "wrap",
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
