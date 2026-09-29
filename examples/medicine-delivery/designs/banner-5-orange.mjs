import { renderBanner } from "./_base.mjs";

export const FORMAT = { width: 1200, height: 480, name: "banner-5-orange.png" };
export const FONTS = [{ family: "Lato", weights: [300, 400, 700, 900] }];

export default () =>
  renderBanner({
    g1: "#7A2800",
    g2: "#C84800",
    g3: "#FF6B00",
    accent: "#FFE566",
    ctaText: "#C84800",
    tagline: ["Your Pharmacy,", "On Demand."],
    sub: "Order anytime · 15 min delivery · 10,000+ medicines",
    badge: "15 MIN EXPRESS DELIVERY",
  });
