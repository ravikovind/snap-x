/**
 * watch.mjs
 * A dev tool: re-renders design files on change and serves a minimal local preview page.
 * No new dependencies (fs.watch + Node's http), kept small — this isn't a production feature.
 */
import http from "http";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { renderDesign } from "./render.mjs";
import { renderGuides } from "./guides.mjs";

const CONTENT_TYPES = { ".png": "image/png", ".html": "text/html; charset=utf-8" };

function page(files, guideFiles, version) {
  const img = (dir, name) => `<figure><img src="/${dir}/${encodeURIComponent(name)}?v=${version}" alt="${name}"><figcaption>${name}</figcaption></figure>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>snap-x watch</title><style>
    body{background:#111;color:#eee;font:14px/1.4 -apple-system,sans-serif;margin:0;padding:24px}
    h1{font-size:15px;color:#888;font-weight:400;margin:0 0 20px}
    .grid{display:flex;flex-wrap:wrap;gap:20px}
    figure{margin:0;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px}
    img{display:block;max-width:360px;max-height:360px;background:#000}
    figcaption{margin-top:6px;font-size:12px;color:#999;font-family:monospace}
  </style></head><body>
    <h1>snap-x watch — re-renders on save</h1>
    <div class="grid">${files.map((n) => img("files", n)).join("")}</div>
    ${guideFiles.length ? `<h1 style="margin-top:32px">guides</h1><div class="grid">${guideFiles.map((n) => img("guides", n)).join("")}</div>` : ""}
    <script>
      let v = ${version};
      setInterval(async () => {
        try { const r = await fetch("/version"); const n = await r.text();
          if (n !== String(v)) location.reload(); } catch {}
      }, 1000);
    </script>
  </body></html>`;
}

/**
 * Watches `files` for changes, re-rendering (and optionally re-running guides) on each one, and
 * serves a minimal preview page that auto-reloads when new output exists. Returns { port, stop() };
 * the caller is responsible for keeping the process alive (the CLI just awaits forever).
 */
export async function startWatch(files, fonts, { outDir, guidesDir, guides = false, port = 0, log = () => {} } = {}) {
  let version = 0;
  const outputs = new Set();
  const guideOutputs = new Set();

  async function renderAll() {
    for (const f of files) {
      try {
        const result = await renderDesign(f, outDir, fonts);
        for (const p of Array.isArray(result) ? result : [result]) outputs.add(path.basename(p));
      } catch (err) {
        log(`  ⚠  ${path.basename(f)}: ${err.message}`);
      }
      if (guides) {
        try {
          const written = await renderGuides(f, guidesDir, fonts, {});
          for (const p of written) guideOutputs.add(path.basename(p));
        } catch (err) {
          log(`  ⚠  ${path.basename(f)} (guides): ${err.message}`);
        }
      }
    }
    version++;
  }

  await fsp.mkdir(outDir, { recursive: true });
  if (guides) await fsp.mkdir(guidesDir, { recursive: true });
  await renderAll();
  log(`  Rendered ${outputs.size} file(s)${guides ? ` + ${guideOutputs.size} guide(s)` : ""}.`);

  // A save can fire fs.watch more than once (editors write in stages) — debounce to one re-render.
  let pending = null;
  const scheduleRerender = (f) => {
    log(`  ↻  ${path.basename(f)} changed, re-rendering…`);
    clearTimeout(pending);
    pending = setTimeout(() => renderAll().then(() => log(`  Rendered ${outputs.size} file(s)${guides ? ` + ${guideOutputs.size} guide(s)` : ""}.`)), 80);
  };

  const watchers = files.map((f) => fs.watch(f, { persistent: true }, () => scheduleRerender(f)));

  const serveFile = async (dir, name, res) => {
    const safe = path.basename(name); // no traversal — always just a filename within dir
    try {
      const buf = await fsp.readFile(path.join(dir, safe));
      res.writeHead(200, { "Content-Type": CONTENT_TYPES[path.extname(safe)] ?? "application/octet-stream" });
      res.end(buf);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  };

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/" || url.pathname === "/index.html") {
      res.writeHead(200, { "Content-Type": CONTENT_TYPES[".html"] });
      res.end(page([...outputs].sort(), [...guideOutputs].sort(), version));
    } else if (url.pathname === "/version") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(String(version));
    } else if (url.pathname.startsWith("/files/")) {
      await serveFile(outDir, decodeURIComponent(url.pathname.slice("/files/".length)), res);
    } else if (url.pathname.startsWith("/guides/")) {
      await serveFile(guidesDir, decodeURIComponent(url.pathname.slice("/guides/".length)), res);
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => resolve());
  });

  return {
    port: server.address().port,
    stop: () => {
      clearTimeout(pending);
      for (const w of watchers) w.close();
      return new Promise((resolve) => server.close(resolve));
    },
  };
}
