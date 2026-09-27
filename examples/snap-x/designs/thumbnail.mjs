import { FONTS, COLORS, box, txt, H, chip, arrow, brand, glow, root } from "./_brand.mjs";

export const FORMAT = { width: 1280, height: 720, name: "thumbnail.png" };
export { FONTS };

export default function () {
  return root(1280, 720, { flexDirection: "column", justifyContent: "space-between", padding: "60px 80px 60px" }, [
    glow({ top: -240, right: -180, width: 900, height: 900 }),
    box({ alignItems: "center", justifyContent: "space-between" }, [
      brand(20),
      txt("/snap-x · Claude Code skill", { fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", color: COLORS.muted }),
    ]),
    box({ flexDirection: "column" }, [
      txt("Branded graphics", { ...H(92), color: COLORS.ink }),
      box({ alignItems: "baseline", gap: 8 }, [
        txt("for", { ...H(92), color: COLORS.ink }),
        txt("every platform,", { ...H(92), color: COLORS.red }),
      ]),
      txt("made by your AI agent.", { ...H(92), color: COLORS.ink }),
    ]),
    box({ alignItems: "center" }, [chip("your project", false, true), arrow(22, 14), chip("Claude Code", false, true), arrow(22, 14), chip("design.mjs", false, true), arrow(22, 14), chip("PNG", true, true)]),
  ]);
}
