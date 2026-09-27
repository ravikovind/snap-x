import { FONTS, COLORS, box, txt, H, brand, glow, command, root } from "./_brand.mjs";

export const FORMAT = { width: 1080, height: 1920, name: "poster.png" };
export { FONTS };

// the three pillars (repositioning.md §1.3), always in this order
const pillar = (n, label, hot) => box({ alignItems: "center", justifyContent: "space-between", padding: "22px 30px", border: `1px solid ${hot ? COLORS.red : COLORS.line}`, background: hot ? COLORS.red : "rgba(255,255,255,0.03)", borderRadius: 16 }, [
  txt(label, { fontFamily: "JetBrains Mono", fontSize: 24, fontWeight: 700, color: hot ? "#fff" : COLORS.ink, whiteSpace: "nowrap" }),
  txt(n, { fontFamily: "JetBrains Mono", fontSize: 20, fontWeight: 700, color: hot ? "rgba(255,255,255,0.8)" : COLORS.muted }),
]);

export default function () {
  return root(1080, 1920, { flexDirection: "column", justifyContent: "space-between", padding: "84px 88px 84px" }, [
    glow({ top: -260, right: -300, width: 1100, height: 1100 }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 8, background: COLORS.red }),
    box({ alignItems: "center", justifyContent: "space-between" }, [
      brand(26),
      txt("OPEN SOURCE · MIT", { fontSize: 18, fontWeight: 700, letterSpacing: "0.2em", color: COLORS.muted }),
    ]),
    box({ flexDirection: "column" }, [
      txt("Branded", { ...H(140), color: COLORS.ink }),
      txt("graphics for", { ...H(140), color: COLORS.ink }),
      txt("every", { ...H(140), color: COLORS.red }),
      txt("platform,", { ...H(140), color: COLORS.red }),
      txt("made by", { ...H(140), color: COLORS.ink, marginTop: 20 }),
      txt("your AI", { ...H(140), color: COLORS.ink }),
      txt("agent.", { ...H(140), color: COLORS.ink }),
      txt("Thumbnails, covers, banners, store graphics and more: sized right, checked, and repeatable.", {
        marginTop: 44, fontSize: 30, lineHeight: 1.4, color: COLORS.muted, maxWidth: 860, flexWrap: "wrap",
      }),
    ]),
    box({ flexDirection: "column", gap: 14 }, [
      pillar("01", "Your brand in, every platform out."),
      pillar("02", "Correct for each platform."),
      pillar("03", "Exact and repeatable.", true),
      box({ marginTop: 26, justifyContent: "center" }, [command(24)]),
    ]),
  ]);
}
