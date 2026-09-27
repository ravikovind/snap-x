# @snap-x/mcp

Branded graphics for every platform, made by your AI agent.

MCP server for [snap-x](https://github.com/ravikovind/snap-x): lets any agent (Claude Desktop, Cursor, Windsurf, …) render, check and preview platform-ready branded graphics from self-contained Satori `.mjs` design files.

```json
{
  "mcpServers": {
    "snap-x": { "command": "npx", "args": ["@snap-x/mcp"] }
  }
}
```

| Tool | Description |
|---|---|
| `render_designs` | Render one or more `.mjs` design files to PNG. Optional `scale: n` for a sharp `<name>@nx.png` export. A file exporting `VARIANTS` renders once per row and reports every output path. |
| `check_designs` | Validate one or more `.mjs` design files: structural rules plus an actual render attempt. A `VARIANTS` file is checked once per row, failures labeled by row id. |
| `preview_guides` | Draw a platform format's danger zones (profile photo, duration badge, story UI, cropped edges) over a design and write the overlay PNG, plus a mobile-crop PNG when the platform crops on phones. |
| `list_formats` | The full platform-format table — sizes, whether the platform forbids an alpha channel, upload size/type limits where documented, notes and placement zones for link previews, YouTube, X/LinkedIn/Instagram, Google Play and the App Store. Pass `format` for one format's full details. |

The calling agent writes the design files; this server only renders and validates them.

**Design rules for agents without the `/snap-x` skill:** read the resource `snap-x://design-guide`, or use the `design_cards` prompt (arguments: `source` — a repo, URL or brief — and optional `formats`), which packages the workflow and the guide into one message. See the [main README](https://github.com/ravikovind/snap-x#readme) for the design-file format.

## Security

Design files are JavaScript: their top-level code runs with this server's own permissions when a tool renders or checks them — the same as running `node designs/og.mjs` yourself. Only point this server at design files you trust.

Set `SNAP_X_ROOT` to restrict every tool to paths inside one directory (symlinks are resolved, so a symlink inside the root can't point outside it undetected):

```json
{ "mcpServers": { "snap-x": { "command": "npx", "args": ["@snap-x/mcp"], "env": { "SNAP_X_ROOT": "/path/to/project" } } } }
```

Unset by default — existing setups are unaffected. A path outside the root (including an `outDir`) is rejected with a clear error naming it.
