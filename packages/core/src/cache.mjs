/**
 * Best-effort persistent disk cache shared by fonts and emoji.
 * Location: $SNAP_X_CACHE_DIR, else $XDG_CACHE_HOME/snap-x/fonts, else ~/.cache/snap-x/fonts.
 * Any read/write problem silently falls back to the network.
 */
import fs from "fs/promises";
import os from "os";
import path from "path";
import { createHash } from "crypto";

export function cacheDir() {
  return (
    process.env.SNAP_X_CACHE_DIR ??
    path.join(process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"), "snap-x", "fonts")
  );
}

/** Stable file path for a cache entry: sha256 of the parts, plus an extension. */
export function cachePath(ext, ...parts) {
  const hash = createHash("sha256").update(parts.map((p) => p ?? "").join("\0")).digest("hex");
  return path.join(cacheDir(), `${hash}.${ext}`);
}

export async function readDisk(file) {
  try {
    const b = await fs.readFile(file);
    if (b.length === 0) return null;
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  } catch {
    return null;
  }
}

export async function writeDisk(file, data) {
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`; // write-then-rename so concurrent runs never see a partial file
    await fs.writeFile(tmp, Buffer.from(data));
    await fs.rename(tmp, file);
  } catch {}
}
