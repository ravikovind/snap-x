# Changelog

## Unreleased

- **Visual regression for examples** (improvements.md §7.1): `npm run examples:diff` renders every `examples/<name>/designs` pack to a temp dir and compares each output pixel-by-pixel against its committed PNG (pure-JS: `pixelmatch` + `pngjs`, no native image libraries), with a small threshold for anti-aliasing noise. A real change writes a diff image under `.examples-diff/` (gitignored) — verified this catches a real regression (deliberately corrupted a committed PNG, confirmed the diff flagged it and the diff image clearly highlighted the changed region, then restored it) and that a clean repo passes (31 images, 0 differences). CI runs it after `examples:check` on every push, uploading `.examples-diff/` as an artifact on failure, and now caches `~/.cache/snap-x` (fetched fonts) to cut down on network-related flakiness
- **`.jsx`/`.tsx` design files** (improvements.md §6.1, confirmed the esbuild dependency with Ravi first): accepted alongside `.mjs`, transformed at load time with esbuild's `transform()` API (no bundling, no filesystem resolution) against a new tiny JSX runtime (`packages/core/src/jsx-runtime.mjs`) — no React dependency. Same `FORMAT`/`FONTS`/`VARIANTS`/default-export contract, same `_`-prefix helper rule (relative imports resolve correctly since the transformed code is written to a real colocated temp file, not evaluated from a `data:` URL), same glob/directory expansion. Function components are called eagerly so `check`'s structural validation sees the same fully-resolved tree it would for `.mjs` — a real gap a test caught before this shipped (a `display: "grid"` nested inside a component was invisible to `check` until function calls were resolved before returning the tree). The `/snap-x` skill keeps writing `.mjs`; README's design-file example now shows the JSX version first, since it reads more easily. New `examples/jsx-demo/` (a feature demo, not a brand pack) with a `.jsx` and a `.tsx` file
- **`snap-x watch`** (improvements.md §6.2): a dev tool — renders once, opens a local preview page (prints the URL) listing every output, then re-renders (debounced) and auto-reloads the page whenever a watched design file changes. `--guides` also runs the placement check on every change and shows those overlays. No new dependencies: `fs.watch` + Node's `http`
- **`VARIANTS`** (improvements.md §4, confirmed with Ravi before coding): an optional export (array, or an async function returning one) that turns one design file into a series — the default export is called once per row, output named `<name-stem>-<id>.<ext>` (or a row's own `format: { name }` override). `render`, `check` and `guides` all handle it: render writes one file per row (`render --only <id,id>` for a subset), check labels failures by row id without aborting the others, guides runs every row. MCP's `render_designs`/`check_designs` handle it transparently. Without `VARIANTS`, a design behaves exactly as before — fully opt-in, no existing design or test changed behavior
- **`--scale <n>`** (improvements.md §3.3): render/check at n× resolution for a sharp `<name>@nx.png` export — Satori's layout is unchanged, only resvg's raster target grows, so text stays vector-sharp (verified: cropped and visually inspected a 2× render before implementing). `check --scale <n>` also verifies resvg can encode the design at that size. Available from the CLI, the `renderDesign`/`checkDesign` API, and MCP's `render_designs` (`scale` parameter). `snap-x guides`'s existing integer-scale matching already recognizes a scaled output's size — no changes needed there
- **3 new formats** (improvements.md §2.2, first 4 candidates confirmed with Ravi — the rest need his go-ahead before adding): `facebook-cover` (851×315, verified against Facebook's Help Center), `pinterest-pin` (1000×1500, unverified — Pinterest's own spec page gives safe-zone insets and file rules but not an exact size), `twitch-banner` (1200×480, unverified — Twitch's help center is JS-rendered and couldn't be fetched directly to confirm firsthand). `facebook-post` was skipped: no official Meta source documents a size distinct from the existing `og` link-share spec. 22 formats total, 15 verified
- **Formats: structured limits + 3 more verified.** Optional `maxBytes`/`types` fields (shown in `snap-x formats <id>`, `--json`, and MCP `list_formats`), filled in only from a format's own official `source`. Verified 3 more against official docs: `github-social-preview` (GitHub Docs), `linkedin-post` (LinkedIn Help), `instagram-post` (Meta's Graph API reference) — now 14 of 19 formats verified, up from 11. Checked `x-post` against X's docs too: its old Twitter Cards developer page has been removed with no stable replacement, so it stays unverified rather than guessing from third-party guides
- **Design principles:** new `PRINCIPLES.md` (what fits in snap-x) and `skills/snap-x/references/design-principles.md` (focal point, hierarchy, spacing, alignment, whitespace, colour proportion, squint test, pack consistency, and 6 named archetypes). The skill's Step 2 now requires naming an archetype per format plus the pack's spacing unit and type scale; Step 4 scores every render against the same rubric
- **Copy update:** descriptions (root, plugin, marketplace, website) no longer list specific platforms as if it were the full scope — platform names moved to keywords and to the README/site gallery, presented as examples. Subline shortened to "Thumbnails, covers, banners, store graphics and more: sized right, checked, and repeatable." everywhere it appeared
- **Repositioned:** "Branded graphics for every platform, made by your AI agent." — the same headline and subline now appear in README, website, and every package/plugin/manifest description
- README rewritten around the new positioning: a real-output gallery, Claude Code install in the first screenful, "How it works," "Correct for every platform," "Exact and repeatable," a use-cases table and an FAQ — all previously-existing technical content (design-file format, Satori rules, fonts, CLI, logos/images) kept intact under "Write designs by hand"
- Website rewritten to match: new hero, four new sections (Problem, Use cases, Exact and repeatable, FAQ), and two false claims fixed ("Pure JSX"/the code sample, and "no imports")
- `packages/mcp/README.md` tool table fixed: added the missing `preview_guides` row and corrected `list_formats`'s description
- Skill triggers broadened to cover creators, personal brand, e-commerce and app-store use cases, not just software projects
- New example packs: `examples/storefront` (fictional e-commerce brand) and `examples/creator-series` (fictional YouTube channel), each showing one template rendering several variants
- `scripts/examples.mjs`: an `example.json`'s `guides` entries can now force a format id (`{ "file", "format" }`) when a design's exact size matches more than one platform format

