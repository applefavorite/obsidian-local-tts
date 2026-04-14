🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — ノートを読み上げる

Obsidian 向けの高品質**オフライン**ニューラル音声合成プラグインです。APIキー不要、ネット接続不要（初回以降）、サブスクリプション不要。

## 機能

- 🔇 **完全オフライン** — 初回モデルダウンロード後はすべてローカルで動作
- 🧠 **ニューラル品質** — 最先端の 8,200 万パラメータ TTS モデル Kokoro-82M を使用
- 📝 **スマートな Markdown 解析** — コードブロック・frontmatter・URL・タグ・数式・コメントを自動スキップ
- ✨ **文章ハイライト** — 読み上げ中の文章をエディタでリアルタイムにハイライト
- 📍 **自動スクロール** — 現在の文章が常に画面内に収まるよう自動スクロール
- 🔖 **ブックマークと再開** — 一時停止・停止時に位置を自動保存、いつでも再開可能
- ⚡ **ストリーミング再生** — 次の文章を先読み生成しながら即座に音声再生開始
- 🎛️ **再生コントロール** — 再生/一時停止、文章スキップ、可変速度（0.5×–2.0×）
- 🗣️ **7種類の音声** — アメリカ英語・イギリス英語、男性・女性
- 🖥️ **デスクトップ専用** — macOS、Windows、Linux（Electron / Node.js 必須）

## スクリーンショット

### 文章ハイライトで読み上げ
![Reading](screenshots/1.png)

### 設定画面
![Settings](screenshots/2.png)

### コマンド
![Commands](screenshots/3.png)

### 再生コントロール
![Controls](screenshots/4.png)

### ブックマーク
![Bookmarks](screenshots/5.png)

## 必要環境

