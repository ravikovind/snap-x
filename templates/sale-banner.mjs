// Template: sale / promo banner (1200×630 — the `og` size, reused; there's no dedicated
// e-commerce-banner format yet) — archetype: Split (design-principles.md § Archetypes).
// Brand-neutral. Copy this file into your own designs/ and edit the two blocks below.
//
// Uses VARIANTS: one layout, several products/prices — the point of this template is that you
// edit the PRODUCTS array, not the layout, when you add a new banner to the set.

// ── EDIT THESE VALUES ───────────────────────────────────────────────────────
const BG = "#fbf3e7";
const INK = "#2b1b12";
const ACCENT = "#e1592c";
const MUTED = "#8a7361";

const PRODUCTS = [
  { id: "product-one", name: "Product One", price: "$29", oldPrice: "$39", tag: "SALE" },
  { id: "product-two", name: "Product Two", price: "$49", oldPrice: null, tag: "NEW" },
];
// ─────────────────────────────────────────────────────────────────────────────

export const FORMAT = { width: 1200, height: 630, name: "sale-banner.png" };
export const FONTS = [{ family: "Inter", weights: [400, 700, 900] }];
export const VARIANTS = PRODUCTS.map((p) => ({ ...p, format: { name: `sale-banner-${p.id}.png` } }));

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export default function (variant) {
  return box(
    { width: 1200, height: 630, background: BG, fontFamily: "Inter", position: "relative", overflow: "hidden" },
    [
      box({ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: ACCENT }),

      // text: left ~55%
      box({ width: 660, flexDirection: "column", justifyContent: "center", padding: "0 72px", gap: 20 }, [
        box({ padding: "8px 20px", borderRadius: 999, background: ACCENT, alignSelf: "flex-start" }, [
          txt(variant.tag, { fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }),
        ]),
        txt(variant.name, { fontSize: 48, fontWeight: 900, color: INK, lineHeight: 1.1, whiteSpace: "nowrap" }),
        box({ alignItems: "baseline", gap: 14 }, [
          txt(variant.price, { fontSize: 40, fontWeight: 900, color: ACCENT }),
          variant.oldPrice ? txt(variant.oldPrice, { fontSize: 24, fontWeight: 700, color: MUTED, textDecoration: "line-through" }) : null,
        ].filter(Boolean)),
      ]),

      // product art: right ~45% — replace this flat placeholder shape with your own drawn art or an
      // embedded photo (see README.md "Logos and images" for the async + base64 pattern)
      box({ position: "absolute", right: 90, top: 0, bottom: 0, alignItems: "center", justifyContent: "center" }, [
        box({ width: 300, height: 380, borderRadius: 20, background: `${ACCENT}22`, border: `3px solid ${ACCENT}` }),
      ]),
    ],
  );
}
