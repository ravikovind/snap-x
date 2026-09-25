export const FORMAT = { width: 1080, height: 1920, name: "poster.png" };

const PIPELINE = [
  { step: "01", label: "snap-x init",   desc: "Scaffold config + design files" },
  { step: "02", label: "snap-x check",  desc: "Validate Satori CSS rules" },
  { step: "03", label: "snap-x render", desc: "Satori → SVG → resvg → PNG" },
];

const FORMATS = ["OG  1200×630", "Thumb  1280×720", "Cover  1500×500", "Poster  1080×1920", "README  1280×640"];

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
      style: { width: 1080, height: 1920, background: bg, display: "flex", flexDirection: "column", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, transparent, ${accent}, transparent)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: 200, left: -80, width: 700, height: 700, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        ...[{ top: 36, left: 36 }, { top: 36, right: 36 }, { bottom: 36, left: 36 }, { bottom: 36, right: 36 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: accentMuted, fontSize: 20, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),
        // Header
        { type: "div", props: { style: { height: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 72px" }, children: [
          { type: "div", props: { style: { color: text, fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", display: "flex" }, children: ["⚡ snap-x"] } },
          { type: "div", props: { style: { color: accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: ["Open Source · MIT"] } },
        ]}},
        // Hero
        { type: "div", props: { style: { height: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 72px", gap: 24, textAlign: "center" }, children: [
          { type: "div", props: { style: { color: text, fontSize: 130, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.05em", display: "flex" }, children: ["snap-x"] } },
          { type: "div", props: { style: { color: textMuted, fontSize: 24, lineHeight: 1.5, display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }, children: ["Turn any project into a full social image pack — one command. No browser. Pure Node.js."] } },
          { type: "div", props: { style: { color: textMuted, fontSize: 14, letterSpacing: "0.06em", display: "flex" }, children: ["npm install -g @snap-x/core"] } },
        ]}},
        // Stats bar
        { type: "div", props: { style: { height: 130, display: "flex", flexDirection: "row", alignItems: "center", borderTop: `1px solid ${borderAccent}`, borderBottom: `1px solid ${borderAccent}` }, children: [
          ...[["5", "Formats"], ["0", "Browsers"], ["1", "Command"]].flatMap(([val, label], i) => [
            { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
              { type: "div", props: { style: { color: accent, fontSize: 44, fontWeight: 900, lineHeight: 1, display: "flex" }, children: [val] } },
              { type: "div", props: { style: { color: textMuted, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex" }, children: [label] } },
            ]}},
            i < 2 ? { type: "div", props: { style: { width: 1, height: 60, background: borderAccent, display: "flex" }, children: [] } } : null,
          ].filter(Boolean)),
        ]}},
        // Pipeline
        { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", padding: "56px 72px 0 72px" }, children: [
          { type: "div", props: { style: { color: textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, display: "flex" }, children: ["Pipeline"] } },
          ...PIPELINE.map((s, i) => ({
            type: "div",
            props: {
              style: { flex: 1, display: "flex", flexDirection: "row", alignItems: "center", gap: 24, borderTop: i === 0 ? "none" : `1px solid ${borderAccent}` },
              children: [
                { type: "div", props: { style: { color: accentMuted, fontSize: 13, fontWeight: 700, width: 28, display: "flex", flexShrink: 0 }, children: [s.step] } },
                { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
                  { type: "div", props: { style: { color: text, fontSize: 26, fontWeight: 800, lineHeight: 1, display: "flex" }, children: [s.label] } },
                  { type: "div", props: { style: { color: textMuted, fontSize: 17, display: "flex" }, children: [s.desc] } },
                ]}},
              ],
            },
          })),
        ]}},
        // Footer
        { type: "div", props: { style: { height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, borderTop: `1px solid ${borderAccent}` }, children: [
          { type: "div", props: { style: { color: textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: ["Formats"] } },
          { type: "div", props: { style: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }, children: FORMATS.map(f => ({
            type: "div", props: { style: { background: accentMuted, borderRadius: 6, padding: "6px 14px", color: accent, fontSize: 13, fontWeight: 700, display: "flex" }, children: [f] }
          }))}},
        ]}},
      ],
    },
  };
}
