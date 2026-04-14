🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — 朗读你的笔记

为 Obsidian 提供高质量的**离线**神经文字转语音功能。无需 API 密钥，无需网络（首次运行后），无需订阅。

## 功能特性

- 🔇 **100% 离线** — 首次下载模型后，完全在本机运行
- 🧠 **神经网络品质** — 基于 Kokoro-82M，最先进的 8200 万参数 TTS 模型
- 📝 **智能 Markdown 解析** — 自动跳过代码块、frontmatter、URL、标签、数学公式、注释
- ✨ **句子高亮** — 编辑器实时高亮当前正在朗读的句子
- 📍 **自动滚动** — 编辑器自动滚动，始终保持当前句子可见
- 🔖 **书签与续读** — 暂停或停止时自动保存位置，随时继续
- ⚡ **流式播放** — 音频立即开始，同时预生成后续句子
- 🎛️ **播放控制** — 播放/暂停、跳句、可变速度（0.5×–2.0×）
- 🗣️ **7 种音色** — 美式英语与英式英语，男声女声
- 🖥️ **仅限桌面端** — macOS、Windows、Linux（需要 Electron / Node.js）

## 截图

### 句子高亮朗读
![Reading](screenshots/1.png)

### 设置页面
![Settings](screenshots/2.png)

### 命令面板
![Commands](screenshots/3.png)

### 播放控制条
![Controls](screenshots/4.png)

### 书签管理
![Bookmarks](screenshots/5.png)

## 系统要求

