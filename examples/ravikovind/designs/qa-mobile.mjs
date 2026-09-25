import { cover, FONTS as F, H } from "./_cover.mjs";
export const FORMAT = { width: 1184, height: H, name: "qa-mobile-crop.png" };
export const FONTS = F;
// What a phone shows: the centre 1184×396 (x 200 → 1384).
export default () => ({
  type: "div",
  props: { style: { display: "flex", position: "relative", width: 1184, height: H, overflow: "hidden" }, children: [
    { type: "div", props: { style: { display: "flex", position: "absolute", left: -200, top: 0 }, children: [cover()] } },
  ] },
});
