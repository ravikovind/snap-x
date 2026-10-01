import type { Metadata } from "next";
import { readMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Install",
  description: "Install snap-x in Claude Code, Cursor, Windsurf, Claude Desktop, Codex, or any MCP agent — and as a standalone CLI.",
  openGraph: { images: ["/og/install.png"] },
};

export default function InstallPage() {
  const html = readMarkdown("INSTALL.md");

  return (
    <section className="mx-auto max-w-[820px] px-4 py-20 sm:px-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Install</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Get started</h1>
      <p className="mt-4 text-muted">
        Pick your agent or tool. Every option uses the same{" "}
        <a href="https://github.com/ravikovind/snap-x" target="_blank" rel="noopener" className="underline hover:text-ink">
          @snap-x/mcp
        </a>{" "}
        server or CLI under the hood.
      </p>
      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#79c0ff] prose-code:rounded prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border prose-pre:bg-[#0d0d0d] prose-strong:text-ink prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
