# @snap-x/mcp

MCP server for [snap-x](https://github.com/ravikovind/snap-x): lets agents (Claude Desktop, Cursor, Windsurf, …) validate and render self-contained Satori `.mjs` design files to PNG.

```json
{
  "mcpServers": {
    "snap-x": { "command": "npx", "args": ["@snap-x/mcp"] }
  }
}
```

| Tool | Description |
|---|---|
| `render_designs` | Render one or more `.mjs` design files to PNG |
| `check_designs` | Validate one or more `.mjs` design files |
| `list_formats` | Common social-image dimensions (reference only) |

The calling agent writes the design files; this server only renders and validates them.

**Design rules for agents without the `/snap-x` skill:** read the resource `snap-x://design-guide`, or use the `design_cards` prompt (arguments: `source` — a repo, URL or brief — and optional `formats`), which packages the workflow and the guide into one message. See the [main README](https://github.com/ravikovind/snap-x#readme) for the design-file format.
