/**
 * pool.mjs
 * Renders multiple design files concurrently with a small worker_threads pool.
 */
import os from "os";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { renderDesign } from "./render.mjs";

const WORKER_PATH = fileURLToPath(new URL("./render-worker.mjs", import.meta.url));

/** CPU-count-based default pool size (always ≥ 1). */
export function defaultJobs() {
  return Math.max(1, os.cpus().length);
}

/**
 * Renders `files` into `outDir`, one `renderDesign` call per file (each of which may itself expand
 * into several outputs via VARIANTS). `jobs` (default: defaultJobs()) is clamped to at least 1 and
 * at most `files.length`; **1 job, or a single file, runs the exact sequential path from before this
 * pool existed — no worker_threads spun up at all.** More than that spreads files across that many
 * worker threads (each rendering quietly — see render-worker.mjs).
 *
 * `onResult(index, { ok: true, result } | { ok: false, error })` (may be async) is called once per
 * file, always in the original file order regardless of which worker actually finishes first: a
 * result is queued the moment it arrives, but `onResult` calls themselves are chained one at a time
 * in index order — the next one is only invoked after the previous one's promise has resolved — so
 * that even an async onResult (e.g. one that reads the output file before logging it) can't have its
 * own work interleave out of order. This is what keeps console output (and exit-code decisions)
 * deterministic between runs.
 */
export async function renderPool(files, outDir, fonts, { scale = 1, only, jobs, onResult = () => {} } = {}) {
  const n = Math.max(1, Math.min(jobs ?? defaultJobs(), files.length || 1));

  if (n <= 1) {
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await renderDesign(files[i], outDir, fonts, { scale, only, log: () => {} });
        await onResult(i, { ok: true, result });
      } catch (err) {
        await onResult(i, { ok: false, error: err.message });
      }
    }
    return;
  }

  const results = new Array(files.length);
  const ready = new Array(files.length).fill(false);
  let nextToEmit = 0;
  let emitChain = Promise.resolve(); // serializes onResult calls even though messages arrive unordered

  const scheduleEmits = () => {
    while (nextToEmit < files.length && ready[nextToEmit]) {
      const i = nextToEmit;
      emitChain = emitChain.then(() => onResult(i, results[i]));
      nextToEmit++;
    }
  };

  const workers = Array.from({ length: n }, () => new Worker(WORKER_PATH, { workerData: { fonts } }));
  let nextToStart = 0;
  let pending = files.length;

  try {
    await new Promise((resolve, reject) => {
      const assignNext = (worker) => {
        if (nextToStart >= files.length) return;
        const i = nextToStart++;
        worker.__index = i;
        worker.postMessage({ filePath: files[i], outDir, scale, only });
      };

      for (const worker of workers) {
        worker.on("message", (msg) => {
          const i = worker.__index;
          results[i] = msg.ok ? { ok: true, result: msg.result } : { ok: false, error: msg.error };
          ready[i] = true;
          scheduleEmits();
          pending--;
          if (pending === 0) resolve();
          else assignNext(worker);
        });
        worker.on("error", reject);
        assignNext(worker);
      }
    });
    await emitChain; // the last scheduled onResult may still be pending when `pending` hits 0
  } finally {
    await Promise.all(workers.map((w) => w.terminate()));
  }
}
