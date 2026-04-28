import { PlaybackState } from "./types";

export type PlaybackAction =
  | "play"
  | "stop"
  | "next"
  | "prev"
  | "speed"
  | "bookmark-toggle"   // 🔖 click: save bookmark if none, jump to bookmark if exists
  | "bookmark-clear"    // 🔖 right-click/contextmenu: clear bookmark
  | "bookmark-list"     // 📋 click: open all-bookmarks modal
  | "bookmark-resume";  // static "🔖 Resume" click when idle

export class PlaybackView {
  // Main playback bar — visible during play / pause
  private playbackEl: HTMLElement;
  // Static "🔖 Resume" pill — visible when idle and current note has a bookmark
  private resumeEl: HTMLElement;

  private visible = false;
  private _hasBookmark = false;

  private prevBtn: HTMLElement;
  private playPauseBtn: HTMLElement;
  private nextBtn: HTMLElement;
  private stopBtn: HTMLElement;
  private speedBtn: HTMLElement;
  private progressEl: HTMLElement;
  private bookmarkBtn: HTMLElement;
  private bookmarkListBtn: HTMLElement;

  private actionCallback: ((action: PlaybackAction) => void) | null = null;

  /**
   * @param playbackItem  Status-bar item for the full playback controls
   * @param resumeItem    Status-bar item for the idle "🔖 Resume" pill
   */
  constructor(playbackItem: HTMLElement, resumeItem: HTMLElement) {
    // ── Playback bar ──────────────────────────────────────────────────
    this.playbackEl = playbackItem;
    this.playbackEl.addClass("local-tts-status-bar");
    this.playbackEl.addClass("local-tts-hidden");

    this.prevBtn      = this.mkBtn(this.playbackEl, "⏮", "Previous sentence");
    this.playPauseBtn = this.mkBtn(this.playbackEl, "▶",  "Play / pause");
    this.nextBtn      = this.mkBtn(this.playbackEl, "⏭", "Next sentence");
    this.stopBtn      = this.mkBtn(this.playbackEl, "⏹", "Stop");

    this.playbackEl.createSpan({ cls: "local-tts-separator", text: " | " });

    this.speedBtn = this.playbackEl.createEl("span", {
      cls: "local-tts-speed-btn",
      text: "1.0x",
    });
    this.speedBtn.title = "Change speed";
    this.speedBtn.addEventListener("click", () => this.actionCallback?.("speed"));

    this.playbackEl.createSpan({ cls: "local-tts-separator", text: " | " });
    this.progressEl = this.playbackEl.createSpan({ cls: "local-tts-progress", text: "0/0" });

    this.playbackEl.createSpan({ cls: "local-tts-separator", text: " | " });

    // 🔖 bookmark button
    this.bookmarkBtn = this.playbackEl.createEl("span", {
      cls: "local-tts-btn local-tts-bookmark-btn",
      text: "🔖",
    });
    this.bookmarkBtn.title = "Save bookmark (right-click: clear)";
    this.bookmarkBtn.addEventListener("click", () => this.actionCallback?.("bookmark-toggle"));
    this.bookmarkBtn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.actionCallback?.("bookmark-clear");
    });

    this.playbackEl.createSpan({ cls: "local-tts-separator", text: " " });

    // 📋 bookmark list button
    this.bookmarkListBtn = this.playbackEl.createEl("span", {
      cls: "local-tts-btn local-tts-bookmark-list-btn",
      text: "📋",
    });
    this.bookmarkListBtn.title = "Show all bookmarks";
    this.bookmarkListBtn.addEventListener("click", () => this.actionCallback?.("bookmark-list"));

    // Wire playback controls
    this.prevBtn.addEventListener("click",      () => this.actionCallback?.("prev"));
    this.playPauseBtn.addEventListener("click", () => this.actionCallback?.("play"));
    this.nextBtn.addEventListener("click",      () => this.actionCallback?.("next"));
    this.stopBtn.addEventListener("click",      () => this.actionCallback?.("stop"));

    // ── Static resume pill (idle state) ──────────────────────────────
    this.resumeEl = resumeItem;
    this.resumeEl.addClass("local-tts-resume-pill");
    this.resumeEl.addClass("local-tts-hidden");
    this.resumeEl.setText("🔖 Resume");
    this.resumeEl.title = "Resume reading from bookmark";
    this.resumeEl.addEventListener("click", () => this.actionCallback?.("bookmark-resume"));
  }

  private mkBtn(parent: HTMLElement, icon: string, title: string): HTMLElement {
    const btn = parent.createEl("span", { cls: "local-tts-btn", text: icon });
    btn.title = title;
    return btn;
  }

  onAction(callback: (action: PlaybackAction) => void): void {
    this.actionCallback = callback;
  }

  // ─── State updates ────────────────────────────────────────────────────────

  update(state: PlaybackState): void {
    if (state.isPlaying || state.isPaused) {
      this.showPlayback();
    } else {
      this.hidePlayback();
      return;
    }
    this.playPauseBtn.textContent = state.isPaused ? "▶" : "⏸";
    this.progressEl.textContent   = `${state.currentSentenceIndex + 1}/${state.totalSentences}`;
  }

  updateSpeed(speed: number): void {
    this.speedBtn.textContent = `${speed.toFixed(2).replace(/\.?0+$/, "")}x`;
  }

  /**
   * Update the 🔖 button style.
   * - `hasBookmark = true`  → filled / accent colour, title says "Jump to bookmark"
   * - `hasBookmark = false` → normal, title says "Save bookmark here"
   */
  setBookmarkState(hasBookmark: boolean): void {
    this._hasBookmark = hasBookmark;
    if (hasBookmark) {
      this.bookmarkBtn.addClass("has-bookmark");
      this.bookmarkBtn.title = "Jump to bookmark (right-click: clear)";
    } else {
      this.bookmarkBtn.removeClass("has-bookmark");
      this.bookmarkBtn.title = "Save bookmark here (right-click: clear)";
    }
  }

  /**
   * Show or hide the static "🔖 Resume" pill (visible only when NOT playing).
   * Automatically hidden when the playback bar is shown.
   */
  setResumeVisible(visible: boolean): void {
    if (visible) {
      this.resumeEl.removeClass("local-tts-hidden");
    } else {
      this.resumeEl.addClass("local-tts-hidden");
    }
  }

  // ─── Visibility ───────────────────────────────────────────────────────────

  private showPlayback(): void {
    if (!this.visible) {
      this.playbackEl.removeClass("local-tts-hidden");
      this.visible = true;
    }
    // Hide resume pill while playback bar is active
    this.resumeEl.addClass("local-tts-hidden");
  }

  private hidePlayback(): void {
    if (this.visible) {
      this.playbackEl.addClass("local-tts-hidden");
      this.visible = false;
    }
  }

  /** @deprecated use setResumeVisible + setBookmarkState instead */
  setBookmarkVisible(_visible: boolean): void { /* kept for compat */ }

  show(): void  { this.showPlayback(); }
  hide(): void  { this.hidePlayback(); }

  destroy(): void {
    this.playbackEl.empty();
    this.resumeEl.empty();
  }
}
