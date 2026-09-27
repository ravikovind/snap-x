// @snap-x/core is a plain JS package (no .d.ts files) — this is a loose ambient declaration for the
// handful of exports apps/web actually uses (the landing page's gallery, /formats, and the OG-image
// prebuild script). Not a full type surface for the package.
declare module "@snap-x/core" {
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

  export function renderDesign(
    designPath: string,
    outDir: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fonts: any[],
    opts?: { scale?: number; only?: string[]; log?: (line: string) => void },
  ): Promise<string | string[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function resolveFonts(spec: any): Promise<any[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function collectFontsSpec(files: string[]): Promise<any>;
  export function resetFontCache(): void;
}
