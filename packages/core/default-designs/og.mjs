/**
 * OG card — 1200×630
 * export FORMAT and a default function(config) → Satori tree
 * Edit freely. All containers need display:"flex". No z-index, no CSS grid.
 */
import { getTheme } from "../src/themes/index.mjs";
import { lucideIcon } from "../src/icons.mjs";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };

export default function (config) {
  const t = { ...getTheme(config.theme), ...( config.themeOverride ?? {}) };
  const { title = "", description = "", domain = "", tags = [] } = config;
  const titleSize = title.length > 70 ? 40 : title.length > 50 ? 48 : title.length > 35 ? 54 : 62;
  const label = domain || title;

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: t.bg, display: "flex", fontFamily: t.fontDisplay, position: "relative", overflow: "hidden" },
      children: [
        // Glow
        { type: "div", props: { style: { position: "absolute", top: -100, left: -60, width: 450, height: 450, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.12")} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // Frame
        { type: "div", props: { style: { position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: `1px solid ${t.borderAccent}`, borderRadius: 14, display: "flex" }, children: [] } },
        // Accent bar
        { type: "div", props: { style: { position: "absolute", top: 28, left: 28, width: 4, height: 574, background: `linear-gradient(to bottom, ${t.accent} 0%, ${t.accentMuted} 80%, transparent 100%)`, borderRadius: "14px 0 0 14px", display: "flex" }, children: [] } },
        // Corner marks
        ...[{ top: 20, left: 22 }, { top: 20, right: 22 }, { bottom: 20, left: 22 }, { bottom: 20, right: 22 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: t.accentMuted, fontSize: 16, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),
        // Content
        {
          type: "div",
          props: {
            style: { position: "absolute", top: 52, left: 68, right: 52, bottom: 52, display: "flex", flexDirection: "column", justifyContent: "space-between" },
            children: [
              // Top
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
                  children: [
                    { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                      { type: "div", props: { style: { width: 7, height: 7, borderRadius: 999, background: t.accent, display: "flex" }, children: [] } },
                      { type: "div", props: { style: { color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: [label] } },
                    ]}},
                    domain ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 4, color: t.textMuted }, children: [
                      { type: "div", props: { style: { fontSize: 13, display: "flex" }, children: [domain] } },
                      lucideIcon("ArrowUpRight", { size: 13, color: t.textMuted }),
                    ]}} : null,
                  ].filter(Boolean),
                },
              },
              // Middle
              {
                type: "div",
                props: {
                  style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 24, paddingBottom: 16, gap: 16, maxWidth: 900 },
                  children: [
                    { type: "div", props: { style: { color: t.text, fontSize: titleSize, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.025em", display: "flex", flexWrap: "wrap" }, children: [title] } },
                    description ? { type: "div", props: { style: { color: t.textMuted, fontSize: 18, fontWeight: 400, lineHeight: 1.4, display: "flex", flexWrap: "wrap" }, children: [description.length > 120 ? description.slice(0, 120).trimEnd() + "…" : description] } } : null,
                  ].filter(Boolean),
                },
              },
              // Separator
              { type: "div", props: { style: { height: 1, background: `linear-gradient(to right, ${t.accent} 0%, ${t.accentMuted} 55%, transparent 100%)`, marginBottom: 16, display: "flex" }, children: [] } },
              // Bottom
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
                  children: [
                    tags.length > 0 ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: tags.slice(0, 3).map(tag => ({
                      type: "div", props: { style: { border: `1px solid ${t.borderAccent}`, borderRadius: 6, padding: "5px 12px", color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", display: "flex" }, children: [tag] }
                    }))}} : null,
                    domain ? { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                      lucideIcon("Zap", { size: 18, color: t.accent }),
                      { type: "div", props: { style: { color: t.accent, fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", display: "flex" }, children: [domain] } },
                    ]}} : null,
                  ].filter(Boolean),
                },
              },
            ],
          },
        },
      ],
    },
  };
}
