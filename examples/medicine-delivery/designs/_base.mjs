import fs from "fs/promises";
import { fileURLToPath } from "url";

const binAsset = async (rel, mime) => {
  const buf = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)));
  return `data:${mime};base64,${buf.toString("base64")}`;
};

const svgStroked = async (rel, color, sw = 2) => {
  const raw = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
  const out = raw
    .replaceAll("currentColor", color)
    .replaceAll('stroke-width="2"', `stroke-width="${sw}"`);
  return `data:image/svg+xml;base64,${Buffer.from(out).toString("base64")}`;
};

/**
 * @param {{ g1, g2, g3, accent, ctaText, tagline, sub, badge }} theme
 */
export async function renderBanner({ g1, g2, g3, accent, ctaText, tagline, sub, badge }) {
  const white = "#FFFFFF";

  const [clockIcon, arrowIcon, medicinePhoto] = await Promise.all([
    svgStroked("../assets/lucide-clock.svg", accent, 2),
    svgStroked("../assets/lucide-arrow-right.svg", ctaText, 2.5),
    binAsset("../assets/medicine-photo.jpg", "image/jpeg"),
  ]);

  const dot = (top, left, size, opacity) => ({
    type: "div",
    props: {
      style: {
        display: "flex", position: "absolute",
        width: size, height: size, borderRadius: 999,
        background: `rgba(255,255,255,${opacity})`,
        top, left,
      },
      children: [],
    },
  });

  const ring = (top, left, size, opacity) => ({
    type: "div",
    props: {
      style: {
        display: "flex", position: "absolute",
        width: size, height: size, borderRadius: 999,
        border: `1.5px solid rgba(255,255,255,${opacity})`,
        top, left,
      },
      children: [],
    },
  });

  // Cross / plus medical icon
  const cross = (top, left, size, opacity) => ({
    type: "div",
    props: {
      style: { display: "flex", position: "absolute", top, left, opacity },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", position: "relative", width: size, height: size },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex", position: "absolute",
                    width: size, height: Math.round(size / 3),
                    top: Math.round(size / 3),
                    background: `rgba(255,255,255,0.9)`,
                    borderRadius: 3,
                  },
                  children: [],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex", position: "absolute",
                    width: Math.round(size / 3), height: size,
                    left: Math.round(size / 3),
                    background: `rgba(255,255,255,0.9)`,
                    borderRadius: 3,
                  },
                  children: [],
                },
              },
            ],
          },
        },
      ],
    },
  });

  return {
    type: "div",
    props: {
      style: {
        width: 1200, height: 480,
        display: "flex",
        fontFamily: "Lato",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(120deg, ${g1} 0%, ${g2} 45%, ${g3} 100%)`,
        borderRadius: 20,
      },
      children: [

        // Background rings
        ring(-100, -100, 380, 0.07),
        ring(-60,  -60,  300, 0.05),
        ring(180,  -160, 460, 0.04),
        ring(-50,  840,  360, 0.06),
        ring(80,   920,  440, 0.04),
        ring(260,  960,  300, 0.05),

        // Scattered dots
        dot(40,  400, 5, 0.2), dot(90,  540, 4, 0.18),
        dot(140, 360, 6, 0.15), dot(210, 480, 5, 0.18),
        dot(360, 420, 4, 0.2), dot(410, 300, 5, 0.15),
        dot(60,  680, 4, 0.15), dot(310, 620, 5, 0.12),

        // Medical cross decorations
        cross(40, 560, 28, 0.12),
        cross(300, 500, 20, 0.1),
        cross(380, 640, 16, 0.08),

        // ── Right: medicine photo ────────────────────────────────────
        // Glow behind image
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 500, height: 500, borderRadius: 999,
              background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%)",
              top: -20, left: 680,
            },
            children: [],
          },
        },
        // Shadow
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 340, height: 32, borderRadius: 999,
              background: "rgba(0,0,0,0.3)",
              top: 406, left: 748,
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
            },
            children: [],
          },
        },
        // Accent ring border
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 432, height: 432, borderRadius: 999,
              border: `3px solid rgba(255,255,255,0.2)`,
              top: 14, left: 732,
            },
            children: [],
          },
        },
        // Photo circle
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 400, height: 400, borderRadius: 999,
              overflow: "hidden",
              top: 30, left: 748,
            },
            children: [{ type: "img", props: { src: medicinePhoto, width: 400, height: 400, style: { display: "flex" } } }],
          },
        },

        // ── Left content ─────────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "0 0 0 60px", width: 640, height: 480, flexShrink: 0,
            },
            children: [

              // Badge pill
              {
                type: "div",
                props: {
                  style: { display: "flex", marginBottom: 16 },
                  children: [{
                    type: "div",
                    props: {
                      style: {
                        display: "flex", flexDirection: "row", alignItems: "center",
                        background: "rgba(255,255,255,0.18)", borderRadius: 999,
                        padding: "6px 16px", border: "1px solid rgba(255,255,255,0.3)",
                      },
                      children: [
                        { type: "img", props: { src: clockIcon, width: 13, height: 13, style: { display: "flex", marginRight: 7 } } },
                        {
                          type: "span",
                          props: {
                            style: { display: "flex", fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "1.8px" },
                            children: [badge],
                          },
                        },
                      ],
                    },
                  }],
                },
              },

              // Tagline line 1
              {
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 52, fontWeight: 900,
                    color: white, lineHeight: 1.1, letterSpacing: "-0.5px",
                    whiteSpace: "nowrap", marginBottom: 4,
                  },
                  children: [tagline[0]],
                },
              },

              // Tagline line 2 (accent color)
              {
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 52, fontWeight: 900,
                    color: accent, lineHeight: 1.1, letterSpacing: "-0.5px",
                    whiteSpace: "nowrap", marginBottom: 16,
                  },
                  children: [tagline[1]],
                },
              },

              // Sub text
              {
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 15, fontWeight: 300,
                    color: "rgba(255,255,255,0.72)",
                    letterSpacing: "0.2px", marginBottom: 28, whiteSpace: "nowrap",
                  },
                  children: [sub],
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
                        background: white, borderRadius: 999, padding: "13px 32px",
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            style: {
                              display: "flex", fontSize: 16, fontWeight: 900,
                              color: ctaText, letterSpacing: "0.5px",
                              marginRight: 10, whiteSpace: "nowrap",
                            },
                            children: ["ORDER NOW"],
                          },
                        },
                        { type: "img", props: { src: arrowIcon, width: 18, height: 18, style: { display: "flex" } } },
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
