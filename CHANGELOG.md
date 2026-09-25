# Changelog

## 0.5.0 (core) / 0.1.0 (cli) / 0.2.1 (mcp)

- **New `@snap-x/cli`** owns the `snap-x` command: `npx @snap-x/cli check|render …`, or `npm install -g @snap-x/cli` for the short `snap-x`
- `@snap-x/core` is now library-only (its `bin` moved to `@snap-x/cli`); the CLI implementation is still exported as `@snap-x/core/cli`
- `@snap-x/mcp` updated to depend on `@snap-x/core ^0.5.0`
- Migration: `npx @snap-x/core …` → `npx @snap-x/cli …`

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
