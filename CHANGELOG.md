# Changelog

## 0.4.0 — first public release

snap-x is now a **render-only** pipeline: a self-contained `.mjs` design file in, a PNG out. No browser, no config, no auto-detection.

### Packages
(The unscoped `snap-x` name is unavailable on npm — too similar to the existing `snapx` — so the CLI ships inside `@snap-x/core`.)

- `@snap-x/core` — the CLI (`npx @snap-x/core check|render …`, or `snap-x` after a global install) and the engine: Satori renderer, font loader, programmatic API
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
