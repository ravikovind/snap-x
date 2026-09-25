export const FORMAT = { width: 1280, height: 640, name: "readme-card.png" };

export default function (config) {
  const accent = config.themeOverride?.accent ?? "#eb1d25";
  const accentMuted = config.themeOverride?.accentMuted ?? "rgba(235,29,37,0.25)";
  const borderAccent = config.themeOverride?.borderAccent ?? "rgba(235,29,37,0.30)";
  const bg = "#000000";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.50)";

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 640, background: bg, display: "flex", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        { type: "div", props: { style: { position: "absolute", top: -80, right: -40, width: 480, height: 480, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 5, height: 640, background: `linear-gradient(to bottom, ${accent}, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: 20, left: 20, right: 20, bottom: 20, border: `1px solid ${borderAccent}`, borderRadius: 12, display: "flex" }, children: [] } },
        // Left
        {
          type: "div",
          props: {
            style: { width: 760, height: 640, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 52px 52px 68px" },
            children: [
              { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex" }, children: ["@snap-x/core"] } },
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
                { type: "div", props: { style: { color: text, fontSize: 80, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: textMuted, fontSize: 18, lineHeight: 1.5, display: "flex", flexWrap: "wrap", maxWidth: 560 }, children: ["Turn any project into a full social image pack — one command. No browser. Pure Node.js."] } },
                { type: "div", props: { style: { height: 1, background: `linear-gradient(to right, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
                { type: "div", props: { style: { display: "flex", gap: 8 }, children: ["Satori", "resvg-js", "Node.js", "MIT"].map(s => ({
                  type: "div", props: { style: { background: accentMuted, borderRadius: 6, padding: "5px 12px", color: accent, fontSize: 13, fontWeight: 700, display: "flex" }, children: [s] }
                }))}},
              ]}},
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${borderAccent}`, borderRadius: 8, padding: "10px 16px" }, children: [
                { type: "div", props: { style: { color: accent, fontSize: 15, display: "flex" }, children: [">"] } },
                { type: "div", props: { style: { color: textMuted, fontSize: 15, display: "flex" }, children: ["npm install -g "] } },
                { type: "div", props: { style: { color: text, fontSize: 15, fontWeight: 700, display: "flex" }, children: ["@snap-x/core"] } },
              ]}},
            ],
          },
        },
        { type: "div", props: { style: { width: 1, height: 560, marginTop: 40, background: `linear-gradient(to bottom, transparent, ${accentMuted}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },
        // Right: pipeline
        {
          type: "div",
          props: {
            style: { flex: 1, height: 640, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px 40px 36px", gap: 12 },
            children: [
              { type: "div", props: { style: { color: textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4, display: "flex" }, children: ["Pipeline"] } },
              ...[
                { cmd: "snap-x init",   sub: "Scaffold designs" },
                { cmd: "snap-x check",  sub: "Validate Satori" },
                { cmd: "snap-x render", sub: "5 PNGs in seconds" },
              ].map(s => ({
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 2, background: accentMuted, borderRadius: 10, padding: "14px 16px" },
                  children: [
                    { type: "div", props: { style: { color: text, fontSize: 15, fontWeight: 800, lineHeight: 1, display: "flex" }, children: [s.cmd] } },
                    { type: "div", props: { style: { color: textMuted, fontSize: 12, display: "flex" }, children: [s.sub] } },
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
