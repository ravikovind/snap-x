/**
 * Platform formats: sizes, constraints and placement zones.
 *
 * `verified: true` means the numbers were checked against the platform's official documentation (`source`);
 * otherwise they are widely-used values that should be re-checked before a launch. Zones are in the format's own
 * pixel space and are guidance for `snap-x guides`, not a guarantee:
 *   avoid[]  = areas the platform covers or crops (keep text and key content out of them)
 *   safe     = the area where important content should live
 *   mobileCrop = the strip a phone actually shows { x, w }
 */

const rect = (x, y, w, h, label) => ({ type: "rect", x, y, w, h, label });
const circle = (cx, cy, r, label) => ({ type: "circle", cx, cy, r, label });

export const FORMATS = [
  // ── Link previews & repos ────────────────────────────────────────────────
  {
    id: "og", aliases: ["open-graph", "og-image"], platform: "Link preview (Facebook / LinkedIn / Slack / X)", width: 1200, height: 630,
    verified: true, source: "https://developers.facebook.com/docs/sharing/webmasters/images/",
    notes: "1.91:1; min 600×315; ≤ 8 MB. X's large card crops toward 2:1, so keep key content centred.",
  },
  {
    id: "github-social-preview", aliases: ["readme-card"], platform: "GitHub repo social preview / README hero", width: 1280, height: 640,
    verified: false, notes: "GitHub → Settings → Social preview (min 640×320, ≤ 1 MB).",
  },

  // ── YouTube ──────────────────────────────────────────────────────────────
  {
    id: "youtube-thumbnail", aliases: ["yt-thumbnail", "thumbnail"], platform: "YouTube video thumbnail", width: 1280, height: 720,
    verified: true, source: "https://support.google.com/youtube/answer/72431",
    notes: "16:9; min width 640; JPG or PNG; ≤ 2 MB on mobile (50 MB desktop). Big face/subject + ≤ 4 large words: it's viewed tiny.",
    avoid: [rect(1100, 648, 160, 56, "duration badge (approx.)")],
  },
  {
    id: "youtube-shorts-thumbnail", platform: "YouTube Shorts thumbnail", width: 1080, height: 1920,
    verified: true, source: "https://support.google.com/youtube/answer/72431", notes: "9:16; min height 640; JPG or PNG.",
  },
  {
    id: "youtube-channel-art", aliases: ["youtube-banner"], platform: "YouTube channel banner", width: 2560, height: 1440,
    verified: false, notes: "Upload 2560×1440. Keep logos/text inside the centred 1546×423 area — the rest is cropped on TV/desktop/mobile.",
    safe: rect(507, 508, 1546, 423, "safe on all devices"),
  },

  // ── Social covers & posts ────────────────────────────────────────────────
  {
    id: "linkedin-cover", aliases: ["linkedin-banner"], platform: "LinkedIn personal cover", width: 1584, height: 396,
    verified: false, notes: "The profile photo covers the bottom-left; mobile crops the sides. Text in the safe box only; decoration may go anywhere.",
    avoid: [circle(160, 396, 115, "profile photo"), rect(0, 0, 200, 396, "mobile crop"), rect(1384, 0, 200, 396, "mobile crop"), rect(200, 0, 1184, 30, "top edge"), rect(200, 366, 1184, 30, "bottom edge")],
    safe: rect(380, 50, 1004, 296, "text lives here"), mobileCrop: { x: 200, w: 1184 },
  },
  {
    id: "x-header", aliases: ["twitter-header"], platform: "X (Twitter) profile header", width: 1500, height: 500,
    verified: false, notes: "The profile photo overlaps the bottom-left (approx. zone below). Keep text right of it and away from the edges.",
    avoid: [circle(207, 500, 168, "profile photo (approx.)"), rect(0, 0, 1500, 50, "top edge"), rect(0, 450, 1500, 50, "bottom edge")],
    safe: rect(430, 60, 940, 380, "text lives here"),
  },
  { id: "x-post", aliases: ["twitter-post"], platform: "X in-feed image", width: 1200, height: 675, verified: false, notes: "16:9 shows uncropped in the timeline." },
  { id: "linkedin-post", platform: "LinkedIn post / link image", width: 1200, height: 627, verified: false, notes: "1.91:1." },
  { id: "instagram-post", aliases: ["ig-post"], platform: "Instagram feed (portrait)", width: 1080, height: 1350, verified: false, notes: "4:5 takes the most feed space." },
  {
    id: "instagram-story", aliases: ["story", "reel", "poster"], platform: "Instagram / Facebook / WhatsApp story or Reel", width: 1080, height: 1920,
    verified: false, notes: "Leave about 250 px clear at the top and bottom for the app's UI.",
    avoid: [rect(0, 0, 1080, 250, "UI (approx.)"), rect(0, 1670, 1080, 250, "UI (approx.)")], safe: rect(60, 250, 960, 1420, "content"),
  },

  // ── Google Play ──────────────────────────────────────────────────────────
  {
    id: "google-play-feature-graphic", aliases: ["play-feature-graphic"], platform: "Google Play feature graphic", width: 1024, height: 500, alpha: false,
    verified: true, source: "https://support.google.com/googleplay/android-developer/answer/9866151", notes: "JPEG or 24-bit PNG, no alpha. Shown as the cover for the listing video and large collections.",
  },
  {
    id: "google-play-icon", platform: "Google Play app icon", width: 512, height: 512,
    verified: true, source: "https://support.google.com/googleplay/android-developer/answer/9866151", notes: "32-bit PNG (alpha allowed), ≤ 1024 KB.",
  },
  {
    id: "google-play-phone", aliases: ["play-screenshot", "playstore-screenshot"], platform: "Google Play phone screenshot (portrait)", width: 1080, height: 1920, alpha: false,
    verified: true, source: "https://support.google.com/googleplay/android-developer/answer/9866151",
    notes: "JPEG or 24-bit PNG, no alpha. 9:16 (min 1080×1920) or 16:9; each side 320–3840 px and the long side ≤ 2× the short side. 2–8 screenshots.",
  },
  {
    id: "google-play-phone-landscape", platform: "Google Play phone screenshot (landscape)", width: 1920, height: 1080, alpha: false,
    verified: true, source: "https://support.google.com/googleplay/android-developer/answer/9866151", notes: "16:9, min 1920×1080, no alpha.",
  },

  // ── Apple App Store ──────────────────────────────────────────────────────
  {
    id: "app-store-iphone-6.9", aliases: ["appstore-screenshot", "app-store-screenshot"], platform: 'App Store iPhone 6.9" screenshot', width: 1320, height: 2868, alpha: false,
    verified: true, source: "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications",
    notes: 'Required for iPhone apps (unless you provide 6.5"). PNG/JPEG, NO alpha/transparency, 1–10 screenshots. Landscape: 2868×1320.',
  },
  {
    id: "app-store-iphone-6.5", platform: 'App Store iPhone 6.5" screenshot', width: 1284, height: 2778, alpha: false,
    verified: true, source: "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications",
    notes: "Also accepted: 1242×2688. No alpha.",
  },
  {
    id: "app-store-ipad-13", platform: 'App Store iPad 13" screenshot', width: 2064, height: 2752, alpha: false,
    verified: true, source: "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications",
    notes: "Required for iPad apps. Also accepted: 2048×2732. No alpha.",
  },
  {
    id: "app-store-mac", platform: "Mac App Store screenshot", width: 2880, height: 1800, alpha: false,
    verified: true, source: "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications",
    notes: "16:10. Also accepted: 2560×1600, 1440×900, 1280×800. No alpha.",
  },
];

const norm = (s) => String(s).trim().toLowerCase();

/** Look a format up by id, alias, or exact "WxH" / (width, height). Returns undefined if unknown. */
export function findFormat(query, height) {
  if (typeof query === "number" && typeof height === "number") return FORMATS.find((f) => f.width === query && f.height === height);
  const q = norm(query);
  const size = q.match(/^(\d+)\s*[x×]\s*(\d+)$/);
  if (size) return FORMATS.find((f) => f.width === +size[1] && f.height === +size[2]);
  return FORMATS.find((f) => f.id === q || f.aliases?.includes(q));
}
