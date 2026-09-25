import fs from "fs/promises";
import os from "os";
import path from "path";

export async function makeTmpDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), "snapx-test-"));
}

export async function writeFiles(dir, files) {
  for (const [name, content] of Object.entries(files)) {
    const p = path.join(dir, name);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, content);
  }
}

/** A minimal valid self-contained design, parameterised by output name/size. */
export function validDesign({ name = "out.png", width = 200, height = 100, fonts } = {}) {
  return `
export const FORMAT = { width: ${width}, height: ${height}, name: ${JSON.stringify(name)} };
${fonts ? `export const FONTS = ${JSON.stringify(fonts)};` : ""}
export default function () {
  return { type: "div", props: { style: { width: ${width}, height: ${height}, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
    { type: "div", props: { style: { color: "#fff", fontSize: 24, display: "flex" }, children: ["hi"] } },
  ]}};
}
`;
}

/** Points the font disk cache at a fresh temp dir; returns { dir, cleanup }. */
export async function isolateCache() {
  const dir = await makeTmpDir();
  const prev = process.env.SNAP_X_CACHE_DIR;
  process.env.SNAP_X_CACHE_DIR = dir;
  return {
    dir,
    cleanup: async () => {
      if (prev === undefined) delete process.env.SNAP_X_CACHE_DIR;
      else process.env.SNAP_X_CACHE_DIR = prev;
      await fs.rm(dir, { recursive: true, force: true });
    },
  };
}