## 0.6.0 — core 0.6.0 · cli 0.2.0 · mcp 0.4.0

- **Emoji support:** emoji (incl. flags and ZWJ sequences) are drawn as Twemoji images, fetched once and cached on disk (works offline afterwards). `check` no longer flags them
- **Platform formats:** `snap-x formats` lists 19 formats — link previews, YouTube thumbnails / Shorts / channel art, X, LinkedIn, Instagram, Google Play, App Store — with sizes, notes, no-alpha rules and placement zones; 11 are checked against official documentation (source URLs shown), the rest are marked unverified
- **`snap-x guides`:** overlays a format's danger zones (profile photo, duration badge, story UI, cropped edges) and the safe area on your design and renders the mobile crop (`<name>.guides.png`, `<name>.mobile.png`)
- **`FORMAT.alpha: false`** writes an opaque RGB PNG (colour type 2). App Store and Google Play graphics must have no alpha channel; `check` warns when a store size is missing it
- CLI: real `--help` and `--version`, flag parsing for `--format`; MCP: `list_formats` serves the real table (with `format` for details), new `preview_guides` tool, richer design guide
- Skill: new `references/formats.md` (layout by platform incl. store screenshots), a website/brief-input pass from two more cold tests (Next.js CSS variables, brand-page assets, logo-vs-CSS colors, `whiteSpace: "pre"`, viewing SVGs, brief-only fallbacks), and QA via `snap-x guides` instead of hand-written designs

## 0.5.1 · cli 0.1.1 · mcp 0.3.0

