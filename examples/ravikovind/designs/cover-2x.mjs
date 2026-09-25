import { cover, FONTS as F, W, H } from "./_cover.mjs";
export const FORMAT = { width: W * 2, height: H * 2, name: "ravi-kovind-linkedin-cover@2x.png" };
export const FONTS = F;
// Same vector tree scaled 2× (crisp, like deviceScaleFactor: 2).
export default () => ({
  type: "div",
  props: { style: { display: "flex", position: "relative", width: W * 2, height: H * 2, overflow: "hidden" }, children: [
    { type: "div", props: { style: { display: "flex", position: "absolute", left: 0, top: 0, width: W, height: H, transform: "scale(2)", transformOrigin: "top left" }, children: [cover()] } },
  ] },
});
