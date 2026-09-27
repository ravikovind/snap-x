import Link from "next/link";

const FEATURES = [
  {
    icon: "🚀",
    title: "No browser. No config.",
    body: "Pure Node.js pipeline powered by Satori + resvg-js. Renders in seconds, anywhere Node runs.",
  },
  {
    icon: "🎨",
    title: "Design files as code",
    body: "Self-contained .mjs, .jsx or .tsx files (no React). Export VARIANTS to render a whole series — an episode, a product line — from one template.",
  },
  {
    icon: "🔤",
    title: "Any Google Font, one line",
    body: "Load any weight of any Google Font. Emoji rendered as Twemoji. Automatic fallbacks for CJK, Arabic, Hebrew, Devanagari, and more.",
  },
  {
    icon: "📐",
    title: "Every platform format",
    body: "OG cards, YouTube thumbnails, X banners, LinkedIn covers, Instagram posts, App Store screenshots, Play Store graphics — built in.",
  },
  {
    icon: "🤖",
    title: "AI-native workflow",
    body: "The /snap-x Claude Code skill reads your project, finds your real logo and fonts, and writes + renders the full pack automatically.",
  },
  {
    icon: "🔌",
    title: "MCP server included",
    body: "Render, check and preview designs from Cursor, Windsurf, or Claude Desktop via the @snap-x/mcp server.",
  },
];

const PAIN_CARDS = [
  { icon: "📱", quote: "Your text hides under the profile photo on mobile.", fix: "snap-x guides overlays the profile-photo zone and renders the mobile-cropped version before you post." },
  { icon: "🎬", quote: "The duration badge sits on your thumbnail's punchline.", fix: "The YouTube thumbnail format ships with the duration-badge zone built in — guides catches the overlap before you upload." },
  { icon: "🚫", quote: "The store rejected your graphic for an alpha channel.", fix: "Set alpha: false and App Store / Play graphics render as opaque RGB — check reminds you when a store format needs it." },
  { icon: "🔁", quote: "Every new video, sale or release means redesigning from scratch.", fix: "The design is one template — change the episode number, product or price and re-render the whole series." },
];

const HOW = [
  { n: "01", title: "Point", body: "Give your agent a repo, a website URL or a written brief.", pill: "/snap-x" },
  { n: "02", title: "Plan", body: "It pulls your real logo, colors, fonts and copy, picks the formats you need, and writes a plan.", pill: "snap-plan.md" },
  { n: "03", title: "Render and verify", body: "It writes one design file per format, checks them, renders exact-size PNGs, overlays each platform's danger zones, and looks at every image before handing them over.", pill: "snap-x check && render" },
];

const USE_CASES = [
  { slug: "youtube", tag: "YouTube creators", title: "Thumbnails, channel art, Shorts", image: "/gallery/youtube-thumbnail.png" },
  { slug: "personal-brand", tag: "Personal brand", title: "LinkedIn cover, X header", image: "/gallery/linkedin-cover.png" },
  { slug: "app-stores", tag: "App makers", title: "App Store screenshots, Play feature graphic", image: "/gallery/appstore-vote.png" },
  { slug: "websites-and-projects", tag: "Websites and projects", title: "OG/link previews, README cards, GitHub social preview", image: "/gallery/snapx-og.png" },
  { slug: "ecommerce", tag: "E-commerce / marketing", title: "Sale and promo banners, Instagram posts and stories", image: "/gallery/storefront-banner.png" },
];

const FAQS = [
  {
    q: "Why not just use an AI image generator?",
    a: (
      <>
        <p>
          Use one. Tools like Nano Banana and ChatGPT are great at pixels: photos, illustration, texture, mood. snap-x does the work around the art:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li><strong className="text-ink">Exact sizes.</strong> Image models generate in preset aspect ratios, so exact platform sizes (a 1584×396 LinkedIn cover, a 1024×500 Play feature graphic) usually mean cropping. snap-x renders the exact size.</li>
          <li><strong className="text-ink">Your real logo.</strong> It&apos;s embedded from the file, not redrawn.</li>
          <li><strong className="text-ink">Precise edits.</strong> Change &quot;Episode 12&quot; to &quot;Episode 13&quot; and nothing else moves.</li>
          <li><strong className="text-ink">Series and batches.</strong> One template gives identical layouts across a thumbnail series, a catalogue of banners or localized screenshots.</li>
          <li><strong className="text-ink">Platform rules.</strong> Safe zones, mobile crops and store no-alpha rules are built in and checked.</li>
          <li><strong className="text-ink">Yours, locally.</strong> The design is a code file you can diff and version; renders run on your machine.</li>
        </ul>
        <p className="mt-3">They combine well: generate a background or product shot, then let snap-x place it with your logo and copy at every size.</p>
      </>
    ),
  },
  {
    q: "Do I need Claude Code?",
    a: <p>No. The MCP server works with any MCP agent (Claude Desktop, Cursor, Windsurf), and you can write designs by hand with the CLI.</p>,
  },
  {
    q: "Can it make photos or illustrations?",
    a: <p>No. snap-x lays out text, shapes, logos and images you supply; it doesn&apos;t generate art. Bring your own images, or generate them elsewhere and let snap-x place them with your logo, copy and platform rules.</p>,
  },
];

