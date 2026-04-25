export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private _isPlaying: boolean = false;
  private _isPaused: boolean = false;
  private onEndedCallback: (() => void) | null = null;

  get playing(): boolean {
    return this._isPlaying;
  }

  get paused(): boolean {
    return this._isPaused;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === "closed") {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
    return this.audioContext;
  }

  /**
   * 播放 PCM 音频数据（Float32Array）
   */
  async play(audioData: Float32Array, sampleRate: number): Promise<void> {
    this.stopCurrentSource();

    const ctx = this.getAudioContext();

    // 如果 context 被暂停，恢复它
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const buffer = ctx.createBuffer(1, audioData.length, sampleRate);
    buffer.copyToChannel(audioData, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    if (this.gainNode) {
      source.connect(this.gainNode);
    } else {
      source.connect(ctx.destination);
    }

    source.onended = () => {
      if (this._isPlaying && !this._isPaused) {
        this._isPlaying = false;
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }
    };

    this.currentSource = source;
    this._isPlaying = true;
    this._isPaused = false;
    source.start(0);
  }

  /**
   * 暂停播放
   */
  pause(): void {
    if (!this._isPlaying || this._isPaused) return;
    if (this.audioContext && this.audioContext.state === "running") {
      void this.audioContext.suspend();
      this._isPaused = true;
    }
  }

  /**
   * 恢复播放
   */
  resume(): void {
    if (!this._isPaused) return;
    if (this.audioContext && this.audioContext.state === "suspended") {
      void this.audioContext.resume();
      this._isPaused = false;
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    this.stopCurrentSource();
    this._isPlaying = false;
    this._isPaused = false;
  }

  private stopCurrentSource(): void {
    if (this.currentSource) {
      try {
        this.currentSource.onended = null;
        this.currentSource.stop();
      } catch {
        // 忽略已停止的 source 错误
      }
      this.currentSource = null;
    }
  }

  /**
   * 设置音量 0-1
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.gainNode.context.currentTime
      );
    }
  }

  /**
   * 注册播放完成回调
   */
  onEnded(callback: () => void): void {
    this.onEndedCallback = callback;
  }

  /**
   * 释放资源
   */
  dispose(): void {
    this.stop();
    if (this.audioContext) {
      void this.audioContext.close();
      this.audioContext = null;
    }
    this.gainNode = null;
    this.onEndedCallback = null;
  }
}
