/**
 * TTS Engine — HTTP client that talks to the local tts-server.mjs process.
 * No direct kokoro-js usage here; all inference runs in the Node.js server.
 */
import { requestUrl } from "obsidian";

export class TTSEngine {
  private _isReady = false;
  private serverUrl: string;

  constructor(port = 19199) {
    this.serverUrl = `http://127.0.0.1:${port}`;
  }

  get ready(): boolean {
    return this._isReady;
  }

  /** Update port (called when settings change). */
  updatePort(port: number): void {
    this.serverUrl = `http://127.0.0.1:${port}`;
    this._isReady = false;
  }

  /** Check if server is running and model is ready. */
  async initialize(): Promise<void> {
    try {
      const resp = await requestUrl({ url: `${this.serverUrl}/status` });
      const data = resp.json as { status: string };
      this._isReady = data.status === "ready";
    } catch {
      this._isReady = false;
    }
  }

  /**
   * Poll /status until ready or timeout.
   * @param timeoutMs Maximum wait in milliseconds (default 3 minutes)
   * @param onProgress Optional callback with current status string
   */
  async waitForReady(
    timeoutMs = 180000,
    onProgress?: (status: string) => void
  ): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        const resp = await requestUrl({ url: `${this.serverUrl}/status` });
        const data = resp.json as { status: string; error?: string };
        onProgress?.(data.status);
        if (data.status === "ready") { this._isReady = true; return; }
        if (data.status === "error") {
          throw new Error(`Server model error: ${data.error}`);
        }
      } catch (e) {
        if ((e as Error).message?.startsWith("Server model error")) throw e;
        // Server not yet reachable — still starting
        onProgress?.("connecting");
      }
      await new Promise((r) => activeWindow.setTimeout(r, 2000));
    }
    throw new Error("TTS server did not become ready within the timeout.");
  }

  /**
   * Generate speech for a single sentence.
   * Returns raw PCM Float32Array and sample rate decoded from the WAV response.
   */
  async generateSentence(
    text: string,
    voiceId: string,
    speed: number
  ): Promise<{ audio: Float32Array; sampleRate: number }> {
    if (!this._isReady) {
      throw new Error("TTS server is not ready.");
    }

    const resp = await requestUrl({
      url: `${this.serverUrl}/tts`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: voiceId, speed }),
    });

    if (resp.status < 200 || resp.status >= 300) {
      let msg = `HTTP ${resp.status}`;
      try { msg = (resp.json as { error: string }).error; } catch { /* ignore */ }
      throw new Error(msg);
    }

    const arrayBuffer = resp.arrayBuffer;

    // Decode WAV using Web Audio API (available in Electron)
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    void audioCtx.close();

    return {
      audio: audioBuffer.getChannelData(0),
      sampleRate: audioBuffer.sampleRate,
    };
  }

  listVoices(): string[] {
    return [
      "af_sky", "af_bella", "af_nicole",
      "am_adam", "am_michael",
      "bf_emma", "bm_george",
    ];
  }

  dispose(): void {
    this._isReady = false;
  }
}
