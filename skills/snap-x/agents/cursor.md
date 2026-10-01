# snap-x for Cursor

Add the MCP server to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

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

Then ask Cursor: **"Make a branded image pack for this project"** — it uses `render_designs`, `check_designs`, `preview_guides` and `list_formats` via the MCP server.

For the full skill workflow (inspect → plan → write → render → verify), copy the `snap-x/` skill folder to `.cursor/rules/snap-x/` and Cursor will pick up the instructions automatically.
