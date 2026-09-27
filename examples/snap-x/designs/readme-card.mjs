import { FONTS, COLORS, box, txt, H, chip, arrow } from "./_brand.mjs";

export const FORMAT = { width: 1280, height: 640, name: "readme-card.png" };
export { FONTS };

export default function () {
  return box({
    width: 1280, height: 640, background: COLORS.bg, fontFamily: "Saira", position: "relative",
    overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "52px 72px 48px",
  }, [
    // glow + hairline
    box({ position: "absolute", top: -220, right: -160, width: 760, height: 760, background: "radial-gradient(circle, rgba(235,29,37,0.30) 0%, rgba(235,29,37,0) 62%)" }),
    box({ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: COLORS.red }),

    // top bar
    box({ alignItems: "center", justifyContent: "space-between" }, [
      box({ alignItems: "center", gap: 12 }, [
        box({ width: 14, height: 14, background: COLORS.red }),
        txt("SNAP-X", { fontSize: 17, fontWeight: 700, letterSpacing: "0.24em", color: COLORS.ink }),
      ]),
      txt("OPEN SOURCE · MIT", { fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: COLORS.muted }),
    ]),

    // headline
    box({ flexDirection: "column" }, [
      txt("Branded graphics", { ...H(86), color: COLORS.ink }),
      box({ alignItems: "baseline", gap: 8 }, [
        txt("for", { ...H(86), color: COLORS.ink }),
        txt("every platform,", { ...H(86), color: COLORS.red }),
      ]),
      txt("made by your AI agent.", { ...H(86), color: COLORS.ink }),
      txt("Thumbnails, covers, banners, store graphics and more: sized right, checked, and repeatable.", {
        marginTop: 20, fontSize: 19, lineHeight: 1.4, color: COLORS.muted, maxWidth: 900, flexWrap: "wrap",
      }),
    ]),

    // pipeline + command
    box({ alignItems: "center", justifyContent: "space-between" }, [
      box({ alignItems: "center" }, [chip("your project"), arrow(), chip("Claude Code"), arrow(), chip("design.mjs"), arrow(), chip("PNG", true)]),
      box({ fontFamily: "JetBrains Mono", fontSize: 14, color: COLORS.muted, gap: 10 }, [
        txt("$", { color: COLORS.red, fontWeight: 700 }),
        txt("npx @snap-x/cli render designs/*.mjs", { color: COLORS.ink }),
      ]),
    ]),
  ]);
}
