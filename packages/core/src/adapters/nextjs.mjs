import fs from "fs";
import path from "path";

export async function readNextJs(dir) {
  // Try to extract site metadata from next.config or site data files
  const candidates = [
    "data/site.ts", "data/site.js",
    "lib/site.ts", "lib/site.js",
    "config/site.ts", "config/site.js",
  ];

  for (const c of candidates) {
    const p = path.join(dir, c);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf-8");

    const domainMatch = content.match(/url['":\s]+['"]https?:\/\/([^'"\/\s]+)/i);
    const titleMatch = content.match(/(?:name|title)['":\s]+['"]([^'"]{3,60})['"]/i);

    return {
      domain: domainMatch?.[1] ?? "",
      title: titleMatch?.[1] ?? "",
    };
  }

  return null;
}
