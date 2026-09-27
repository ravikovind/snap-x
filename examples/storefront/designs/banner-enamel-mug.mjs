import { FONTS, banner } from "./_storefront.mjs";

export const FORMAT = { width: 1200, height: 630, name: "banner-enamel-mug.png" };
export { FONTS };

export default () =>
  banner(1200, 630, { product: "Enamel Camp Mug", kind: "mug", price: "$18", oldPrice: "$24", tag: "FALL SALE" });
