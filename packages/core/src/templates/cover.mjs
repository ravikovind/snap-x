/**
 * Cover — 1500×500
 * Twitter/X header, LinkedIn banner.
 * Left: name + domain. Right: tagline split into punchy lines.
 */

import { getTheme } from "../themes/index.mjs";
import { lucideIcon } from "../icons.mjs";

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

  // Split tagline into two lines at natural break points
  const breakAt = [" — ", " & ", " · ", " | ", ". ", ", "];
  let line1 = tagline;
  let line2 = "";
  for (const sep of breakAt) {
    const idx = tagline.indexOf(sep);
    if (idx > 0 && idx < tagline.length - sep.length) {
      line1 = tagline.slice(0, idx).trim();
      line2 = tagline.slice(idx + sep.length).trim();
      break;
    }
  }
  // Secondary split: if line1 is still too long, split it again
  if (line1.length > 28) {
    for (const sep of breakAt) {
      const idx2 = line1.indexOf(sep);
      if (idx2 > 0) {
        const overflow = line1.slice(idx2 + sep.length).trim();
        line1 = line1.slice(0, idx2).trim();
        line2 = line2 ? overflow + " · " + line2 : overflow;
        break;
      }
    }
  }

  // Dynamic name font size
  const nameFontSize = name.length > 22 ? 58 : name.length > 15 ? 68 : 80;
  // Dynamic tagline font size
  const tagFontSize = line1.length > 30 ? 28 : line1.length > 20 ? 34 : 40;

  return {
    type: "div",
    props: {
      style: {
        width: 1500, height: 500,
        background: t.bg,
        display: "flex",
        alignItems: "center",
        fontFamily: t.fontDisplay,
        padding: "0 96px",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Subtle grid
        {
          type: "div",
          props: {
            style: {
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(${t.accentMuted.replace("0.25", "0.025")} 1px, transparent 1px), linear-gradient(90deg, ${t.accentMuted.replace("0.25", "0.025")} 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
              display: "flex",
            },
            children: [],
          },
        },

        // Glow left
        {
          type: "div",
          props: {
            style: {
              position: "absolute", top: "50%", left: 40,
              width: 500, height: 500, marginTop: -250,
              background: `radial-gradient(circle, ${t.accentMuted.replace("0.25", "0.09")} 0%, transparent 60%)`,
              display: "flex",
            },
            children: [],
          },
        },

        // Glow right
        {
          type: "div",
          props: {
            style: {
              position: "absolute", top: "50%", right: 0,
              width: 400, height: 400, marginTop: -200,
              background: `radial-gradient(circle, ${t.accentMuted.replace("0.25", "0.05")} 0%, transparent 65%)`,
              display: "flex",
            },
            children: [],
          },
        },

        // Left: label + name + domain
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 },
            children: [
              label ? {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 8 },
                  children: [
                    { type: "div", props: { style: { width: 6, height: 6, borderRadius: 999, background: t.accent, display: "flex" }, children: [] } },
                    { type: "div", props: { style: { color: t.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: [label] } },
                  ],
                },
              } : null,
              { type: "div", props: { style: { color: t.text, fontSize: nameFontSize, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", display: "flex" }, children: [name] } },
              domain ? {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 6, marginTop: 4 },
                  children: [
                    lucideIcon("Globe", { size: 14, color: t.textMuted }),
                    { type: "div", props: { style: { color: t.textMuted, fontSize: 16, letterSpacing: "0.04em", display: "flex" }, children: [domain] } },
                  ],
                },
              } : null,
            ].filter(Boolean),
          },
        },

        // Divider
        {
          type: "div",
          props: {
            style: {
              width: 1, alignSelf: "stretch",
              margin: "60px 72px",
              background: `linear-gradient(to bottom, transparent, ${t.borderAccent}, transparent)`,
              display: "flex", flexShrink: 0,
            },
            children: [],
          },
        },

        // Right: tagline split into two lines
        {
          type: "div",
          props: {
            style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 },
            children: [
              { type: "div", props: { style: { color: t.text, fontSize: tagFontSize, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em", display: "flex", flexWrap: "wrap" }, children: [line1] } },
              line2 ? { type: "div", props: { style: { color: t.textMuted, fontSize: tagFontSize - 4, fontWeight: 400, lineHeight: 1.3, display: "flex", flexWrap: "wrap" }, children: [line2] } } : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}
