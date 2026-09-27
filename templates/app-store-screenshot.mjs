// Template: App Store screenshot, iPhone 6.9" (1320×2868) — archetype: Device mock
// (design-principles.md § Archetypes). Brand-neutral. Copy this file into your own designs/ and
// edit the two blocks below. alpha: false is required — App Store screenshots must have no alpha
// channel; `check` warns if it's missing.
//
// Uses VARIANTS: App Store screenshots are almost always a series — one row per shot, same layout,
// colors and type across all of them; only the caption and mock-screen contents change.

// ── EDIT THESE VALUES ───────────────────────────────────────────────────────
const BG = "#0e0e12";
const INK = "#f5f5f5";
const ACCENT = "#5b8cff";
const MUTED = "rgba(245,245,245,0.6)";

const SHOTS = [
  { id: "01", caption: "Everything in one place", rows: 12 },
  { id: "02", caption: "Find what you need, fast", rows: 14 },
  { id: "03", caption: "Share with your team", rows: 10 },
];
// ─────────────────────────────────────────────────────────────────────────────

export const FORMAT = { width: 1320, height: 2868, name: "app-store-screenshot.png", alpha: false };
export const FONTS = [{ family: "Inter", weights: [400, 700, 900] }];
export const VARIANTS = SHOTS.map((s) => ({ ...s, format: { name: `app-store-screenshot-${s.id}.png` } }));

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

// A plainly generic, clearly-mock phone screen — replace with your own real screenshot (embed it
// as a PNG at the frame's inner size; see README.md "Logos and images" for the async + base64 pattern).
// No fixed height: enough rows to fill the screen, and the frame is deliberately let run past the
// canvas's bottom edge rather than stop short — a half-empty phone reads as unfinished (see
// skills/snap-x/references/formats.md's App Store guidance); cropping off the bottom edge doesn't.
const mockScreen = (rows) =>
  box({ width: 1120, background: "#fff", borderRadius: "28px 28px 0 0", flexDirection: "column", padding: 32, gap: 18 }, [
    box({ width: 220, height: 28, borderRadius: 8, background: "#e5e5e5" }),
    ...Array.from({ length: rows }, () => box({ width: "100%", height: 140, flexShrink: 0, borderRadius: 14, background: "#f1f1f1" })),
  ]);

export default function (variant) {
  return box(
    { width: 1320, height: 2868, background: BG, fontFamily: "Inter", flexDirection: "column", alignItems: "center", padding: "160px 100px 0" },
    [
      // caption — top ~15-20% of the canvas, ≤ 2 lines
      txt(variant.caption, { fontSize: 84, fontWeight: 900, color: INK, textAlign: "center", lineHeight: 1.15, maxWidth: 1100, flexWrap: "wrap" }),
      txt("Mock UI — replace with a real screenshot", { fontSize: 22, color: MUTED, marginTop: 20 }),

      // device frame, large, below the caption
      box({ marginTop: 60, padding: 20, borderRadius: 48, background: "#1a1a1a", border: `2px solid ${ACCENT}` }, [mockScreen(variant.rows)]),
    ],
  );
}
