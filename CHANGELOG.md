# Changelog

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
