import fs from "fs";
import path from "path";
import { marked } from "marked";

// The monorepo root — apps/web is two levels under it (apps/web -> apps -> root).
const REPO_ROOT = path.resolve(process.cwd(), "../..");

/** Reads a markdown file from the repo root (single source — never duplicated into content/) and renders it to HTML. */
export function readMarkdown(relativePath: string): string {
  const raw = fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
  return marked.parse(raw, { async: false }) as string;
}

/**
 * SHOWCASE.md links its images as `examples/<name>/...png`, relative to the repo root where the
 * file lives — not servable as-is from a Next.js page. This app copies one representative image per
 * pack into public/examples/<name>.png (see /examples/page.tsx); rewrite the markdown to match
 * before parsing, so the same file stays the single source instead of a second copy with edited paths.
 */
export function readMarkdownWithExampleImages(relativePath: string): string {
  const raw = fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
  const rewritten = raw.replace(/\]\(examples\/([a-z0-9-]+)\/[^)]+\)/g, "](/examples/$1.png)");
  return marked.parse(rewritten, { async: false }) as string;
}

/**
 * Reads a markdown file and returns only the section between two headings (exclusive of the next
 * heading, inclusive of everything up to it) — e.g. pulling README.md's technical reference out
 * from under its marketing sections without duplicating the file.
 */
export function readMarkdownSection(relativePath: string, fromHeading: string, toHeading?: string): string {
  const raw = fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
  const fromIdx = raw.indexOf(fromHeading);
  if (fromIdx === -1) throw new Error(`readMarkdownSection: heading "${fromHeading}" not found in ${relativePath}`);
  const rest = raw.slice(fromIdx);
  const toIdx = toHeading ? rest.indexOf(toHeading, fromHeading.length) : -1;
  const section = toIdx === -1 ? rest : rest.slice(0, toIdx);
  return marked.parse(section, { async: false }) as string;
}
