// Shared builder for the LinkedIn launch-post collage — two orientations, one asset set.
// Fonts declared locally (Saira + Space Mono) rather than imported from _brand.mjs, which still
// uses JetBrains Mono for the original 5-file dogfood set — this keeps that pack's own assets
// untouched while matching the current site (which switched to Space Mono).
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { COLORS, box, txt, H, brand, glow, root } from "./_brand.mjs";

export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "Space Mono", weights: [400, 700] },
];

const binAsset = async (rel) => {
  const buf = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)));
  return `data:image/png;base64,${buf.toString("base64")}`;
};

// A framed card: fixed box, the real image centered inside at its own aspect ratio (never
// cropped, never stretched) — same "letterboxed thumbnail" pattern the website's own format/
// template/example cards use. No rotation, no overlap: a clean grid instead of a scattered pile.
const frame = (src, ratio, boxW, boxH, left, top) => {
  const pad = 12;
  const availW = boxW - pad * 2;
  const availH = boxH - pad * 2;
  const w = availW / availH > ratio ? availH * ratio : availW;
  const h = availW / availH > ratio ? availH : availW / ratio;
  return box(
    {
      position: "absolute", left, top, width: boxW, height: boxH, background: "#0d0d0d",
      border: `1px solid ${COLORS.line}`, borderRadius: 12, alignItems: "center", justifyContent: "center",
    },
    [{ type: "img", props: { src, width: Math.round(w), height: Math.round(h), style: { display: "flex", borderRadius: 4 } } }],
  );
};

const command = (size = 14) =>
  box({ fontFamily: "Space Mono", fontSize: size, alignItems: "center", gap: 10 }, [
    txt("$", { color: COLORS.red, fontWeight: 700 }),
    txt("npx @snap-x/cli render designs/*.mjs", { color: COLORS.muted }),
  ]);

async function loadPhotos() {
  const [ravikovind, openNotifier, heyreach, foodBanner, diwali] = await Promise.all([
    binAsset("../assets/li-ravikovind-cover.png"),
    binAsset("../assets/li-open-notifier-og.png"),
    binAsset("../assets/li-heyreach-og.png"),
    binAsset("../assets/li-food-banner.png"),
    binAsset("../assets/li-diwali-poster.png"),
  ]);
  // real aspect ratios (width / height) of the source PNGs, used to fit each into its frame
  return {
    ravikovind: { src: ravikovind, ratio: 1584 / 396 },
    heyreach: { src: heyreach, ratio: 1200 / 630 },
    openNotifier: { src: openNotifier, ratio: 1200 / 630 },
    foodBanner: { src: foodBanner, ratio: 1200 / 480 },
    diwali: { src: diwali, ratio: 1080 / 1350 },
  };
}

// 1200x627 — the linkedin-post format. Text left; a clean, non-overlapping 3-row grid right,
// grouped by shape (the ultra-wide cover gets its own full-width row instead of being squeezed
// into a square cell where most of the frame would sit empty).
export async function landscape() {
  const p = await loadPhotos();
  return root(1200, 627, {}, [
    glow({ top: -150, left: 520 }),
    box({ flexDirection: "column", justifyContent: "center", width: 520, height: 627, padding: "0 0 0 64px" }, [
      box({ marginBottom: 28 }, [brand(22)]),
      txt("One tool. Every", { ...H(46), color: COLORS.ink }),
      txt("platform.", { ...H(46), color: COLORS.ink, marginBottom: 18 }),
      txt("Made by your AI agent.", { fontSize: 22, fontWeight: 700, color: COLORS.red, marginBottom: 22 }),
      txt(
        "Your agent writes the design. snap-x renders the exact size and checks it against the platform's own rules — real output, not a mockup.",
        { fontSize: 16, fontWeight: 400, color: COLORS.muted, lineHeight: 1.5, width: 420, marginBottom: 24 },
      ),
      command(14),
    ]),
    frame(p.ravikovind.src, p.ravikovind.ratio, 600, 160, 560, 50),
    frame(p.heyreach.src, p.heyreach.ratio, 290, 210, 560, 230),
    frame(p.openNotifier.src, p.openNotifier.ratio, 290, 210, 870, 230),
    frame(p.foodBanner.src, p.foodBanner.ratio, 370, 145, 560, 460),
    frame(p.diwali.src, p.diwali.ratio, 210, 145, 950, 460),
  ]);
}

// 1080x1350 (4:5) — LinkedIn's own feed-engagement recommendation for a portrait/vertical post.
// Text on top, the same 3-row grid restacked to span the full width below it.
export async function portrait() {
  const p = await loadPhotos();
  return root(1080, 1350, { flexDirection: "column" }, [
    glow({ top: -260, left: 300 }),
    box({ flexDirection: "column", padding: "72px 64px 0" }, [
      box({ marginBottom: 32 }, [brand(24)]),
      txt("One tool. Every", { ...H(58), color: COLORS.ink }),
      txt("platform.", { ...H(58), color: COLORS.ink, marginBottom: 20 }),
      txt("Made by your AI agent.", { fontSize: 26, fontWeight: 700, color: COLORS.red, marginBottom: 24 }),
      txt(
        "Your agent writes the design. snap-x renders the exact size and checks it against the platform's own rules — real output, not a mockup.",
        { fontSize: 19, fontWeight: 400, color: COLORS.muted, lineHeight: 1.55, width: 780, marginBottom: 28 },
      ),
      command(18),
    ]),
    box({ position: "relative", width: 1080, flex: 1 }, [
      frame(p.ravikovind.src, p.ravikovind.ratio, 960, 220, 60, 40),
      frame(p.heyreach.src, p.heyreach.ratio, 470, 230, 60, 280),
      frame(p.openNotifier.src, p.openNotifier.ratio, 470, 230, 550, 280),
      frame(p.foodBanner.src, p.foodBanner.ratio, 600, 300, 60, 530),
      frame(p.diwali.src, p.diwali.ratio, 340, 300, 680, 530),
    ]),
  ]);
}
