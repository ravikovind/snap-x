// The .tsx counterpart: type annotations are stripped at load time (esbuild), not type-checked.
import { BG, INK, ACCENT, FONTS as F } from "./_theme.mjs";

interface StatProps {
  value: string;
  label: string;
}

export const FORMAT = { width: 1280, height: 640, name: "card.png" };
export const FONTS = F;

function Stat({ value, label }: StatProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", color: ACCENT, fontSize: 48, fontWeight: 900 }}>{value}</div>
      <div style={{ display: "flex", color: "rgba(242,245,247,0.6)", fontSize: 15 }}>{label}</div>
    </div>
  );
}

export default function () {
  return (
    <div style={{ width: 1280, height: 640, background: BG, display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, gap: 40 }}>
      <div style={{ display: "flex", color: INK, fontSize: 56, fontWeight: 900 }}>.tsx works too</div>
      <div style={{ display: "flex", gap: 56 }}>
        <Stat value="0" label="React dependencies" />
        <Stat value="1" label="tiny JSX factory" />
        <Stat value="2" label="new extensions (.jsx, .tsx)" />
      </div>
    </div>
  );
}
