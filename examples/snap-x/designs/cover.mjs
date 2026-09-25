export const FORMAT = { width: 1500, height: 500, name: "cover.png" };
export const FONTS  = [{ family: "Saira", weights: [400, 700, 900] }];

export default function () {
  const accent = "#eb1d25";
  const accentMuted = "rgba(235,29,37,0.25)";
  const borderAccent = "rgba(235,29,37,0.30)";
  const bg = "#080808";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.45)";
  const textDim = "rgba(255,255,255,0.15)";

  const steps = [
    { n: "01", title: "Claude writes .mjs", desc: "/snap-x reads your project" },
    { n: "02", title: "snap-x check",  desc: "Validate" },
    { n: "03", title: "snap-x render", desc: "Generate" },
  ];

  return {
    type: "div",
    props: {
      style: { width: 1500, height: 500, background: bg, display: "flex", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        // left glow
        { type: "div", props: { style: { position: "absolute", top: -120, left: -80, width: 700, height: 700, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 60%)`, display: "flex" }, children: [] } },
        // right glow
        { type: "div", props: { style: { position: "absolute", bottom: -200, right: -100, width: 600, height: 600, background: `radial-gradient(circle, rgba(235,29,37,0.08) 0%, transparent 60%)`, display: "flex" }, children: [] } },

        // top accent line
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${accent}, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
        // bottom line
        { type: "div", props: { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${borderAccent}, transparent)`, display: "flex" }, children: [] } },

        // corner marks
        ...[{ top: 18, left: 22 }, { top: 18, right: 22 }, { bottom: 18, left: 22 }, { bottom: 18, right: 22 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: textDim, fontSize: 18, lineHeight: 1, display: "flex" }, children: ["+"] },
        })),

        // main layout
        {
          type: "div",
          props: {
            style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", alignItems: "center", padding: "0 100px", gap: 72 },
            children: [
              // brand block
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 },
                  children: [
                    { type: "div", props: { style: { display: "flex", alignItems: "baseline", gap: 0 }, children: [
                      { type: "div", props: { style: { color: text, fontSize: 120, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.05em", display: "flex" }, children: ["snap"] } },
                      { type: "div", props: { style: { color: accent, fontSize: 120, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.05em", display: "flex" }, children: ["-x"] } },
                    ]}},
                    { type: "div", props: { style: { color: textMuted, fontSize: 19, lineHeight: 1.5, maxWidth: 420, display: "flex", flexWrap: "wrap" }, children: ["Turn any project into a branded image pack. Any format. One command."] } },
                  ],
                },
              },

              // divider
              { type: "div", props: { style: { width: 1, height: 320, background: `linear-gradient(to bottom, transparent, ${borderAccent}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

              // pipeline steps
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 0, flex: 1 },
                  children: [
                    { type: "div", props: { style: { color: textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20, display: "flex" }, children: ["Pipeline"] } },
                    ...steps.map((s, i) => ({
                      type: "div",
                      props: {
                        style: { display: "flex", alignItems: "center", gap: 20, padding: "20px 0", borderTop: i === 0 ? "none" : `1px solid rgba(255,255,255,0.06)` },
                        children: [
                          { type: "div", props: { style: { color: borderAccent, fontSize: 12, fontWeight: 700, width: 22, flexShrink: 0, display: "flex" }, children: [s.n] } },
                          { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 3, flex: 1 }, children: [
                            { type: "div", props: { style: { color: text, fontSize: 24, fontWeight: 800, lineHeight: 1, display: "flex" }, children: [s.title] } },
                            { type: "div", props: { style: { color: textMuted, fontSize: 14, display: "flex" }, children: [s.desc] } },
                          ]}},
                          { type: "div", props: { style: { color: accent, fontSize: 16, fontWeight: 900, display: "flex" }, children: ["→"] } },
                        ],
                      },
                    })),
                  ],
                },
              },

              // divider
              { type: "div", props: { style: { width: 1, height: 320, background: `linear-gradient(to bottom, transparent, ${borderAccent}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

              // stat block
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 24, flexShrink: 0 },
                  children: [
                    ...[ ["∞", "Formats"], ["0", "Browsers"], ["1", "Command"] ].map(([val, label]) => ({
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
                        children: [
                          { type: "div", props: { style: { color: accent, fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", display: "flex" }, children: [val] } },
                          { type: "div", props: { style: { color: textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex" }, children: [label] } },
                        ],
                      },
                    })),
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
