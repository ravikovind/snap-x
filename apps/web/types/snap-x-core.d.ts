// @snap-x/core is a plain JS package (no .d.ts files). apps/web only ever needs the pure platform-format
// data — never the renderer, which pulls in native bindings (@resvg/resvg-js) and a dynamic import() that
// Turbopack can't bundle. Import from the "./formats" subpath (packages/core/src/formats.mjs — no
// render/fonts/check imports) instead of the package root; that keeps Next's page bundle free of them.
// The OG-image prebuild script (scripts/render-og.mjs) is plain JS and imports the full package directly,
// outside this type surface.
declare module "@snap-x/core/formats" {
  export interface Zone {
    type: "rect" | "circle";
    label?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    cx?: number;
    cy?: number;
    r?: number;
  }

  export interface Format {
    id: string;
    aliases?: string[];
    platform: string;
    width: number;
    height: number;
    verified: boolean;
    source?: string;
    notes: string;
    alpha?: boolean;
    maxBytes?: number;
    types?: string[];
    avoid?: Zone[];
    safe?: Zone;
    mobileCrop?: { x: number; w: number };
  }

  export const FORMATS: Format[];
  export function findFormat(query: string | number, height?: number): Format | undefined;
}
