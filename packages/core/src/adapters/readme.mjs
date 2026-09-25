import fs from "fs";
import path from "path";

const STACK_MAP = {
  "next.js": "Next.js", "nextjs": "Next.js", "next js": "Next.js",
  "react": "React", "vue": "Vue", "svelte": "Svelte", "astro": "Astro",
  "typescript": "TypeScript", "javascript": "JavaScript",
  "node.js": "Node.js", "nodejs": "Node.js",
  "python": "Python", "rust": "Rust", "golang": "Go", " go ": "Go",
  "tailwind": "Tailwind", "prisma": "Prisma", "supabase": "Supabase",
  "satori": "Satori", "resvg": "Resvg",
  "postgres": "Postgres", "mongodb": "MongoDB", "redis": "Redis",
  "docker": "Docker", "vercel": "Vercel", "cloudflare": "Cloudflare",
  "zoho": "Zoho", "openai": "OpenAI", "anthropic": "Anthropic",
};

export async function readReadme(dir) {
  const candidates = ["README.md", "readme.md", "Readme.md"];
  let content = null;
  for (const c of candidates) {
    const p = path.join(dir, c);
    if (fs.existsSync(p)) { content = fs.readFileSync(p, "utf-8"); break; }
  }
  if (!content) return null;

  const lines = content.split("\n");
  const h1 = lines.find((l) => l.startsWith("# "))?.replace(/^# /, "").trim() ?? "";
  const description = lines.find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("!") && l.length > 20)?.trim() ?? "";

  const lower = content.toLowerCase();
  const seen = new Set();
  const stack = [];
  for (const [keyword, display] of Object.entries(STACK_MAP)) {
    if (lower.includes(keyword) && !seen.has(display)) {
      seen.add(display);
      stack.push(display);
    }
  }

  return { name: h1, description, stack };
}
