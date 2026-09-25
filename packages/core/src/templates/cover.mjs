/**
 * Cover — 1500×500
 * Twitter/X header, LinkedIn banner.
 * Wide and short — horizontal layout, name left, tagline right.
 */

import { getTheme } from "../themes/index.mjs";

export const FORMAT = { width: 1500, height: 500 };

export function coverCard({
  name = "",
  tagline = "",
  label = "",
  domain = "",
  theme: themeName = "dark",
  themeOverride = {},
}) {
  const t = { ...getTheme(themeName), ...themeOverride };

  return {
    type: "div",
    props: {
      style: {
        width: 1500, height: 500,
        background: t.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: t.fontDisplay,
        padding: "0 100px",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Grid pattern background
        {
          type: "div",
          props: {
            style: {
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(${t.accentMuted.replace("0.25", "0.03")} 1px, transparent 1px), linear-gradient(90deg, ${t.accentMuted.replace("0.25", "0.03")} 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
              display: "flex",
            },
            children: [],
          },
        },

        // Accent glow center-left
        {
          type: "div",
          props: {
            style: {
              position: "absolute", top: "50%", left: 60,
              width: 400, height: 400,
              marginTop: -200,
              background: `radial-gradient(circle, ${t.accentMuted.replace("0.25", "0.08")} 0%, transparent 65%)`,
              display: "flex",
            },
            children: [],
          },
        },

        // Left: name + label
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: 14, zIndex: 1 },
            children: [
              label ? { type: "div", props: { style: { color: t.accent, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "flex" }, children: [label] } } : null,
              { type: "div", props: { style: { color: t.text, fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", display: "flex" }, children: [name] } },
              domain ? { type: "div", props: { style: { color: t.textMuted, fontSize: 18, letterSpacing: "0.04em", display: "flex" }, children: [domain] } } : null,
            ].filter(Boolean),
          },
        },

        // Divider
        {
          type: "div",
          props: {
            style: { width: 1, height: 200, background: t.borderAccent, margin: "0 80px", flexShrink: 0, zIndex: 1, display: "flex" },
            children: [],
          },
        },

        // Right: tagline
        {
          type: "div",
          props: {
            style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 1 },
            children: [
              { type: "div", props: { style: { color: t.text, fontSize: 32, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", display: "flex", flexWrap: "wrap" }, children: [tagline] } },
            ],
          },
        },
      ],
    },
  };
}
