import { FONTS as F, C, phone, wordmark } from "./_kite.mjs";
export const FORMAT = { width: 1024, height: 500, name: "play-feature-graphic.png", alpha: false };
export const FONTS = F;
const d = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const t = (style, text) => d({ whiteSpace: "nowrap", ...style }, [text]);
export default () => d({ width: 1024, height: 500, background: C.bg, fontFamily: "Nunito", position: "relative", overflow: "hidden" }, [
  d({ position: "absolute", right: -150, bottom: -120, width: 560, height: 560, borderRadius: 999, background: C.orange }),
  d({ position: "absolute", left: 70, top: 0, bottom: 0, flexDirection: "column", justifyContent: "center", gap: 20 }, [
    wordmark(56),
    d({ flexDirection: "column" }, [
      t({ fontSize: 66, fontWeight: 900, color: C.cream, lineHeight: 1.08 }, "Plan the hike,"),
      t({ fontSize: 66, fontWeight: 900, color: C.orange, lineHeight: 1.08 }, "skip the"),
      t({ fontSize: 66, fontWeight: 900, color: C.orange, lineHeight: 1.08 }, "group chat."),
    ]),
  ]),
  d({ position: "absolute", left: 700, top: 55 }, [phone(300, "vote")]),
]);
