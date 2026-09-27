import { FONTS, banner } from "./_storefront.mjs";

// One template, three products (improvements.md §4 — VARIANTS instead of one .mjs per product).
// og size (1200×630) reused as the pack's generic wide-banner size — there's no dedicated
// e-commerce-banner format yet.
export const FORMAT = { width: 1200, height: 630, name: "banner.png" };
export { FONTS };

export const VARIANTS = [
  { id: "cedar-candle", product: "Cedar & Amber Candle", kind: "candle", price: "$28", oldPrice: "$36", tag: "FALL SALE", format: { name: "banner-cedar-candle.png" } },
  { id: "wool-throw", product: "Wool Blend Throw", kind: "throw", price: "$64", oldPrice: null, tag: "NEW", format: { name: "banner-wool-throw.png" } },
  { id: "enamel-mug", product: "Enamel Camp Mug", kind: "mug", price: "$18", oldPrice: "$24", tag: "FALL SALE", format: { name: "banner-enamel-mug.png" } },
];

export default (variant) => banner(1200, 630, variant);
