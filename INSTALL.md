# Installing snap-x

Pick your agent or tool below.

---

## Claude Code

The fastest path — the skill gives Claude the full inspect → plan → write → render → verify workflow.

```
/plugin marketplace add ravikovind/snap-x
/plugin install snap-x@snap-x
/snap-x
```

**Manual install:** copy `skills/snap-x/` to `~/.claude/skills/snap-x/`.

---

## Cursor

Add the MCP server to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (per project):

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

Restart Cursor, then ask: **"Make a branded image pack for this project."**

---

## Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

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

Restart Windsurf and ask Cascade.

---

## Claude Desktop

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart Claude Desktop, then ask to make a branded image pack.

---

## OpenAI Codex

Copy the skill folder to Codex's skills directory:

```bash
cp -r skills/snap-x ~/.codex/skills/snap-x
```

Then ask Codex to use `$snap-x` with a repo, a website URL, or a written brief.

---

## Any other MCP agent

The same JSON block works in any MCP-compatible client:

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

The agent writes the `.mjs` design files; snap-x renders and validates them via `render_designs`, `check_designs`, `preview_guides` and `list_formats`.

---

## CLI only (no agent)

```bash
npm install -g @snap-x/cli

snap-x version
snap-x render designs/*.mjs --out snap-output
snap-x render designs/*.mjs --format svg
snap-x check  designs/*.mjs
snap-x guides designs/*.mjs
snap-x formats
```

Full CLI reference: [README.md#write-designs-by-hand-cli](README.md#write-designs-by-hand-cli)
