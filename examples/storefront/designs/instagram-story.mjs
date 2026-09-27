import { FONTS, banner } from "./_storefront.mjs";

export const FORMAT = { width: 1080, height: 1920, name: "instagram-story.png" };
export { FONTS };

export default () =>
  banner(1080, 1920, { product: "Cedar & Amber Candle", kind: "candle", price: "$28", oldPrice: "$36", tag: "FALL SALE" });
