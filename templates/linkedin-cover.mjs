// Template: LinkedIn personal cover (1584×396) — archetype: Big type (design-principles.md § Archetypes)
// Brand-neutral. Copy this file into your own designs/ and edit the block below.
// The profile photo overlaps the bottom-left and phones crop the sides — text must live in the
// safe box (right of the photo); decoration may go anywhere. Check with: snap-x guides <this file>

// ── EDIT THESE VALUES ───────────────────────────────────────────────────────
const NAME = "Your Name";
const TAGLINE = "What you do, in one line";
const BG = "#0b0f14";
const INK = "#f5f5f5";
const ACCENT = "#4fd1c5";
// ─────────────────────────────────────────────────────────────────────────────

export const FORMAT = { width: 1584, height: 396, name: "linkedin-cover.png" };
export const FONTS = [{ family: "Inter", weights: [400, 700, 900] }];

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export default function () {
  return box(
    { width: 1584, height: 396, background: BG, fontFamily: "Inter", position: "relative", overflow: "hidden" },
    [
      // decoration is free to sit under the profile photo (bottom-left) — text never goes here
      box({ position: "absolute", left: -80, bottom: -160, width: 420, height: 420, borderRadius: 9999, background: `${ACCENT}22` }),

      // text starts at x=380 — the left edge of the format's safe box (see formats.mjs's linkedin-cover entry)
      box({ position: "absolute", left: 380, top: 0, bottom: 0, width: 1004, flexDirection: "column", justifyContent: "center", gap: 10 }, [
        txt(NAME, { fontSize: 56, fontWeight: 900, color: INK, whiteSpace: "nowrap" }),
        txt(TAGLINE, { fontSize: 24, fontWeight: 400, color: "rgba(245,245,245,0.68)", whiteSpace: "nowrap" }),
      ]),
    ],
  );
}
