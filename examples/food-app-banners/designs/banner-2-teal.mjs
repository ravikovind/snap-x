import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-2-teal.png" };
export const FONTS = [{ family: "Saira", weights: [300, 400, 600, 700, 800, 900] }];

export default () =>
  renderBanner({
    g1: "#003D28",
    g2: "#006B44",
    g3: "#00C86A",
    highlight: "#C8FF80",   // lime green
    ctaText: "#004A30",
  });
