import type { Metadata } from "next";
import { readMarkdownWithExampleImages } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Showcase",
  description: "Real (and fictional-demo) packs made with snap-x.",
  openGraph: { images: ["/og/showcase.png"] },
};

export default function ShowcasePage() {
  const html = readMarkdownWithExampleImages("SHOWCASE.md");

  return (
    <section className="mx-auto max-w-[900px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Showcase</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Made with snap-x</h1>
      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#79c0ff] prose-img:rounded-xl prose-img:border prose-img:border-border prose-th:text-left prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
