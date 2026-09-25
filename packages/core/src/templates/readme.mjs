/**
 * README Card — 1280×640
 * GitHub social preview / repository card.
 * Shows: repo name, description, tech stack pills, stars/stats.
 */

import { getTheme } from "../themes/index.mjs";

export const FORMAT = { width: 1280, height: 640 };

export function readmeCard({
  name = "",
  description = "",
  stack = [],      // ["Node.js", "Satori", "Resvg"]
  stats = [],      // [{ label: "stars", value: "1.2k" }]
  owner = "",
  theme: themeName = "dark",
  themeOverride = {},
}) {
  const t = { ...getTheme(themeName), ...themeOverride };

  return {
    type: "div",
    props: {
      style: {
        width: 1280, height: 640,
        background: t.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: t.fontDisplay,
        padding: "64px 80px",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Glow top-right
        {
          type: "div",
          props: {
            style: { position: "absolute", top: -60, right: -60, width: 400, height: 400, background: `radial-gradient(circle, ${t.accentMuted.replace("0.25","0.09")} 0%, transparent 65%)`, display: "flex" },
            children: [],
          },
        },

        // Top: owner/name
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: 10, zIndex: 1 },
            children: [
              owner ? { type: "div", props: { style: { color: t.textMuted, fontSize: 18, fontWeight: 400, letterSpacing: "0.02em", display: "flex" }, children: [`${owner} /`] } } : null,
              { type: "div", props: { style: { color: t.text, fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", display: "flex" }, children: [name] } },
            ].filter(Boolean),
          },
        },

        // Middle: description
        description ? {
          type: "div",
          props: {
            style: { color: t.textMuted, fontSize: 24, fontWeight: 400, lineHeight: 1.4, maxWidth: 900, display: "flex", flexWrap: "wrap", zIndex: 1 },
            children: [description.length > 120 ? description.slice(0, 120).trimEnd() + "…" : description],
          },
        } : null,

        // Bottom: stack pills + stats
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 },
            children: [
              // Stack pills
              {
                type: "div",
                props: {
                  style: { display: "flex", gap: 10 },
                  children: stack.slice(0, 5).map((s) => ({
                    type: "div",
                    props: { style: { border: `1px solid ${t.borderColor}`, borderRadius: 6, padding: "6px 14px", color: t.textMuted, fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", display: "flex" }, children: [s] },
                  })),
                },
              },

              // Stats
              stats.length > 0 ? {
                type: "div",
                props: {
                  style: { display: "flex", gap: 28 },
                  children: stats.slice(0, 3).map((s) => ({
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
                      children: [
                        { type: "div", props: { style: { color: t.text, fontSize: 28, fontWeight: 900, display: "flex" }, children: [s.value] } },
                        { type: "div", props: { style: { color: t.textMuted, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex" }, children: [s.label] } },
                      ],
                    },
                  })),
                },
              } : null,
            ].filter(Boolean),
          },
        },
      ].filter(Boolean),
    },
  };
}
