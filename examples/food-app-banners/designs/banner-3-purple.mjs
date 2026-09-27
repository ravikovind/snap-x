import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-3-purple.png" };
export const FONTS = [{ family: "Saira", weights: [300, 400, 600, 700, 800, 900] }];

export default () =>
  renderBanner({
    g1: "#140028",
    g2: "#4A0096",
    g3: "#9B30D0",
    highlight: "#FFD700",   // gold
    ctaText: "#4A0096",
  });
