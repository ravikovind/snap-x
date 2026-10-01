# snap-x for Windsurf

Add the MCP server to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "snap-x": {
      "command": "npx",
      "args": ["@snap-x/mcp"]
    }
  }
}
```

Restart Windsurf, then ask Cascade: **"Make a branded image pack for this project"** — it uses `render_designs`, `check_designs`, `preview_guides` and `list_formats` via the MCP server.
