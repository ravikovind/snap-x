import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-1-red.png" };
export const FONTS = [{ family: "Saira", weights: [300, 400, 600, 700, 800, 900] }];

export default () =>
  renderBanner({
    g1: "#C0001A",
    g2: "#E03020",
    g3: "#FF5500",
    highlight: "#FFE033",   // yellow
    ctaText: "#C0001A",
  });
