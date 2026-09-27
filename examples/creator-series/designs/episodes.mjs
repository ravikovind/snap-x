import { FONTS, episodeThumb } from "./_creator-series.mjs";

// One template, three episodes (improvements.md §4 — VARIANTS instead of one .mjs per episode).
export const FORMAT = { width: 1280, height: 720, name: "episode.png" };
export { FONTS };

export const VARIANTS = [
  { id: "ep1", episode: "EPISODE 1", title: "Cutting the legs", icon: "saw", format: { name: "ep1-cutting-the-legs.png" } },
  { id: "ep2", episode: "EPISODE 2", title: "Gluing the top", icon: "glue", format: { name: "ep2-gluing-the-top.png" } },
  { id: "ep3", episode: "EPISODE 3", title: "First finish coat", icon: "brush", format: { name: "ep3-first-finish-coat.png" } },
];

export default (variant) => episodeThumb(variant.episode, variant.title, variant.icon);
