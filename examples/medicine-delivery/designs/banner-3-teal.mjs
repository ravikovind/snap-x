import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-3-teal.png" };
export const FONTS = [{ family: "Lato", weights: [300, 400, 700, 900] }];

export default () =>
  renderBanner({
    g1: "#003D2A",
    g2: "#006B4A",
    g3: "#00A86B",
    accent: "#A8FF78",
    ctaText: "#003D2A",
    tagline: ["Healthcare at", "Your Doorstep."],
    sub: "Verified medicines · Licensed pharmacists · Safe & fast",
    badge: "TRUSTED HEALTH PARTNER",
  });
