import type { Metadata } from "next";
import { readMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What snap-x sends over the network, what it stores, and the third-party services it relies on.",
};

export default function PrivacyPage() {
  const html = readMarkdown("PRIVACY.md");

  return (
    <section className="mx-auto max-w-[820px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Privacy</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Privacy policy</h1>
      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#79c0ff] prose-code:rounded prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border prose-pre:bg-[#0d0d0d] prose-strong:text-ink prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
