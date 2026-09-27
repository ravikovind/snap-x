import { FONTS, COLORS, box, txt, H, chip, arrow, brand, glow, command, root } from "./_brand.mjs";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export { FONTS };

export default function () {
  return root(1200, 630, { flexDirection: "column", justifyContent: "space-between", padding: "56px 72px 56px" }, [
    glow({ top: -260, right: -200 }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 6, background: COLORS.red }),
    box({ alignItems: "center", justifyContent: "space-between" }, [
      brand(),
      txt("OPEN SOURCE · MIT", { fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: COLORS.muted }),
    ]),
    box({ flexDirection: "column" }, [
      txt("Branded graphics", { ...H(90), color: COLORS.ink }),
      box({ alignItems: "baseline", gap: 8 }, [
        txt("for", { ...H(90), color: COLORS.ink }),
        txt("every platform,", { ...H(90), color: COLORS.red }),
      ]),
      txt("made by your AI agent.", { ...H(90), color: COLORS.ink }),
    ]),
    box({ alignItems: "center", justifyContent: "space-between", padding: "16px 22px", border: `1px solid ${COLORS.line}`, borderRadius: 14, background: "rgba(255,255,255,0.03)" }, [
      command(20),
      box({ alignItems: "center" }, [txt("every platform", { fontSize: 15, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.14em" }), arrow(16, 12), txt("PNG", { fontSize: 15, fontWeight: 900, color: COLORS.red, letterSpacing: "0.14em" })]),
    ]),
  ]);
}
