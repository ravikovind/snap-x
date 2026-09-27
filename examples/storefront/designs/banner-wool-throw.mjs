import { FONTS, banner } from "./_storefront.mjs";

export const FORMAT = { width: 1200, height: 630, name: "banner-wool-throw.png" };
export { FONTS };

export default () =>
  banner(1200, 630, { product: "Wool Blend Throw", kind: "throw", price: "$64", oldPrice: null, tag: "NEW" });
