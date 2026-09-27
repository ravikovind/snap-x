import type { Metadata } from "next";
import { Saira, Space_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_DESCRIPTION =
  "Branded graphics for every platform, made by your AI agent. Exact sizes, real logos, safe zones checked. Claude Code plugin, MCP server and CLI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "snap-x — Branded graphics for every platform, made by your AI agent",
    template: "%s — snap-x",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "snap-x — Branded graphics for every platform, made by your AI agent",
    description: SITE_DESCRIPTION,
    type: "website",
    images: ["/og/home.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/home.png"],
  },
};

const NAV_LINKS = [
  { href: "/formats", label: "Formats" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/templates", label: "Templates" },
  { href: "/examples", label: "Examples" },
  { href: "/showcase", label: "Showcase" },
  { href: "/docs", label: "Docs" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${saira.variable} ${spaceMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-bg text-ink">
        <nav className="fixed inset-x-0 top-0 z-50 flex h-15 items-center justify-between border-b border-border bg-bg/85 px-4 backdrop-blur-md sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-red text-xs font-black text-white">
              SX
            </span>
            <span className="text-lg font-black tracking-[0.15em]">SNAP-X</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href="https://github.com/ravikovind/snap-x"
            target="_blank"
            rel="noopener"
            className="font-mono text-sm text-muted transition-colors hover:text-ink"
          >
            GitHub
          </a>
        </nav>

        <main className="flex-1 pt-15">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-red text-[10px] font-black text-white">
                SX
              </span>
              <span className="text-sm font-black tracking-[0.15em]">SNAP-X</span>
            </div>
            <div className="flex flex-wrap gap-6 font-mono text-sm text-muted">
              <a href="https://github.com/ravikovind/snap-x" target="_blank" rel="noopener" className="hover:text-ink">
                GitHub
              </a>
              <a href="https://www.npmjs.com/package/@snap-x/cli" target="_blank" rel="noopener" className="hover:text-ink">
                npm
              </a>
              <Link href="/docs" className="hover:text-ink">
                Docs
              </Link>
              <a
                href="https://github.com/ravikovind/snap-x/blob/main/CHANGELOG.md"
                target="_blank"
                rel="noopener"
                className="hover:text-ink"
              >
                Changelog
              </a>
            </div>
            <div className="font-mono text-xs text-muted-2">MIT License · images on this site are made with snap-x</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
