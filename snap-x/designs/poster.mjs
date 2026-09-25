export const FORMAT = { width: 1080, height: 1920, name: "poster.png" };
export const FONTS  = [{ family: "Saira", weights: [400, 700, 900] }];

export default function () {
  const accent = "#eb1d25";
  const accentMuted = "rgba(235,29,37,0.25)";
  const borderAccent = "rgba(235,29,37,0.30)";
  const bg = "#080808";
  const surface = "#101010";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.45)";
  const textDim = "rgba(255,255,255,0.15)";

  const formats = [
    { name: "og.mjs",            size: "1200×630",   use: "Open Graph / Twitter" },
    { name: "thumbnail.mjs",     size: "1280×720",   use: "YouTube / Blog" },
    { name: "cover.mjs",         size: "1500×500",   use: "GitHub / X Banner" },
    { name: "poster.mjs",        size: "1080×1920",  use: "Instagram Story" },
    { name: "readme-card.mjs",   size: "1280×640",   use: "GitHub README" },
    { name: "linkedin-cover.mjs",size: "1584×396",   use: "LinkedIn Banner" },
    { name: "your-format.mjs",   size: "any size",   use: "Anything you need" },
  ];

  return {
    type: "div",
    props: {
      style: { width: 1080, height: 1920, background: bg, display: "flex", flexDirection: "column", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        // glows
        { type: "div", props: { style: { position: "absolute", top: -80, right: -80, width: 700, height: 700, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 60%)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", bottom: 100, left: -120, width: 600, height: 600, background: `radial-gradient(circle, rgba(235,29,37,0.08) 0%, transparent 60%)`, display: "flex" }, children: [] } },
        // top bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, transparent, ${accent}, transparent)`, display: "flex" }, children: [] } },
        // corner marks
        ...[{ top: 28, left: 32 }, { top: 28, right: 32 }, { bottom: 28, left: 32 }, { bottom: 28, right: 32 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: textDim, fontSize: 22, lineHeight: 1, display: "flex" }, children: ["+"] },
        })),

        // HEADER (100px)
        { type: "div", props: { style: { height: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 72px", flexShrink: 0 }, children: [
          { type: "div", props: { style: { display: "flex", alignItems: "baseline", gap: 0 }, children: [
            { type: "div", props: { style: { color: text, fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", display: "flex" }, children: ["snap"] } },
            { type: "div", props: { style: { color: accent, fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", display: "flex" }, children: ["-x"] } },
          ]}},
          { type: "div", props: { style: { color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex" }, children: ["Open Source · MIT"] } },
        ]}},

        // HERO (440px)
        { type: "div", props: { style: { height: 440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 72px", gap: 20, flexShrink: 0 }, children: [
          { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex" }, children: ["Social image generator"] } },
          { type: "div", props: { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }, children: [
            { type: "div", props: { style: { color: text, fontSize: 148, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.06em", display: "flex" }, children: ["snap"] } },
            { type: "div", props: { style: { color: accent, fontSize: 148, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.06em", display: "flex" }, children: ["-x"] } },
          ]}},
          { type: "div", props: { style: { color: textMuted, fontSize: 20, lineHeight: 1.55, textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 680 }, children: ["Any format. Any size. One command. No browser."] } },
        ]}},

        // STATS (140px)
        { type: "div", props: { style: { height: 140, display: "flex", flexDirection: "row", alignItems: "center", borderTop: `1px solid ${borderAccent}`, borderBottom: `1px solid ${borderAccent}`, flexShrink: 0 }, children: [
          ...[["∞", "Formats"], ["0", "Browsers"], ["1", "Command"]].flatMap(([val, label], i) => [
            { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
              { type: "div", props: { style: { color: accent, fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", display: "flex" }, children: [val] } },
              { type: "div", props: { style: { color: textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", display: "flex" }, children: [label] } },
            ]}},
            i < 2 ? { type: "div", props: { style: { width: 1, height: 64, background: borderAccent, display: "flex" }, children: [] } } : null,
          ].filter(Boolean)),
        ]}},

        // FORMATS LIST (flex 1)
        {
          type: "div",
          props: {
            style: { flex: 1, display: "flex", flexDirection: "column", padding: "44px 72px 0 72px" },
            children: [
              { type: "div", props: { style: { color: textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20, display: "flex" }, children: ["Formats — add any .mjs file"] } },
              ...formats.map((f, i) => ({
                type: "div",
                props: {
                  style: {
                    display: "flex", flexDirection: "row", alignItems: "center", gap: 16,
                    padding: "18px 20px",
                    marginBottom: 10,
                    background: i === formats.length - 1 ? `rgba(235,29,37,0.08)` : surface,
                    border: `1px solid ${i === formats.length - 1 ? borderAccent : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 10,
                  },
                  children: [
                    { type: "div", props: { style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 }, children: [
                      { type: "div", props: { style: { color: i === formats.length - 1 ? accent : text, fontSize: 17, fontWeight: 700, display: "flex" }, children: [f.name] } },
                      { type: "div", props: { style: { color: textMuted, fontSize: 13, display: "flex" }, children: [f.use] } },
                    ]}},
                    { type: "div", props: { style: { color: i === formats.length - 1 ? accent : textMuted, fontSize: 13, fontWeight: 600, display: "flex" }, children: [f.size] } },
                  ],
                },
              })),
            ],
          },
        },

        // FOOTER (140px)
        { type: "div", props: { style: { height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, borderTop: `1px solid ${borderAccent}`, flexShrink: 0 }, children: [
          { type: "div", props: { style: { color: textMuted, fontSize: 13, letterSpacing: "0.06em", display: "flex" }, children: ["npm install -g @snap-x/core"] } },
          { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", display: "flex" }, children: ["@snap-x/core"] } },
        ]}},
      ],
    },
  };
}
