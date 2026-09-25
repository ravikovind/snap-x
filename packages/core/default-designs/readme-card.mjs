import { getTheme } from "../src/themes/index.mjs";
import { lucideIcon } from "../src/icons.mjs";

export const FORMAT = { width: 1280, height: 640, name: "readme-card.png" };

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };
  const { title: name = "", description = "", stack = [], owner = "" } = config;
  const nameFontSize = name.length > 25 ? 52 : name.length > 18 ? 62 : 72;

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 640, background: t.bg, display: "flex", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        { type: "div", props: { style: { width: 5, alignSelf: "stretch", flexShrink: 0, background: `linear-gradient(to bottom, ${t.accent} 0%, ${t.accentMuted} 60%, transparent 100%)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: -80, right: -80, width: 500, height: 500, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.08")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        {
          type: "div",
          props: {
            style: { flex: 1, display: "flex", flexDirection: "column", padding: "56px 72px 52px" },
            children: [
              { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }, children: [
                { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                  owner ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                    lucideIcon("Layers", { size: 14, color: t.textMuted }),
                    { type: "div", props: { style: { color: t.textMuted, fontSize: 16, fontWeight: 400, letterSpacing: "0.04em", display: "flex" }, children: [owner] } },
                  ]}} : null,
                  { type: "div", props: { style: { color: t.text, fontSize: nameFontSize, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", display: "flex", flexWrap: "wrap" }, children: [name] } },
                ].filter(Boolean) }},
                description ? { type: "div", props: { style: { color: t.textMuted, fontSize: 22, fontWeight: 400, lineHeight: 1.5, maxWidth: 860, display: "flex", flexWrap: "wrap", borderLeft: `2px solid ${t.accentMuted}`, paddingLeft: 20 }, children: [description.length > 140 ? description.slice(0, 140).trimEnd() + "…" : description] }} : null,
              ].filter(Boolean) }},
              stack.length > 0 ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: stack.slice(0, 6).map(s => ({
                type: "div", props: { style: { border: `1px solid ${t.borderAccent}`, borderRadius: 6, padding: "7px 16px", color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", display: "flex" }, children: [s] }
              }))}} : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}
