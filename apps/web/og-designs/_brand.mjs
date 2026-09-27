// Shared brand file for this site's own OG images (improvements.md §11.3 — "images on this site
// are made with snap-x"). Matches app/globals.css's Tailwind theme tokens exactly.
export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "JetBrains Mono", weights: [400, 700] },
];

export const COLORS = {
  bg: "#070707",
  ink: "#f5f5f5",
  muted: "rgba(255,255,255,0.52)",
  red: "#eb1d25",
  line: "rgba(255,255,255,0.14)",
};

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

/** The shared frame every OG image in this pack uses: brand mark top-left, headline, label bottom. */
export function ogFrame({ label, title, accent }) {
  return box(
    {
      width: 1200, height: 630, background: COLORS.bg, fontFamily: "Saira", position: "relative",
      overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px",
    },
    [
      box({ position: "absolute", top: -260, right: -200, width: 700, height: 700, borderRadius: 9999, background: "radial-gradient(circle, rgba(235,29,37,0.28) 0%, rgba(235,29,37,0) 62%)" }),
      box({ position: "absolute", left: 0, top: 0, right: 0, height: 6, background: COLORS.red }),

      box({ alignItems: "center", gap: 12 }, [
        box({ width: 16, height: 16, background: COLORS.red }),
        txt("SNAP-X", { fontSize: 20, fontWeight: 700, letterSpacing: "0.24em", color: COLORS.ink }),
      ]),

      box({ flexDirection: "column", gap: 16 }, [
        txt(label, { fontFamily: "JetBrains Mono", fontSize: 18, fontWeight: 700, color: accent ?? COLORS.red, letterSpacing: "0.1em" }),
        txt(title, { fontSize: 62, fontWeight: 900, color: COLORS.ink, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1000, flexWrap: "wrap" }),
      ]),

      txt("snap-x — branded graphics for every platform, made by your AI agent", { fontSize: 18, color: COLORS.muted }),
    ],
  );
}
