// Demonstrates improvements.md §6.1: .jsx design files, transformed at load time with esbuild
// against a tiny no-React JSX runtime (packages/core/src/jsx-runtime.mjs). Same rules as .mjs:
// self-contained, exports FORMAT/FONTS/default, imports a normal `_`-prefixed helper.
import { BG, INK, ACCENT, FONTS as F } from "./_theme.mjs";

export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS = F;

function Chip({ label }) {
  return (
    <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, border: `1px solid ${ACCENT}`, color: ACCENT, fontSize: 15, fontWeight: 700 }}>
      {label}
    </div>
  );
}

export default function () {
  return (
    <div style={{ width: 1200, height: 630, background: BG, display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, gap: 24 }}>
      <div style={{ display: "flex", color: INK, fontSize: 72, fontWeight: 900, letterSpacing: "-0.02em" }}>
        Design files, in JSX
      </div>
      <div style={{ display: "flex", color: "rgba(242,245,247,0.6)", fontSize: 22, maxWidth: 820 }}>
        Same FORMAT / FONTS / default export contract as .mjs — just transformed at load time. No React.
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <>
          <Chip label=".jsx" />
          <Chip label=".tsx" />
          <Chip label="no React" />
        </>
      </div>
    </div>
  );
}