function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ""}`}
      style={{ background: "radial-gradient(circle, rgba(235,29,37,0.18) 0%, transparent 65%)" }}
    />
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-24 text-center sm:px-8 sm:py-32">
        <Glow className="-right-40 -top-40 h-[500px] w-[500px]" />
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-red-dim bg-red-dim px-4 py-1.5 font-mono text-xs text-red">
          <span className="h-1.5 w-1.5 rounded-full bg-red" />
          v0.7.0 — VARIANTS, JSX/TSX, parallel rendering
        </div>
        <h1 className="mx-auto mt-8 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
          Branded graphics for <em className="not-italic text-red">every platform</em>, made by your AI agent.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Thumbnails, covers, banners, store graphics and more: sized right, checked, and repeatable.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#install" className="rounded-lg bg-red px-7 py-3.5 font-bold tracking-wide text-white transition hover:-translate-y-px hover:bg-[#ff2d35]">
            Install for Claude Code
          </a>
          <Link href="/docs" className="rounded-lg border border-border-2 px-7 py-3.5 font-bold tracking-wide transition hover:border-white/30 hover:bg-white/5">
            Use with any MCP agent
          </Link>
        </div>
      </section>

      {/* GALLERY (real output, from the example packs) */}
      <div className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { src: "/gallery/youtube-thumbnail.png", alt: "YouTube thumbnail example" },
            { src: "/gallery/linkedin-cover.png", alt: "LinkedIn cover example" },
            { src: "/gallery/appstore-vote.png", alt: "App Store screenshot example" },
            { src: "/gallery/play-feature-graphic.png", alt: "Google Play feature graphic example" },
            { src: "/gallery/snapx-og.png", alt: "OG card example" },
            { src: "/gallery/storefront-banner.png", alt: "E-commerce banner example" },
          ].map((img) => (
            <div key={img.src} className="overflow-hidden rounded-xl border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-2">
          All made by snap-x, from a design file — not screenshots or mockups. See <Link href="/examples" className="underline hover:text-ink">every example</Link>.
        </p>
      </div>

      {/* FEATURES */}
      <div className="mx-auto my-24 h-px max-w-[1160px] bg-border" />
      <section className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Features</p>
        <h2 className="max-w-xl text-4xl font-black tracking-tight">
          Everything you need to ship <em className="not-italic text-red">on-brand graphics</em>
        </h2>
        <p className="mt-4 max-w-lg text-muted">No config, no auto-detection — every design file declares exactly what it needs.</p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-bg p-8 transition hover:bg-surface">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-red-dim bg-red-dim text-xl">{f.icon}</div>
              <h3 className="mb-2 text-[17px] font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <div className="mx-auto my-24 h-px max-w-[1160px] bg-border" />
      <section className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">The problem</p>
        <h2 className="max-w-xl text-4xl font-black tracking-tight">
          Graphics that are close, <em className="not-italic text-red">but not quite right</em>
        </h2>
        <p className="mt-4 max-w-lg text-muted">Platform-shaped mistakes are easy to make and easy to miss until it&apos;s live.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PAIN_CARDS.map((c) => (
            <div key={c.quote} className="rounded-2xl border border-border bg-surface p-7">
              <div className="mb-3.5 flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-dim bg-red-dim text-sm">{c.icon}</div>
                <div className="font-bold leading-snug text-ink">&ldquo;{c.quote}&rdquo;</div>
              </div>
              <div className="pl-10 text-sm leading-relaxed text-muted">
                <strong className="text-green">Fixed:</strong> {c.fix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="mx-auto my-24 h-px max-w-[1160px] bg-border" />
      <section className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Workflow</p>
        <h2 className="max-w-xl text-4xl font-black tracking-tight">
          Point, plan, <em className="not-italic text-red">render and verify</em>
        </h2>
        <p className="mt-4 max-w-lg text-muted">The agent does all three. Or write and run the same steps yourself with the CLI.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-surface p-8">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-red">Step {s.n}</div>
              <h3 className="mb-2.5 text-xl font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              <span className="mt-3 inline-block rounded-md border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-[#79c0ff]">{s.pill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <div className="mx-auto my-24 h-px max-w-[1160px] bg-border" />
      <section className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Use cases</p>
        <h2 className="max-w-xl text-4xl font-black tracking-tight">
          Whatever you make, <em className="not-italic text-red">there&apos;s a format for it</em>
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <Link
              key={u.slug}
              href={`/use-cases/${u.slug}`}
              className="block overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-red-dim hover:bg-surface-2"
            >
              <div className="flex h-[150px] items-center justify-center bg-[#0d0d0d] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.image} alt={u.title} className="max-h-full max-w-full rounded object-contain" />
              </div>
              <div className="p-5">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-red">{u.tag}</div>
                <h3 className="text-[15px] font-bold leading-snug">{u.title}</h3>
              </div>
            </Link>
          ))}
          <Link
            href="/formats"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-2 p-8 text-center transition hover:border-red-dim hover:bg-surface"
          >
            <span className="font-bold">Something else?</span>
            <span className="text-sm text-muted">If it&apos;s a graphic with a size, snap-x can make it — see every format.</span>
          </Link>
        </div>
      </section>

      {/* EXACT AND REPEATABLE */}
      <div className="mx-auto my-24 h-px max-w-[1160px] bg-border" />
      <section className="mx-auto max-w-[1160px] px-4 text-center sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">Exact &amp; repeatable</p>
        <h2 className="mx-auto max-w-lg text-4xl font-black tracking-tight">
          One template. <em className="not-italic text-red">Infinite, exact renders.</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">The design is a code file — not a canvas someone can accidentally nudge.</p>
        <ul className="mx-auto mt-8 max-w-xl list-disc space-y-2 pl-5 text-left text-sm leading-relaxed text-muted">
          <li><strong className="text-ink">Your real logo</strong> is embedded, not redrawn.</li>
          <li><strong className="text-ink">Text is exactly</strong> what you wrote — no drift, no reinterpretation.</li>
          <li><strong className="text-ink">The size is exact</strong> — no cropping to fit a platform.</li>
          <li>Change one word — &quot;Episode 12&quot; → &quot;Episode 13&quot; — and only that word moves.</li>
          <li><strong className="text-ink">Re-render a whole series</strong> or catalogue from one template.</li>
          <li>Renders locally, no browser.</li>
        </ul>
      </section>

      {/* FAQ */}
      <div className="mx-auto my-24 h-px max-w-[1160px] bg-border" />
      <section className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-red">FAQ</p>
        <h2 className="max-w-xl text-4xl font-black tracking-tight">
          Questions people <em className="not-italic text-red">actually ask</em>
        </h2>
        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group bg-bg">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-7 py-5 font-bold marker:content-none">
                {f.q}
                <span className="font-mono text-xl text-red transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="max-w-2xl px-7 pb-6 text-sm leading-relaxed text-muted">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* INSTALL BANNER */}
      <section id="install" className="mx-auto my-20 max-w-[1160px] rounded-2xl border border-red-dim bg-gradient-to-br from-red-dim to-transparent px-4 py-14 text-center sm:px-8">
        <h2 className="text-3xl font-black tracking-tight">
          Start rendering in <em className="not-italic text-red">30 seconds</em>
        </h2>
        <p className="mt-2 text-muted">No account. No API key. Just npm.</p>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
          <div className="rounded-lg border border-border-2 bg-bg px-6 py-4 text-left font-mono text-sm">
            <span className="text-red">$</span> npx @snap-x/cli render designs/*.mjs
          </div>
          <div className="rounded-lg border border-border-2 bg-bg px-6 py-4 text-left font-mono text-sm">
            <span className="text-red">$</span> npm install -g @snap-x/cli
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <a href="https://github.com/ravikovind/snap-x" target="_blank" rel="noopener" className="rounded-lg bg-red px-6 py-3 font-bold text-white">
            Read the docs
          </a>
          <Link href="/examples" className="rounded-lg border border-border-2 px-6 py-3 font-bold">
            View examples
          </Link>
        </div>
      </section>
    </>
  );
}
