import { getTheme } from "../../packages/core/src/themes/index.mjs";
import { lucideIcon } from "../../packages/core/src/icons.mjs";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

const CMDS = ["snap-x init", "snap-x check", "snap-x render"];

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: t.bg, display: "flex", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        // Glow
        { type: "div", props: { style: { position: "absolute", top: -80, right: -60, width: 520, height: 520, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.10")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // Left accent bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 5, height: 630, background: `linear-gradient(to bottom, ${t.accent}, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // Border
        { type: "div", props: { style: { position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: `1px solid ${t.borderAccent}`, borderRadius: 14, display: "flex" }, children: [] } },
        // Corner marks
        ...[{ top: 16, left: 18 }, { top: 16, right: 18 }, { bottom: 16, left: 18 }, { bottom: 16, right: 18 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: t.accentMuted, fontSize: 16, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),
        // Content
        {
          type: "div",
          props: {
            style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 68px" },
            children: [
              // Top: eyebrow
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                lucideIcon("Zap", { size: 14, color: t.accent }),
                { type: "div", props: { style: { color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: ["Open Source · MIT License"] } },
              ]}},
              // Center: title + desc
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 18 }, children: [
                { type: "div", props: { style: { color: t.text, fontSize: 96, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 22, lineHeight: 1.45, display: "flex", flexWrap: "wrap", maxWidth: 700 }, children: ["Turn any project into a full social image pack — one command. No browser. Pure Node.js."] } },
              ]}},
              // Bottom: CLI commands + stack
              { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                { type: "div", props: { style: { display: "flex", gap: 10 }, children: CMDS.map(cmd => ({
                  type: "div", props: { style: { background: "rgba(255,255,255,0.06)", border: `1px solid ${t.borderAccent}`, borderRadius: 8, padding: "7px 16px", display: "flex", alignItems: "center", gap: 8 }, children: [
                    lucideIcon("Terminal", { size: 13, color: t.accent }),
                    { type: "div", props: { style: { color: t.text, fontSize: 14, fontWeight: 600, fontFamily: "monospace", display: "flex" }, children: [cmd] } },
                  ]}
                }))}},
                { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                  lucideIcon("Package", { size: 16, color: t.accent }),
                  { type: "div", props: { style: { color: t.accent, fontSize: 18, fontWeight: 900, display: "flex" }, children: ["@snap-x/core"] } },
                ]}},
              ]}},
            ],
          },
        },
      ],
    },
  };
}
