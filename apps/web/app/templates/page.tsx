import type { Metadata } from "next";
import { TEMPLATES } from "@/content/templates";

export const metadata: Metadata = {
  title: "Templates",
  description: "Six brand-neutral starter designs — each with an \"edit these values\" block, a named archetype, zero check warnings, and a committed preview.",
  openGraph: { images: ["/og/templates.png"] },
};

export default function TemplatesPage() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Templates</p>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Copy one, edit the values</h1>
      <p className="mt-4 max-w-xl text-muted">
        Brand-neutral, well-commented designs — each has an &quot;edit these values&quot; block at the top, names its archetype in a comment, and
        checks with zero warnings.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <a
            key={t.name}
            href={`https://github.com/ravikovind/snap-x/blob/main/templates/${t.name}.mjs`}
            target="_blank"
            rel="noopener"
            className="block overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-red-dim hover:bg-surface-2"
          >
            <div className="flex h-[150px] items-center justify-center bg-[#0d0d0d] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt={t.name} className="max-h-full max-w-full rounded object-contain" />
            </div>
            <div className="p-6">
              <div className="mb-2 font-mono text-xs text-muted-2">templates/{t.name}.mjs</div>
              <h2 className="text-lg font-bold leading-snug">{t.name}</h2>
              <p className="mt-2 text-sm text-muted">{t.archetype}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