- **Obsidian 桌面版**（不支持移动端）
- **Node.js ≥ 18** 已安装
  - macOS / Linux：通过 [nvm](https://github.com/nvm-sh/nvm) 或 [Homebrew](https://brew.sh) 安装
  - Windows：从 [nodejs.org](https://nodejs.org) 下载
- 约 90 MB 磁盘空间（默认模型）
- 仅首次下载模型时需要联网（之后完全离线）

## 安装

### 手动安装（社区插件审核通过前）

1. 从[最新版本](https://github.com/applefavorite/obsidian-local-tts/releases)下载 `main.js`、`styles.css`、`manifest.json` 和 `server/` 文件夹。
2. 将所有文件复制到 `<vault>/.obsidian/plugins/obsidian-local-tts/`。
3. 在设置 → 第三方插件中启用 **Local TTS**。

插件首次加载时会自动安装服务器依赖（`kokoro-js`）。

### 首次使用检查清单

1. 打开设置 → Local TTS。
2. 确认 **Server Dependencies** 显示 ✅。若不显示，点击 **Install Dependencies**。
3. TTS 服务器会自动启动（Server Status 显示 ✅ Running）。
4. 首次启动时会从 HuggingFace 下载 Kokoro 模型（约 90 MB），视网络速度需 1–3 分钟。
5. 状态显示 **model ready** 后，打开任意笔记，按 `Cmd/Ctrl + Shift + L`。

## 使用方法

| 操作 | 方式 |
|------|------|
| 朗读当前笔记 | `Cmd/Ctrl + Shift + L` 或点击侧边栏 🔊 图标 |
| 朗读选中文字 | 选中文字 → 右键 → Read selection aloud |
| 暂停 / 继续 | `Cmd/Ctrl + Shift + P` 或点击状态栏 ⏸ |
| 停止 | `Cmd/Ctrl + Shift + S` 或点击状态栏 ⏹ |
| 从书签继续 | `Cmd/Ctrl + Shift + R` 或点击状态栏 "🔖 Resume" |

## 键盘快捷键

| 命令 | 默认快捷键 |
|------|-----------|
| 朗读当前笔记 | `Cmd/Ctrl + Shift + L` |
| 暂停 / 继续 | `Cmd/Ctrl + Shift + P` |
| 停止朗读 | `Cmd/Ctrl + Shift + S` |
| 从书签继续 | `Cmd/Ctrl + Shift + R` |
| 下一句 | —（可在快捷键设置中分配） |
| 上一句 | — |
| 加速（+0.25×） | — |
| 减速（−0.25×） | — |
| 显示所有书签 | — |
| 清除当前笔记书签 | — |

## 朗读起点选择

按 `Cmd/Ctrl + Shift + L` 时，会弹出选择框：

- **From beginning** — 从第 1 句开始
- **From cursor** — 从光标所在句子开始
- **From bookmark**（若存在）— 从上次停止的位置继续

## 书签系统

- 每次暂停或停止时，书签会**自动保存**当前位置。
- 书签存储句子索引和预览文字。
- 未播放时，状态栏显示 **🔖 Resume** 胶囊按钮（当前笔记有书签时）。
- 播放中点击 🔖 可跳转到书签位置。
- 右键点击 🔖 可清除书签。
- 点击 📋 查看全库所有书签。

## 音色列表

| 音色 | 描述 |
|------|------|
| af_sky（默认） | 美式英语女声 — Sky |
| af_bella | 美式英语女声 — Bella |
| af_nicole | 美式英语女声 — Nicole |
| am_adam | 美式英语男声 — Adam |
| am_michael | 美式英语男声 — Michael |
| bf_emma | 英式英语女声 — Emma |
| bm_george | 英式英语男声 — George |

## 设置说明

### TTS 服务器
| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| Server Dependencies | — | 显示依赖安装状态；提供安装按钮 |
| Server Status | — | 实时轮询；显示模型加载进度 |
| Auto-start server | 开启 | 插件加载时自动启动服务器 |
| Server Port | 19199 | 端口冲突时修改 |
| Node.js Path | 自动检测 | 自动检测失败时手动设置 |
| Model Quantization | q8（约 90 MB）| q4 = 更快/更小；fp32 = 最高质量 |

### 声音与播放
| 设置项 | 默认值 |
|--------|--------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | 开启 |
| Highlight current sentence | 开启 |
| Highlight color | 黄色 30% |

### 内容过滤（默认全部开启）
跳过代码块 · 跳过 frontmatter · 跳过注释 · 跳过脚注 · 跳过 URL · 跳过标签 · 跳过数学公式

## 已知限制

- **仅限桌面端** — ONNX Runtime 需要 Node.js 原生二进制，Obsidian 移动端不支持。
- **需要 Node.js** — 推理服务器作为独立 Node.js 进程运行。
- **首次联网** — Kokoro 模型仅在首次使用时从 HuggingFace 下载。
- **macOS Gatekeeper** — 若 Node.js 通过 nvm 安装，插件会通过登录 Shell 自动检测；若检测失败，请在设置中手动设置路径。
- **仅源码视图** — 句子高亮仅在 Markdown 源码编辑器中有效，阅读视图不支持。

## 常见问题

**状态栏没有任何显示。**
播放控制条仅在朗读时显示。🔖 Resume 胶囊按钮仅在当前笔记有书签且未播放时显示。

**服务器一直显示"未运行"。**
前往设置 → Local TTS → 点击 Start Server。检查 Node.js Path 设置，点击 Detect 自动检测。

**提示"找不到 node"。**
安装 Node.js（≥ 18），然后在设置中点击 **Detect**，或手动粘贴路径（如 `/Users/you/.nvm/versions/node/v20.20.2/bin/node`）。

**模型下载缓慢或失败。**
约 90 MB 模型从 HuggingFace 下载。若超时，重启服务器后会自动续传。

**音频断断续续。**
在设置 → 高级中降低预生成并发数（默认 3），或尝试更快的量化方案（q4）。

**高亮卡在第一句不动。**
请确认使用的是源码编辑器（非阅读视图）。若问题持续，尝试禁用后重新启用插件。

---

> 喜欢离线 TTS？试试 App Store 上的 **PaperVoice** — 专为学术论文设计的 AI 驱动 PDF 朗读应用。

## 支持作者

如果这个插件对你有帮助，欢迎请我喝杯咖啡 ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## 许可证

MIT © 2025 applefavorite
