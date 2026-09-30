import type { Metadata } from "next";
import { Lato, Saira } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { SiteNav } from "@/components/SiteNav";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const saira = Saira({
  variable: "--font-saira",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${saira.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-bg text-ink">
        <SiteNav />

        <main className="flex-1 pt-15">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-8">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="snap-x logo" className="h-6 w-6 rounded" />
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
