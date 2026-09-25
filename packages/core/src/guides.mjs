/**
 * Placement guides: draw a platform format's danger zones over a design (and preview the mobile crop), so you can
 * SEE whether text lands under a profile photo, a duration badge, or a cropped edge. Zones come from formats.mjs.
 */
import path from "path";
import fs from "fs/promises";
import { loadDesignModule } from "./load.mjs";
import { resolveTree, renderTree } from "./render.mjs";
import { FORMATS, findFormat } from "./formats.mjs";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

/** The format for a design: an explicit id, an exact size match, or a uniformly scaled one (e.g. an @2x export). */
export function matchFormat(width, height, formatId) {
  if (formatId) {
    const f = findFormat(formatId);
    return f ? { format: f, scale: width / f.width } : null;
  }
  const exact = findFormat(width, height);
  if (exact) return { format: exact, scale: 1 };
  for (const f of FORMATS) {
    const k = width / f.width;
    if (k > 1 && Number.isInteger(k) && height === f.height * k) return { format: f, scale: k };
  }
  return null;
}

const RED = "rgba(255,40,60,";
const zoneBox = (z, k, fontFamily) => {
  const tag = (extra) => box({ fontSize: 12 * k, color: "#fff", background: RED + "0.85)", padding: `${1 * k}px ${5 * k}px`, fontFamily, lineHeight: 1.2, ...extra }, [z.label]);
  const base = { position: "absolute", background: RED + "0.16)", border: `${Math.max(1, k)}px solid ${RED}0.9)`, overflow: "hidden" };
  if (z.type === "circle") {
    // label sits at the circle's centre so the curve never clips it
    return box({ ...base, left: (z.cx - z.r) * k, top: (z.cy - z.r) * k, width: 2 * z.r * k, height: 2 * z.r * k, borderRadius: 9999, alignItems: "center", justifyContent: "center" }, z.label ? [tag({})] : []);
  }
  return box({ ...base, left: z.x * k, top: z.y * k, width: z.w * k, height: z.h * k }, z.label ? [tag({ position: "absolute", left: 4 * k, top: 3 * k })] : []);
};

/** The design with the format's zones drawn on top (red = avoid, dashed = safe area). */
export function guidesTree(tree, format, { width, height, scale = 1, fontFamily }) {
  const k = scale;
  const layer = [
    ...(format.avoid ?? []).map((z) => zoneBox(z, k, fontFamily)),
    ...(format.safe ? [box({ position: "absolute", left: format.safe.x * k, top: format.safe.y * k, width: format.safe.w * k, height: format.safe.h * k, border: `${Math.max(2, 2 * k)}px dashed rgba(34,211,238,0.95)` },
      format.safe.label ? [box({ position: "absolute", left: 4 * k, top: -18 * k, fontSize: 12 * k, color: "#22d3ee", fontFamily }, [format.safe.label])] : [])] : []),
  ];
  return box({ position: "relative", width, height, overflow: "hidden" }, [tree, box({ position: "absolute", left: 0, top: 0, width, height }, layer)]);
}

/** The strip a phone shows: the format's mobileCrop region only. */
export function mobileTree(tree, format, { width, height, scale = 1 }) {
  const { x, w } = format.mobileCrop;
  return box({ position: "relative", width: w * scale, height, overflow: "hidden" },
    [box({ position: "absolute", left: -x * scale, top: 0, width, height }, [tree])]);
}

/**
 * Writes `<name>.guides.png` (and `<name>.mobile.png` when the format defines a mobile crop) for one design.
 * Returns the written paths ([] when the format has no known placement zones).
 */
export async function renderGuides(designPath, outDir, fonts, { formatId } = {}) {
  const mod = await loadDesignModule(designPath);
  if (!mod.FORMAT) throw new Error(`${path.basename(designPath)}: missing export FORMAT`);
  const { width, height } = mod.FORMAT;
  const stem = (mod.FORMAT.name ?? path.basename(designPath, ".mjs")).replace(/\.png$/i, "");
  const match = matchFormat(width, height, formatId);

  if (!match) { console.log(`  –  ${stem}: no known format for ${width}×${height} (pass --format <id>; see \`snap-x formats\`)`); return []; }
  const { format, scale } = match;
  if (!format.avoid && !format.safe && !format.mobileCrop) { console.log(`  –  ${stem}: nothing to check — ${format.id} has no placement zones (that's fine)`); return []; }

  const tree = await resolveTree(mod);
  const opts = { width, height, scale, fontFamily: fonts[0]?.name };
  const written = [];

  const guides = path.join(outDir, `${stem}.guides.png`);
  await fs.writeFile(guides, await renderTree(guidesTree(tree, format, opts), { width, height }, fonts));
  written.push(guides);

  if (format.mobileCrop) {
    const mobile = path.join(outDir, `${stem}.mobile.png`);
    await fs.writeFile(mobile, await renderTree(mobileTree(tree, format, opts), { width: format.mobileCrop.w * scale, height }, fonts));
    written.push(mobile);
  }
  console.log(`  🧭  ${stem}: ${format.id} → ${written.map((p) => path.basename(p)).join(", ")}`);
  return written;
}
