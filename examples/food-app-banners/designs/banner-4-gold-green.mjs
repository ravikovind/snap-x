import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-4-gold-green.png" };
export const FONTS = [{ family: "Saira", weights: [300, 400, 600, 700, 800, 900] }];

export default () =>
  renderBanner({
    g1: "#1A3A00",
    g2: "#2E6600",
    g3: "#6B9E00",
    highlight: "#FFD700",   // gold
    ctaText: "#2E6600",
  });
