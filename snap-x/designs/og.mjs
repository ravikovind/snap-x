export const FORMAT = { width: 1200, height: 630, name: "og.png" };

const CMDS = ["snap-x init", "snap-x check", "snap-x render"];

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
      style: { width: 1200, height: 630, background: bg, display: "flex", fontFamily: "Saira", position: "relative", overflow: "hidden" },
      children: [
        { type: "div", props: { style: { position: "absolute", top: -80, right: -60, width: 520, height: 520, background: `radial-gradient(circle, ${accentMuted} 0%, transparent 65%)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: 0, left: 0, width: 5, height: 630, background: `linear-gradient(to bottom, ${accent}, ${accentMuted}, transparent)`, display: "flex" }, children: [] } },
        { type: "div", props: { style: { position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: `1px solid ${borderAccent}`, borderRadius: 14, display: "flex" }, children: [] } },
        ...[{ top: 16, left: 18 }, { top: 16, right: 18 }, { bottom: 16, left: 18 }, { bottom: 16, right: 18 }].map(pos => ({
          type: "div", props: { style: { position: "absolute", ...pos, color: accentMuted, fontSize: 16, lineHeight: 1, display: "flex" }, children: ["+"] }
        })),
        {
          type: "div",
          props: {
            style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 68px" },
            children: [
              { type: "div", props: { style: { color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex" }, children: ["⚡ Open Source · MIT License"] } },
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: 18 }, children: [
                { type: "div", props: { style: { color: text, fontSize: 96, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", display: "flex" }, children: ["snap-x"] } },
                { type: "div", props: { style: { color: textMuted, fontSize: 22, lineHeight: 1.45, display: "flex", flexWrap: "wrap", maxWidth: 700 }, children: ["Turn any project into a full social image pack — one command. No browser. Pure Node.js."] } },
              ]}},
              { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                { type: "div", props: { style: { display: "flex", gap: 10 }, children: CMDS.map(cmd => ({
                  type: "div", props: { style: { background: "rgba(255,255,255,0.06)", border: `1px solid ${borderAccent}`, borderRadius: 8, padding: "7px 16px", display: "flex" }, children: [
                    { type: "div", props: { style: { color: text, fontSize: 14, fontWeight: 600, display: "flex" }, children: [`> ${cmd}`] } },
                  ]}
                }))}},
                { type: "div", props: { style: { color: accent, fontSize: 18, fontWeight: 900, display: "flex" }, children: ["@snap-x/core"] } },
              ]}},
            ],
          },
        },
      ],
    },
  };
}
