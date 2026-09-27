import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: every page here is server-rendered at build time (formats/use-cases/templates/
  // examples/showcase/docs all read from repo data, not runtime request data) and served as plain
  // HTML/CSS/JS — no Node server needed at deploy time. See improvements.md Phase 11.
  output: "export",
  images: {
    // next/image's default loader needs a running server for on-demand resizing, which a static
    // export doesn't have. Every image here is already a pre-rendered PNG at its exact display
    // size (snap-x's own output, or a committed example/template preview) — plain <img> instead.
    unoptimized: true,
  },
};

export default nextConfig;
