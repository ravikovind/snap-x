// Template: Instagram / Facebook story (1080×1920) — archetype: Centred badge
// (design-principles.md § Archetypes). Brand-neutral. Copy this file into your own designs/ and
// edit the block below. Leave ~250px clear at the top and bottom for the app's UI — content must
// live inside the safe box. Check with: snap-x guides <this file>

// ── EDIT THESE VALUES ───────────────────────────────────────────────────────
const BADGE = "ANNOUNCEMENT";
const HEADLINE = "Your headline here";
const BG = "#12100e";
const INK = "#f5f2ee";
const ACCENT = "#f2a154";
// ─────────────────────────────────────────────────────────────────────────────

export const FORMAT = { width: 1080, height: 1920, name: "instagram-story.png" };
export const FONTS = [{ family: "Inter", weights: [400, 700, 900] }];

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export default function () {
  return box(
    { width: 1080, height: 1920, background: BG, fontFamily: "Inter", alignItems: "center", justifyContent: "center" },
    [
      // centred inside the safe box (y 250–1670) — nothing placed in the top/bottom ~250px UI bands
      box({ flexDirection: "column", alignItems: "center", gap: 28, maxWidth: 880 }, [
        box({ padding: "12px 28px", borderRadius: 999, border: `2px solid ${ACCENT}` }, [
          txt(BADGE, { fontSize: 24, fontWeight: 700, color: ACCENT, letterSpacing: "0.14em" }),
        ]),
        txt(HEADLINE, { fontSize: 72, fontWeight: 900, color: INK, textAlign: "center", lineHeight: 1.15, flexWrap: "wrap" }),
      ]),
    ],
  );
}
