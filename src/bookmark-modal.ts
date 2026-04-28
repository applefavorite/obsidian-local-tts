import { App, Modal, SuggestModal } from "obsidian";
import type LocalTTSPlugin from "./main";

// ─── 朗读起点选择 Modal ──────────────────────────────────────────────────────

interface ReadOption {
  label: string;
  description: string;
  startIndex: number;
}

export class ReadStartModal extends SuggestModal<ReadOption> {
  constructor(
    app: App,
    private options: ReadOption[],
    private onChoose: (startIndex: number) => void
  ) {
    super(app);
    this.setPlaceholder("Choose where to start reading…");
  }

  getSuggestions(_query: string): ReadOption[] {
    // Always show all options — no filtering
    return this.options;
  }

  renderSuggestion(option: ReadOption, el: HTMLElement): void {
    el.createDiv({ text: option.label, cls: "suggestion-title" });
    el.createDiv({ text: option.description, cls: "suggestion-note" });
  }

  onChooseSuggestion(option: ReadOption): void {
    this.onChoose(option.startIndex);
  }
}

// ─── 全部书签列表 Modal ──────────────────────────────────────────────────────
export class BookmarkListModal extends Modal {
  constructor(private plugin: LocalTTSPlugin) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("local-tts-bookmark-modal");
    contentEl.createEl("h2", { text: "🔖 Reading bookmarks" });

    const bookmarks = this.plugin.settings.bookmarks;
    const entries = Object.entries(bookmarks).sort(
      ([, a], [, b]) => b.timestamp - a.timestamp
    );

    if (entries.length === 0) {
      contentEl.createEl("p", {
        text: "No bookmarks yet. Bookmarks are saved automatically when you pause or stop reading.",
        cls: "setting-item-description",
      });
      return;
    }

    const list = contentEl.createDiv({ cls: "local-tts-bookmark-list" });

    for (const [filePath, bm] of entries) {
      const item = list.createDiv({ cls: "local-tts-bookmark-item" });

      const info = item.createDiv({ cls: "local-tts-bookmark-info" });
      const fileName = filePath.split("/").pop()?.replace(/\.md$/, "") ?? filePath;
      info.createDiv({ text: fileName, cls: "local-tts-bookmark-filename" });
      info.createDiv({
        text: `Sentence ${bm.sentenceIndex + 1}: "${bm.sentencePreview}"`,
        cls: "local-tts-bookmark-preview",
      });
      info.createDiv({
        text: formatTimestamp(bm.timestamp),
        cls: "local-tts-bookmark-time",
      });

      const actions = item.createDiv({ cls: "local-tts-bookmark-actions" });

      const resumeBtn = actions.createEl("button", { text: "Resume", cls: "mod-cta" });
      resumeBtn.addEventListener("click", () => {
        this.close();
        void this.plugin.openAndResumeFromBookmark(filePath, bm);
      });

      const delBtn = actions.createEl("button", { text: "✕" });
      delBtn.title = "Delete bookmark";
      delBtn.addEventListener("click", () => {
        delete this.plugin.settings.bookmarks[filePath];
        void this.plugin.saveSettings().then(() => {
          item.remove();
          if (Object.keys(this.plugin.settings.bookmarks).length === 0) {
            list.remove();
            contentEl.createEl("p", {
              text: "No bookmarks.",
              cls: "setting-item-description",
            });
          }
        });
      });
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

// ─── helper ─────────────────────────────────────────────────────────────────
function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}
