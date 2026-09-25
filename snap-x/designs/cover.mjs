import { getTheme } from "../../packages/core/src/themes/index.mjs";
import { lucideIcon } from "../../packages/core/src/icons.mjs";

export const FORMAT = { width: 1500, height: 500, name: "cover.png" };

const FORMATS = [
  { label: "OG",        size: "1200×630" },
  { label: "Thumbnail", size: "1280×720" },
  { label: "Cover",     size: "1500×500" },
  { label: "Poster",    size: "1080×1920" },
  { label: "README",    size: "1280×640" },
];

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };

  return {
    type: "div",
    props: {
      style: { width: 1500, height: 500, background: t.bg, display: "flex", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        // Top accent line
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${t.accent}, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // Bottom accent line
        { type: "div", props: { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // Glow left
        { type: "div", props: { style: { position: "absolute", top: -80, left: -60, width: 500, height: 500, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.08")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // Corner marks
        ...[{ top: 18, left: 20 }, { top: 18, right: 20 }, { bottom: 18, left: 20 }, { bottom: 18, right: 20 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: t.accentMuted, fontSize: 16, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),

        // Main layout
        {
          type: "div",
          props: {
            style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", alignItems: "center", padding: "0 88px", gap: 80 },
            children: [
              // Left: brand
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 12, flex: "none" }, children: [
                { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                  lucideIcon("Zap", { size: 20, color: t.accent }),
                  { type: "div", props: { style: { color: t.accent, fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex" }, children: ["Open Source"] } },
                ]}},
                { type: "div", props: { style: { color: t.text, fontSize: 100, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 18, lineHeight: 1.4, display: "flex", flexWrap: "wrap", maxWidth: 440 }, children: ["Turn any project into a full social image pack. One command. No browser."] } },
              ]}},
              // Divider
              { type: "div", props: { style: { width: 1, height: 300, background: `linear-gradient(to bottom, transparent, ${t.accentMuted}, transparent)`, display: "flex", flex: "none" }, children: [] } },
              // Right: format list
              { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", gap: 0 }, children: [
                { type: "div", props: { style: { color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, display: "flex" }, children: ["5 formats generated"] } },
                ...FORMATS.map((f, i) => ({
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 14, borderTop: i === 0 ? "none" : `1px solid ${t.borderAccent}` },
                    children: [
                      { type: "div", props: { style: { color: t.text, fontSize: 20, fontWeight: 800, display: "flex" }, children: [f.label] } },
                      { type: "div", props: { style: { color: t.accent, fontSize: 14, fontWeight: 600, fontFamily: "monospace", display: "flex" }, children: [f.size] } },
                    ],
                  },
                })),
              ]}},
            ],
          },
        },
      ],
    },
  };
}