- **`snap-x check` now warns about characters no loaded font can draw** (they render as blank boxes: emoji, `✔`, `→` in some fonts). Chars covered by the automatic script fallback are not flagged
- **Fix: `_`-prefixed helper files are always skipped**, including when a shell expands `designs/*.mjs` into explicit paths (0.5.0 did not skip them at all)
- **MCP:** new `snap-x://design-guide` resource and `design_cards` prompt so agents without the skill get the design rules; `check_designs` surfaces the glyph warnings
- Skill: fixes from a cold test (repo types beyond Node, brand-less libraries, conflicting facts, undersized logos, real icon sets, monospace for code copy, a `_helper.mjs` example) and `npx -y` so agents never stall on the install prompt
- CI (GitHub Actions: tests on Node 20/22/24, example designs, and a publish dry-run guard against manifest warnings); MCP server tests

- **Skill restructured:** `SKILL.md` cut from 282 to 54 lines (a lean workflow with gates and non-negotiables); design detail lives in `references/step-3-design.md`
- Skill now handles a **repo, a website URL or a written brief**, with a website recipe for copy, colors and fonts, a **facts-only rule**, and **real logo/brand-asset discovery**
- New guidance from real runs: draw symbols instead of typing glyphs a font lacks, fit headlines (`nowrap`, ≈0.5 em/char), banner safe zones + QA overlay/mobile crop, and **look at every rendered PNG** before delivering
- `snap-x render`/`check` skip `_`-prefixed helper files when expanding a directory or glob
- README cut to the essentials (363 → 87 lines)

## 0.5.0 (core) / 0.1.0 (cli) / 0.2.1 (mcp)

- **New `@snap-x/cli`** owns the `snap-x` command: `npx -y @snap-x/cli check|render …`, or `npm install -g @snap-x/cli` for the short `snap-x`
- `@snap-x/core` is now library-only (its `bin` moved to `@snap-x/cli`); the CLI implementation is still exported as `@snap-x/core/cli`
- `@snap-x/mcp` updated to depend on `@snap-x/core ^0.5.0`
- Migration: `npx @snap-x/core …` → `npx -y @snap-x/cli …`

## 0.4.0 — first public release

snap-x is now a **render-only** pipeline: a self-contained `.mjs` design file in, a PNG out. No browser, no config, no auto-detection.

### Packages
(The unscoped `snap-x` name is unavailable on npm — too similar to the existing `snapx`.)

- `@snap-x/core` — the CLI and engine: Satori renderer, font loader, programmatic API (0.4.0 shipped the `snap-x` bin; it moved to `@snap-x/cli` in 0.5.0)
- `@snap-x/mcp` 0.2.0 — MCP server: `render_designs`, `check_designs`, `list_formats`

### Breaking changes (from the pre-release tooling)
- Removed `snap-x init`, `snap-x.config.json`, project auto-detection, theme presets, default designs, and the `--format/--title/--desc/--domain/--tags/--theme/--font/--project` flags
- Design files now export `FORMAT`, an optional `FONTS`, and a **zero-argument** default export (no `config` parameter)
- CLI is `snap-x check|render <paths…> [--out <dir>]`; paths may be files, directories, or `*` globs
- MCP tools changed from `generate_images` / `init_config` / `list_formats` to `render_designs` / `check_designs` / `list_formats`
- Removed the legacy Playwright / HTML-template render path

### Added
- Per-file `FONTS` export (any Google Font, any weights); fonts merged and deduped across a batch
- Persistent on-disk font cache — repeat renders ~7× faster and work offline (`$SNAP_X_CACHE_DIR`, `$XDG_CACHE_HOME/snap-x/fonts`, or `~/.cache/snap-x/fonts`)
- Automatic script fallback fonts: CJK, Korean, Arabic, Hebrew, Thai, Devanagari, Bengali (plus Cyrillic/Greek/Latin-extended for fonts that lack them) via small Noto Sans subsets
- `check` now performs a real Satori render (when fonts load) to catch runtime-only errors
- Claude Code plugin + `/snap-x` skill; installable via `/plugin marketplace add ravikovind/snap-x`

### Fixed
- An unavailable font falls back to Inter with a warning instead of aborting the render
- A non-2xx font file response was previously treated as font data
- A design's top-level code no longer runs twice per command

### Known limitations
- Emoji and symbol glyphs (e.g. `✔`) are not supported and render as blank boxes
- Fonts come from Google Fonts only
- `npm audit` reports a moderate `fflate` advisory inside `satori` (not reachable from snap-x's inputs)
