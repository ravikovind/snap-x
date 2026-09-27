import type { Metadata } from "next";
import { EXAMPLES } from "@/content/examples";

export const metadata: Metadata = {
  title: "Examples",
  description: "Complete packs made with the /snap-x skill: designs, assets, plan and output, each built from a repo, a site, or a written brief.",
  openGraph: { images: ["/og/examples.png"] },
};

export default function ExamplesPage() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Examples</p>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Complete packs, made with the skill</h1>
      <p className="mt-4 max-w-xl text-muted">
        Each has its designs, assets, plan and output — every image is real snap-x output, not a mockup. Regenerate all of them: <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-[#79c0ff]">npm run examples</code>.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((e) => (
          <a
            key={e.name}
            href={`https://github.com/ravikovind/snap-x/tree/main/examples/${e.name}`}
            target="_blank"
            rel="noopener"
            className="block overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-red-dim hover:bg-surface-2"
          >
            <div className="flex h-[150px] items-center justify-center bg-[#0d0d0d] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.image} alt={e.title} className="max-h-full max-w-full rounded object-contain" />
            </div>
            <div className="p-6">
              <div className="mb-2 font-mono text-xs text-muted-2">examples/{e.name}</div>
              <h2 className="text-lg font-bold leading-snug">{e.title}</h2>
              <p className="mt-2 text-sm text-muted">{e.body}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
