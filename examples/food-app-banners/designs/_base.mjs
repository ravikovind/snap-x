// Shared banner layout — imported by the 3 theme entry files
import fs from "fs/promises";
import { fileURLToPath } from "url";

const svgStroked = async (rel, color, sw = 2) => {
  const raw = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
  const out = raw
    .replaceAll("currentColor", color)
    .replaceAll('stroke-width="2"', `stroke-width="${sw}"`);
  return `data:image/svg+xml;base64,${Buffer.from(out).toString("base64")}`;
};

const svgFilled = async (rel, fill) => {
  const raw = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
  const out = raw
    .replaceAll('stroke="currentColor"', 'stroke="none"')
    .replaceAll('fill="none"', `fill="${fill}"`);
  return `data:image/svg+xml;base64,${Buffer.from(out).toString("base64")}`;
};

const binAsset = async (rel, mime) => {
  const buf = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)));
  return `data:${mime};base64,${buf.toString("base64")}`;
};

/**
 * @param {{ g1: string, g2: string, g3: string, highlight: string, ctaText: string }} theme
 */
export async function renderBanner({ g1, g2, g3, highlight, ctaText }) {
  const white = "#FFFFFF";

  const [arrowIcon, clockIcon, utensilsIcon, pastaPhoto] = await Promise.all([
    svgStroked("../assets/lucide-arrow-right.svg", ctaText, 2.5),
    svgStroked("../assets/lucide-clock.svg", highlight, 2),
    svgFilled("../assets/lucide-utensils.svg", "rgba(255,255,255,0.1)"),
    binAsset("../assets/pasta-photo.jpg", "image/jpeg"),
  ]);

  // Decorative floating dot
  const dot = (top, left, size, opacity) => ({
    type: "div",
    props: {
      style: {
        display: "flex", position: "absolute", top, left,
        width: size, height: size, borderRadius: 999,
        background: `rgba(255,255,255,${opacity})`,
      },
      children: [],
    },
  });

  // Decorative ring
  const ring = (top, left, size, opacity) => ({
    type: "div",
    props: {
      style: {
        display: "flex", position: "absolute", top, left,
        width: size, height: size, borderRadius: 999,
        border: `1.5px solid rgba(255,255,255,${opacity})`,
      },
      children: [],
    },
  });

  return {
    type: "div",
    props: {
      style: {
        width: 1200, height: 480,
        display: "flex",
        fontFamily: "Saira",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(120deg, ${g1} 0%, ${g2} 45%, ${g3} 100%)`,
        borderRadius: 24,
      },
      children: [

        // ── Background rings ─────────────────────────────────────────
        ring(-120, -120, 420, 0.07),
        ring(-80,  -80,  340, 0.05),
        ring(200,  -180, 500, 0.04),
        ring(-60,  820,  380, 0.06),
        ring(100,  900,  480, 0.04),
        ring(280,  980,  320, 0.05),

        // Scattered dots
        dot(30,  420, 6, 0.25), dot(70,  560, 4, 0.2),
        dot(120, 380, 5, 0.2),  dot(200, 500, 8, 0.15),
        dot(350, 440, 5, 0.2),  dot(400, 320, 4, 0.18),
        dot(50,  700, 5, 0.15), dot(300, 650, 6, 0.12),
        dot(440, 580, 4, 0.15), dot(20,  900, 5, 0.12),

        // Watermark utensils
        {
          type: "div",
          props: {
            style: { display: "flex", position: "absolute", top: 60, left: 480, opacity: 0.05 },
            children: [{ type: "img", props: { src: utensilsIcon, width: 360, height: 360, style: { display: "flex" } } }],
          },
        },

        // ── Floating pasta (right side) ──────────────────────────────
        // Ambient glow
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 500, height: 500, borderRadius: 999,
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)",
              top: -10, left: 680,
            },
            children: [],
          },
        },
        // Shadow ellipse
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 340, height: 36, borderRadius: 999,
              background: "rgba(0,0,0,0.28)",
              top: 402, left: 748,
            },
            children: [],
          },
        },
        // White ring
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 416, height: 416, borderRadius: 999,
              background: white,
              top: 22, left: 740,
              transform: "rotate(-6deg)",
              transformOrigin: "center center",
            },
            children: [],
          },
        },
        // Accent ring
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 432, height: 432, borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.22)",
              top: 14, left: 732,
              transform: "rotate(-6deg)",
              transformOrigin: "center center",
            },
            children: [],
          },
        },
        // Pasta photo circle
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 400, height: 400, borderRadius: 999,
              overflow: "hidden",
              top: 30, left: 748,
              transform: "rotate(-6deg)",
              transformOrigin: "center center",
            },
            children: [{ type: "img", props: { src: pastaPhoto, width: 400, height: 400, style: { display: "flex" } } }],
          },
        },
        // Garnish emojis
        {
          type: "div",
          props: {
            style: { display: "flex", position: "absolute", top: 30, left: 1090 },
            children: [{ type: "span", props: { style: { display: "flex", fontSize: 48 }, children: ["🌿"] } }],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", position: "absolute", top: 360, left: 700 },
            children: [{ type: "span", props: { style: { display: "flex", fontSize: 44 }, children: ["🌶️"] } }],
          },
        },

        // ── Left content ─────────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "0 0 0 64px", width: 620, height: 480, flexShrink: 0,
            },
            children: [

              // Label pill
              {
                type: "div",
                props: {
                  style: { display: "flex", marginBottom: 18 },
                  children: [{
                    type: "div",
                    props: {
                      style: {
                        display: "flex", flexDirection: "row", alignItems: "center",
                        background: "rgba(255,255,255,0.18)", borderRadius: 999,
                        padding: "6px 16px", border: "1px solid rgba(255,255,255,0.3)",
                      },
                      children: [
                        { type: "img", props: { src: clockIcon, width: 14, height: 14, style: { display: "flex", marginRight: 7 } } },
                        {
                          type: "span",
                          props: {
                            style: { display: "flex", fontSize: 12, fontWeight: 700, color: highlight, letterSpacing: "1.5px" },
                            children: ["LIMITED TIME OFFER"],
                          },
                        },
                      ],
                    },
                  }],
                },
              },

              // FLAT
              {
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 28, fontWeight: 300,
                    color: "rgba(255,255,255,0.75)", letterSpacing: "8px",
                    whiteSpace: "nowrap", marginBottom: -8,
                  },
                  children: ["FLAT"],
                },
              },

              // 50% OFF
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 4 },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          display: "flex", fontSize: 148, fontWeight: 900,
                          color: white, letterSpacing: "-4px", lineHeight: 1, whiteSpace: "nowrap",
                        },
                        children: ["50"],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 4 },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: {
                                display: "flex", fontSize: 80, fontWeight: 900,
                                color: highlight, lineHeight: 1, letterSpacing: "-1px", whiteSpace: "nowrap",
                              },
                              children: ["%"],
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                display: "flex", fontSize: 52, fontWeight: 900,
                                color: white, letterSpacing: "2px", lineHeight: 1, whiteSpace: "nowrap",
                              },
                              children: ["OFF"],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },

              // Subtitle
              {
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 16, fontWeight: 300,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.3px", marginBottom: 28, whiteSpace: "nowrap",
                  },
                  children: ["On your first 3 orders  ·  No coupon needed"],
                },
              },

              // CTA button
              {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: [{
                    type: "div",
                    props: {
                      style: {
                        display: "flex", flexDirection: "row", alignItems: "center",
                        background: white, borderRadius: 999, padding: "14px 36px",
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            style: {
                              display: "flex", fontSize: 20, fontWeight: 800,
                              color: ctaText, letterSpacing: "0.5px",
                              marginRight: 10, whiteSpace: "nowrap",
                            },
                            children: ["ORDER NOW"],
                          },
                        },
                        { type: "img", props: { src: arrowIcon, width: 20, height: 20, style: { display: "flex" } } },
                      ],
                    },
                  }],
                },
              },

            ],
          },
        },
      ],
    },
  };
}
