import { App, MarkdownView } from "obsidian";
import {
  EditorView,
  Decoration,
  DecorationSet,
} from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";

// StateEffect：更新高亮范围
export const setHighlightEffect = StateEffect.define<{
  from: number;
  to: number;
} | null>();

// StateField：存储当前高亮 DecorationSet
export const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setHighlightEffect)) {
        if (effect.value === null) {
          decorations = Decoration.none;
        } else {
          const mark = Decoration.mark({
            class: "local-tts-highlight",
          });
          decorations = Decoration.set([mark.range(effect.value.from, effect.value.to)]);
        }
      }
    }
    return decorations;
  },
  provide(field) {
    return EditorView.decorations.from(field);
  },
});

export class HighlightManager {
  constructor(private app: App) {}

  /** Always get the fresh EditorView — never cache. */
  private getEditorView(): EditorView | null {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return null;
    const cmView = (view.editor as unknown as { cm: EditorView }).cm;
    return cmView ?? null;
  }

  /**
   * Clear old highlight, apply new highlight, then scroll sentence into view.
   */
  highlight(
    lineStart: number,
    lineEnd: number,
    charStart: number,
    charEnd: number,
    autoScroll: boolean
  ): void {
    try {
      const cmView = this.getEditorView();
      if (!cmView) return;

      const doc = cmView.state.doc;
      const totalLines = doc.lines;

      const safeLineStart = Math.max(1, Math.min(lineStart + 1, totalLines));
      const safeLineEnd   = Math.max(1, Math.min(lineEnd   + 1, totalLines));

      const startLine = doc.line(safeLineStart);
      const endLine   = doc.line(safeLineEnd);

      const from = Math.min(startLine.from + charStart, startLine.to);
      const to   = Math.min(endLine.from   + charEnd,   endLine.to);

      const range = (from < to)
        ? { from, to }
        : { from: startLine.from, to: startLine.to };

      // Dispatch highlight + optional scroll in one transaction
      const effects: StateEffect<unknown>[] = [setHighlightEffect.of(range)];
      if (autoScroll) {
        effects.push(EditorView.scrollIntoView(range.from));
      }

      cmView.dispatch({ effects });
    } catch {
      // Editor may have closed — ignore silently
    }
  }

  /** Clear all highlights. */
  clear(): void {
    try {
      const cmView = this.getEditorView();
      if (!cmView) return;
      cmView.dispatch({ effects: setHighlightEffect.of(null) });
    } catch {
      // ignore
    }
  }
}
