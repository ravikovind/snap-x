// Shared builder for the snap-x logo/app-icon family. Concept: three solid rectangles at different
// aspect ratios (portrait, square, landscape) fanned out — "one source, exact size for every
// platform." White shapes on snap-x's own brand red (#eb1d25). Solid fills (no thin strokes), so
// one composition holds up cleanly from 16px favicons to a 1024px logo — checked by rendering real
// 16px/32px PNGs, not assumed.

export const FONTS = [];

const RED = "#eb1d25";
const WHITE = "#ffffff";

const rect = (w, h, left, top, opacity, rotate = 0) => ({
  type: "div",
  props: {
    style: {
      display: "flex", position: "absolute", width: w, height: h, left, top,
      background: WHITE, opacity, borderRadius: w * 0.09, transform: `rotate(${rotate}deg)`,
    },
    children: [],
  },
});

/**
 * @param {number} size canvas size in px (square)
 * @param {{ rounded?: boolean }} opts rounded: draw rounded corners on the background (off for
 *   apple-icon — the OS applies its own mask)
 */
export function logo(size, { rounded = true } = {}) {
  return {
    type: "div",
    props: {
      style: {
        width: size, height: size, background: RED, borderRadius: rounded ? size * 0.22 : 0,
        display: "flex", position: "relative", overflow: "hidden",
      },
      children: [
        rect(size * 0.3, size * 0.54, size * 0.14, size * 0.2, 0.45, -6),
        rect(size * 0.4, size * 0.4, size * 0.32, size * 0.16, 0.7, 0),
        rect(size * 0.5, size * 0.3, size * 0.24, size * 0.42, 1, 4),
      ],
    },
  };
}
