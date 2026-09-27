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
| `render_designs` | Render one or more `.mjs` design files to PNG. |
| `check_designs` | Validate one or more `.mjs` design files: structural rules plus an actual render attempt. |
| `preview_guides` | Draw a platform format's danger zones (profile photo, duration badge, story UI, cropped edges) over a design and write the overlay PNG, plus a mobile-crop PNG when the platform crops on phones. |
| `list_formats` | The full platform-format table — sizes, whether the platform forbids an alpha channel, upload size/type limits where documented, notes and placement zones for link previews, YouTube, X/LinkedIn/Instagram, Google Play and the App Store. Pass `format` for one format's full details. |

The calling agent writes the design files; this server only renders and validates them.

**Design rules for agents without the `/snap-x` skill:** read the resource `snap-x://design-guide`, or use the `design_cards` prompt (arguments: `source` — a repo, URL or brief — and optional `formats`), which packages the workflow and the guide into one message. See the [main README](https://github.com/ravikovind/snap-x#readme) for the design-file format.
