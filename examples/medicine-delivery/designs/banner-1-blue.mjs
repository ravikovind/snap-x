import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-1-blue.png" };
export const FONTS = [{ family: "Lato", weights: [300, 400, 700, 900] }];

export default () =>
  renderBanner({
    g1: "#003580",
    g2: "#0057B8",
    g3: "#1A8FE3",
    accent: "#FFD60A",
    ctaText: "#003580",
    tagline: ["Medicines in", "15 Minutes."],
    sub: "Delivered to your door · No prescription hassle",
    badge: "LIGHTNING FAST DELIVERY",
  });
