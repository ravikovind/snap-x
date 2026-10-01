import { FONTS, ogFrame } from "./_brand.mjs";

export const FORMAT = { width: 1200, height: 630, name: "page.png" };
export { FONTS };

export const VARIANTS = [
  { id: "home", label: "snap-x", title: "Branded graphics for every platform, made by your AI agent.", format: { name: "home.png" } },
  { id: "formats", label: "Correct for every platform", title: "22 formats, verified against official docs.", format: { name: "formats.png" } },
  { id: "use-cases", label: "Use cases", title: "Whatever you make, there's a format for it.", format: { name: "use-cases.png" } },
  { id: "templates", label: "Templates", title: "Six brand-neutral starters. Copy one, edit the values.", format: { name: "templates.png" } },
  { id: "examples", label: "Examples", title: "Complete packs, made with the skill.", format: { name: "examples.png" } },
  { id: "showcase", label: "Showcase", title: "Made with snap-x.", format: { name: "showcase.png" } },
  { id: "docs", label: "Docs", title: "Write designs by hand.", format: { name: "docs.png" } },
  { id: "install", label: "Install", title: "Claude Code, Cursor, Windsurf, Claude Desktop, Codex, CLI.", format: { name: "install.png" } },
];

export default function (variant) {
  return ogFrame({ label: variant.label, title: variant.title });
}
