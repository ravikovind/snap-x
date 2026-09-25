import { getTheme } from "../../packages/core/src/themes/index.mjs";
import { lucideIcon } from "../../packages/core/src/icons.mjs";

export const FORMAT = { width: 1280, height: 720, name: "thumbnail.png" };

const FEATURES = [
  { icon: "Terminal",   label: "One command",    desc: "snap-x render → 5 PNGs" },
  { icon: "Code",       label: "No browser",     desc: "Pure Node.js, no Puppeteer" },
  { icon: "Zap",        label: "Claude writes",  desc: "AI-generated design files" },
  { icon: "Layers",     label: "5 formats",      desc: "OG · Cover · Poster · More" },
];

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 720, background: t.bg, display: "flex", flexDirection: "row", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        // Left accent bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 5, height: 720, background: `linear-gradient(to bottom, ${t.accent}, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // Border
        { type: "div", props: { style: { position: "absolute", top: 20, left: 20, right: 20, bottom: 20, border: `1px solid ${t.borderAccent}`, borderRadius: 12, display: "flex" }, children: [] } },
        // Glow
        { type: "div", props: { style: { position: "absolute", top: -60, left: -40, width: 400, height: 400, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.08")} 0%, transparent 65%)`, display: "flex" }, children: [] } },

        // LEFT: brand
        {
          type: "div",
          props: {
            style: { width: 680, height: 720, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px 52px 68px" },
            children: [
              // Eyebrow
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                { type: "div", props: { style: { width: 6, height: 6, borderRadius: 999, background: t.accent, display: "flex" }, children: [] } },
                { type: "div", props: { style: { color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", display: "flex" }, children: ["Satori → SVG → PNG · No browser"] } },
              ]}},
              // Center: title + desc
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
                { type: "div", props: { style: { color: t.text, fontSize: 100, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 18, lineHeight: 1.5, display: "flex", flexWrap: "wrap", maxWidth: 480 }, children: ["Turn any project into a full social image pack — one command. Claude writes the designs."] } },
                // CLI pills
                { type: "div", props: { style: { display: "flex", gap: 8 }, children: ["init", "check", "render"].map(cmd => ({
                  type: "div", props: { style: { background: t.accentMuted, borderRadius: 6, padding: "5px 14px", color: t.accent, fontSize: 13, fontWeight: 700, fontFamily: "monospace", display: "flex" }, children: [`snap-x ${cmd}`] }
                }))}},
              ]}},
              // Bottom: npm
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                lucideIcon("Package", { size: 14, color: t.textMuted }),
                { type: "div", props: { style: { color: t.textMuted, fontSize: 14, display: "flex" }, children: ["npm install -g @snap-x/core"] } },
              ]}},
            ],
          },
        },

        // Divider
        { type: "div", props: { style: { width: 1, height: 640, marginTop: 40, background: `linear-gradient(to bottom, transparent, ${t.accentMuted}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

        // RIGHT: feature cards
        {
          type: "div",
          props: {
            style: { flex: 1, height: 720, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 44px 40px 36px", gap: 10 },
            children: FEATURES.map(f => ({
              type: "div",
              props: {
                style: { flex: 1, display: "flex", flexDirection: "row", alignItems: "center", gap: 14, background: t.accentMuted, borderRadius: 12, padding: "0 18px" },
                children: [
                  { type: "div", props: { style: { width: 40, height: 40, borderRadius: 10, background: "rgba(235,29,37,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: [
                    lucideIcon(f.icon, { size: 20, color: t.accent }),
                  ]}},
                  { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
                    { type: "div", props: { style: { color: t.text, fontSize: 17, fontWeight: 800, lineHeight: 1, display: "flex" }, children: [f.label] } },
                    { type: "div", props: { style: { color: t.textMuted, fontSize: 13, display: "flex" }, children: [f.desc] } },
                  ]}},
                ],
              },
            })),
          },
        },
      ],
    },
  };
}
