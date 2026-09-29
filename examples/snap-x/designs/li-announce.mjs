import fs from "fs/promises";
import { fileURLToPath } from "url";
import { FONTS, COLORS, box, txt, H, brand, glow, root } from "./_brand.mjs";

export const FORMAT = { width: 1200, height: 627, name: "li-announce.png" };
export { FONTS };

const binAsset = async (rel) => {
  const buf = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)));
  return `data:image/png;base64,${buf.toString("base64")}`;
};

const photo = (src, w, h, left, top, rotate) =>
  box(
    {
      position: "absolute", left, top, width: w, height: h, transform: `rotate(${rotate}deg)`,
      borderRadius: 10, overflow: "hidden", border: "3px solid #1a1a1a",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    },
    [{ type: "img", props: { src, width: w, height: h, style: { display: "flex" } } }],
  );

export default async function () {
  const [ravikovind, openNotifier, heyreach, foodBanner, diwali] = await Promise.all([
    binAsset("../assets/li-ravikovind-cover.png"),
    binAsset("../assets/li-open-notifier-og.png"),
    binAsset("../assets/li-heyreach-og.png"),
    binAsset("../assets/li-food-banner.png"),
    binAsset("../assets/li-diwali-poster.png"),
  ]);

  return root(1200, 627, {}, [
    glow({ top: -150, left: 520 }),
    box({ flexDirection: "column", justifyContent: "center", width: 520, height: 627, padding: "0 0 0 64px" }, [
      box({ marginBottom: 28 }, [brand(22)]),
      txt("One tool. Every", { ...H(46), color: COLORS.ink }),
      txt("platform.", { ...H(46), color: COLORS.ink, marginBottom: 18 }),
      txt("Made by your AI agent.", { fontSize: 22, fontWeight: 700, color: COLORS.red, marginBottom: 22 }),
      txt(
        "Your agent writes the design. snap-x renders the exact size and checks it against the platform's own rules — real output, not a mockup.",
        { fontSize: 16, fontWeight: 400, color: COLORS.muted, lineHeight: 1.5, width: 420 },
      ),
    ]),
    photo(ravikovind, 370, 93, 660, 40, -7),
    photo(heyreach, 250, 132, 900, 55, 6),
    photo(openNotifier, 260, 137, 640, 190, -5),
    photo(foodBanner, 270, 108, 880, 240, 5),
    photo(diwali, 140, 175, 640, 400, -6),
  ]);
}
