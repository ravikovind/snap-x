import { getTheme } from "../src/themes/index.mjs";

export const FORMAT = { width: 1080, height: 1920, name: "poster.png" };

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };
  const { title = "", description: subtitle = "", domain: eyebrow = "", domain: footer = "" } = config;
  const titleSize = title.length > 60 ? 58 : title.length > 40 ? 68 : title.length > 25 ? 80 : 96;

  return {
    type: "div",
    props: {
      style: { width: 1080, height: 1920, background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: t.fontDisplay, padding: "80px", position: "relative", overflow: "hidden", gap: 24 },
      children: [
        { type: "div", props: { style: { position: "absolute", top: "50%", left: "50%", width: 900, height: 900, marginTop: -450, marginLeft: -450, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.07")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        ...[{ top: 32, left: 32 }, { top: 32, right: 32 }, { bottom: 32, left: 32 }, { bottom: 32, right: 32 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: t.accentMuted, fontSize: 20, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),
        eyebrow ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          { type: "div", props: { style: { width: 8, height: 8, borderRadius: 999, background: t.accent, display: "flex" }, children: [] } },
          { type: "div", props: { style: { color: t.accent, fontSize: 15, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: [eyebrow] } },
        ]}} : null,
        { type: "div", props: { style: { color: t.text, fontSize: titleSize, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.025em", display: "flex", flexWrap: "wrap", justifyContent: "center", textAlign: "center" }, children: [title] } },
        subtitle ? { type: "div", props: { style: { color: t.textMuted, fontSize: 24, fontWeight: 400, lineHeight: 1.4, display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 760 }, children: [subtitle] } } : null,
        footer ? { type: "div", props: { style: { position: "absolute", bottom: 48, display: "flex", alignItems: "center", gap: 10 }, children: [
          { type: "div", props: { style: { height: 1, width: 40, background: t.accentMuted, display: "flex" }, children: [] } },
          { type: "div", props: { style: { color: t.textMuted, fontSize: 15, letterSpacing: "0.08em", display: "flex" }, children: [footer] } },
          { type: "div", props: { style: { height: 1, width: 40, background: t.accentMuted, display: "flex" }, children: [] } },
        ]}} : null,
      ].filter(Boolean),
    },
  };
}
