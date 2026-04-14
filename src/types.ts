export interface BookmarkData {
  filePath: string;
  sentenceIndex: number;
  timestamp: number;
  sentencePreview: string;  // 截断到 50 字
}

export interface LocalTTSSettings {
  // 模型设置
  modelId: string;          // 默认 "onnx-community/Kokoro-82M-v1.0-ONNX"
  modelDtype: string;       // "q8" | "q4" | "fp32"，默认 "q8"（约90MB）
  voiceId: string;          // 默认 "af_sky"（美式女声）

  // 服务器设置
  serverPort: number;       // 本地 TTS 服务端口，默认 19199
  nodePath: string;         // Node.js 可执行文件路径，空字符串=自动检测
  autoStartServer: boolean; // 插件加载时自动启动服务器，默认 true

  // 播放设置
  speed: number;            // 0.5 - 2.0，默认 1.0

  // 文本处理设置
  skipCodeBlocks: boolean;  // 默认 true
  skipFrontmatter: boolean; // 默认 true
  skipComments: boolean;    // 默认 true（HTML 注释 和 %% 注释）
  skipFootnotes: boolean;   // 默认 true
  skipUrls: boolean;        // 默认 true
  skipTags: boolean;        // 默认 true（#tag）
  skipMathBlocks: boolean;  // 默认 true（$$ ... $$）

  // 高亮设置
  highlightCurrentSentence: boolean; // 默认 true
  highlightColor: string;   // 默认 "rgba(255, 208, 0, 0.3)"

  // 高级设置
  maxConcurrentGenerations: number; // 预生成句子数，默认 3
  autoScrollToSentence: boolean;    // 默认 true

  // 书签
  bookmarks: Record<string, BookmarkData>; // key = 文件路径
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  currentText: string;        // 当前正在读的句子文本
  sourceFile: string;         // 当前朗读的文件路径
  progress: number;           // 0-100
}

export interface ProcessedText {
  sentences: SentenceInfo[];
  totalEstimatedDuration: number; // 预估总时长（秒）
}

export interface SentenceInfo {
  text: string;           // 要朗读的文本（已清洗）
  originalText: string;   // 原始 markdown 文本
  lineStart: number;      // 在文档中的起始行号
  lineEnd: number;        // 结束行号
  charStart: number;      // 行内起始字符位置
  charEnd: number;        // 行内结束字符位置
}

export const DEFAULT_SETTINGS: LocalTTSSettings = {
  modelId: "onnx-community/Kokoro-82M-v1.0-ONNX",
  modelDtype: "q8",
  voiceId: "af_sky",
  serverPort: 19199,
  nodePath: "",
  autoStartServer: true,
  speed: 1.0,
  skipCodeBlocks: true,
  skipFrontmatter: true,
  skipComments: true,
  skipFootnotes: true,
  skipUrls: true,
  skipTags: true,
  skipMathBlocks: true,
  highlightCurrentSentence: true,
  highlightColor: "rgba(255, 208, 0, 0.3)",
  maxConcurrentGenerations: 3,
  autoScrollToSentence: true,
  bookmarks: {},
};

export const AVAILABLE_VOICES: { id: string; name: string }[] = [
  { id: "af_sky", name: "Sky (American Female)" },
  { id: "af_bella", name: "Bella (American Female)" },
  { id: "af_nicole", name: "Nicole (American Female)" },
  { id: "am_adam", name: "Adam (American Male)" },
  { id: "am_michael", name: "Michael (American Male)" },
  { id: "bf_emma", name: "Emma (British Female)" },
  { id: "bm_george", name: "George (British Male)" },
];
