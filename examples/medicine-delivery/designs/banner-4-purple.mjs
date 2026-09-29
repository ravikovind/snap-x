import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-4-purple.png" };
export const FONTS = [{ family: "Lato", weights: [300, 400, 700, 900] }];

export default () =>
  renderBanner({
    g1: "#1A0038",
    g2: "#4A0096",
    g3: "#7B2FD0",
    accent: "#FFD700",
    ctaText: "#4A0096",
    tagline: ["Feel Better,", "Faster."],
    sub: "Skip the queue · Order in seconds · 15 min delivery",
    badge: "15 MIN EXPRESS DELIVERY",
  });
