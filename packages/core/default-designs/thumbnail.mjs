import { getTheme } from "../src/themes/index.mjs";
import { lucideIcon } from "../src/icons.mjs";

export const FORMAT = { width: 1280, height: 720, name: "thumbnail.png" };

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };
  const { title = "", description: subtitle = "", domain: eyebrow = "", tags = [] } = config;
  const titleSize = title.length > 50 ? 58 : title.length > 35 ? 70 : title.length > 20 ? 84 : 96;
  const tag = tags[0] ?? "";

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 720, background: t.bg, display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: t.fontDisplay, padding: "60px 72px", position: "relative", overflow: "hidden" },
      children: [
        { type: "div", props: { style: { position: "absolute", bottom: -80, right: -80, width: 500, height: 500, background: `radial-gradient(circle, ${t.accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        eyebrow ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          lucideIcon("Rocket", { size: 16, color: t.accent }),
          { type: "div", props: { style: { color: t.accent, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex" }, children: [eyebrow] } },
        ]}} : { type: "div", props: { style: { display: "flex" }, children: [] } },
        { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }, children: [
          { type: "div", props: { style: { color: t.text, fontSize: titleSize, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.03em", display: "flex", flexWrap: "wrap", maxWidth: 1000 }, children: [title] } },
          subtitle ? { type: "div", props: { style: { color: t.textMuted, fontSize: 22, fontWeight: 400, lineHeight: 1.4, display: "flex", flexWrap: "wrap", maxWidth: 820 }, children: [subtitle] } } : null,
        ].filter(Boolean) }},
        tag ? { type: "div", props: { style: { display: "flex" }, children: [
          { type: "div", props: { style: { background: t.accent, color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 18px", borderRadius: 6, display: "flex" }, children: [tag] } },
        ]}} : { type: "div", props: { style: { display: "flex" }, children: [] } },
      ],
    },
  };
}
