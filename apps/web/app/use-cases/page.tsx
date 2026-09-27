import type { Metadata } from "next";
import Link from "next/link";
import { USE_CASES } from "@/content/use-cases";

export const metadata: Metadata = {
  title: "Use cases",
  description: "YouTube creators, personal brand, app makers, websites and projects, e-commerce — real examples of what snap-x can make, and how repeatable it is for a series or catalogue.",
  openGraph: { images: ["/og/use-cases.png"] },
};

export default function UseCasesHub() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Use cases</p>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
        Whatever you make, <em className="not-italic text-red">there&apos;s a format for it</em>
      </h1>
      <p className="mt-4 max-w-xl text-muted">Real examples, each with the exact formats, platform rules, and repeatability angle for that use case.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((u) => (
          <Link
            key={u.slug}
            href={`/use-cases/${u.slug}`}
            className="block overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-red-dim hover:bg-surface-2"
          >
            <div className="flex h-[160px] items-center justify-center bg-[#0d0d0d] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.image} alt={u.imageAlt} className="max-h-full max-w-full rounded object-contain" />
            </div>
            <div className="p-6">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-red">{u.tag}</div>
              <h2 className="text-lg font-bold leading-snug">{u.title}</h2>
              <p className="mt-2 text-sm text-muted">&ldquo;{u.pain}&rdquo;</p>
            </div>
          </Link>
        ))}

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-2 p-8 text-center">
          <span className="font-bold">Something else?</span>
          <span className="text-sm text-muted">
            If it&apos;s a graphic with a size, snap-x can make it — see{" "}
            <Link href="/formats" className="underline hover:text-ink">
              every format
            </Link>{" "}
            or{" "}
            <Link href="/templates" className="underline hover:text-ink">
              start from a template
            </Link>
            .
          </span>
        </div>
      </div>
    </section>
  );
}
