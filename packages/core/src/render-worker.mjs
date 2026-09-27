/**
 * render-worker.mjs
 * One thread of pool.mjs's render pool. Receives one design path per message, renders it quietly
 * (its own console.log would print out of order relative to the main thread's — pool.mjs prints
 * instead, once each file's turn comes up in the original order), and posts the result back.
 */
import { parentPort, workerData } from "worker_threads";
import { renderDesign } from "./render.mjs";

const { fonts } = workerData;

parentPort.on("message", async ({ filePath, outDir, scale, only }) => {
  try {
    const result = await renderDesign(filePath, outDir, fonts, { scale, only, log: () => {} });
    parentPort.postMessage({ ok: true, result });
  } catch (err) {
    parentPort.postMessage({ ok: false, error: err.message });
  }
});
