import { FONTS, banner } from "./_storefront.mjs";

export const FORMAT = { width: 1080, height: 1350, name: "instagram-post.png" };
export { FONTS };

export default () =>
  banner(1080, 1350, { product: "Cedar & Amber Candle", kind: "candle", price: "$28", oldPrice: "$36", tag: "FALL SALE" });
