// Template: YouTube thumbnail (1280×720) — archetype: Big type (design-principles.md § Archetypes)
// Brand-neutral. Copy this file into your own designs/ and edit the block below.

// ── EDIT THESE VALUES ───────────────────────────────────────────────────────
const HEADLINE = "Your headline here"; // ≤ 4 huge words — this is seen ~200px wide
const CHANNEL = "Channel name";
const BG = "#0e0e12";
const INK = "#f5f5f5";
const ACCENT = "#ffcc00";
// ─────────────────────────────────────────────────────────────────────────────

export const FORMAT = { width: 1280, height: 720, name: "youtube-thumbnail.png" };
export const FONTS = [{ family: "Inter", weights: [400, 700, 900] }];

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export default function () {
  return box(
    {
      width: 1280, height: 720, background: BG, fontFamily: "Inter", position: "relative",
      overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "56px 72px",
    },
    [
      // accent bar — decoration may sit anywhere, including near the bottom-right duration-badge zone
      box({ position: "absolute", left: 0, top: 0, right: 0, height: 10, background: ACCENT }),

      box({ alignItems: "center", gap: 12 }, [
        box({ width: 16, height: 16, borderRadius: 4, background: ACCENT }),
        txt(CHANNEL, { fontSize: 20, fontWeight: 700, color: "rgba(245,245,245,0.7)", letterSpacing: "0.08em" }),
      ]),

      // headline dominates ≥ 40% of the canvas height — the point of the Big type archetype.
      // whiteSpace: "nowrap" + a size picked so it never wraps; shrink HEADLINE or the font size if it does.
      txt(HEADLINE, { fontSize: 108, fontWeight: 900, color: INK, lineHeight: 1.0, letterSpacing: "-0.02em", whiteSpace: "nowrap" }),
    ],
  );
  // Nothing placed in the bottom-right ~160×56px — that's where YouTube draws the duration badge.
  // Check with: snap-x guides templates/youtube-thumbnail.mjs
}
