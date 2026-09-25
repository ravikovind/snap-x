import { cover, qaLayer, FONTS as F, W, H } from "./_cover.mjs";
export const FORMAT = { width: W, height: H, name: "qa-overlay.png" };
export const FONTS = F;
// Danger zones drawn on top: avatar circle (Ø230 at 160,396), mobile side crops, top/bottom chrome; dashed = safe area.
export default () => ({ type: "div", props: { style: { display: "flex", position: "relative", width: W, height: H }, children: [cover(), qaLayer()] } });
