import {
  Editor,
  MarkdownView,
  Menu,
  Notice,
  Plugin,
  TFile,
} from "obsidian";
import type { ChildProcess } from "child_process";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as nodePath from "path";
import { BookmarkData, DEFAULT_SETTINGS, PlaybackState, SentenceInfo } from "./types";
import { processMarkdown } from "./text-processor";
import { TTSEngine } from "./tts-engine";
import { AudioPlayer } from "./audio-player";
import { HighlightManager, highlightField } from "./highlight-manager";
import { PlaybackView } from "./playback-view";
import { LocalTTSSettingTab } from "./settings";
import { BookmarkListModal, ReadStartModal } from "./bookmark-modal";

const SPEED_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default class LocalTTSPlugin extends Plugin {
  settings = { ...DEFAULT_SETTINGS };
  ttsEngine = new TTSEngine();
  audioPlayer = new AudioPlayer();
  // HighlightManager is initialised in onload() so this.app is available
  highlightManager!: HighlightManager;
  playbackView: PlaybackView | null = null;

  playbackState: PlaybackState = {
    isPlaying: false,
    isPaused: false,
    currentSentenceIndex: 0,
    totalSentences: 0,
    currentText: "",
    sourceFile: "",
    progress: 0,
  };

  private sentences: SentenceInfo[] = [];
  private currentIndex = 0;
  private abortController: AbortController | null = null;
  private audioCache = new Map<number, { audio: Float32Array; sampleRate: number }>();
  private prefetchingIndices = new Set<number>();

  private serverProcess: ChildProcess | null = null;

  // ─── Plugin lifecycle ──────────────────────────────────────────────────────

  async onload() {
    this.highlightManager = new HighlightManager(this.app);
    await this.loadSettings();

    document.documentElement.style.setProperty(
      "--local-tts-highlight-color",
      this.settings.highlightColor
    );

    this.registerEditorExtension(highlightField);
    this.ttsEngine.updatePort(this.settings.serverPort);

    // Ribbon
    this.addRibbonIcon("volume-2", "Read current note aloud", () => { void this.readCurrentNote(); });

    // Status bar — two items: playback controls + idle resume pill
    const statusBarItem = this.addStatusBarItem();
    const resumeBarItem = this.addStatusBarItem();
    this.playbackView = new PlaybackView(statusBarItem, resumeBarItem);
    this.playbackView.onAction((action) => {
      switch (action) {
        case "play":             this.togglePlayPause(); break;
        case "stop":             this.stopPlayback(); break;
        case "next":             void this.nextSentence(); break;
        case "prev":             void this.prevSentence(); break;
        case "speed":            this.cycleSpeed(); break;
        case "bookmark-toggle":  this.handleBookmarkToggle(); break;
        case "bookmark-clear":   this.handleBookmarkClear(); break;
        case "bookmark-list":    new BookmarkListModal(this).open(); break;
        case "bookmark-resume":  void this.resumeCurrentNote(); break;
      }
    });

    // Update resume pill when user switches notes
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.updateResumeButton())
    );

    // ── Commands ──────────────────────────────────────────────────────────
    this.addCommand({
      id: "read-current-note",
      name: "Read current note",
      callback: () => { void this.readCurrentNote(); },
    });
    this.addCommand({
      id: "read-selected-text",
      name: "Read selected text",
      editorCallback: (editor: Editor) => { void this.readSelectedText(editor); },
    });
    this.addCommand({
      id: "pause-resume",
      name: "Pause / resume",
      callback: () => this.togglePlayPause(),
    });
    this.addCommand({
      id: "stop",
      name: "Stop reading",
      callback: () => this.stopPlayback(),
    });
    this.addCommand({
      id: "resume-reading",
      name: "Resume reading from bookmark",
      callback: () => { void this.resumeCurrentNote(); },
    });
    this.addCommand({
      id: "clear-bookmark",
      name: "Clear bookmark for current note",
      callback: () => this.clearCurrentBookmark(),
    });
    this.addCommand({
      id: "show-bookmarks",
      name: "Show all bookmarks",
      callback: () => new BookmarkListModal(this).open(),
    });
    this.addCommand({
      id: "next-sentence",
      name: "Next sentence",
      callback: () => { void this.nextSentence(); },
    });
    this.addCommand({
      id: "prev-sentence",
      name: "Previous sentence",
      callback: () => { void this.prevSentence(); },
    });
    this.addCommand({
      id: "speed-up",
      name: "Speed up (+ 0.25x)",
      callback: () => this.adjustSpeed(0.25),
    });
    this.addCommand({
      id: "speed-down",
      name: "Speed down (- 0.25x)",
      callback: () => this.adjustSpeed(-0.25),
    });

    // ── Editor context menu ───────────────────────────────────────────────
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor) => {
        menu.addItem((item) =>
          item.setTitle("Read aloud").setIcon("volume-2").onClick(() => this.readCurrentNote())
        );
        if (editor.getSelection()) {
          menu.addItem((item) =>
            item.setTitle("Read selection aloud").setIcon("volume-2")
              .onClick(() => this.readSelectedText(editor))
          );
        }
        // Show "Resume from bookmark" only if current note has a bookmark
        const file = this.app.workspace.getActiveFile();
        if (file && this.settings.bookmarks[file.path]) {
          menu.addItem((item) =>
            item.setTitle("Resume reading from bookmark").setIcon("bookmark")
              .onClick(() => { void this.resumeCurrentNote(); })
          );
        }
      })
    );

    // Settings tab
    this.addSettingTab(new LocalTTSSettingTab(this.app, this));

    // Auto-install server deps if missing, then auto-start server
    if (this.settings.autoStartServer) {
      setTimeout(() => {
        void (async () => {
          await this.checkAndInstallServerDeps();
          await this.startServer();
        })();
      }, 1500);
    }
  }

  onunload() {
    // Save bookmark if currently playing/paused
    if (
      (this.playbackState.isPlaying || this.playbackState.isPaused) &&
      this.playbackState.sourceFile &&
      this.playbackState.sourceFile !== "selection"
    ) {
      this.saveBookmark();
    }
    this.stopPlayback();
    this.stopServer();
    this.ttsEngine.dispose();
    this.audioPlayer.dispose();
    this.playbackView?.destroy();
    document.documentElement.style.removeProperty("--local-tts-highlight-color");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    // Ensure bookmarks is always an object (safety for old data)
    if (!this.settings.bookmarks) this.settings.bookmarks = {};
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ─── Bookmark management ──────────────────────────────────────────────────

  saveBookmark(): void {
    const { sourceFile, currentSentenceIndex } = this.playbackState;
    if (!sourceFile || sourceFile === "selection") return;
    const sentence = this.sentences[currentSentenceIndex];
    if (!sentence) return;

    const preview =
      sentence.text.length > 50 ? sentence.text.slice(0, 50) + "…" : sentence.text;

    this.settings.bookmarks[sourceFile] = {
      filePath: sourceFile,
      sentenceIndex: currentSentenceIndex,
      timestamp: Date.now(),
      sentencePreview: preview,
    };
    void this.saveSettings();
    this.playbackView?.setBookmarkState(true);
    this.updateResumeButton();
  }

  clearBookmark(filePath: string): void {
    if (this.settings.bookmarks[filePath]) {
      delete this.settings.bookmarks[filePath];
      void this.saveSettings();
      if (this.playbackState.sourceFile === filePath) {
        this.playbackView?.setBookmarkState(false);
      }
      this.updateResumeButton();
    }
  }

  /** Toggle logic for the 🔖 button in the playback bar. */
  private handleBookmarkToggle(): void {
    const { sourceFile } = this.playbackState;
    if (!sourceFile || sourceFile === "selection") return;
    if (this.settings.bookmarks[sourceFile]) {
      // Has bookmark → jump to it
      this.jumpToBookmark();
    } else {
      // No bookmark → save current position
      this.saveBookmark();
      new Notice("Bookmark saved.");
    }
  }

  /** Right-click / contextmenu on the 🔖 button → clear bookmark. */
  private handleBookmarkClear(): void {
    const { sourceFile } = this.playbackState;
    if (!sourceFile || sourceFile === "selection") return;
    if (this.settings.bookmarks[sourceFile]) {
      this.clearBookmark(sourceFile);
      new Notice("Bookmark cleared.");
    } else {
      new Notice("No bookmark to clear.");
    }
  }

  clearCurrentBookmark(): void {
    const file = this.app.workspace.getActiveFile();
    if (!file) { new Notice("No active note."); return; }
    if (this.settings.bookmarks[file.path]) {
      this.clearBookmark(file.path);
      new Notice("Bookmark cleared.");
    } else {
      new Notice("No bookmark for this note.");
    }
  }

  /** Resume current note from bookmark (Cmd+Shift+R). */
  async resumeCurrentNote(): Promise<void> {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view?.file) { new Notice("No active note."); return; }

    const bm = this.settings.bookmarks[view.file.path];
    if (!bm) {
      new Notice("No bookmark saved for this note. Use 'Read current note' to start reading.");
      return;
    }

    const content = await this.app.vault.read(view.file);
    await this.startReading(content, view.file.path, bm.sentenceIndex);
  }

  /** Jump to saved bookmark position in the currently playing note. */
  jumpToBookmark(): void {
    const { sourceFile } = this.playbackState;
    if (!sourceFile) return;
    const bm = this.settings.bookmarks[sourceFile];
    if (!bm) return;

    this.audioPlayer.stop();
    void this.playSentenceAt(bm.sentenceIndex);
  }

  /** Open a file and start reading from the given bookmark. */
  async openAndResumeFromBookmark(filePath: string, bm: BookmarkData): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      new Notice(`File not found: ${filePath}`);
      return;
    }
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    // Wait for editor to settle
    await new Promise((r) => setTimeout(r, 350));
    const content = await this.app.vault.read(file);
    await this.startReading(content, filePath, bm.sentenceIndex);
  }

  // ─── Server dependency management ─────────────────────────────────────────

  /** Returns true if server/node_modules/kokoro-js is present. */
  serverDepsInstalled(): boolean {
    try {
      const basePath = (this.app.vault.adapter as unknown as { getBasePath(): string }).getBasePath();
      const kokoroPath = nodePath.join(basePath, this.manifest.dir ?? "", "server", "node_modules", "kokoro-js");
      return fs.existsSync(kokoroPath);
    } catch {
      return false;
    }
  }

  /** Run npm install in server/ directory via login shell (finds nvm npm). */
  async installServerDeps(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const basePath = (this.app.vault.adapter as unknown as { getBasePath(): string }).getBasePath();
        const serverDir = nodePath.join(basePath, this.manifest.dir ?? "", "server");
        const proc = childProcess.spawn(
          "/bin/zsh",
          ["-l", "-c", `npm install --prefix "${serverDir}"`],
          { stdio: ["ignore", "pipe", "pipe"], detached: false }
        );
        proc.stdout?.on("data", (d: Buffer) => console.debug("[LocalTTS deps]", d.toString().trimEnd()));
        proc.stderr?.on("data", (d: Buffer) => console.debug("[LocalTTS deps]", d.toString().trimEnd()));
        proc.on("close", (code: number | null) => {
          if (code === 0) {
            new Notice("Local TTS: server dependencies installed ✅");
          } else {
            new Notice(`Local TTS: npm install failed (code=${code}). Check console.`, 6000);
          }
          resolve();
        });
        proc.on("error", (err: Error) => {
          new Notice(`Local TTS: install error — ${err.message}`, 6000);
          resolve();
        });
      } catch (err) {
        console.error("[LocalTTS] installServerDeps:", err);
        resolve();
      }
    });
  }

  private async checkAndInstallServerDeps(): Promise<void> {
    if (this.serverDepsInstalled()) return;
    console.debug("[LocalTTS] server/node_modules/kokoro-js not found — running npm install…");
    new Notice("Local TTS: installing server dependencies (kokoro-js)…", 5000);
    await this.installServerDeps();
  }

  // ─── Server management ────────────────────────────────────────────────────

  async startServer(): Promise<void> {
    if (this.serverProcess && !this.serverProcess.killed) return;

    const basePath = (this.app.vault.adapter as unknown as { getBasePath(): string }).getBasePath();
    const serverScript = nodePath.join(basePath, this.manifest.dir ?? "", "server", "tts-server.mjs");

    if (!fs.existsSync(serverScript)) {
      new Notice(`TTS server script not found:\n${serverScript}`, 8000);
      return;
    }

    const nodeExec = await this.resolveNodePath();
    const port = String(this.settings.serverPort);
    const modelId = this.settings.modelId;
    const dtype = this.settings.modelDtype;

    console.debug(`[LocalTTS] Starting: ${nodeExec} ${serverScript} ${port}`);

    this.serverProcess = childProcess.spawn(
      nodeExec,
      [serverScript, port, modelId, dtype],
      { stdio: ["ignore", "pipe", "pipe"], detached: false }
    );

    this.serverProcess.stdout?.on("data", (d: Buffer) =>
      console.debug("[TTS Server]", d.toString().trimEnd())
    );
    this.serverProcess.stderr?.on("data", (d: Buffer) =>
      console.error("[TTS Server]", d.toString().trimEnd())
    );
    this.serverProcess.on("error", (err: Error) => {
      new Notice(`TTS server failed: ${err.message}`, 6000);
      this.serverProcess = null;
    });
    this.serverProcess.on("exit", (code: number | null) => {
      console.debug(`[TTS Server] Exited (code=${code})`);
      this.serverProcess = null;
      this.ttsEngine.dispose();
    });

    this.ttsEngine.updatePort(this.settings.serverPort);
    new Notice("TTS server starting… (model download ~90 MB on first run)", 4000);
  }

  stopServer(): void {
    if (this.serverProcess && !this.serverProcess.killed) {
      this.serverProcess.kill("SIGTERM");
    }
    this.serverProcess = null;
  }

  get isServerRunning(): boolean {
    return this.serverProcess !== null && !this.serverProcess.killed;
  }

  async detectNodePath(): Promise<string> {
    return new Promise((resolve) => {
      const shells = ["/bin/zsh", "/bin/bash"];
      let tried = 0;
      const tryShell = (shell: string) => {
        const proc = childProcess.spawn(shell, ["-l", "-c", "which node"], {
          stdio: ["ignore", "pipe", "ignore"],
          timeout: 5000,
        });
        let out = "";
        proc.stdout?.on("data", (d: Buffer) => { out += d.toString(); });
        proc.on("close", (code: number) => {
          const p = out.trim();
          if (code === 0 && p && fs.existsSync(p)) { resolve(p); return; }
          tried++;
          if (tried < shells.length) { tryShell(shells[tried]); return; }
          const home = process.env.HOME ?? "";
          const candidates = [
            `${home}/.nvm/versions/node/v20.20.2/bin/node`,
            "/usr/local/bin/node",
            "/opt/homebrew/bin/node",
          ];
          resolve(candidates.find((c) => fs.existsSync(c)) ?? "");
        });
        proc.on("error", () => {
          tried++;
          if (tried < shells.length) tryShell(shells[tried]);
          else resolve("");
        });
      };
      tryShell(shells[0]);
    });
  }

  private async resolveNodePath(): Promise<string> {
    if (this.settings.nodePath) return this.settings.nodePath;
    const detected = await this.detectNodePath();
    return detected || "node";
  }

  // ─── Core reading flow ────────────────────────────────────────────────────

  async readCurrentNote(): Promise<void> {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view?.file) { new Notice("No active note found."); return; }

    const content = await this.app.vault.read(view.file);
    const filePath = view.file.path;
    const processed = processMarkdown(content, this.settings);
    const total = processed.sentences.length;

    if (total === 0) {
      new Notice("No readable text found in this note.");
      return;
    }

    // Cursor-based start index
    const cursorLine = view.editor.getCursor().line;
    const cursorIdx = this.findSentenceAtLine(processed.sentences, cursorLine);

    const bm = this.settings.bookmarks[filePath];

    interface ReadOption { label: string; description: string; startIndex: number; }
    const options: ReadOption[] = [
      {
        label: "From beginning",
        description: `Sentence 1 / ${total}`,
        startIndex: 0,
      },
      {
        label: "From cursor",
        description: `Sentence ${cursorIdx + 1} / ${total}  — "${processed.sentences[cursorIdx].text.slice(0, 50)}"`,
        startIndex: cursorIdx,
      },
    ];

    if (bm) {
      const bmIdx = Math.max(0, Math.min(bm.sentenceIndex, total - 1));
      options.push({
        label: `From bookmark  (sentence ${bmIdx + 1} / ${total})`,
        description: `"${bm.sentencePreview}"  ·  ${formatBookmarkTime(bm.timestamp)}`,
        startIndex: bmIdx,
      });
    }

    new ReadStartModal(this.app, options, (startIndex) => {
      void this.startReading(content, filePath, startIndex);
    }).open();
  }

  /** Return the index of the first sentence whose end line ≥ cursorLine. */
  private findSentenceAtLine(sentences: SentenceInfo[], cursorLine: number): number {
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i].lineEnd >= cursorLine) return i;
    }
    return Math.max(0, sentences.length - 1);
  }

  async readSelectedText(editor: Editor): Promise<void> {
    const selected = editor.getSelection();
    if (!selected.trim()) { new Notice("No text selected."); return; }
    await this.startReading(selected, "selection", 0);
  }

  private async startReading(content: string, sourceFile: string, startIndex = 0): Promise<void> {
    this.stopPlayback();

    await this.ttsEngine.initialize();
    if (!this.ttsEngine.ready) {
      new Notice(
        "TTS server is not ready. Start it in Settings → Local TTS → Start server.",
        6000
      );
      return;
    }

    const processed = processMarkdown(content, this.settings);
    if (processed.sentences.length === 0) {
      new Notice("No readable text found in this note.");
      return;
    }

    const safeStart = Math.max(0, Math.min(startIndex, processed.sentences.length - 1));

    this.sentences = processed.sentences;
    this.currentIndex = safeStart;
    this.audioCache.clear();
    this.prefetchingIndices.clear();
    this.abortController = new AbortController();

    this.playbackState = {
      isPlaying: true,
      isPaused: false,
      currentSentenceIndex: safeStart,
      totalSentences: this.sentences.length,
      currentText: "",
      sourceFile,
      progress: 0,
    };

    // Update 🔖 button state
    const hasBookmark = sourceFile !== "selection" && !!this.settings.bookmarks[sourceFile];
    this.playbackView?.setBookmarkState(hasBookmark);
    this.playbackView?.setResumeVisible(false); // hide resume pill during playback

    this.audioPlayer.onEnded(() => this.onSentenceEnded());
    await this.playSentenceAt(safeStart);
  }

  private async playSentenceAt(index: number): Promise<void> {
    if (this.abortController?.signal.aborted) return;
    if (index >= this.sentences.length) { this.onReadingComplete(); return; }

    const sentence = this.sentences[index];
    this.currentIndex = index;

    console.debug(`[LocalTTS] Playing ${index + 1}/${this.sentences.length}`);

    this.playbackState.currentSentenceIndex = index;
    this.playbackState.currentText = sentence.text;
    this.playbackState.progress = Math.round((index / this.sentences.length) * 100);
    this.playbackState.isPlaying = true;
    this.playbackState.isPaused = false;
    this.updateUI();

    this.applyHighlight(sentence);
    this.prefetchAhead(index);

    let audioData = this.audioCache.get(index);
    if (!audioData) {
      try {
        audioData = await this.ttsEngine.generateSentence(
          sentence.text, this.settings.voiceId, this.settings.speed
        );
      } catch (err) {
        if (this.abortController?.signal.aborted) return;
        console.error("[LocalTTS]", err);
        new Notice(`TTS error: ${err}`, 4000);
        this.onSentenceEnded();
        return;
      }
    }

    if (this.abortController?.signal.aborted) return;
    this.audioCache.set(index, audioData);
    this.cleanAudioCache(index);
    await this.audioPlayer.play(audioData.audio, audioData.sampleRate);
  }

  private onSentenceEnded(): void {
    if (this.abortController?.signal.aborted) return;
    const next = this.currentIndex + 1;
    if (next >= this.sentences.length) this.onReadingComplete();
    else void this.playSentenceAt(next);
  }

  private onReadingComplete(): void {
    // Clear bookmark — note was read to the end
    const { sourceFile } = this.playbackState;
    if (sourceFile && sourceFile !== "selection" && this.settings.bookmarks[sourceFile]) {
      this.clearBookmark(sourceFile);
    }
    this.playbackState.isPlaying = false;
    this.playbackState.isPaused = false;
    this.clearHighlight();
    this.updateUI();          // calls updateResumeButton() inside
    new Notice("Finished reading.");
  }

  // ─── Prefetch ─────────────────────────────────────────────────────────────

  private prefetchAhead(current: number): void {
    const max = this.settings.maxConcurrentGenerations;
    for (let i = 1; i <= max; i++) {
      const idx = current + i;
      if (idx >= this.sentences.length) break;
      if (this.audioCache.has(idx) || this.prefetchingIndices.has(idx)) continue;
      this.prefetchingIndices.add(idx);
      this.ttsEngine
        .generateSentence(this.sentences[idx].text, this.settings.voiceId, this.settings.speed)
        .then((data) => { this.audioCache.set(idx, data); this.prefetchingIndices.delete(idx); })
        .catch(() => { this.prefetchingIndices.delete(idx); });
    }
  }

  private cleanAudioCache(current: number): void {
    const max = this.settings.maxConcurrentGenerations;
    for (const key of this.audioCache.keys()) {
      if (key < current - 1 || key > current + max + 1) this.audioCache.delete(key);
    }
  }

  // ─── Playback controls ────────────────────────────────────────────────────

  togglePlayPause(): void {
    if (!this.playbackState.isPlaying && !this.playbackState.isPaused) return;

    if (this.playbackState.isPaused) {
      this.audioPlayer.resume();
      this.playbackState.isPaused = false;
      this.playbackState.isPlaying = true;
    } else {
      this.audioPlayer.pause();
      this.playbackState.isPaused = true;
      this.playbackState.isPlaying = false;
      // Auto-save bookmark on pause
      this.saveBookmark();
    }
    this.updateUI();
  }

  stopPlayback(): void {
    // Auto-save bookmark on stop (if reading an actual file)
    if (
      (this.playbackState.isPlaying || this.playbackState.isPaused) &&
      this.playbackState.sourceFile &&
      this.playbackState.sourceFile !== "selection"
    ) {
      this.saveBookmark();
    }
    this.abortController?.abort();
    this.abortController = null;
    this.audioPlayer.stop();
    this.clearHighlight();
    this.audioCache.clear();
    this.prefetchingIndices.clear();
    this.playbackState.isPlaying = false;
    this.playbackState.isPaused = false;
    this.updateUI();
  }

  async nextSentence(): Promise<void> {
    if (!this.playbackState.isPlaying && !this.playbackState.isPaused) return;
    this.audioPlayer.stop();
    await this.playSentenceAt(this.currentIndex + 1);
  }

  async prevSentence(): Promise<void> {
    if (!this.playbackState.isPlaying && !this.playbackState.isPaused) return;
    this.audioPlayer.stop();
    await this.playSentenceAt(Math.max(0, this.currentIndex - 1));
  }

  cycleSpeed(): void {
    const idx = SPEED_STEPS.findIndex((s) => Math.abs(s - this.settings.speed) < 0.01);
    const next = SPEED_STEPS[(idx + 1) % SPEED_STEPS.length];
    this.settings.speed = next;
    void this.saveSettings();
    this.playbackView?.updateSpeed(next);
    new Notice(`Speed: ${next}x`);
  }

  adjustSpeed(delta: number): void {
    const next = Math.max(0.5, Math.min(2.0, this.settings.speed + delta));
    this.settings.speed = next;
    void this.saveSettings();
    this.playbackView?.updateSpeed(next);
    new Notice(`Speed: ${next.toFixed(2)}x`);
  }

  // ─── Highlight ────────────────────────────────────────────────────────────

  private applyHighlight(sentence: SentenceInfo): void {
    if (!this.settings.highlightCurrentSentence) return;
    this.highlightManager.highlight(
      sentence.lineStart,
      sentence.lineEnd,
      sentence.charStart,
      sentence.charEnd,
      this.settings.autoScrollToSentence
    );
  }

  private clearHighlight(): void {
    this.highlightManager.clear();
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  private updateUI(): void {
    this.playbackView?.update(this.playbackState);
    this.playbackView?.updateSpeed(this.settings.speed);
    // When not playing, refresh the resume pill
    if (!this.playbackState.isPlaying && !this.playbackState.isPaused) {
      this.updateResumeButton();
    }
  }

  /** Show or hide the "🔖 Resume" pill based on active file + bookmark state. */
  updateResumeButton(): void {
    const playing = this.playbackState.isPlaying || this.playbackState.isPaused;
    if (playing) { this.playbackView?.setResumeVisible(false); return; }
    const file = this.app.workspace.getActiveFile();
    const hasBookmark = !!file && !!this.settings.bookmarks[file.path];
    this.playbackView?.setResumeVisible(hasBookmark);
  }
}

// ─── module-level helpers ─────────────────────────────────────────────────────

function formatBookmarkTime(ts: number): string {
  const d = new Date(ts);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}
