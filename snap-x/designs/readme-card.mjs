export const FORMAT = { width: 1280, height: 640, name: "readme-card.png" };

export default function (config) {
  const accent = config.themeOverride?.accent ?? "#eb1d25";
  const accentMuted = config.themeOverride?.accentMuted ?? "rgba(235,29,37,0.18)";
  const borderAccent = config.themeOverride?.borderAccent ?? "rgba(235,29,37,0.28)";
  const bg = "#080808";
  const surface = "#0f0f0f";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.45)";
  const textDim = "rgba(255,255,255,0.15)";

  const steps = [
    { n: "01", cmd: "snap-x init",   desc: "Scaffold config + design files" },
    { n: "02", cmd: "snap-x check",  desc: "Validate Satori CSS rules" },
    { n: "03", cmd: "snap-x render", desc: "Generate PNGs — any format, any size" },
  ];

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 640, background: bg, display: "flex", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        // glow top right
        { type: "div", props: { style: { position: "absolute", top: -60, right: -40, width: 440, height: 440, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // left accent bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 4, height: 640, background: `linear-gradient(to bottom, ${accent}, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // inner border
        { type: "div", props: { style: { position: "absolute", top: 18, left: 18, right: 18, bottom: 18, border: `1px solid ${borderAccent}`, borderRadius: 10, display: "flex" }, children: [] } },
        // corner marks
        ...[{ top: 10, left: 12 }, { top: 10, right: 12 }, { bottom: 10, left: 12 }, { bottom: 10, right: 12 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: textDim, fontSize: 14, lineHeight: 1, display: "flex" }, children: ["+"] },
        })),

        // LEFT (700px)
        {
          type: "div",
          props: {
            style: { width: 700, height: 640, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px 52px 60px" },
            children: [
              // eyebrow
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                { type: "div", props: { style: { width: 6, height: 6, borderRadius: 99, background: accent, display: "flex" }, children: [] } },
                { type: "div", props: { style: { color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex" }, children: ["@snap-x/core"] } },
              ]}},

              // headline
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
                { type: "div", props: { style: { display: "flex", alignItems: "baseline", gap: 0 }, children: [
                  { type: "div", props: { style: { color: text, fontSize: 88, fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.05em", display: "flex" }, children: ["snap"] } },
                  { type: "div", props: { style: { color: accent, fontSize: 88, fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.05em", display: "flex" }, children: ["-x"] } },
                ]}},
                { type: "div", props: { style: { color: textMuted, fontSize: 16, lineHeight: 1.55, maxWidth: 460, display: "flex", flexWrap: "wrap" }, children: ["Any format. Any size. One command. No browser. Pure Node.js."] } },
                { type: "div", props: { style: { height: 1, background: `linear-gradient(to right, ${borderAccent}, transparent)`, display: "flex" }, children: [] } },
                { type: "div", props: { style: { display: "flex", gap: 7 }, children: ["Node.js", "Satori", "resvg-js", "MIT"].map(s => ({
                  type: "div", props: { style: { background: accentMuted, border: `1px solid ${borderAccent}`, borderRadius: 5, padding: "4px 12px", color: accent, fontSize: 11, fontWeight: 700, display: "flex" }, children: [s] },
                }))}},
              ]}},

              // install command
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 10, background: surface, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 8, padding: "10px 16px" }, children: [
                { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, display: "flex" }, children: ["$"] } },
                { type: "div", props: { style: { color: textMuted, fontSize: 13, display: "flex" }, children: ["npm install -g "] } },
                { type: "div", props: { style: { color: text, fontSize: 13, fontWeight: 700, display: "flex" }, children: ["@snap-x/core"] } },
              ]}},
            ],
          },
        },

        // divider
        { type: "div", props: { style: { width: 1, height: 540, marginTop: 50, background: `linear-gradient(to bottom, transparent, ${borderAccent}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

        // RIGHT — pipeline
        {
          type: "div",
          props: {
            style: { flex: 1, height: 640, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 44px 40px 32px", gap: 10 },
            children: [
              { type: "div", props: { style: { color: textMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, display: "flex" }, children: ["Pipeline"] } },
              ...steps.map(s => ({
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "row", alignItems: "center", gap: 14, background: surface, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 10, padding: "16px 18px" },
                  children: [
                    { type: "div", props: { style: { color: borderAccent, fontSize: 11, fontWeight: 700, width: 18, flexShrink: 0, display: "flex" }, children: [s.n] } },
                    { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
                      { type: "div", props: { style: { color: text, fontSize: 15, fontWeight: 800, lineHeight: 1, display: "flex" }, children: [s.cmd] } },
                      { type: "div", props: { style: { color: textMuted, fontSize: 11, display: "flex" }, children: [s.desc] } },
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
