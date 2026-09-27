# Contributing to snap-x

Thanks for looking at snap-x. This covers setup, where things live, and how to add the two things people usually contribute: a platform format and an example or template.

## Setup

```bash
npm ci
npm test
```

`npm test` runs both packages' test suites (`packages/core`, `packages/mcp` — `npm test --workspaces --if-present`). A few tests need Google Fonts reachable over the network; they skip (not fail) when it isn't.

Other useful commands:

```bash
npm run examples:check   # every examples/ and templates/ design still checks clean
npm run examples         # regenerate every committed example/template image
npm run examples:diff    # confirm committed images still match a fresh render (pixel diff)
node scripts/check-packages.mjs   # the same publish-dry-run guard CI runs
```

## Where things live

| Area | File |
|---|---|
| Render pipeline (Satori → resvg → PNG, opaque RGB via `encodeRgbPng`) | `packages/core/src/render.mjs`, `png.mjs` |
| Design loading (`.mjs`/`.jsx`/`.tsx`) | `packages/core/src/load.mjs`, `jsx-runtime.mjs` |
| Checks (structure, real render, glyphs, store alpha) | `packages/core/src/check.mjs`, `glyphs.mjs` |
| Formats data (`FORMATS`: id, aliases, platform, width, height, verified, source, notes, alpha, maxBytes, types, avoid[], safe, mobileCrop) | `packages/core/src/formats.mjs` |
| Guides overlay and mobile crop | `packages/core/src/guides.mjs` |
| Dev watch server | `packages/core/src/watch.mjs` |
| CLI (flags parsed in `VALUE_FLAGS`) | `packages/core/src/cli.mjs`, `packages/cli/bin.mjs` |
| Public API | `packages/core/src/index.mjs` |
| MCP server | `packages/mcp/src/index.mjs` |
| Skill | `skills/snap-x/SKILL.md`, `skills/snap-x/references/*.md` |
| Examples, templates and regeneration | `examples/`, `templates/`, `scripts/examples.mjs`, `scripts/examples-diff.mjs` |
| What fits in snap-x at all | [`PRINCIPLES.md`](PRINCIPLES.md) — read this before proposing a feature; a proposal that conflicts with a principle probably belongs somewhere else |

## Adding or verifying a platform format

`packages/core/src/formats.mjs` is the single source of truth `snap-x formats`, `snap-x guides`, `check`'s alpha warning, and the MCP `list_formats` tool all read from.

1. Find the platform's **official** documentation for the size, any upload limits, and any covered/cropped areas. Third-party "social media size guide" posts are a fine starting point for candidates, never a source of the numbers themselves.
2. Add the entry with `verified: true` and `source: "<the doc URL>"` **only if** you fetched and can quote the official page. Otherwise `verified: false`, no `source`, and a `notes` line saying what you checked and why it's unverified (see the `x-post` and `pinterest-pin` entries for the pattern).
3. Fill `maxBytes`/`types` only when the same official source documents them.
4. Add `avoid`/`safe`/`mobileCrop` zones only when the docs describe them; label an approximate one `"(approx.)"`.
5. Add a case to `packages/core/test/formats.test.mjs` if the format needs its own assertion (most new entries are already covered by the generic "every format has a unique id, a positive integer size and notes" style tests).
6. Run `npm test` and `node -e 'import("./packages/core/src/formats.mjs").then(({FORMATS}) => console.log(FORMATS.length, FORMATS.filter(f=>f.verified).length))'` and update any place a doc states the format count (README, CHANGELOG).

## Adding an example or template

- **Example** (`examples/<name>/`): a complete pack — real or fictional brand, `designs/`, an optional `assets/`, a `snap-plan.md`, a `share-copy.txt`. `scripts/examples.mjs` auto-discovers any `examples/<name>/designs/` directory; no registration needed. Add an `example.json` (`{ "guides": [...] }`) if the pack has a zoned format worth checking — see `examples/storefront/example.json` for the `{ "file", "format" }` form when a design's size is ambiguous between formats.
- **Template** (`templates/<name>.mjs`): brand-neutral, meant to be copied and edited — see `templates/README.md` for the contract every template follows (an "edit these values" block, an archetype comment, zero `check` warnings, a committed preview PNG).
- Fictional brands are fine and encouraged for examples that need a "real-looking" pack (see `examples/storefront`, `examples/creator-series`) — just label it clearly as fictional in `snap-plan.md` and don't use a real third-party logo or product photo.
- Run `npm run examples:check` and `npm run examples` (which also regenerates `templates/`), and **look at every rendered PNG** before committing it — `check` passing isn't the same as looking right (see [`PRINCIPLES.md`](PRINCIPLES.md) and `skills/snap-x/references/design-principles.md`).

## Tests

Add tests next to the existing ones in `packages/core/test/` or `packages/mcp/test/` (plain `node:test` — no test framework dependency). A feature that touches rendering needs a real-render test (see the `needsFonts` skip-when-offline pattern used throughout `packages/core/test/cli.test.mjs`); a pure-data change (a new format, a doc fix) usually doesn't.

## Commit style

Small, reviewable commits; a commit message that says *why*, not just *what*, especially for a format's verification status or a design decision. `CHANGELOG.md` gets an entry under `## Unreleased` for anything user-visible (a feature, a fixed claim, a new format) in the same commit or series.

## Docs follow code

If a change is user-visible, update in the same series: the CLI `--help` text if relevant, `README.md`, the affected package's own README, the skill's `references/*.md` if the skill's workflow is affected, the MCP tool description if the tool's behavior changed, and `CHANGELOG.md`. Don't mention a feature anywhere public before it ships.
