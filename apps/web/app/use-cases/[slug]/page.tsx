import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findFormat } from "@snap-x/core/formats";
import { USE_CASES, getUseCase } from "@/content/use-cases";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return {
    title: useCase.tag,
    description: `${useCase.title} — made with snap-x. ${useCase.pain}`,
    openGraph: { images: [`/og/use-cases-${useCase.slug}.png`] },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const formats = useCase.formatIds.map((id) => findFormat(id)).filter((f) => f !== undefined);

  return (
    <section className="mx-auto max-w-[900px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">{useCase.tag}</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{useCase.title}</h1>

      {/* The problem */}
      <p className="mt-6 text-lg text-muted">&ldquo;{useCase.pain}&rdquo;</p>

      {/* What you get */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-[#0d0d0d]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={useCase.image} alt={useCase.imageAlt} className="w-full" />
        </div>
        {useCase.guidesImage && (
          <div className="overflow-hidden rounded-2xl border border-border bg-[#0d0d0d]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={useCase.guidesImage} alt={useCase.guidesImageAlt} className="w-full" />
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted-2">
        Real output from{" "}
        <a href={useCase.exampleUrl} target="_blank" rel="noopener" className="underline hover:text-ink">
          {useCase.exampleName}
        </a>
      </p>

      {/* Formats covered */}
      <h2 className="mt-14 text-2xl font-bold">Formats covered</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {formats.map((f) => (
          <Link
            key={f!.id}
            href="/formats"
            className="rounded-xl border border-border bg-surface p-4 transition hover:border-red-dim"
          >
            <div className="font-mono text-xs text-muted-2">
              {f!.width}×{f!.height}
            </div>
            <div className="font-bold">{f!.id}</div>
            <div className="mt-1 flex gap-1.5">
              {f!.verified ? (
                <span className="rounded-full bg-green-dim px-2 py-0.5 font-mono text-[10px] text-green">verified</span>
              ) : (
                <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-2">unverified</span>
              )}
              {f!.alpha === false && <span className="rounded-full bg-red-dim px-2 py-0.5 font-mono text-[10px] text-red">no alpha</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* Platform rules handled */}
      {useCase.guidesImage && (
        <>
          <h2 className="mt-14 text-2xl font-bold">Platform rules, checked</h2>
          <p className="mt-3 text-muted">
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-[#79c0ff]">snap-x guides</code> draws each format&apos;s
            danger zones over your design and renders the mobile crop, so you can see whether text is covered before you post — see the overlay above.
          </p>
        </>
      )}

      {/* Try it */}
      <h2 className="mt-14 text-2xl font-bold">Try it</h2>
      <div className="mt-4 rounded-xl border border-border-2 bg-surface p-5 font-mono text-sm">{useCase.prompt}</div>
      {useCase.templateUrl && (
        <p className="mt-3 text-sm text-muted">
          Prefer to write it by hand?{" "}
          <a href={useCase.templateUrl} target="_blank" rel="noopener" className="underline hover:text-ink">
            Start from this template
          </a>
          .
        </p>
      )}

      {/* Repeatable */}
      <h2 className="mt-14 text-2xl font-bold">Repeatable</h2>
      <p className="mt-3 text-muted">{useCase.repeatable}</p>

      <div className="mt-14 border-t border-border pt-8">
        <Link href="/use-cases" className="text-sm text-muted underline hover:text-ink">
          ← All use cases
        </Link>
      </div>
    </section>
  );
}
