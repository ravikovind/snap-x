// Template: OG / link-preview card (1200×630) — archetype: Big type (design-principles.md § Archetypes)
// Brand-neutral. Copy this file into your own designs/ and edit the block below.
// X's large card crops toward 2:1, so keep the important content centred, away from the top/bottom edges.

// ── EDIT THESE VALUES ───────────────────────────────────────────────────────
const TITLE = "Your project name";
const SUBTITLE = "One line describing what it does, under ~100 characters.";
const DOMAIN = "yourdomain.com";
const BG = "#0a0a0a";
const INK = "#f5f5f5";
const ACCENT = "#5b8cff";
// ─────────────────────────────────────────────────────────────────────────────

export const FORMAT = { width: 1200, height: 630, name: "og-card.png" };
export const FONTS = [{ family: "Inter", weights: [400, 700, 900] }];

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export default function () {
  return box(
    {
      width: 1200, height: 630, background: BG, fontFamily: "Inter", position: "relative",
      overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px",
    },
    [
      box({ position: "absolute", top: -220, right: -160, width: 640, height: 640, borderRadius: 9999, background: `${ACCENT}18` }),

      box({ alignItems: "center", gap: 10 }, [
        box({ width: 14, height: 14, background: ACCENT }),
        txt(DOMAIN, { fontSize: 16, fontWeight: 700, color: "rgba(245,245,245,0.55)", letterSpacing: "0.1em" }),
      ]),

      box({ flexDirection: "column", gap: 18 }, [
        txt(TITLE, { fontSize: 76, fontWeight: 900, color: INK, lineHeight: 1.05, letterSpacing: "-0.02em", whiteSpace: "nowrap" }),
        txt(SUBTITLE, { fontSize: 24, fontWeight: 400, color: "rgba(245,245,245,0.65)", maxWidth: 820, flexWrap: "wrap", lineHeight: 1.4 }),
      ]),
    ],
  );
}
