"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/formats", label: "Formats" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/templates", label: "Templates" },
  { href: "/examples", label: "Examples" },
  { href: "/showcase", label: "Showcase" },
  { href: "/docs", label: "Docs" },
  { href: "/install", label: "Install" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="flex h-15 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="snap-x logo" className="h-7 w-7 rounded" />
          <span className="text-lg font-black tracking-[0.15em]">SNAP-X</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-mono text-sm text-muted transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>
        <a
          href="https://github.com/ravikovind/snap-x"
          target="_blank"
          rel="noopener"
          className="hidden font-mono text-sm text-muted transition-colors hover:text-ink md:block"
        >
          GitHub
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-bg px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-mono text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com/ravikovind/snap-x"
              target="_blank"
              rel="noopener"
              className="rounded-lg px-3 py-3 font-mono text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
