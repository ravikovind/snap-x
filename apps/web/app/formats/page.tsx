import type { Metadata } from "next";
import { FORMATS, type Format, type Zone } from "@snap-x/core/formats";

export const metadata: Metadata = {
  title: "Platform formats",
  description:
    "Every platform format snap-x knows: exact size, whether the platform forbids an alpha channel, upload limits and placement zones — generated directly from the same data snap-x formats prints.",
  openGraph: { images: ["/og/formats.png"] },
};

const zoneText = (z: Zone) =>
  z.type === "circle"
    ? `circle (${z.cx}, ${z.cy}) r=${z.r}${z.label ? ` — ${z.label}` : ""}`
    : `rect ${z.x},${z.y} ${z.w}×${z.h}${z.label ? ` — ${z.label}` : ""}`;

function FormatCard({ f }: { f: Format }) {
  const ratio = f.width / f.height;
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex h-20 items-center justify-center rounded-lg border border-border-2 bg-surface-2">
        <div
          className="rounded bg-gradient-to-br from-surface-2 to-surface"
          style={{
            width: ratio >= 1 ? "70%" : `${Math.max(20, 70 * ratio)}%`,
            height: ratio >= 1 ? `${Math.max(20, 70 / ratio)}%` : "70%",
            border: "1px solid var(--color-border-2)",
          }}
        />
      </div>
      <div className="font-mono text-xs text-muted-2">
        {f.width}×{f.height}
      </div>
      <h3 className="mt-1 font-bold">{f.id}</h3>
      <p className="text-sm text-muted">{f.platform}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-2">{f.notes}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {f.verified ? (
          <span className="rounded-full bg-green-dim px-2 py-0.5 font-mono text-[10px] text-green">verified</span>
        ) : (
          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-2">unverified</span>
        )}
        {f.alpha === false && <span className="rounded-full bg-red-dim px-2 py-0.5 font-mono text-[10px] text-red">no alpha</span>}
        {(f.avoid?.length || f.safe) && <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-2">zones</span>}
        {(f.maxBytes || f.types) && <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-2">limits</span>}
      </div>
      {f.source && (
        <a href={f.source} target="_blank" rel="noopener" className="mt-3 block truncate text-xs text-[#79c0ff] underline">
          source
        </a>
      )}
      {(f.avoid?.length || f.safe) && (
        <div className="mt-3 space-y-1 border-t border-border pt-3 font-mono text-[11px] text-muted-2">
          {f.avoid?.map((z, i) => (
            <div key={i}>avoid {zoneText(z)}</div>
          ))}
          {f.safe && <div>safe {zoneText(f.safe)}</div>}
        </div>
      )}
    </div>
  );
}

export default function FormatsPage() {
  const verifiedCount = FORMATS.filter((f) => f.verified).length;

  return (
    <section className="mx-auto max-w-[1160px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Correct for every platform</p>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
        {FORMATS.length} formats, <em className="not-italic text-red">{verifiedCount} verified</em> against official docs
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        This table is generated at build time from{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-[#79c0ff]">packages/core/src/formats.mjs</code> — the exact
        same data <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-[#79c0ff]">snap-x formats</code> prints. Nothing here is hand-typed.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FORMATS.map((f) => (
          <FormatCard key={f.id} f={f} />
        ))}
      </div>
    </section>
  );
}
