// Shared helpers for the "Salt & Pine" pack.
// Salt & Pine is a FICTIONAL home-goods brand made up for this example —
// there is no real company, product, or domain behind it. All product art
// below is flat drawn shapes, not photos, and saltandpine.example uses the
// IANA-reserved non-resolving .example TLD on purpose.

export const FONTS = [{ family: "Poppins", weights: [400, 700, 900] }];

export const C = {
  bg: "#FBF3E7",
  panel: "#F3E4D0",
  ink: "#2B1B12",
  accent: "#E1592C",
  accent2: "#6B8F71",
  cream: "#FFFDF9",
  muted: "#8A7361",
};

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export const wordmark = (size = 22) =>
  box({ alignItems: "center", gap: 10 }, [
    box({ width: size * 0.7, height: size * 0.7, borderRadius: 999, background: C.accent }),
    txt("SALT & PINE", { fontSize: size, fontWeight: 700, letterSpacing: "0.14em", color: C.ink }),
  ]);

export const tagPill = (label, scale = 1) =>
  box({
    padding: `${7 * scale}px ${18 * scale}px`, borderRadius: 999, background: C.accent,
  }, [txt(label, { fontSize: 15 * scale, fontWeight: 700, letterSpacing: "1px", color: C.cream })]);

// Flat drawn product art — no photos. `s` is the bounding box size in px.
export const productArt = (kind, s = 240) => {
  if (kind === "candle") {
    return box({ width: s, height: s, alignItems: "center", justifyContent: "flex-end" }, [
      box({ position: "absolute", top: s * 0.06, left: s * 0.46, width: s * 0.06, height: s * 0.14, borderRadius: 4, background: C.accent }),
      box({
        width: s * 0.56, height: s * 0.7, borderRadius: "10px 10px 22px 22px",
        background: C.accent2, border: `3px solid ${C.ink}`,
      }),
    ]);
  }
  if (kind === "throw") {
    return box({ width: s, height: s * 0.62, flexDirection: "column", justifyContent: "flex-end" }, [
      box({ width: s, height: s * 0.5, borderRadius: 14, background: C.accent2, border: `3px solid ${C.ink}`, flexDirection: "column" }, [
        box({ width: s, height: s * 0.11, background: C.cream, marginTop: s * 0.1 }),
        box({ width: s, height: s * 0.11, background: C.accent, marginTop: s * 0.08 }),
      ]),
    ]);
  }
  // mug
  return box({ width: s, height: s * 0.8, alignItems: "center" }, [
    box({ position: "absolute", top: s * 0.02, left: s * 0.3, width: s * 0.06, height: s * 0.16, background: C.muted, borderRadius: 4 }),
    box({ position: "absolute", top: s * 0.02, left: s * 0.46, width: s * 0.06, height: s * 0.2, background: C.muted, borderRadius: 4 }),
    box({
      width: s * 0.6, height: s * 0.56, marginTop: s * 0.22, borderRadius: "6px 6px 16px 16px",
      background: C.cream, border: `3px solid ${C.ink}`,
    }),
    box({
      position: "absolute", right: s * 0.06, top: s * 0.42, width: s * 0.16, height: s * 0.24,
      borderRadius: 20, border: `4px solid ${C.ink}`,
    }),
  ]);
};

// Main template — reused for every size/product in this pack. Only the
// arguments change; the layout adapts to wide vs. tall canvases.
export function banner(width, height, { product, kind, price, oldPrice, tag }) {
  const tall = height > width; // instagram-post / instagram-story
  const topPad = height >= 1900 ? 260 : tall ? 90 : 56; // clear Instagram Story's UI-chrome avoid zone
  const bottomPad = height >= 1900 ? 260 : tall ? 90 : 56;

  const priceRow = box({ alignItems: "baseline", gap: 14 }, [
    txt(price, { fontSize: tall ? 46 : 40, fontWeight: 900, color: C.accent }),
    oldPrice ? txt(oldPrice, { fontSize: tall ? 26 : 22, fontWeight: 700, color: C.muted, textDecoration: "line-through" }) : null,
  ].filter(Boolean));

  const copy = box({ flexDirection: "column", gap: 16 }, [
    tagPill(tag, tall ? 1.1 : 1),
    txt(product, { fontSize: tall ? 58 : 50, fontWeight: 900, lineHeight: 1.05, color: C.ink, maxWidth: tall ? 760 : 640, flexWrap: "wrap" }),
    priceRow,
  ]);

  const art = productArt(kind, tall ? 420 : 300);

  return box({
    width, height, background: C.bg, fontFamily: "Poppins", position: "relative", overflow: "hidden",
    flexDirection: "column", justifyContent: "space-between", padding: `${topPad}px 72px ${bottomPad}px`,
  }, [
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 10, background: C.accent2 }),
    box({ alignItems: "center", justifyContent: "space-between" }, [wordmark(tall ? 24 : 20), txt("NEW ARRIVAL", { fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", color: C.muted })]),
    tall
      ? box({ flexDirection: "column", alignItems: "center", gap: 40, flex: 1, justifyContent: "center" }, [art, copy])
      : box({ alignItems: "center", justifyContent: "space-between", flex: 1 }, [copy, art]),
    box({ justifyContent: "center" }, [txt("saltandpine.example", { fontFamily: "Poppins", fontSize: 14, color: C.muted, letterSpacing: "0.08em" })]),
  ]);
}
