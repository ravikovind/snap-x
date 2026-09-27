import { FONTS, ogFrame } from "./_brand.mjs";

export const FORMAT = { width: 1200, height: 630, name: "use-case.png" };
export { FONTS };

// Mirrors content/use-cases.ts's slug/tag/title (only what an OG image needs) — kept as a small,
// manually-synced duplicate since a .mjs design file can't import a .ts data file directly (it runs
// under snap-x's own Node-ESM loader, not through Next's TypeScript pipeline). If you add a use
// case, add its row here too.
export const VARIANTS = [
  { id: "youtube", tag: "YouTube creators", title: "Thumbnails, channel art, Shorts", format: { name: "use-cases-youtube.png" } },
  { id: "personal-brand", tag: "Personal brand", title: "LinkedIn cover, X header", format: { name: "use-cases-personal-brand.png" } },
  { id: "app-stores", tag: "App makers", title: "App Store screenshots, Play feature graphic", format: { name: "use-cases-app-stores.png" } },
  { id: "websites-and-projects", tag: "Websites and projects", title: "OG cards, README cards, GitHub social preview", format: { name: "use-cases-websites-and-projects.png" } },
  { id: "ecommerce", tag: "E-commerce / marketing", title: "Sale banners, Instagram posts and stories", format: { name: "use-cases-ecommerce.png" } },
];

export default function (variant) {
  return ogFrame({ label: variant.tag, title: variant.title });
}
