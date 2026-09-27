import fs from "fs/promises";
import { fileURLToPath } from "url";

export const FORMAT = { width: 1080, height: 1350, name: "diwali-poster.png" };
export const FONTS = [{ family: "Saira", weights: [300, 400, 600, 700, 800, 900] }];

const svgFilled = async (rel, fill) => {
  const raw = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
  const out = raw
    .replaceAll('stroke="currentColor"', 'stroke="none"')
    .replaceAll('fill="none"', `fill="${fill}"`);
  return `data:image/svg+xml;base64,${Buffer.from(out).toString("base64")}`;
};

const svgStroked = async (rel, color) => {
  const raw = await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(raw.replaceAll("currentColor", color)).toString("base64")}`;
};

export default async function () {
  // ── Light palette ────────────────────────────────────────────────────
  const bg       = "#fffbf2";       // warm white/cream
  const red      = "#eb1d25";       // VoltVave red
  const gold     = "#D4860A";       // amber-gold (readable on white)
  const goldBright = "#F5A800";     // brighter gold for decorative fills
  const textDark = "#1a0800";       // near-black warm
  const textMid  = "#7a5c30";       // warm brown-gray
  const textFade = "#b08050";       // muted warm

  const [starIcon, flameIcon, zapIcon] = await Promise.all([
    svgFilled("../assets/lucide-star.svg", goldBright),
    svgFilled("../assets/lucide-flame.svg", "#FF6B00"),
    svgStroked("../assets/lucide-zap.svg", red),
  ]);

  // Small gold star image
  const starDot = (size = 14) => ({
    type: "img",
    props: { src: starIcon, width: size, height: size, style: { display: "flex" } },
  });

  // Ornamental divider  ─── ◆ ───
  const divider = (opacity = 0.4) => ({
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "row", alignItems: "center", width: "100%" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flex: 1, height: 1, background: `rgba(180,110,0,${opacity})` },
            children: [],
          },
        },
        {
          type: "svg",
          props: {
            width: 10, height: 10, viewBox: "0 0 10 10",
            style: { display: "flex", margin: "0 10px" },
            children: [{ type: "path", props: { d: "M5 0 L10 5 L5 10 L0 5 Z", fill: goldBright } }],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flex: 1, height: 1, background: `rgba(180,110,0,${opacity})` },
            children: [],
          },
        },
      ],
    },
  });

  const centered = (child) => ({
    type: "div",
    props: {
      style: { display: "flex", justifyContent: "center", width: "100%" },
      children: [child],
    },
  });

  const floatStar = (top, left, size, opacity) => ({
    type: "div",
    props: {
      style: { display: "flex", position: "absolute", top, left, opacity },
      children: [starDot(size)],
    },
  });

  // Mandala ring — stronger contrast on white bg
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    return {
      type: "line",
      props: {
        x1: 140 + 100 * Math.cos(a), y1: 140 + 100 * Math.sin(a),
        x2: 140 + 126 * Math.cos(a), y2: 140 + 126 * Math.sin(a),
        stroke: "rgba(160,100,0,0.3)", strokeWidth: 1,
      },
    };
  });

  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    const x = 140 + 132 * Math.cos(a), y = 140 + 132 * Math.sin(a), s = 5;
    return {
      type: "path",
      props: { d: `M${x} ${y - s} L${x + s} ${y} L${x} ${y + s} L${x - s} ${y} Z`, fill: goldBright },
    };
  });

  const mandalaRing = {
    type: "svg",
    props: {
      width: 280, height: 280, viewBox: "0 0 280 280",
      style: { display: "flex", position: "absolute", top: 0, left: 0 },
      children: [
        { type: "circle", props: { cx: 140, cy: 140, r: 132, fill: "none", stroke: "rgba(160,100,0,0.18)", strokeWidth: 1 } },
        { type: "circle", props: { cx: 140, cy: 140, r: 110, fill: "none", stroke: "rgba(160,100,0,0.25)", strokeWidth: 1 } },
        { type: "circle", props: { cx: 140, cy: 140, r: 86,  fill: "none", stroke: "rgba(160,100,0,0.35)", strokeWidth: 1 } },
        ...ticks,
        ...diamonds,
      ],
    },
  };

  // Corner bracket (2px, red)
  const cH = (pos) => ({ type: "div", props: { style: { display: "flex", position: "absolute", ...pos, width: 100, height: 2, background: red }, children: [] } });
  const cV = (pos) => ({ type: "div", props: { style: { display: "flex", position: "absolute", ...pos, width: 2, height: 40, background: red }, children: [] } });

  return {
    type: "div",
    props: {
      style: {
        width: 1080, height: 1350,
        background: bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Saira",
        position: "relative",
        overflow: "hidden",
      },
      children: [

        // ── Subtle warm radial wash ────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 700, height: 700, borderRadius: 999,
              background: "radial-gradient(circle, rgba(255,160,0,0.08) 0%, transparent 65%)",
              top: 220, left: 190,
            },
            children: [],
          },
        },
        // Red tint at bottom
        {
          type: "div",
          props: {
            style: {
              display: "flex", position: "absolute",
              width: 600, height: 350, borderRadius: 999,
              background: "radial-gradient(circle, rgba(235,29,37,0.05) 0%, transparent 70%)",
              bottom: -80, left: 240,
            },
            children: [],
          },
        },

        // ── Scattered gold stars ───────────────────────────────────────
        floatStar(90,  80,  18, 0.7),
        floatStar(80,  960, 14, 0.6),
        floatStar(200, 40,  12, 0.5),
        floatStar(220, 1020,16, 0.55),
        floatStar(560, 52,  20, 0.6),
        floatStar(540, 1000,14, 0.5),
        floatStar(720, 70,  12, 0.45),
        floatStar(700, 980, 18, 0.55),
        floatStar(980, 100, 14, 0.5),
        floatStar(960, 940, 16, 0.5),
        floatStar(1150,60,  10, 0.4),
        floatStar(1140,990, 12, 0.4),
        floatStar(350, 30,  10, 0.4),
        floatStar(420, 1030,10, 0.4),

        // ── Red corner brackets ────────────────────────────────────────
        cH({ top: 0, left: 0 }), cV({ top: 0, left: 0 }),
        cH({ top: 0, right: 0 }), cV({ top: 0, right: 0 }),
        cH({ bottom: 0, left: 0 }), cV({ bottom: 0, left: 0 }),
        cH({ bottom: 0, right: 0 }), cV({ bottom: 0, right: 0 }),

        // ── Main content ───────────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "56px 72px",
              flex: 1,
            },
            children: [

              // Header
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 10 },
                        children: [
                          { type: "img", props: { src: zapIcon, width: 16, height: 16, style: { display: "flex", marginRight: 8 } } },
                          {
                            type: "span",
                            props: {
                              style: { display: "flex", fontSize: 13, fontWeight: 700, color: red, letterSpacing: "2.5px" },
                              children: ["VOLTVAVE INNOVATIONS"],
                            },
                          },
                          { type: "img", props: { src: zapIcon, width: 16, height: 16, style: { display: "flex", marginLeft: 8 } } },
                        ],
                      },
                    },
                    divider(0.3),
                  ],
                },
              },

              // Diya + mandala
              {
                type: "div",
                props: {
                  style: { display: "flex", justifyContent: "center", width: "100%" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", width: 280, height: 280, position: "relative" },
                        children: [
                          mandalaRing,
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex", position: "absolute",
                                top: 0, left: 0, width: 280, height: 280,
                                justifyContent: "center", alignItems: "center",
                              },
                              children: [
                                { type: "span", props: { style: { display: "flex", fontSize: 130, lineHeight: 1 }, children: ["🪔"] } },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },

              // Eyebrow
              centered({
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 18, fontWeight: 300,
                    color: textMid, letterSpacing: "5px", whiteSpace: "nowrap",
                  },
                  children: ["WISHING YOU A"],
                },
              }),

              // HAPPY
              centered({
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 118, fontWeight: 900,
                    color: gold, letterSpacing: "-1px", lineHeight: 1.05, whiteSpace: "nowrap",
                  },
                  children: ["HAPPY"],
                },
              }),

              // DIWALI — VoltVave red for max impact on white
              centered({
                type: "span",
                props: {
                  style: {
                    display: "flex", fontSize: 156, fontWeight: 900,
                    color: red, letterSpacing: "-2px", lineHeight: 1, whiteSpace: "nowrap",
                  },
                  children: ["DIWALI"],
                },
              }),

              // Sparkle row
              centered({
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "row", alignItems: "center" },
                  children: [
                    { type: "span", props: { style: { display: "flex", fontSize: 28 }, children: ["✨"] } },
                    { type: "div", props: { style: { display: "flex", width: 120, height: 1, background: "rgba(180,110,0,0.35)", margin: "0 14px" }, children: [] } },
                    { type: "span", props: { style: { display: "flex", fontSize: 28 }, children: ["✨"] } },
                  ],
                },
              }),

              // Middle divider
              divider(0.35),

              // Blessing message
              centered({
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center" },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          display: "flex", fontSize: 20, fontWeight: 300,
                          color: textDark, letterSpacing: "0.3px", lineHeight: 1.7,
                        },
                        children: ["May this Festival of Lights fill your life with joy,"],
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          display: "flex", fontSize: 20, fontWeight: 300,
                          color: textDark, letterSpacing: "0.3px", lineHeight: 1.7,
                        },
                        children: ["prosperity, and new beginnings."],
                      },
                    },
                  ],
                },
              }),

              // Bottom divider
              divider(0.35),

              // Footer
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 6 },
                        children: [
                          { type: "img", props: { src: flameIcon, width: 22, height: 22, style: { display: "flex", marginRight: 10 } } },
                          {
                            type: "span",
                            props: {
                              style: { display: "flex", fontSize: 26, fontWeight: 800, color: textDark, letterSpacing: "0.3px" },
                              children: ["VoltVave Innovations"],
                            },
                          },
                          { type: "img", props: { src: flameIcon, width: 22, height: 22, style: { display: "flex", marginLeft: 10 } } },
                        ],
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: { display: "flex", fontSize: 14, fontWeight: 600, color: gold, letterSpacing: "1.5px" },
                        children: ["VOLTVAVE.COM"],
                      },
                    },
                  ],
                },
              },

            ],
          },
        },
      ],
    },
  };
}
