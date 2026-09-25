import fs from "fs";
import path from "path";

export async function readPackageJson(dir) {
  const p = path.join(dir, "package.json");
  if (!fs.existsSync(p)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(p, "utf-8"));
    // Normalize scoped/kebab package names → Title Case display name
    if (pkg.name) {
      pkg._displayName = pkg.name
        .replace(/^@[^/]+\//, "")   // strip scope
        .replace(/[-_]/g, " ")      // kebab/snake → spaces
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
    }
    return pkg;
  } catch {
    return null;
  }
}
