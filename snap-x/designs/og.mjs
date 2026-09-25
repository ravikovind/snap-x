export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS  = [{ family: "Saira", weights: [400, 700, 900] }];

export default function () {
  const accent = "#eb1d25";
  const accentMuted = "rgba(235,29,37,0.25)";
  const borderAccent = "rgba(235,29,37,0.30)";
  const bg = "#080808";
  const surface = "#111111";
  const text = "rgba(255,255,255,0.95)";
  const textMuted = "rgba(255,255,255,0.45)";
  const textDim = "rgba(255,255,255,0.20)";

  const lines = [
    { prompt: "$", cmd: "npx snap-x render designs/*.mjs", out: null },
    { prompt: " ", cmd: null, out: "→  og.png        (67 KB)" },
    { prompt: " ", cmd: null, out: "→  cover.png     (66 KB)" },
    { prompt: " ", cmd: null, out: "→  poster.png   (124 KB)" },
  ];

  return {
    type: "div",
    props: {
      style: { width: 1200, height: 630, background: bg, display: "flex", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        // background glow
        { type: "div", props: { style: { position: "absolute", bottom: -120, left: -80, width: 600, height: 600, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        // top border line
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${accent}, transparent)`, display: "flex" }, children: [] } },

        // LEFT — brand
        {
          type: "div",
          props: {
            style: { width: 520, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", gap: 0 },
            children: [
              { type: "div", props: { style: { color: accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 28, display: "flex" }, children: ["Open Source · MIT"] } },
              { type: "div", props: { style: { color: text, fontSize: 108, fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.05em", display: "flex" }, children: ["snap"] } },
              { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 0 }, children: [
                { type: "div", props: { style: { color: accent, fontSize: 108, fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.05em", display: "flex" }, children: ["-x"] } },
              ]}},
              { type: "div", props: { style: { width: 48, height: 3, background: accent, marginTop: 28, marginBottom: 28, display: "flex" }, children: [] } },
              { type: "div", props: { style: { color: textMuted, fontSize: 17, lineHeight: 1.55, maxWidth: 340, display: "flex", flexWrap: "wrap" }, children: ["Any format. Any size. One command.\nNo browser. Pure Node.js."] } },
            ],
          },
        },

        // divider
        { type: "div", props: { style: { width: 1, height: 480, marginTop: 75, background: `linear-gradient(to bottom, transparent, ${borderAccent}, transparent)`, display: "flex", flexShrink: 0 }, children: [] } },

        // RIGHT — terminal
        {
          type: "div",
          props: {
            style: { flex: 1, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px 0 44px" },
            children: [
              // terminal window
              {
                type: "div",
                props: {
                  style: { background: surface, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
                  children: [
                    // title bar
                    { type: "div", props: { style: { height: 38, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", padding: "0 16px", gap: 7 }, children: [
                      { type: "div", props: { style: { width: 11, height: 11, borderRadius: 99, background: "#ff5f57", display: "flex" }, children: [] } },
                      { type: "div", props: { style: { width: 11, height: 11, borderRadius: 99, background: "#febc2e", display: "flex" }, children: [] } },
                      { type: "div", props: { style: { width: 11, height: 11, borderRadius: 99, background: "#28c840", display: "flex" }, children: [] } },
                      { type: "div", props: { style: { flex: 1, display: "flex", justifyContent: "center" }, children: [
                        { type: "div", props: { style: { color: textDim, fontSize: 11, letterSpacing: "0.06em", display: "flex" }, children: ["terminal"] } },
                      ]}},
                    ]}},
                    // lines
                    { type: "div", props: { style: { padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 6 }, children:
                      lines.map(l => ({
                        type: "div",
                        props: {
                          style: { display: "flex", gap: 10, alignItems: "baseline" },
                          children: [
                            { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, width: 10, flexShrink: 0, display: "flex" }, children: [l.prompt] } },
                            l.cmd
                              ? { type: "div", props: { style: { color: text, fontSize: 13, fontWeight: 600, display: "flex" }, children: [l.cmd] } }
                              : { type: "div", props: { style: { color: textMuted, fontSize: 13, display: "flex" }, children: [l.out] } },
                          ],
                        },
                      }))
                    }},
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
