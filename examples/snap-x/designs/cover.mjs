import { FONTS, COLORS, box, txt, H, glow, command, root } from "./_brand.mjs";

export const FORMAT = { width: 1500, height: 500, name: "cover.png" };
export { FONTS };

// the three pillars (repositioning.md §1.3), always in this order
const pillar = (n, title, sub, hot) => box({ alignItems: "center", gap: 18 }, [
  txt(n, { fontFamily: "JetBrains Mono", fontSize: 14, fontWeight: 700, color: hot ? COLORS.red : COLORS.muted, width: 26 }),
  box({ flexDirection: "column", gap: 2 }, [
    txt(title, { fontSize: 23, fontWeight: 700, color: hot ? COLORS.red : COLORS.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }),
    txt(sub, { fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.muted, whiteSpace: "nowrap" }),
  ]),
]);

export default function () {
  return root(1500, 500, { alignItems: "center", padding: "0 96px 0 190px", gap: 70 }, [
    glow({ top: -300, right: 200, width: 800, height: 800 }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 5, background: COLORS.red }),
    box({ flexDirection: "column", gap: 30 }, [
      box({ flexDirection: "column" }, [
        txt("Branded graphics", { ...H(66), color: COLORS.ink }),
        box({ alignItems: "baseline", gap: 8 }, [
          txt("for", { ...H(66), color: COLORS.ink }),
          txt("every platform,", { ...H(66), color: COLORS.red }),
        ]),
        txt("made by your AI agent.", { ...H(66), color: COLORS.ink }),
      ]),
      command(15),
    ]),
    box({ width: 1, height: 300, background: COLORS.line }),
    box({ flexDirection: "column", gap: 26 }, [
      pillar("01", "Your brand in, every platform out.", "reads your project, finds the real logo & fonts"),
      pillar("02", "Correct for each platform.", "19 formats, safe-zone guides, checked"),
      pillar("03", "Exact and repeatable.", "real logo embedded, re-render a whole series", true),
    ]),
  ]);
}
