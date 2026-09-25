export const FORMAT = { width: 1280, height: 720, name: "thumbnail.png" };

const FEATURES = [
  { label: "One command",   desc: "snap-x render → 5 PNGs" },
  { label: "No browser",    desc: "Pure Node.js, no Puppeteer" },
  { label: "Claude writes", desc: "AI-generated design files" },
  { label: "5 formats",     desc: "OG · Cover · Poster · More" },
];

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
      style: { width: 1280, height: 720, background: bg, display: "flex", flexDirection: "row", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 5, height: 720, background: `linear-gradient(to bottom, ${accent}, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: 20, left: 20, right: 20, bottom: 20, border: `1px solid ${borderAccent}`, borderRadius: 12, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: -60, left: -40, width: 400, height: 400, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // Left
        {
          type: "div",
          props: {
            style: { width: 680, height: 720, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px 52px 68px" },
            children: [
              { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", display: "flex" }, children: ["Satori → SVG → PNG · No browser"] } },
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
                { type: "div", props: { style: { color: text, fontSize: 100, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: textMuted, fontSize: 18, lineHeight: 1.5, display: "flex", flexWrap: "wrap", maxWidth: 480 }, children: ["Turn any project into a full social image pack. Claude writes the designs."] } },
                { type: "div", props: { style: { display: "flex", gap: 8 }, children: ["init", "check", "render"].map(cmd => ({
                  type: "div", props: { style: { background: accentMuted, borderRadius: 6, padding: "5px 14px", color: accent, fontSize: 13, fontWeight: 700, display: "flex" }, children: [`snap-x ${cmd}`] }
                }))}},
              ]}},
              { type: "div", props: { style: { color: textMuted, fontSize: 14, display: "flex" }, children: ["npm install -g @snap-x/core"] } },
            ],
          },
        },
        { type: "div", props: { style: { width: 1, height: 640, marginTop: 40, background: `linear-gradient(to bottom, transparent, ${accentMuted}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },
        // Right: feature cards
        {
          type: "div",
          props: {
            style: { flex: 1, height: 720, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 44px 40px 36px", gap: 10 },
            children: FEATURES.map(f => ({
              type: "div",
              props: {
                style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, background: accentMuted, borderRadius: 12, padding: "0 20px" },
                children: [
                  { type: "div", props: { style: { color: text, fontSize: 18, fontWeight: 800, lineHeight: 1, display: "flex" }, children: [f.label] } },
                  { type: "div", props: { style: { color: textMuted, fontSize: 13, display: "flex" }, children: [f.desc] } },
                ],
              },
            })),
          },
        },
      ],
    },
  };
}
