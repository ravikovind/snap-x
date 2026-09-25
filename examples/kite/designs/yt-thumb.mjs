import { FONTS as F, C, scenery, wordmark } from "./_kite.mjs";
export const FORMAT = { width: 1280, height: 720, name: "youtube-thumbnail.png" };
export const FONTS = F;
const d = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const t = (style, text) => d({ whiteSpace: "nowrap", ...style }, [text]);
export default () => d({ width: 1280, height: 720, background: C.bg, fontFamily: "Nunito", position: "relative", overflow: "hidden" }, [
  d({ position: "absolute", left: 0, bottom: 0 }, [scenery(1280, 512, false)]),
  d({ position: "absolute", right: 90, top: 60, width: 250, height: 250, borderRadius: 999, background: C.orange }),
  d({ position: "absolute", left: 80, top: 70 }, [wordmark(84)]),
  d({ position: "absolute", left: 80, top: 210, flexDirection: "column" }, [
    t({ fontSize: 230, fontWeight: 900, color: C.cream, lineHeight: 1.0 }, "Plan the"),
    t({ fontSize: 230, fontWeight: 900, color: C.orange, lineHeight: 1.0 }, "hike 🥾"),
  ]),
]);
