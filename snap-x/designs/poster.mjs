import { getTheme } from "../../packages/core/src/themes/index.mjs";
import { lucideIcon } from "../../packages/core/src/icons.mjs";

export const FORMAT = { width: 1080, height: 1920, name: "poster.png" };

const PIPELINE = [
  { icon: "Terminal",   step: "01", label: "snap-x init",   desc: "Scaffold config + design files" },
  { icon: "Code",       step: "02", label: "snap-x check",  desc: "Validate Satori CSS rules" },
  { icon: "Zap",        step: "03", label: "snap-x render", desc: "Satori → SVG → resvg → PNG" },
];

const FORMATS = ["OG  1200×630", "Thumb  1280×720", "Cover  1500×500", "Poster  1080×1920", "README  1280×640"];

export default function (config) {
  const t = { ...getTheme(config.theme), ...(config.themeOverride ?? {}) };

  return {
    type: "div",
    props: {
      style: { width: 1080, height: 1920, background: t.bg, display: "flex", flexDirection: "column", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        // Top bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, transparent, ${t.accent}, transparent)`, display: "flex" }, children: [] } },
        // Bottom bar
        { type: "div", props: { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${t.accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // Glow
        { type: "div", props: { style: { position: "absolute", top: 200, left: -80, width: 700, height: 700, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.07")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", bottom: 300, right: -80, width: 500, height: 500, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.05")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // Corner marks
        ...[{ top: 36, left: 36 }, { top: 36, right: 36 }, { bottom: 36, left: 36 }, { bottom: 36, right: 36 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: t.accentMuted, fontSize: 20, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),

        // ── 1. HEADER (100px) ──────────────────────────────
        {
          type: "div",
          props: {
            style: { height: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 72px" },
            children: [
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                lucideIcon("Zap", { size: 20, color: t.accent }),
                { type: "div", props: { style: { color: t.text, fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", display: "flex" }, children: ["snap-x"] } },
              ]}},
              { type: "div", props: { style: { color: t.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: ["Open Source · MIT"] } },
            ],
          },
        },

        // ── 2. HERO (500px) ────────────────────────────────
        {
          type: "div",
          props: {
            style: { height: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 72px", gap: 24, textAlign: "center" },
            children: [
              { type: "div", props: { style: { color: t.text, fontSize: 130, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.05em", display: "flex" }, children: ["snap-x"] } },
              { type: "div", props: { style: { color: t.textMuted, fontSize: 24, lineHeight: 1.5, display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }, children: ["Turn any project into a full social image pack — one command. No browser. Pure Node.js."] } },
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                { type: "div", props: { style: { height: 1, width: 48, background: t.accentMuted, display: "flex" }, children: [] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 14, letterSpacing: "0.06em", display: "flex" }, children: ["npm install -g @snap-x/core"] } },
                { type: "div", props: { style: { height: 1, width: 48, background: t.accentMuted, display: "flex" }, children: [] } },
              ]}},
            ],
          },
        },

        // ── 3. STATS BAR (130px) ──────────────────────────
        {
          type: "div",
          props: {
            style: { height: 130, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", borderTop: `1px solid ${t.borderAccent}`, borderBottom: `1px solid ${t.borderAccent}` },
            children: [
              { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
                { type: "div", props: { style: { color: t.accent, fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", display: "flex" }, children: ["5"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex" }, children: ["Formats"] } },
              ]}},
              { type: "div", props: { style: { width: 1, height: 60, background: t.borderAccent, display: "flex" }, children: [] } },
              { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
                { type: "div", props: { style: { color: t.accent, fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", display: "flex" }, children: ["0"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex" }, children: ["Browsers"] } },
              ]}},
              { type: "div", props: { style: { width: 1, height: 60, background: t.borderAccent, display: "flex" }, children: [] } },
              { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
                { type: "div", props: { style: { color: t.accent, fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", display: "flex" }, children: ["1"] } },
                { type: "div", props: { style: { color: t.textMuted, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex" }, children: ["Command"] } },
              ]}},
            ],
          },
        },

        // ── 4. PIPELINE (830px flex-1) ────────────────────
        {
          type: "div",
          props: {
            style: { flex: 1, display: "flex", flexDirection: "column", padding: "56px 72px 0 72px" },
            children: [
              { type: "div", props: { style: { color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, display: "flex" }, children: ["Pipeline"] } },
              ...PIPELINE.map((s, i) => ({
                type: "div",
                props: {
                  style: { flex: 1, display: "flex", flexDirection: "row", alignItems: "center", gap: 24, borderTop: i === 0 ? "none" : `1px solid ${t.borderAccent}` },
                  children: [
                    { type: "div", props: { style: { color: t.accentMuted, fontSize: 13, fontWeight: 700, width: 28, display: "flex", flexShrink: 0 }, children: [s.step] } },
                    { type: "div", props: { style: { width: 52, height: 52, borderRadius: 12, background: t.accentMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: [
                      lucideIcon(s.icon, { size: 24, color: t.accent }),
                    ]}},
                    { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
                      { type: "div", props: { style: { color: t.text, fontSize: 26, fontWeight: 800, fontFamily: "monospace", lineHeight: 1, display: "flex" }, children: [s.label] } },
                      { type: "div", props: { style: { color: t.textMuted, fontSize: 17, display: "flex" }, children: [s.desc] } },
                    ]}},
                    { type: "div", props: { style: { marginLeft: "auto", display: "flex" }, children: [lucideIcon("ArrowRight", { size: 20, color: t.accentMuted })] } },
                  ],
                },
              })),
            ],
          },
        },

        // ── 5. FOOTER (200px) ─────────────────────────────
        {
          type: "div",
          props: {
            style: { height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, borderTop: `1px solid ${t.borderAccent}` },
            children: [
              { type: "div", props: { style: { color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: ["Formats generated"] } },
              { type: "div", props: { style: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }, children: FORMATS.map(f => ({
                type: "div", props: { style: { background: t.accentMuted, borderRadius: 6, padding: "6px 14px", color: t.accent, fontSize: 13, fontWeight: 700, fontFamily: "monospace", display: "flex" }, children: [f] }
              }))}},
            ],
          },
        },
      ],
    },
  };
}
