/**
 * Local TTS HTTP Server — standalone Node.js process
 * Runs kokoro-js outside Electron's renderer so ONNX/WASM works correctly.
 *
 * Usage: node tts-server.mjs [port] [modelId] [dtype]
 * Defaults: port=19199, modelId=onnx-community/Kokoro-82M-v1.0-ONNX, dtype=q8
 */

import { createServer } from "node:http";
import { KokoroTTS } from "kokoro-js";

const PORT = parseInt(process.argv[2]) || 19199;
const MODEL_ID = process.argv[3] || "onnx-community/Kokoro-82M-v1.0-ONNX";
const MODEL_DTYPE = process.argv[4] || "q8";

let tts = null;
let serverStatus = "loading"; // "loading" | "ready" | "error"
let errorMsg = "";

// ─── WAV encoder ────────────────────────────────────────────────────────────
function encodeWAV(audioFloat32, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;

  // Convert Float32 → Int16
  const pcm = new Int16Array(audioFloat32.length);
  for (let i = 0; i < audioFloat32.length; i++) {
    const s = Math.max(-1, Math.min(1, audioFloat32[i]));
    pcm[i] = s < 0 ? s * 32768 : s * 32767;
  }

  const dataBytes = pcm.byteLength;
  const buf = Buffer.alloc(44 + dataBytes);

  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write("WAVE", 8, "ascii");
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16, 16);                              // PCM subchunk size
  buf.writeUInt16LE(1, 20);                               // PCM format
  buf.writeUInt16LE(numChannels, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28);
  buf.writeUInt16LE(numChannels * bitsPerSample / 8, 32);
  buf.writeUInt16LE(bitsPerSample, 34);
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataBytes, 40);
  Buffer.from(pcm.buffer).copy(buf, 44);

  return buf;
}

// ─── Load model ─────────────────────────────────────────────────────────────
console.log(`[TTS Server] Loading ${MODEL_ID} dtype=${MODEL_DTYPE} ...`);

KokoroTTS.from_pretrained(MODEL_ID, {
  dtype: MODEL_DTYPE,
  device: "cpu",
}).then((model) => {
  tts = model;
  serverStatus = "ready";
  console.log("[TTS Server] Model ready.");
}).catch((err) => {
  serverStatus = "error";
  errorMsg = err.message;
  console.error("[TTS Server] Model load error:", err.message);
});

// ─── HTTP server ─────────────────────────────────────────────────────────────
const httpServer = createServer(async (req, res) => {
  // CORS — allow Obsidian renderer (app://obsidian.md) and local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  // GET /status
  if (req.method === "GET" && url.pathname === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: serverStatus, error: errorMsg }));
    return;
  }

  // GET /voices
  if (req.method === "GET" && url.pathname === "/voices") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      voices: [
        "af_sky", "af_bella", "af_nicole",
        "am_adam", "am_michael",
        "bf_emma", "bm_george",
      ],
    }));
    return;
  }

  // POST /tts
  if (req.method === "POST" && url.pathname === "/tts") {
    if (serverStatus !== "ready") {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `Model not ready (${serverStatus}): ${errorMsg}` }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", async () => {
      try {
        const { text, voice = "af_sky", speed = 1.0 } = JSON.parse(body);
        if (!text || !text.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "text is required" }));
          return;
        }

        const result = await tts.generate(text.trim(), { voice, speed: Number(speed) });
        const wavBuf = encodeWAV(result.audio, result.sampling_rate);

        res.writeHead(200, {
          "Content-Type": "audio/wav",
          "Content-Length": wavBuf.length,
          "X-Sample-Rate": result.sampling_rate,
        });
        res.end(wavBuf);
      } catch (err) {
        console.error("[TTS Server] Generate error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

httpServer.listen(PORT, "127.0.0.1", () => {
  console.log(`[TTS Server] Listening on http://127.0.0.1:${PORT}`);
});

httpServer.on("error", (err) => {
  console.error("[TTS Server] HTTP error:", err.message);
  process.exit(1);
});

// Graceful shutdown
const shutdown = () => httpServer.close(() => process.exit(0));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
