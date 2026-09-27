import type { Metadata } from "next";
import { readMarkdownSection } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Docs",
  description: "The design-file format, Satori rules, VARIANTS, fonts, logos and images, and the MCP server — read straight from the repo's own README.md, never duplicated.",
  openGraph: { images: ["/og/docs.png"] },
};

export default function DocsPage() {
  // Single source: README.md itself. If its heading text ever changes, this throws at build time
  // rather than silently going stale — see lib/markdown.ts.
  const html = readMarkdownSection("README.md", "## Write designs by hand (CLI)", "## Examples");

  return (
    <section className="mx-auto max-w-[820px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Docs</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Write designs by hand</h1>
      <p className="mt-4 text-muted">
        Read straight from the repo&apos;s own{" "}
        <a href="https://github.com/ravikovind/snap-x#readme" target="_blank" rel="noopener" className="underline hover:text-ink">
          README.md
        </a>{" "}
        — single source, never duplicated here.
      </p>
      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#79c0ff] prose-code:rounded prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border prose-pre:bg-[#0d0d0d] prose-strong:text-ink prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
