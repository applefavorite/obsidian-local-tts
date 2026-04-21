import { LocalTTSSettings, ProcessedText, SentenceInfo } from "./types";

// 常见缩写，避免错误分句
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "vs", "etc",
  "e.g", "i.e", "fig", "dept", "approx", "est", "no",
  "vol", "pp", "st", "ave", "blvd",
]);

/**
 * 检查句号前的词是否是缩写（避免误切）
 */
function isAbbreviation(text: string, dotIndex: number): boolean {
  // 找到点号前的单词
  let start = dotIndex - 1;
  while (start >= 0 && /[a-zA-Z]/.test(text[start])) {
    start--;
  }
  const word = text.slice(start + 1, dotIndex).toLowerCase();
  if (ABBREVIATIONS.has(word)) return true;
  // 单个大写字母（如 J. Smith 中的 J.）
  if (word.length === 1 && /[A-Z]/.test(text[dotIndex - 1])) return true;
  return false;
}

/**
 * 分割文本为句子，返回每个句子及其在原始行中的字符偏移
 */
function splitIntoSentences(
  lineText: string,
  lineNum: number
): Array<{ text: string; charStart: number; charEnd: number; lineStart: number; lineEnd: number }> {
  const results: Array<{ text: string; charStart: number; charEnd: number; lineStart: number; lineEnd: number }> = [];
  const sentenceEndRegex = /[.!?。！？]+/g;
  let lastEnd = 0;
  let match: RegExpExecArray | null;

  while ((match = sentenceEndRegex.exec(lineText)) !== null) {
    const dotIndex = match.index;
    const endIndex = match.index + match[0].length;

    // 检查是否是缩写
    if (match[0] === "." && isAbbreviation(lineText, dotIndex)) {
      continue;
    }

    const sentence = lineText.slice(lastEnd, endIndex).trim();
    if (sentence.length > 0) {
      results.push({
        text: sentence,
        charStart: lastEnd,
        charEnd: endIndex,
        lineStart: lineNum,
        lineEnd: lineNum,
      });
    }
    lastEnd = endIndex;
  }

  // 剩余部分（没有句号结尾）
  const remaining = lineText.slice(lastEnd).trim();
  if (remaining.length > 0) {
    results.push({
      text: remaining,
      charStart: lastEnd,
      charEnd: lineText.length,
      lineStart: lineNum,
      lineEnd: lineNum,
    });
  }

  return results;
}

/**
 * 处理单行文本：清洗 Markdown 标记
 */
