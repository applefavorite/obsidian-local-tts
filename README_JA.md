🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — ノートを音声で読み上げる

Obsidian 向けの高品質オフライン音声合成プラグインです。API キーなし、サブスクリプションなし、初回以降のインターネット接続も不要です。

## 主な機能

- 🔇 **完全オフライン動作** — 初回のモデルダウンロード後は、ネット接続なしで使えます
- 🧠 **ニューラル TTS** — Kokoro-82M（8,200 万パラメータ）による自然な読み上げ
- 📝 **Markdown を理解** — コードブロック・frontmatter・URL・タグ・数式・コメントを自動でスキップします
- ✨ **文章ハイライト** — 読んでいる文章がエディタでリアルタイムに強調表示されます
- 📍 **自動スクロール** — 読み上げに合わせてエディタが自動でスクロールします
- 🔖 **しおりと再開** — 一時停止・停止時に位置を自動保存。続きからすぐ再開できます
- ⚡ **ストリーミング再生** — 次の文章を先読みしながら、即座に再生を開始します
- 🎛️ **柔軟な操作** — 再生/一時停止・文章スキップ・速度調整（0.5×〜2.0×）をステータスバーから操作できます
- 🗣️ **7 種類の音声** — 米国英語・英国英語、男性・女性
- 🖥️ **デスクトップ専用** — macOS・Windows・Linux（Node.js が必要です）

## スクリーンショット

### 読み上げ中（文章ハイライトあり）
![Reading](screenshots/1.png)

### 設定画面
![Settings](screenshots/2.png)

### コマンド一覧
![Commands](screenshots/3.png)

### 再生コントロール
![Controls](screenshots/4.png)

### しおり一覧
![Bookmarks](screenshots/5.png)

## 動作環境

