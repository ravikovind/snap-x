import { FONTS, banner } from "./_storefront.mjs";

// og size (1200×630) reused as the pack's generic wide-banner size —
// there's no dedicated e-commerce-banner format yet.
export const FORMAT = { width: 1200, height: 630, name: "banner-cedar-candle.png" };
export { FONTS };

export default () =>
  banner(1200, 630, { product: "Cedar & Amber Candle", kind: "candle", price: "$28", oldPrice: "$36", tag: "FALL SALE" });
