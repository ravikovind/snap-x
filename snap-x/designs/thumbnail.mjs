export const FORMAT = { width: 1280, height: 720, name: "thumbnail.png" };
export const FONTS  = [{ family: "Saira", weights: [400, 700, 900] }];

export default function () {
  const accent = "#eb1d25";
  const accentMuted = "rgba(235,29,37,0.25)";
  const borderAccent = "rgba(235,29,37,0.30)";
  const bg = "#080808";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.45)";

  const formats = [
    { name: "og",           size: "1200×630",  tag: "Open Graph" },
    { name: "thumbnail",    size: "1280×720",  tag: "YouTube" },
    { name: "cover",        size: "1500×500",  tag: "GitHub Banner" },
    { name: "poster",       size: "1080×1920", tag: "Instagram" },
    { name: "linkedin-cover", size: "1584×396", tag: "LinkedIn" },
    { name: "custom",       size: "any size",  tag: "Your format" },
  ];

  return {
    type: "div",
    props: {
      style: { width: 1280, height: 720, background: bg, display: "flex", flexDirection: "column", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        // top glow
        { type: "div", props: { style: { position: "absolute", top: -100, right: -60, width: 560, height: 560, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 60%)`, display: "flex" }, children: [] } },
        // top accent bar
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${accent}, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },

        // HEADER
        {
          type: "div",
          props: {
            style: { height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 68px", flexShrink: 0 },
            children: [
              { type: "div", props: { style: { display: "flex", alignItems: "baseline", gap: 2, display: "flex" }, children: [
                { type: "div", props: { style: { color: text, fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", display: "flex" }, children: ["snap"] } },
                { type: "div", props: { style: { color: accent, fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", display: "flex" }, children: ["-x"] } },
              ]}},
              { type: "div", props: { style: { color: accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex" }, children: ["Any format · Any size"] } },
            ],
          },
        },

        // BODY
        {
          type: "div",
          props: {
            style: { flex: 1, display: "flex", flexDirection: "row", padding: "0 68px 0 68px", gap: 52, alignItems: "center" },
            children: [
              // Left — headline
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 20, width: 500, flexShrink: 0 },
                  children: [
                    { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 0 }, children: [
                      { type: "div", props: { style: { color: text, fontSize: 76, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em", display: "flex" }, children: ["Social"] } },
                      { type: "div", props: { style: { color: text, fontSize: 76, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em", display: "flex" }, children: ["images,"] } },
                      { type: "div", props: { style: { color: accent, fontSize: 76, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em", display: "flex" }, children: ["automated."] } },
                    ]}},
                    { type: "div", props: { style: { color: textMuted, fontSize: 17, lineHeight: 1.55, display: "flex", flexWrap: "wrap" }, children: ["One command. No browser. Pure Node.js.\nAdd a .mjs file — get a PNG."] } },
                    { type: "div", props: { style: { display: "flex", gap: 8 }, children: ["check", "render"].map(cmd => ({
                      type: "div", props: { style: { background: "rgba(255,255,255,0.06)", border: `1px solid ${borderAccent}`, borderRadius: 6, padding: "5px 14px", display: "flex" }, children: [
                        { type: "div", props: { style: { color: accent, fontSize: 12, fontWeight: 700, display: "flex" }, children: ["> "] } },
                        { type: "div", props: { style: { color: text, fontSize: 12, fontWeight: 600, display: "flex" }, children: [`snap-x ${cmd}`] } },
                      ]},
                    }))}},
                  ],
                },
              },

              // divider
              { type: "div", props: { style: { width: 1, alignSelf: "stretch", marginTop: 40, marginBottom: 40, background: `linear-gradient(to bottom, transparent, ${borderAccent}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

              // Right — format grid
              {
                type: "div",
                props: {
                  style: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
                  children: formats.map((f, i) => ({
                    type: "div",
                    props: {
                      style: {
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 16px",
                        background: i === formats.length - 1 ? `rgba(235,29,37,0.08)` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${i === formats.length - 1 ? borderAccent : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 8,
                      },
                      children: [
                        { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 1 }, children: [
                          { type: "div", props: { style: { color: i === formats.length - 1 ? accent : text, fontSize: 13, fontWeight: 700, display: "flex" }, children: [f.name + ".mjs"] } },
                          { type: "div", props: { style: { color: textMuted, fontSize: 11, display: "flex" }, children: [f.tag] } },
                        ]}},
                        { type: "div", props: { style: { color: i === formats.length - 1 ? accent : textMuted, fontSize: 12, fontWeight: 600, display: "flex" }, children: [f.size] } },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },

        // FOOTER
        { type: "div", props: { style: { height: 52, display: "flex", alignItems: "center", justifyContent: "center", borderTop: `1px solid rgba(255,255,255,0.05)`, flexShrink: 0 }, children: [
          { type: "div", props: { style: { color: textMuted, fontSize: 12, letterSpacing: "0.08em", display: "flex" }, children: ["npm install -g snap-x"] } },
        ]}},
      ],
    },
  };
}