function cleanLine(line: string, settings: LocalTTSSettings): string {
  let text = line;

  // 移除行内代码
  if (settings.skipCodeBlocks) {
    text = text.replace(/`[^`]*`/g, "");
  }

  // 移除行内数学公式 $...$
  if (settings.skipMathBlocks) {
    text = text.replace(/\$[^$\n]+\$/g, "");
  }

  // 移除脚注引用 [^note]
  if (settings.skipFootnotes) {
    text = text.replace(/\[\^[^\]]+\]/g, "");
  }

  // 移除图片 ![alt](url) 和嵌入 ![[embed]]
  text = text.replace(/!\[\[.*?\]\]/g, "");
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");

  // 转换 wiki 链接 [[page|display]] → display；[[page]] → page
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
  text = text.replace(/\[\[([^\]]+)\]\]/g, "$1");

  // 转换 markdown 链接 [text](url) → text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

  // 移除 URL
  if (settings.skipUrls) {
    text = text.replace(/https?:\/\/[^\s)>\]]+/g, "");
  }

  // 移除标签 #tag
  if (settings.skipTags) {
    text = text.replace(/(^|\s)#[a-zA-Z0-9_/-]+/g, " ");
  }

  // 清理格式标记（保留内容）
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1"); // bold
  text = text.replace(/\*([^*]+)\*/g, "$1");      // italic
  text = text.replace(/~~([^~]+)~~/g, "$1");      // strikethrough
  text = text.replace(/==([^=]+)==/g, "$1");      // highlight

  // 处理标题 ## Heading → Heading.
  const headingMatch = text.match(/^#{1,6}\s+(.+)/);
  if (headingMatch) {
    text = headingMatch[1].trim() + ".";
  }

  // 处理列表项 - item / 1. item
  text = text.replace(/^[-*+]\s+/, "");
  text = text.replace(/^\d+\.\s+/, "");

  // 处理引用块 > quote
  text = text.replace(/^>\s*/, "");

  // 处理表格行（移除 | 分隔符，用逗号连接）
  if (text.includes("|")) {
    const cells = text.split("|").map((c) => c.trim()).filter((c) => c.length > 0 && !/^[-:]+$/.test(c));
    if (cells.length > 0) {
      text = cells.join(", ");
    } else {
      text = "";
    }
  }

  // 清理多余空白
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * 主函数：处理 Markdown 内容，返回句子列表
 */
export function processMarkdown(content: string, settings: LocalTTSSettings): ProcessedText {
  const lines = content.split("\n");
  const sentences: SentenceInfo[] = [];

  // 状态机
  let inFrontmatter = false;
  let frontmatterDone = false;
  let inCodeBlock = false;
  let inMathBlock = false;

  // 用于合并跨行的段落文本
  let paragraphBuffer = "";
  let paragraphLineStart = 0;

  const flushParagraph = (lineEnd: number) => {
    if (paragraphBuffer.trim().length === 0) {
      paragraphBuffer = "";
      return;
    }
    const fragments = splitIntoSentences(paragraphBuffer, paragraphLineStart);
    for (const frag of fragments) {
      if (frag.text.trim().length > 0) {
        sentences.push({
          text: frag.text,
          originalText: frag.text,
          lineStart: frag.lineStart,
          lineEnd: lineEnd,
          charStart: frag.charStart,
          charEnd: frag.charEnd,
        });
      }
    }
    paragraphBuffer = "";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Frontmatter 处理
    if (!frontmatterDone && i === 0 && trimmed === "---") {
      if (settings.skipFrontmatter) {
        inFrontmatter = true;
        continue;
      }
    }
    if (inFrontmatter) {
      if (trimmed === "---" || trimmed === "...") {
        inFrontmatter = false;
        frontmatterDone = true;
      }
      continue;
    }
    frontmatterDone = true;

    // 代码块处理
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        if (paragraphBuffer) flushParagraph(i - 1);
        continue;
      } else {
        inCodeBlock = false;
        continue;
      }
    }
    if (inCodeBlock) {
      if (settings.skipCodeBlocks) continue;
    }

    // 数学块处理
    if (trimmed === "$$" || trimmed.startsWith("$$")) {
      if (!inMathBlock) {
        inMathBlock = true;
        if (paragraphBuffer) flushParagraph(i - 1);
        continue;
      } else {
        inMathBlock = false;
        continue;
      }
    }
    if (inMathBlock) {
      if (settings.skipMathBlocks) continue;
    }

    // HTML 注释 <!-- ... --> （多行）
    if (settings.skipComments) {
      if (trimmed.startsWith("<!--")) {
        if (paragraphBuffer) flushParagraph(i - 1);
        // 找结束注释
        if (!trimmed.includes("-->")) {
          while (i < lines.length && !lines[i].includes("-->")) {
            i++;
          }
        }
        continue;
      }

      // Obsidian 注释 %% ... %%
      if (trimmed.startsWith("%%")) {
        if (paragraphBuffer) flushParagraph(i - 1);
        if (!trimmed.slice(2).includes("%%")) {
          while (i < lines.length && !lines[++i]?.includes("%%")) {
            // skip
          }
        }
        continue;
      }
    }

    // 脚注定义 [^note]: content
    if (settings.skipFootnotes && /^\[\^[^\]]+\]:/.test(trimmed)) {
      if (paragraphBuffer) flushParagraph(i - 1);
      continue;
    }

    // 水平线
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      if (paragraphBuffer) flushParagraph(i - 1);
      continue;
    }

    // 空行：flush paragraph buffer
    if (trimmed === "") {
      if (paragraphBuffer) flushParagraph(i - 1);
      continue;
    }

    // 清洗当前行
    const cleaned = cleanLine(line, settings);
    if (cleaned.length === 0) continue;

    // 标题行直接处理为单独句子
    if (/^#{1,6}\s/.test(trimmed)) {
      if (paragraphBuffer) flushParagraph(i - 1);
      const headingText = cleaned;
      sentences.push({
        text: headingText,
        originalText: trimmed,
        lineStart: i,
        lineEnd: i,
        charStart: 0,
        charEnd: line.length,
      });
      continue;
    }

    // 普通段落文本：累积到 buffer
    if (paragraphBuffer === "") {
      paragraphLineStart = i;
      paragraphBuffer = cleaned;
    } else {
      paragraphBuffer += " " + cleaned;
    }
  }

  // flush 剩余内容
  if (paragraphBuffer) flushParagraph(lines.length - 1);

  // 过滤空句子，计算预估时长（平均每词 0.4 秒）
  const filtered = sentences.filter((s) => s.text.trim().length > 0);
  const wordCount = filtered.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0);
  const totalEstimatedDuration = (wordCount / 150) * 60; // 150 词/分钟

  return {
    sentences: filtered,
    totalEstimatedDuration,
  };
}
