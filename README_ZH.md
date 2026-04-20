🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — 让 Obsidian 开口说话

完全离线的神经网络 TTS 插件，不需要 API Key，不需要联网（首次下载模型后），没有任何订阅费用。

## 功能亮点

- 🔇 **纯离线运行** — 模型下载到本地后，后续完全不需要网络
- 🧠 **神经网络语音** — 基于 Kokoro-82M（8200万参数），音质比传统 TTS 好很多
- 📝 **懂 Markdown** — 代码块、frontmatter、链接、标签、数学公式、注释全部自动跳过，只读正文
- ✨ **实时高亮** — 当前读到哪句，编辑器里就高亮哪句
- 📍 **自动跟随** — 读到哪滚到哪，不用手动翻
- 🔖 **随时续读** — 暂停/停止时自动打书签，下次一键接着读
- ⚡ **流式播放** — 不用等全部生成，边生成边播放
- 🎛️ **播放控制** — 播放/暂停、跳句、调速（0.5×–2.0×），状态栏随手可达
- 🗣️ **7种音色** — 美式/英式英语，男声女声各选
- 🖥️ **桌面端专属** — macOS / Windows / Linux，需要 Node.js

## 截图

### 朗读中（含句子高亮）
![Reading](screenshots/1.png)

### 设置页面
![Settings](screenshots/2.png)

### 命令面板
![Commands](screenshots/3.png)

### 播放控制条
![Controls](screenshots/4.png)

### 书签管理
![Bookmarks](screenshots/5.png)

## 运行环境

