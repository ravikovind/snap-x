import { logo, FONTS as F } from "./_logo.mjs";

export const FORMAT = { width: 512, height: 512, name: "logo-512.png" };
export const FONTS = F;

export const VARIANTS = [
  { id: "logo-512", format: { width: 512, height: 512, name: "logo-512.png" } },
  { id: "logo-1024", format: { width: 1024, height: 1024, name: "logo-1024.png" } },
  { id: "icon-512", format: { width: 512, height: 512, name: "icon-512.png" } },
  { id: "apple-icon-180", format: { width: 180, height: 180, name: "apple-icon-180.png" }, rounded: false },
  { id: "favicon-48", format: { width: 48, height: 48, name: "favicon-48.png" } },
  { id: "favicon-32", format: { width: 32, height: 32, name: "favicon-32.png" } },
  { id: "favicon-16", format: { width: 16, height: 16, name: "favicon-16.png" } },
];

export default function (variant) {
  return logo(variant.format.width, { rounded: variant.rounded ?? true });
}
