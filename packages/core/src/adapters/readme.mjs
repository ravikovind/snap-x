import fs from "fs";
import path from "path";

const STACK_KEYWORDS = ["node", "react", "next", "vue", "svelte", "typescript", "python", "rust", "go", "satori", "resvg", "tailwind", "prisma", "supabase"];

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
  const stack = STACK_KEYWORDS.filter((k) => lower.includes(k));

  return { name: h1, description, stack };
}
