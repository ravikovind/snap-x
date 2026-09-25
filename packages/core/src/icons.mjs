/**
 * Lucide icon SVG paths for use in Satori templates.
 * All icons are 24×24 viewBox, stroke-based (strokeWidth 2, strokeLinecap round, strokeLinejoin round).
 *
 * Usage:
 *   import { lucideIcon } from "./icons.mjs";
 *   lucideIcon("ArrowUpRight", { size: 20, color: "#eb1d25" })
 */

const PATHS = {
  ArrowUpRight: ["M7 17L17 7", "M7 7h10v10"],
  ArrowRight: ["M5 12h14", "M12 5l7 7-7 7"],
  Check: ["M20 6L9 17l-5-5"],
  CheckCircle: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "L22 4 12 14.01l-3-3"],
  MapPin: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  Mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  MessageCircle: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  Rocket: ["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z", "M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z", "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"],
  Code: ["M16 18l6-6-6-6", "M8 6l-6 6 6 6"],
  Zap: ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  Star: ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  Globe: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  Package: ["M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.27 6.96L12 12.01l8.73-5.05", "M12 22.08V12"],
  Users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  TrendingUp: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  Shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  Terminal: ["M4 17l6-6-6-6", "M12 19h8"],
  Layers: ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
};

/**
 * Returns a Satori-compatible SVG node for a Lucide icon.
 */
export function lucideIcon(name, { size = 24, color = "currentColor", strokeWidth = 2 } = {}) {
  const paths = PATHS[name];
  if (!paths) {
    console.warn(`[snap-x] Unknown icon: ${name}`);
    return null;
  }

  return {
    type: "svg",
    props: {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { display: "flex", flexShrink: 0 },
      children: paths.map((d) => ({ type: "path", props: { d } })),
    },
  };
}

export const ICON_NAMES = Object.keys(PATHS);
