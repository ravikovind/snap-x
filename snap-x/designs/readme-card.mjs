import { getTheme } from "../../packages/core/src/themes/index.mjs";
import { lucideIcon } from "../../packages/core/src/icons.mjs";

export const FORMAT = { width: 1280, height: 640, name: "readme-card.png" };

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 640, background: t.bg, display: "flex", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        // Glow
        { type: "div", props: { style: { position: "absolute", top: -80, right: -40, width: 480, height: 480, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.08")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // Left accent bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 5, height: 640, background: `linear-gradient(to bottom, ${t.accent}, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // Border
        { type: "div", props: { style: { position: "absolute", top: 20, left: 20, right: 20, bottom: 20, border: `1px solid ${t.borderAccent}`, borderRadius: 12, display: "flex" }, children: [] } },

        // Left: brand + desc
        {
          type: "div",
          props: {
            style: { width: 760, height: 640, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 52px 52px 68px" },
            children: [
              // Eyebrow
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                lucideIcon("Package", { size: 13, color: t.accent }),
                { type: "div", props: { style: { color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex" }, children: ["@snap-x/core"] } },
              ]}},
              // Center
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
                { type: "div", props: { style: { color: t.text, fontSize: 80, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 18, lineHeight: 1.5, display: "flex", flexWrap: "wrap", maxWidth: 560 }, children: ["Turn any project into a full social image pack — one command. No browser. Pure Node.js."] } },
                { type: "div", props: { style: { height: 1, background: `linear-gradient(to right, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
                { type: "div", props: { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: ["Satori", "resvg-js", "Node.js", "MIT"].map(s => ({
                  type: "div", props: { style: { background: t.accentMuted, borderRadius: 6, padding: "5px 12px", color: t.accent, fontSize: 13, fontWeight: 700, display: "flex" }, children: [s] }
                }))}},
              ]}},
              // Bottom: install command
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${t.borderAccent}`, borderRadius: 8, padding: "10px 16px" }, children: [
                lucideIcon("Terminal", { size: 14, color: t.accent }),
                { type: "div", props: { style: { color: t.textMuted, fontSize: 15, fontFamily: "monospace", display: "flex" }, children: ["npm install -g "] } },
                { type: "div", props: { style: { color: t.text, fontSize: 15, fontFamily: "monospace", fontWeight: 700, display: "flex" }, children: ["@snap-x/core"] } },
              ]}},
            ],
          },
        },

        // Vertical divider
        { type: "div", props: { style: { width: 1, height: 560, marginTop: 40, background: `linear-gradient(to bottom, transparent, ${t.accentMuted}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

        // Right: pipeline steps
        {
          type: "div",
          props: {
            style: { flex: 1, height: 640, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px 40px 36px", gap: 16 },
            children: [
              { type: "div", props: { style: { color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4, display: "flex" }, children: ["Pipeline"] } },
              ...[
                { icon: "Terminal", cmd: "snap-x init",   sub: "Scaffold designs" },
                { icon: "Check",    cmd: "snap-x check",  sub: "Validate Satori" },
                { icon: "Zap",      cmd: "snap-x render", sub: "5 PNGs in seconds" },
              ].map((s, i) => ({
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "row", alignItems: "center", gap: 14, background: t.accentMuted, borderRadius: 10, padding: "14px 16px" },
                  children: [
                    { type: "div", props: { style: { width: 36, height: 36, borderRadius: 8, background: "rgba(235,29,37,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: [
                      lucideIcon(s.icon, { size: 17, color: t.accent }),
                    ]}},
                    { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
                      { type: "div", props: { style: { color: t.text, fontSize: 15, fontWeight: 800, fontFamily: "monospace", lineHeight: 1, display: "flex" }, children: [s.cmd] } },
                      { type: "div", props: { style: { color: t.textMuted, fontSize: 12, display: "flex" }, children: [s.sub] } },
                    ]}},
                  ],
                },
              })),
            ],
          },
        },
      ],
    },
  };
}
