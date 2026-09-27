// Shared helpers for the "Sawdust & Coffee" pack.
// Sawdust & Coffee is a FICTIONAL woodworking channel made up for this
// example — there is no real channel, video, or view/subscriber count behind
// it. All tool icons below are flat drawn shapes, not photos or footage.

export const FONTS = [{ family: "Archivo", weights: [700, 900] }];

export const C = {
  bg: "#1B120C",
  panel: "#3A2417",
  accent: "#E8A33D",
  cream: "#F5E9D8",
  muted: "#B79C86",
  ink: "#1B120C",
};

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

export const wordmark = (size = 20) =>
  box({ alignItems: "center", gap: 10 }, [
    box({ width: size * 0.7, height: size * 0.7, borderRadius: 4, background: C.accent }),
    txt("SAWDUST & COFFEE", { fontSize: size, fontWeight: 700, letterSpacing: "0.14em", color: C.cream }),
  ]);

// Flat drawn tool icons — no photos. `s` is the bounding box size in px.
export const toolArt = (kind, s = 260) => {
  if (kind === "saw") {
    return box({ width: s, height: s * 0.7, alignItems: "center", justifyContent: "center" }, [
      box({ width: s * 0.85, height: s * 0.16, background: C.accent, borderRadius: 6, transform: "rotate(-8deg)" }),
      box({ position: "absolute", right: s * 0.06, width: s * 0.32, height: s * 0.42, background: C.panel, borderRadius: "6px 6px 6px 30px", border: `3px solid ${C.cream}`, transform: "rotate(-8deg)" }),
    ]);
  }
  if (kind === "glue") {
    return box({ width: s * 0.5, height: s * 0.72, flexDirection: "column", alignItems: "center" }, [
      box({ width: s * 0.14, height: s * 0.16, background: C.accent, borderRadius: "3px 3px 0 0" }),
      box({ width: s * 0.5, height: s * 0.56, background: C.panel, border: `3px solid ${C.cream}`, borderRadius: 10, marginTop: -4 }),
    ]);
  }
  // brush
  return box({ width: s * 0.55, height: s * 0.75, flexDirection: "column", alignItems: "center" }, [
    box({ width: s * 0.4, height: s * 0.22, background: C.cream, borderRadius: "4px 4px 10px 10px", border: `3px solid ${C.panel}` }),
    box({ width: s * 0.12, height: s * 0.42, background: C.accent, borderRadius: 4, marginTop: 2 }),
  ]);
};

// Main template — headline column stays left (x 64–784), icon sits right
// (roughly x 800–1160 / y 210–570), both clear of youtube-thumbnail's
// duration-badge avoid zone (x1100,y648, 160×56 — bottom-right corner).
export function episodeThumb(episode, title, icon) {
  return box({
    width: 1280, height: 720, background: C.bg, fontFamily: "Archivo", position: "relative",
    overflow: "hidden", padding: "0 64px", alignItems: "center", justifyContent: "space-between",
  }, [
    box({ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: C.accent }),
    box({ flexDirection: "column", gap: 22, maxWidth: 700 }, [
      txt(episode, { fontSize: 26, fontWeight: 700, letterSpacing: "0.2em", color: C.accent }),
      txt(title, { fontSize: 76, fontWeight: 900, lineHeight: 1.05, color: C.cream, maxWidth: 680, flexWrap: "wrap" }),
      wordmark(18),
    ]),
    box({ width: 340, height: 360, alignItems: "center", justifyContent: "center", background: C.panel, borderRadius: 24 }, [toolArt(icon, 260)]),
  ]);
}
