// Single source of truth for /use-cases (hub + [slug] pages), their OG images, the landing page's
// use-case cards, and the README's use-case table. Only real, committed examples are referenced —
// see improvements.md §11.2a: "Only show examples that exist in the repo."

export interface UseCase {
  slug: string;
  tag: string; // short label, e.g. "YouTube creators"
  title: string; // one-line "what you get"
  pain: string; // the problem, from repositioning.md §2.4
  formatIds: string[]; // ids into FORMATS (@snap-x/core)
  image: string; // /gallery/*.png
  imageAlt: string;
  guidesImage?: string; // an additional guides-overlay image, where relevant
  guidesImageAlt?: string;
  exampleName: string;
  exampleUrl: string;
  prompt: string;
  repeatable: string; // how a series/batch works for this use case
  templateUrl?: string;
}

export const USE_CASES: UseCase[] = [
  {
    slug: "youtube",
    tag: "YouTube creators",
    title: "Thumbnails, channel art, Shorts",
    pain: "The duration badge sits on your thumbnail's punchline.",
    formatIds: ["youtube-thumbnail", "youtube-channel-art", "youtube-shorts-thumbnail"],
    image: "/gallery/youtube-thumbnail.png",
    imageAlt: "A YouTube thumbnail for a fictional trail-hiking app, made with snap-x",
    exampleName: "examples/creator-series",
    exampleUrl: "https://github.com/ravikovind/snap-x/tree/main/examples/creator-series",
    prompt: "/snap-x make a thumbnail series for my channel from this brief: <describe the channel and episode list>",
    repeatable:
      "A real episode series is one design with VARIANTS — one row per episode, same layout and colors, only the caption changes. examples/creator-series's designs/episodes.mjs is a working one.",
    templateUrl: "https://github.com/ravikovind/snap-x/blob/main/templates/youtube-thumbnail.mjs",
  },
  {
    slug: "personal-brand",
    tag: "Personal brand",
    title: "LinkedIn cover, X header",
    pain: "Your text hides under the profile photo on mobile.",
    formatIds: ["linkedin-cover", "x-header", "linkedin-post", "x-post"],
    image: "/gallery/linkedin-cover.png",
    imageAlt: "A LinkedIn personal cover, made with snap-x",
    guidesImage: "/gallery/guides-overlay.png",
    guidesImageAlt: "The same cover with its danger zones overlaid by snap-x guides",
    exampleName: "examples/ravikovind",
    exampleUrl: "https://github.com/ravikovind/snap-x/tree/main/examples/ravikovind",
    prompt: "/snap-x make me a LinkedIn cover from this brief: <name, role, one line, accent color>",
    repeatable: "One template, re-rendered whenever your title or the copy changes — no re-designing.",
    templateUrl: "https://github.com/ravikovind/snap-x/blob/main/templates/linkedin-cover.mjs",
  },
  {
    slug: "app-stores",
    tag: "App makers",
    title: "App Store screenshots, Play feature graphic",
    pain: "The store rejected your graphic for an alpha channel.",
    formatIds: ["app-store-iphone-6.9", "app-store-ipad-13", "google-play-feature-graphic", "google-play-phone"],
    image: "/gallery/appstore-vote.png",
    imageAlt: "An App Store screenshot for a fictional hiking app, made with snap-x",
    exampleName: "examples/kite",
    exampleUrl: "https://github.com/ravikovind/snap-x/tree/main/examples/kite",
    prompt: "/snap-x make App Store screenshots and a Play feature graphic from this brief: <app name, 3 screens, accent color>",
    repeatable:
      "A screenshot set is one design with VARIANTS — one row per shot, same device frame and type, alpha: false throughout. templates/app-store-screenshot.mjs is a ready-to-copy version.",
    templateUrl: "https://github.com/ravikovind/snap-x/blob/main/templates/app-store-screenshot.mjs",
  },
  {
    slug: "websites-and-projects",
    tag: "Websites and projects",
    title: "OG/link previews, README cards, GitHub social preview",
    pain: "Paste your repo link in Slack or X and it shows no preview at all.",
    formatIds: ["og", "github-social-preview"],
    image: "/gallery/snapx-og.png",
    imageAlt: "snap-x's own OG card, made with snap-x",
    exampleName: "examples/snap-x, examples/open-notifier, examples/heyreach",
    exampleUrl: "https://github.com/ravikovind/snap-x/tree/main/examples/snap-x",
    prompt: "/snap-x generate images for this project",
    repeatable: "One template per project; re-render after a rebrand or a copy change in seconds.",
    templateUrl: "https://github.com/ravikovind/snap-x/blob/main/templates/og-card.mjs",
  },
  {
    slug: "ecommerce",
    tag: "E-commerce / marketing",
    title: "Sale and promo banners, Instagram posts and stories",
    pain: "Every new video, sale or release means redesigning from scratch.",
    formatIds: ["instagram-post", "instagram-story", "og"],
    image: "/gallery/storefront-banner.png",
    imageAlt: "A sale banner for a fictional candle brand, made with snap-x",
    exampleName: "examples/storefront",
    exampleUrl: "https://github.com/ravikovind/snap-x/tree/main/examples/storefront",
    prompt: "/snap-x make sale banners for this brief: <brand, products, prices, accent color>",
    repeatable:
      "A product line is one design with VARIANTS — one row per product/price/tag. examples/storefront's designs/banners.mjs is a working one.",
    templateUrl: "https://github.com/ravikovind/snap-x/blob/main/templates/sale-banner.mjs",
  },
];

export function getUseCase(slug: string) {
  return USE_CASES.find((u) => u.slug === slug);
}
