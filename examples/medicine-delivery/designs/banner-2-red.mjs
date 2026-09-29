import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-2-red.png" };
export const FONTS = [{ family: "Lato", weights: [300, 400, 700, 900] }];

export default () =>
  renderBanner({
    g1: "#7A0000",
    g2: "#C0001A",
    g3: "#E83030",
    accent: "#FFE033",
    ctaText: "#C0001A",
    tagline: ["Emergency?", "We've Got You."],
    sub: "Round the clock · Instant dispatch · Tracked delivery",
    badge: "24 × 7 EMERGENCY DELIVERY",
  });