- **Obsidian 桌面版**（不支持移动端）
- **Node.js ≥ 18**（插件依赖独立的 Node 进程做推理）
  - macOS / Linux：推荐用 [nvm](https://github.com/nvm-sh/nvm) 或 Homebrew 装
  - Windows：去 [nodejs.org](https://nodejs.org) 下载安装包
- 磁盘空间：默认 q8 模型约 90 MB
- 联网：仅首次下载模型时需要，之后完全离线

## 安装方式

### 方式一：通过 BRAT 安装（推荐）

1. 先在「设置 → 第三方插件」中搜索并安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 打开「设置 → BRAT → Add Beta Plugin」
3. 输入 `applefavorite/obsidian-local-tts`
4. 在「第三方插件」中启用 Local TTS
5. 后续更新由 BRAT 自动处理，省心省力

### 方式二：手动安装

1. 从 [Releases](https://github.com/applefavorite/obsidian-local-tts/releases) 下载 `main.js`、`styles.css`、`manifest.json` 和 `server/` 文件夹
2. 整体复制到 `<你的 vault>/.obsidian/plugins/obsidian-local-tts/`
3. 在「设置 → 第三方插件」里启用 **Local TTS**

首次加载时插件会自动跑 `npm install` 安装 `kokoro-js`。

### 方式三：社区插件市场（即将上线）

在「设置 → 第三方插件 → 浏览」中搜索「Local TTS」（审核中，敬请期待）。

### 首次使用流程

1. 打开「设置 → Local TTS」
2. **Server Dependencies** 显示 ✅ 就行；显示 ❌ 就点 **Install Dependencies**
3. TTS 服务器会自动启动，状态栏显示 ✅ Running
4. 首次启动会从 HuggingFace 下载 Kokoro 模型（~90 MB），视网速需要 1–3 分钟
5. 状态变成 **model ready** 后，打开任意笔记，按 `Cmd/Ctrl + Shift + L` 就能开始

## 怎么用

1. 点击左侧边栏的 **🔊 图标**，或者按 `Cmd/Ctrl + Shift + L`
2. 弹出选择框，选从哪开始：**开头 / 光标位置 / 上次书签**
3. 底部状态栏控制播放

| 操作 | 方式 |
|------|------|
| 朗读当前笔记 | `Cmd/Ctrl + Shift + L` 或点左侧 🔊 |
| 朗读选中文字 | 选中 → 右键 → Read selection aloud |
| 暂停 / 继续 | `Cmd/Ctrl + Shift + P` 或状态栏 ⏸ |
| 停止 | `Cmd/Ctrl + Shift + S` 或状态栏 ⏹ |
| 从书签继续 | `Cmd/Ctrl + Shift + R` 或状态栏 🔖 Resume |

## 快捷键

| 功能 | 默认快捷键 |
|------|-----------|
| 朗读当前笔记 | `Cmd/Ctrl + Shift + L` |
| 暂停 / 继续 | `Cmd/Ctrl + Shift + P` |
| 停止 | `Cmd/Ctrl + Shift + S` |
| 从书签继续 | `Cmd/Ctrl + Shift + R` |
| 下一句 | 可在快捷键设置里自定义 |
| 上一句 | — |
| 加速 +0.25× | — |
| 减速 −0.25× | — |
| 查看全部书签 | — |
| 清除当前笔记书签 | — |

## 从哪里开始读

按 `Cmd/Ctrl + Shift + L` 后会弹出选择框：

- **From beginning** — 从第一句开始
- **From cursor** — 从光标所在的那句开始
- **From bookmark** — 从上次停下来的地方接着读（有书签时才显示）

## 书签系统

- 暂停或停止时**自动打书签**，不用手动操作
- 有书签的笔记，状态栏会常驻显示 **🔖 Resume** 按钮
- 朗读中点 🔖 按钮 → 跳到书签位置
- 右键点 🔖 → 清除书签
- 点 📋 → 看全库所有书签

## 可用音色

| 音色 ID | 说明 |
|---------|------|
| af_sky（默认） | 美式英语女声 Sky |
| af_bella | 美式英语女声 Bella |
| af_nicole | 美式英语女声 Nicole |
| am_adam | 美式英语男声 Adam |
| am_michael | 美式英语男声 Michael |
| bf_emma | 英式英语女声 Emma |
| bm_george | 英式英语男声 George |

## 设置说明

### TTS 服务器

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| Server Dependencies | — | 依赖状态 + 一键安装按钮 |
| Server Status | — | 实时轮询服务器/模型状态 |
| Auto-start server | 开 | 插件加载时自动启动服务器 |
| Server Port | 19199 | 有端口冲突时改这里 |
| Node.js Path | 自动检测 | 检测失败时手动填路径 |
| Model Quantization | q8（~90 MB） | q4 更快更小，fp32 质量最好 |

### 声音与播放

| 配置项 | 默认值 |
|--------|--------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | 开 |
| Highlight current sentence | 开 |
| Highlight color | 黄色 30% |

### 内容过滤（默认全开）

跳过代码块 · frontmatter · 注释 · 脚注 · URL · 标签 · 数学公式

## 已知限制

- **仅桌面端** — 依赖 Node.js 原生模块，Obsidian 移动端不支持
- **需要 Node.js** — 推理跑在独立的 Node 进程里，不在 Electron renderer 里
- **首次需联网** — 模型从 HuggingFace 下载，之后完全离线
- **macOS + nvm** — 如果自动检测 Node 失败，在设置里手动填路径（如 `~/.nvm/versions/node/v20.20.2/bin/node`）
- **仅源码编辑器** — 句子高亮只在 Markdown 编辑模式下生效，阅读视图暂不支持

## 常见问题

**状态栏没东西？**
朗读状态栏只有在播放/暂停时才显示。🔖 Resume 只在当前笔记有书签且没在播放时显示。

**服务器一直显示未运行？**
进「设置 → Local TTS」点 Start Server。检查一下 Node.js Path，点 Detect 让它自动找。

**提示找不到 node？**
确认 Node.js ≥ 18 已安装，再点设置里的 **Detect**，或者直接把路径粘进去（比如 `/Users/xxx/.nvm/versions/node/v20.20.2/bin/node`）。

**模型下载很慢或中断？**
HuggingFace 国内访问有时不稳定。重启服务器可以断点续传。

**音频卡顿？**
试试在设置里把并发预生成数从 3 改成 1，或者换 q4 量化。

**高亮不动了？**
确认你在源码编辑模式（不是阅读视图）。还有问题就禁用再重新启用插件。

---

> 喜欢离线 TTS？也看看 App Store 上的 **PaperVoice** —— 专为学术论文打造的 AI 朗读 PDF 应用。

## 支持一下

如果这个插件帮到了你，请我喝杯咖啡吧 ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## License

MIT © 2025 applefavorite
