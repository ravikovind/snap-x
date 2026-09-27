#!/usr/bin/env node
/**
 * snap-x MCP Server
 *
 * Branded graphics for every platform, made by your AI agent — exposed as
 * MCP tools. Compatible with Cursor, Windsurf, Claude Desktop, and any MCP
 * client.
 *
 * There's no config or auto-detection here: the calling agent writes
 * self-contained .mjs design files (FORMAT, optional FONTS, a zero-arg
 * default export) and hands their paths to these tools to render.
 *
 * Tools:
 *   - render_designs   render one or more .mjs design files into platform-ready PNGs
 *   - check_designs    validate one or more .mjs design files
 *   - preview_guides   draw a platform's danger zones over designs (profile-photo overlap, crops, safe area)
 *   - list_formats     platform formats: sizes, no-alpha rules, placement zones (YouTube, X, LinkedIn, Play, App Store …)
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
import { renderDesign, checkDesign, resolveFonts, resetFontCache, collectFontsSpec, renderGuides, FORMATS, findFormat } from "@snap-x/core";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const GUIDE_URI = "snap-x://design-guide";
const readGuide = () => fs.readFile(fileURLToPath(new URL("./design-guide.md", import.meta.url)), "utf8");

// ─── Server setup ─────────────────────────────────────────────────────────────

const server = new Server(
  { name: "snap-x", version: "0.4.1" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

// ─── List tools ───────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "render_designs",
      description:
        "Render one or more self-contained Satori .mjs design files into platform-ready branded graphics (pure Node.js, no browser) — thumbnails, covers, banners, store screenshots, OG cards, at exact platform sizes. Each file must export FORMAT ({width, height, name?}) and a default export (a Satori tree object, or a function returning one, called with no arguments unless the file exports VARIANTS). Optionally exports FONTS ([{family, weights?}]) — defaults to Inter 400/700/900 if omitted. A file that exports VARIANTS (an array of rows, each needing a unique string id) is called once per row and produces one output per row, named <name-stem>-<id>.<ext> — this tool reports every output path. Read the resource snap-x://design-guide (or use the design_cards prompt) for the design rules before writing files.",
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
          scale: {
            type: "integer",
            description: "Render at n× resolution for a sharp @2x/@3x export (Satori's layout is unchanged; only the raster output grows). Output files are named \"<name>@<n>x.png\". Defaults to 1.",
          },
        },
        required: ["files"],
      },
    },
    {
      name: "check_designs",
      description:
        "Validate one or more Satori .mjs design files before rendering a branded graphic: structural rules (display:flex only, no z-index/position:fixed/grid) plus an actual Satori render attempt to catch runtime-only errors and characters the font can't draw. A file with a VARIANTS export is checked once per row, with failures labeled by the row's id.",
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
      name: "preview_guides",
      description:
        "Verify a branded graphic is correct for its platform: draw the platform format's danger zones over each design and write <name>.guides.png (red = avoid, dashed cyan = safe area) plus <name>.mobile.png when the platform crops on phones. Use it for banners and covers (LinkedIn, X, YouTube channel art), story-size posters and thumbnails to check that text isn't under a profile photo, duration badge or cropped edge. The format is matched from each design's FORMAT size, or pass `format`.",
      inputSchema: {
        type: "object",
        properties: {
          files: { type: "array", items: { type: "string" }, description: "Absolute paths to the .mjs design files." },
          format: { type: "string", description: "Format id (see list_formats), e.g. linkedin-cover. Optional — inferred from the design's size." },
          outDir: { type: "string", description: "Where to write the overlay PNGs. Defaults to ./snap-guides next to the first file." },
        },
        required: ["files"],
      },
    },
    {
      name: "list_formats",
      description:
        "The platform formats snap-x makes branded graphics for: id, exact size, whether the platform forbids an alpha channel (App Store / Google Play — set FORMAT.alpha = false), upload size/type limits where the platform documents one, notes, and placement zones. Covers link previews, YouTube thumbnails and channel art, X/LinkedIn/Instagram covers and posts, Google Play graphics and screenshots, and App Store screenshots. Pass `format` for one format's full details, including its placement zones and limits. Any FORMAT {width, height} is still valid for a size this list doesn't cover.",
      inputSchema: {
        type: "object",
        properties: { format: { type: "string", description: "A format id, alias or WxH (e.g. app-store-iphone-6.9, thumbnail, 1584x396)." } },
        required: [],
      },
    },
  ],
}));

// ─── Call tool ────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_formats") {
    const zoneText = (z) => (z.type === "circle" ? `circle (${z.cx},${z.cy}) r=${z.r}` : `rect x=${z.x} y=${z.y} ${z.w}×${z.h}`) + (z.label ? `  ${z.label}` : "");
    if (args?.format) {
      const f = findFormat(args.format);
      if (!f) return { content: [{ type: "text", text: `Unknown format "${args.format}". Call list_formats with no arguments to see them.` }], isError: true };
      const lines = [
        `${f.id}  ${f.width}×${f.height}${f.alpha === false ? "  (no alpha channel — set FORMAT.alpha = false)" : ""}`,
        f.platform + (f.verified ? "" : "   [not verified against official docs — re-check before launch]"),
        f.notes,
        ...(f.source ? [`source: ${f.source}`] : []),
        ...(f.maxBytes ? [`max size: ${(f.maxBytes / (1024 * 1024)).toFixed(f.maxBytes % (1024 * 1024) === 0 ? 0 : 1)} MB`] : []),
        ...(f.types ? [`types: ${f.types.join(", ")}`] : []),
        ...(f.avoid ?? []).map((z) => `avoid  ${zoneText(z)}`),
        ...(f.safe ? [`safe   ${zoneText(f.safe)}`] : []),
        ...(f.mobileCrop ? [`mobile crop: x ${f.mobileCrop.x} → ${f.mobileCrop.x + f.mobileCrop.w}`] : []),
      ];
      return { content: [{ type: "text", text: lines.join("\n") }] };
    }
    const w = Math.max(...FORMATS.map((f) => f.id.length));
    const lines = FORMATS.map((f) => {
      const tags = [f.alpha === false ? "no-alpha" : "", f.avoid || f.safe ? "zones" : "", f.maxBytes || f.types ? "limits" : "", f.verified ? "" : "unverified"].filter(Boolean).join(" ");
      return `• ${f.id.padEnd(w)}  ${`${f.width}×${f.height}`.padEnd(10)} ${f.platform}${tags ? `  [${tags}]` : ""}`;
    });
    return { content: [{ type: "text", text: `snap-x platform formats (any FORMAT size also works):\n\n${lines.join("\n")}\n\nCall list_formats with \`format\` for notes and placement zones.` }] };
  }

  if (name === "preview_guides") {
    const files = args.files ?? [];
    if (files.length === 0) return { content: [{ type: "text", text: "No files provided." }], isError: true };
    const outDir = args.outDir ?? path.join(path.dirname(files[0]), "snap-guides");
    try {
      await fs.mkdir(outDir, { recursive: true });
      resetFontCache();
      const fonts = await resolveFonts(await collectFontsSpec(files));
      const written = [];
      for (const f of files) written.push(...(await renderGuides(f, outDir, fonts, { formatId: args.format })));
      const text = written.length
        ? [`Wrote ${written.length} guide image(s) to ${outDir} (red = avoid, dashed cyan = safe area):`, ...written.map((p) => `  • ${path.basename(p)}`), "View them and move anything out of the red zones."].join("\n")
        : "No guide images written: none of the designs match a format with placement zones. Pass `format` (see list_formats) or use a platform size.";
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error creating guides: ${err.message}` }], isError: true };
    }
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
    const scale = args.scale ?? 1;
    if (!Number.isInteger(scale) || scale < 1) {
      return { content: [{ type: "text", text: `scale must be a positive integer, got ${JSON.stringify(args.scale)}.` }], isError: true };
    }

    try {
      await fs.mkdir(outDir, { recursive: true });

      resetFontCache();
      const fontsSpec = await collectFontsSpec(files);
      const fonts = await resolveFonts(fontsSpec);

      // A design's own VARIANTS makes renderDesign return an array of paths instead of one; flatten so
      // a caller sees every real output file regardless of how many any single design expanded into.
      const outPaths = [];
      for (const f of files) {
        const result = await renderDesign(f, outDir, fonts, { scale });
        outPaths.push(...(Array.isArray(result) ? result : [result]));
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
    description: "Design and render branded graphics for every platform — YouTube thumbnails, LinkedIn/X covers, store screenshots, e-commerce banners, OG/README cards — for a project, website or brief, following the snap-x design guide.",
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