- **Obsidian デスクトップ版**（モバイルは非対応）
- **Node.js ≥ 18** がインストール済みであること
  - macOS / Linux：[nvm](https://github.com/nvm-sh/nvm) または [Homebrew](https://brew.sh) でインストール
  - Windows：[nodejs.org](https://nodejs.org) からダウンロード
- デフォルトモデル用に約 90 MB のディスク容量
- インターネット接続は**初回モデルダウンロード時のみ**（以降は完全オフライン）

## インストール

### 手動インストール（コミュニティプラグイン審査承認前）

1. [最新リリース](https://github.com/applefavorite/obsidian-local-tts/releases)から `main.js`、`styles.css`、`manifest.json`、および `server/` フォルダをダウンロード。
2. すべてを `<vault>/.obsidian/plugins/obsidian-local-tts/` にコピー。
3. 設定 → コミュニティプラグインで **Local TTS** を有効化。

初回ロード時にサーバー依存関係（`kokoro-js`）が自動インストールされます。

### 初回起動チェックリスト

1. 設定 → Local TTS を開く。
2. **Server Dependencies** が ✅ を表示していることを確認。表示されない場合は **Install Dependencies** をクリック。
3. TTS サーバーが自動起動（Server Status に ✅ Running と表示）。
4. 初回起動時に Kokoro モデル（約 90 MB）が HuggingFace からダウンロードされます（接続環境により 1〜3 分）。
5. ステータスが **model ready** になったら、任意のノートを開いて `Cmd/Ctrl + Shift + L` を押す。

## 使い方

| 操作 | 方法 |
|------|------|
| 現在のノートを読み上げ | `Cmd/Ctrl + Shift + L` またはリボンの 🔊 をクリック |
| 選択テキストを読み上げ | テキスト選択 → 右クリック → Read selection aloud |
| 一時停止 / 再開 | `Cmd/Ctrl + Shift + P` またはステータスバーの ⏸ |
| 停止 | `Cmd/Ctrl + Shift + S` またはステータスバーの ⏹ |
| ブックマークから再開 | `Cmd/Ctrl + Shift + R` またはステータスバーの「🔖 Resume」 |

## キーボードショートカット

| コマンド | デフォルトショートカット |
|---------|----------------------|
| 現在のノートを読み上げ | `Cmd/Ctrl + Shift + L` |
| 一時停止 / 再開 | `Cmd/Ctrl + Shift + P` |
| 読み上げ停止 | `Cmd/Ctrl + Shift + S` |
| ブックマークから再開 | `Cmd/Ctrl + Shift + R` |
| 次の文章 | —（ホットキー設定で割り当て可能） |
| 前の文章 | — |
| 速度アップ（+0.25×） | — |
| 速度ダウン（−0.25×） | — |
| すべてのブックマークを表示 | — |
| 現在のノートのブックマークを削除 | — |

## 読み上げ開始位置の選択

`Cmd/Ctrl + Shift + L` を押すと選択ダイアログが表示されます：

- **From beginning** — 最初の文章から開始
- **From cursor** — カーソルがある文章から開始
- **From bookmark**（存在する場合） — 最後に停止した位置から再開

## ブックマークシステム

- 一時停止または停止するたびに、ブックマークが**自動保存**されます。
- 文章インデックスとプレビューテキストを保存。
- アクティブなノートにブックマークがある場合、ステータスバーに **🔖 Resume** カプセルが表示されます。
- 再生中に 🔖 をクリックするとブックマーク位置にジャンプ。
- 🔖 を右クリックするとブックマークを削除。
- 📋 でボルト内のすべてのブックマークを表示。

## 音声一覧

| 音声 | 説明 |
|------|------|
| af_sky（デフォルト） | アメリカ英語 女性 — Sky |
| af_bella | アメリカ英語 女性 — Bella |
| af_nicole | アメリカ英語 女性 — Nicole |
| am_adam | アメリカ英語 男性 — Adam |
| am_michael | アメリカ英語 男性 — Michael |
| bf_emma | イギリス英語 女性 — Emma |
| bm_george | イギリス英語 男性 — George |

## 設定リファレンス

### TTS サーバー
| 設定 | デフォルト | 説明 |
|------|-----------|------|
| Server Dependencies | — | インストール状態を表示；インストールボタン付き |
| Server Status | — | ライブポーリング；モデル読み込み進捗を表示 |
| Auto-start server | オン | プラグインロード時にサーバーを自動起動 |
| Server Port | 19199 | ポート競合時に変更 |
| Node.js Path | 自動検出 | 自動検出失敗時に手動設定 |
| Model Quantization | q8（約 90 MB） | q4 = 高速/小サイズ；fp32 = 最高品質 |

### 音声と再生
| 設定 | デフォルト |
|------|-----------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | オン |
| Highlight current sentence | オン |
| Highlight color | 黄色 30% |

### コンテンツフィルター（デフォルトはすべてオン）
コードブロック · frontmatter · コメント · 脚注 · URL · ハッシュタグ · 数式ブロックをスキップ

## 既知の制限

- **デスクトップ専用** — ONNX Runtime は Obsidian モバイルで利用できない Node.js ネイティブバイナリを必要とします。
- **Node.js 必須** — 推論サーバーは独立した Node.js プロセスとして動作します。
- **初回インターネット接続** — Kokoro モデルは初回使用時のみ HuggingFace からダウンロードされます。
- **macOS Gatekeeper** — Node.js が nvm 経由でインストールされている場合、ログインシェル経由で自動検出します。失敗した場合は設定でパスを手動設定してください。
- **ソースビューのみ** — 文章ハイライトは Markdown ソースエディタのみ対応（リーディングビュー不可）。

## よくある質問

**ステータスバーに何も表示されない。**
再生コントロールバーは読み上げ中のみ表示されます。🔖 Resume カプセルはアクティブなノートにブックマークがある場合のみ表示されます。

**サーバーが「未起動」のままになる。**
設定 → Local TTS → Start Server をクリック。Node.js Path 設定を確認し、Detect ボタンで自動検出を試みてください。

**「node が見つかりません」エラー。**
Node.js（≥ 18）をインストールし、設定の **Detect** をクリックするか、パスを手動入力してください（例：`/Users/you/.nvm/versions/node/v20.20.2/bin/node`）。

**モデルのダウンロードが遅い、または失敗する。**
約 90 MB のモデルを HuggingFace からダウンロードします。タイムアウトした場合はサーバーを再起動してください。自動的に再開されます。

**音声が途切れる。**
設定 → 詳細設定でプリジェネレーション並行数を減らしてください（デフォルト: 3）。または高速な量化モデル（q4）を試してください。

**ハイライトが最初の文章で止まる。**
ソースエディタを使用していることを確認してください（リーディングビューではありません）。問題が続く場合は、プラグインを無効化して再度有効化してください。

---

> オフライン TTS が気に入りましたか？App Store で **PaperVoice** をチェックしてみてください — 学術論文向け AI PDF リーダーです。

## サポート

このプラグインが役立った場合は、コーヒーを奢っていただけると嬉しいです ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## ライセンス

MIT © 2025 applefavorite
