import { App, Notice, PluginSettingTab, Setting, requestUrl } from "obsidian";
import { AVAILABLE_VOICES, LocalTTSSettings } from "./types";
import type LocalTTSPlugin from "./main";

export class LocalTTSSettingTab extends PluginSettingTab {
  plugin: LocalTTSPlugin;
  private serverStatusEl: HTMLElement | null = null;
  private depsStatusEl: HTMLElement | null = null;
  private statusPollTimer: number | null = null;

  constructor(app: App, plugin: LocalTTSPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setName("Local TTS").setHeading();

    // ─── 第一组: TTS 服务器 ───────────────────────────────────────────
    new Setting(containerEl).setName("TTS server").setHeading();

    containerEl.createEl("p", {
      text: "The plugin runs a local Node.js server to do TTS inference outside of Electron's renderer. The server downloads the Kokoro model (~90 MB) on first start.",
      cls: "setting-item-description",
    });

    // ─── Dependencies ─────────────────────────────────────────────────────
    const depsSetting = new Setting(containerEl)
      .setName("Server dependencies")
      .setDesc("kokoro-js must be installed in server/node_modules/ for TTS to work.");

    this.depsStatusEl = depsSetting.settingEl.createDiv({ cls: "local-tts-server-status" });
    this.updateDepsStatus();

    depsSetting.addButton((btn) => {
      btn.setButtonText("Install dependencies").onClick(async () => {
        btn.setDisabled(true);
        btn.setButtonText("Installing…");
        await this.plugin.installServerDeps();
        this.updateDepsStatus();
        btn.setDisabled(false);
        btn.setButtonText("Install dependencies");
      });
    });

    // Server Status
    const statusSetting = new Setting(containerEl)
      .setName("Server status")
      .setDesc("Real-time status of the local TTS server");

    this.serverStatusEl = statusSetting.settingEl.createDiv({
      cls: "local-tts-server-status",
    });
    void this.updateServerStatus();

    // Refresh button
    statusSetting.addButton((btn) =>
      btn.setButtonText("Refresh").onClick(() => { void this.updateServerStatus(); })
    );

    // Start / Stop buttons
    new Setting(containerEl)
      .setName("Server control")
      .setDesc("Start or stop the local TTS server process")
      .addButton((btn) => {
        btn.setButtonText("Start server").setCta().onClick(async () => {
          btn.setDisabled(true);
          await this.plugin.startServer();
          setTimeout(() => {
            btn.setDisabled(false);
            void this.updateServerStatus();
          }, 1500);
        });
      })
      .addButton((btn) => {
        btn.setButtonText("Stop server").setWarning().onClick(() => {
          this.plugin.stopServer();
          setTimeout(() => { void this.updateServerStatus(); }, 500);
        });
      });

    // Server Port
    new Setting(containerEl)
      .setName("Server port")
      .setDesc("Port for the local TTS HTTP server (default: 19199)")
      .addText((text) => {
        text
          .setPlaceholder("19199")
          .setValue(String(this.plugin.settings.serverPort))
          .onChange(async (value) => {
            const port = parseInt(value);
            if (!isNaN(port) && port > 1024 && port < 65536) {
              this.plugin.settings.serverPort = port;
              this.plugin.ttsEngine.updatePort(port);
              await this.plugin.saveSettings();
            }
          });
      });

    // Node.js Path
    new Setting(containerEl)
      .setName("Node.js path")
      .setDesc('Path to the node executable. Leave empty for auto-detect (uses login shell "which node").')
      .addText((text) => {
        text
          .setPlaceholder("(auto-detect)")
          .setValue(this.plugin.settings.nodePath)
          .onChange(async (value) => {
            this.plugin.settings.nodePath = value.trim();
            await this.plugin.saveSettings();
          });
      })
      .addButton((btn) => {
        btn.setButtonText("Detect").onClick(async () => {
          btn.setDisabled(true);
          const found = await this.plugin.detectNodePath();
          if (found) {
            this.plugin.settings.nodePath = found;
            await this.plugin.saveSettings();
            new Notice(`Node.js found: ${found}`);
            this.display(); // re-render
          } else {
            new Notice("Could not auto-detect Node.js. Please set the path manually.");
          }
          btn.setDisabled(false);
        });
      });

    // Auto-start
    new Setting(containerEl)
      .setName("Auto-start server")
      .setDesc("Automatically start the TTS server when the plugin loads")
      .addToggle((t) => {
        t.setValue(this.plugin.settings.autoStartServer);
        t.onChange(async (value) => {
          this.plugin.settings.autoStartServer = value;
          await this.plugin.saveSettings();
        });
      });

    // Model dtype
    new Setting(containerEl)
      .setName("Model quantization")
      .setDesc("q8: ~90 MB (recommended) | q4: ~50 MB (faster) | fp32: ~330 MB (best quality)")
      .addDropdown((dd) => {
        dd.addOption("q8", "q8 — ~90 MB (recommended)");
        dd.addOption("q4", "q4 — ~50 MB (fastest)");
        dd.addOption("fp32", "fp32 — ~330 MB (best quality)");
        dd.setValue(this.plugin.settings.modelDtype);
        dd.onChange(async (value) => {
          this.plugin.settings.modelDtype = value;
          await this.plugin.saveSettings();
          new Notice("Restart the server for the new quantization to take effect.");
        });
      });

    // ─── 第二组: 声音 & 播放 ─────────────────────────────────────────
    new Setting(containerEl).setName("Voice & playback").setHeading();

    new Setting(containerEl)
      .setName("Voice")
      .setDesc("Select the TTS voice")
      .addDropdown((dd) => {
        for (const voice of AVAILABLE_VOICES) {
          dd.addOption(voice.id, voice.name);
        }
        dd.setValue(this.plugin.settings.voiceId);
        dd.onChange(async (value) => {
          this.plugin.settings.voiceId = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Speed")
      .setDesc("Playback speed (0.5x – 2.0x)")
      .addSlider((slider) => {
        slider
          .setLimits(0.5, 2.0, 0.25)
          .setValue(this.plugin.settings.speed)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.speed = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Auto-scroll")
      .setDesc("Automatically scroll to the current sentence while reading")
      .addToggle((t) => {
        t.setValue(this.plugin.settings.autoScrollToSentence);
        t.onChange(async (value) => {
          this.plugin.settings.autoScrollToSentence = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Highlight current sentence")
      .setDesc("Highlight the sentence being read in the editor")
      .addToggle((t) => {
        t.setValue(this.plugin.settings.highlightCurrentSentence);
        t.onChange(async (value) => {
          this.plugin.settings.highlightCurrentSentence = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Highlight color")
      .setDesc("CSS color value for sentence highlight")
      .addText((text) => {
        text
          .setPlaceholder("rgba(255, 208, 0, 0.3)")
          .setValue(this.plugin.settings.highlightColor)
          .onChange(async (value) => {
            this.plugin.settings.highlightColor = value;
            document.documentElement.style.setProperty("--local-tts-highlight-color", value);
            await this.plugin.saveSettings();
          });
      });

    // ─── 第三组: 内容过滤 ─────────────────────────────────────────────
    new Setting(containerEl).setName("Content filtering").setHeading();

    const toggleSettings: Array<{ key: keyof LocalTTSSettings; name: string; desc: string }> = [
      { key: "skipCodeBlocks", name: "Skip code blocks", desc: "Don't read code blocks and inline code" },
      { key: "skipFrontmatter", name: "Skip frontmatter", desc: "Don't read YAML frontmatter" },
      { key: "skipComments", name: "Skip comments", desc: "Don't read HTML <!-- --> and Obsidian %% %% comments" },
      { key: "skipFootnotes", name: "Skip footnotes", desc: "Don't read footnote definitions" },
      { key: "skipUrls", name: "Skip URLs", desc: "Don't read bare URLs" },
      { key: "skipTags", name: "Skip tags", desc: "Don't read #hashtags" },
      { key: "skipMathBlocks", name: "Skip math blocks", desc: "Don't read LaTeX math formulas" },
    ];

    for (const s of toggleSettings) {
      new Setting(containerEl)
        .setName(s.name)
        .setDesc(s.desc)
        .addToggle((t) => {
          t.setValue(this.plugin.settings[s.key] as boolean);
          t.onChange(async (value) => {
            (this.plugin.settings as unknown as Record<string, unknown>)[s.key] = value;
            await this.plugin.saveSettings();
          });
        });
    }

    // Start polling while settings tab is open
    this.startStatusPolling();
  }

  hide(): void {
    this.stopStatusPolling();
  }

  // ─── Server status polling ─────────────────────────────────────────────────

  private startStatusPolling(): void {
    this.stopStatusPolling();
    this.statusPollTimer = window.setInterval(() => { void this.updateServerStatus(); }, 3000);
  }

  private stopStatusPolling(): void {
    if (this.statusPollTimer !== null) {
      window.clearInterval(this.statusPollTimer);
      this.statusPollTimer = null;
    }
  }

  private updateDepsStatus(): void {
    if (!this.depsStatusEl) return;
    if (this.plugin.serverDepsInstalled()) {
      this.depsStatusEl.textContent = "✅ Dependencies installed";
      this.depsStatusEl.className = "local-tts-server-status status-ready";
    } else {
      this.depsStatusEl.textContent = "❌ Missing — click Install dependencies";
      this.depsStatusEl.className = "local-tts-server-status status-error";
    }
  }

  private async updateServerStatus(): Promise<void> {
    if (!this.serverStatusEl) return;
    const port = this.plugin.settings.serverPort;
    try {
      const resp = await requestUrl({ url: `http://127.0.0.1:${port}/status` });
      const data = resp.json as { status: string; error?: string };
      if (data.status === "ready") {
        this.serverStatusEl.textContent = "✅ Running — model ready";
        this.serverStatusEl.className = "local-tts-server-status status-ready";
      } else if (data.status === "loading") {
        this.serverStatusEl.textContent = "⏳ Server starting — loading model (may take 1–2 min on first run)…";
        this.serverStatusEl.className = "local-tts-server-status status-loading";
      } else {
        this.serverStatusEl.textContent = `⚠️ Server error: ${data.error || data.status}`;
        this.serverStatusEl.className = "local-tts-server-status status-error";
      }
    } catch {
      this.serverStatusEl.textContent = "❌ Server not running";
      this.serverStatusEl.className = "local-tts-server-status status-stopped";
    }
  }
}
