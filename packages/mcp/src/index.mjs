#!/usr/bin/env node
/**
 * snap-x MCP Server
 *
 * Exposes snap-x's render-only Satori pipeline as MCP tools.
 * Compatible with Cursor, Windsurf, Claude Desktop, and any MCP client.
 *
 * There's no config or auto-detection here: the calling agent writes
 * self-contained .mjs design files (FORMAT, optional FONTS, a zero-arg
 * default export) and hands their paths to these tools to render.
 *
 * Tools:
 *   - render_designs   render one or more .mjs design files to PNG
 *   - check_designs    validate one or more .mjs design files
 *   - list_formats     common social-image dimensions, for reference only
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { renderDesign, checkDesign, resolveFonts, resetFontCache, collectFontsSpec } from "@snap-x/core";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const GUIDE_URI = "snap-x://design-guide";
const readGuide = () => fs.readFile(fileURLToPath(new URL("./design-guide.md", import.meta.url)), "utf8");

// Reference only — not read by render_designs/check_designs, which accept any FORMAT.
const REFERENCE_FORMATS = {
  og:           { width: 1200, height: 630,  description: "Open Graph / Twitter card" },
  cover:        { width: 1500, height: 500,  description: "GitHub / Twitter banner" },
  thumbnail:    { width: 1280, height: 720,  description: "YouTube / blog thumbnail" },
  poster:       { width: 1080, height: 1920, description: "Instagram story / vertical" },
  "readme-card": { width: 1280, height: 640, description: "GitHub README card" },
};

// ─── Server setup ─────────────────────────────────────────────────────────────

const server = new Server(
  { name: "snap-x", version: "0.3.0" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

// ─── List tools ───────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "render_designs",
      description:
        "Render one or more self-contained Satori .mjs design files to PNG (pure Node.js, no browser). Each file must export FORMAT ({width, height, name?}) and a default export (a Satori tree object, or a zero-argument function returning one). Optionally exports FONTS ([{family, weights?}]) — defaults to Inter 400/700/900 if omitted. Read the resource snap-x://design-guide (or use the design_cards prompt) for the design rules before writing files.",
      inputSchema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: { type: "string" },
            description: "Absolute paths to the .mjs design files to render.",
          },
          outDir: {
            type: "string",
            description: "Output directory for the rendered PNGs. Defaults to ./snap-output next to the first file.",
          },
        },
        required: ["files"],
      },
    },
    {
      name: "check_designs",
      description:
        "Validate one or more Satori .mjs design files before rendering: structural rules (display:flex only, no z-index/position:fixed/grid) plus an actual Satori render attempt to catch runtime-only errors.",
      inputSchema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: { type: "string" },
            description: "Absolute paths to the .mjs design files to check.",
          },
        },
        required: ["files"],
      },
    },
    {
      name: "list_formats",
      description:
        "Common social-image dimensions, for reference when deciding what to design. snap-x itself has no fixed format list — any FORMAT {width, height} is valid.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
}));

// ─── Call tool ────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_formats") {
    const lines = Object.entries(REFERENCE_FORMATS).map(
      ([id, f]) => `• ${id.padEnd(12)} ${f.width}×${f.height}  ${f.description}`
    );
    return {
      content: [
        {
          type: "text",
          text: `Common social-image dimensions (reference only — any size works):\n\n${lines.join("\n")}`,
        },
      ],
    };
  }

  if (name === "check_designs") {
    const files = args.files ?? [];
    if (files.length === 0) {
      return { content: [{ type: "text", text: "No files provided." }], isError: true };
    }

    try {
      resetFontCache();
      const fontsSpec = await collectFontsSpec(files);
      const fonts = await resolveFonts(fontsSpec);

      const results = [];
      let allOk = true;
      for (const f of files) {
        const result = await checkDesign(f, { fonts });
        if (result.errors.length === 0) {
          results.push(`✅  ${path.basename(f)}`);
        } else {
          allOk = false;
          results.push(`❌  ${path.basename(f)}`, ...result.errors.map((e) => `     • ${e}`));
        }
        results.push(...result.warnings.map((w) => `     ⚠  ${w}`));
      }

      return { content: [{ type: "text", text: results.join("\n") }], isError: !allOk };
    } catch (err) {
      return { content: [{ type: "text", text: `Error checking designs: ${err.message}` }], isError: true };
    }
  }

  if (name === "render_designs") {
    const files = args.files ?? [];
    if (files.length === 0) {
      return { content: [{ type: "text", text: "No files provided." }], isError: true };
    }
    const outDir = args.outDir ?? path.join(path.dirname(files[0]), "snap-output");

    try {
      await fs.mkdir(outDir, { recursive: true });

      resetFontCache();
      const fontsSpec = await collectFontsSpec(files);
      const fonts = await resolveFonts(fontsSpec);

      const outPaths = [];
      for (const f of files) {
        outPaths.push(await renderDesign(f, outDir, fonts));
      }

      return {
        content: [
          {
            type: "text",
            text: [
              `Rendered ${outPaths.length} file(s) to ${outDir}`,
              ...outPaths.map((p) => `  • ${path.basename(p)}`),
            ].join("\n"),
          },
        ],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error rendering designs: ${err.message}` }], isError: true };
    }
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

// ─── Resources & prompts (the design rules, for agents that don't have the /snap-x skill) ─────────

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [{
    uri: GUIDE_URI, name: "snap-x design guide", mimeType: "text/markdown",
    description: "How to write snap-x design files: workflow, file format, Satori rules, fonts, glyph and text-fit pitfalls, logos, contrast.",
  }],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri !== GUIDE_URI) throw new Error(`Unknown resource: ${request.params.uri}`);
  return { contents: [{ uri: GUIDE_URI, mimeType: "text/markdown", text: await readGuide() }] };
});

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [{
    name: "design_cards",
    description: "Design and render branded images (OG/README cards, banners, posters) for a project, website or brief, following the snap-x design guide.",
    arguments: [
      { name: "source", description: "The repo path, website URL, or a written brief to make images for.", required: true },
      { name: "formats", description: "Which images to make, e.g. \"OG 1200x630 and README card 1280x640\". Default: whatever the project needs.", required: false },
    ],
  }],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "design_cards") throw new Error(`Unknown prompt: ${request.params.name}`);
  const { source = "", formats = "" } = request.params.arguments ?? {};
  const guide = await readGuide();
  return {
    description: "Design and render branded images with snap-x",
    messages: [{
      role: "user",
      content: { type: "text", text: `Make branded images for: ${source || "(ask the user what to make images for)"}\n${formats ? `Formats: ${formats}\n` : ""}\nWrite self-contained snap-x design files, validate them with check_designs, render them with render_designs, then look at every PNG and fix what you see. Follow this guide:\n\n${guide}` },
    }],
  };
});

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