- **Obsidian デスクトップ版**（モバイルは非対応）
- **Node.js 18 以上** — 音声推論は Electron の外で独立した Node プロセスとして動作します
  - macOS / Linux：[nvm](https://github.com/nvm-sh/nvm) または Homebrew でのインストールを推奨
  - Windows：[nodejs.org](https://nodejs.org) からインストーラーをダウンロード
- ディスク空き容量：デフォルトモデル（q8）で約 90 MB
- インターネット接続：初回のモデルダウンロード時のみ必要

## インストール方法

### 方法 1：BRAT 経由（おすすめ）

1. Obsidian のコミュニティプラグインから [BRAT](https://github.com/TfTHacker/obsidian42-brat) をインストール
2. 設定 → BRAT → Add Beta Plugin を開く
3. `applefavorite/obsidian-local-tts` と入力
4. コミュニティプラグイン設定で Local TTS を有効化
5. 以降のアップデートは BRAT が自動で処理します

### 方法 2：手動インストール

1. [最新リリース](https://github.com/applefavorite/obsidian-local-tts/releases) から `main.js`・`styles.css`・`manifest.json`・`server/` フォルダをダウンロード
2. `<vault>/.obsidian/plugins/obsidian-local-tts/` にすべてコピー
3. 設定 → コミュニティプラグイン で **Local TTS** を有効化

初回ロード時に、プラグインが自動で `npm install`（`kokoro-js` のインストール）を実行します。

### 方法 3：コミュニティプラグイン（近日公開）

設定 → コミュニティプラグイン → 閲覧 で「Local TTS」を検索（現在審査中です）。

### 初回セットアップ

1. 設定 → Local TTS を開く
2. **Server Dependencies** が ✅ になっていることを確認（❌ の場合は **Install Dependencies** をクリック）
3. TTS サーバーが自動起動します（Server Status: ✅ Running）
4. 初回のみ HuggingFace から Kokoro モデル（約 90 MB）をダウンロードします（1〜3 分程度）
5. **model ready** と表示されたら準備完了です

## 使い方

1. 左サイドバーの **🔊 アイコン** をクリック、または `Cmd/Ctrl + Shift + L` を押す
2. 開始位置を選択：**最初から** / **カーソル位置から** / **しおりの続きから**
3. **ステータスバー** から再生を操作する

| 操作 | 方法 |
|------|------|
| 現在のノートを読み上げ | `Cmd/Ctrl + Shift + L`、またはサイドバーの 🔊 |
| 選択テキストを読み上げ | テキスト選択 → 右クリック → Read selection aloud |
| 一時停止 / 再開 | `Cmd/Ctrl + Shift + P`、またはステータスバーの ⏸ |
| 停止 | `Cmd/Ctrl + Shift + S`、またはステータスバーの ⏹ |
| しおりから再開 | `Cmd/Ctrl + Shift + R`、またはステータスバーの 🔖 Resume |

## キーボードショートカット

| コマンド | デフォルト |
|---------|----------|
| ノートを読み上げ | `Cmd/Ctrl + Shift + L` |
| 一時停止 / 再開 | `Cmd/Ctrl + Shift + P` |
| 停止 | `Cmd/Ctrl + Shift + S` |
| しおりから再開 | `Cmd/Ctrl + Shift + R` |
| 次の文章 | —（ホットキー設定で割り当て可能） |
| 前の文章 | — |
| 速度アップ (+0.25×) | — |
| 速度ダウン (−0.25×) | — |
| しおり一覧を表示 | — |
| しおりを削除 | — |

## 開始位置の選択

`Cmd/Ctrl + Shift + L` を押すと、開始位置を選ぶダイアログが表示されます。

- **From beginning** — ノートの最初から
- **From cursor** — カーソルのある文章から
- **From bookmark** — 前回停止した位置から（しおりがある場合のみ表示）

## しおり機能

- 一時停止・停止のたびに**自動的にしおりが保存**されます
- しおりがあるノートを開いているとき、ステータスバーに **🔖 Resume** カプセルが表示されます
- 再生中に 🔖 をクリック → しおりの位置にジャンプ
- 🔖 を右クリック → しおりを削除
- 📋 をクリック → vault 内のすべてのしおりを一覧表示

## 音声一覧

| 音声 | 説明 |
|------|------|
| af_sky（デフォルト） | 米国英語・女性 — Sky |
| af_bella | 米国英語・女性 — Bella |
| af_nicole | 米国英語・女性 — Nicole |
| am_adam | 米国英語・男性 — Adam |
| am_michael | 米国英語・男性 — Michael |
| bf_emma | 英国英語・女性 — Emma |
| bm_george | 英国英語・男性 — George |

## 設定リファレンス

### TTS サーバー

| 項目 | デフォルト | 説明 |
|------|----------|------|
| Server Dependencies | — | 依存関係のインストール状態を表示 |
| Server Status | — | サーバー・モデルの状態をリアルタイム表示 |
| Auto-start server | オン | プラグイン読み込み時に自動起動 |
| Server Port | 19199 | ポート競合がある場合に変更 |
| Node.js Path | 自動検出 | 検出に失敗した場合は手動入力 |
| Model Quantization | q8（約 90 MB） | q4: 高速・軽量 / fp32: 最高品質 |

### 音声・再生

| 項目 | デフォルト |
|------|----------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | オン |
| 現在の文章をハイライト | オン |
| ハイライトカラー | 黄色 30% |

### コンテンツフィルター（すべてデフォルトでオン）

コードブロック・frontmatter・コメント・脚注・URL・ハッシュタグ・数式ブロックをスキップ

## 既知の制限事項

- **デスクトップ専用** — Obsidian Mobile には Node.js ネイティブバイナリが含まれないため非対応
- **Node.js が必須** — 音声推論は Electron のレンダラー外で Node.js プロセスとして実行されます
- **初回のみネット接続が必要** — Kokoro モデルは HuggingFace から一度だけダウンロードされます
- **nvm 環境** — ログインシェル経由で Node.js を自動検出します。失敗した場合は設定でパスを手動入力してください
- **ソースエディタのみ対応** — 文章ハイライトはプレビュー（読み取り専用）表示では動作しません

## よくある質問

**ステータスバーに何も表示されない。**
再生コントロールは再生中・一時停止中のみ表示されます。🔖 Resume はしおりがある場合のみ表示されます。

**サーバーが「未起動」のままになる。**
設定 → Local TTS → Start Server をクリックしてください。Node.js Path 欄で **Detect** を試してみてください。

**「node が見つかりません」というエラーが出る。**
Node.js 18 以上をインストール後、設定の **Detect** ボタンを押すか、パスを直接入力してください（例：`~/.nvm/versions/node/v20.20.2/bin/node`）。

**モデルのダウンロードが途中で止まる。**
HuggingFace へのアクセスが不安定な場合があります。サーバーを再起動すると続きからダウンロードされます。

**音声が途切れる。**
設定の並行プリジェネレーション数を減らす（デフォルト 3 → 1）か、q4 量化モデルに切り替えてみてください。

**ハイライトが最初の文章で止まってしまう。**
プレビューモードではなくソースエディタを使用しているか確認してください。それでも解決しない場合は、プラグインを一度無効化して再度有効化してください。

---

> オフライン TTS が気に入りましたか？ App Store の **PaperVoice** もぜひチェックしてみてください — 論文に特化した AI PDF リーダーです。

## サポート

このプラグインが役に立ちましたら、コーヒー一杯分のご支援をいただけると嬉しいです ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## ライセンス

MIT © 2025 applefavorite
