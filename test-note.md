---
title: Test Note for Local TTS
tags: [test, tts]
date: 2026-04-13
---

# Introduction

This is a test note for the Local TTS plugin. It contains various Markdown elements that need to be properly handled by the text processor.

## Code Blocks

Here is some code that should be skipped:

```python
def hello():
    print("Hello, World!")
```

And inline code like `console.log("test")` should also be removed.

## Links and References

Check out [[My Other Note|this page]] for more details. You can also visit [Google](https://www.google.com) or see the raw URL https://example.com.

## Math

The equation $E = mc^2$ is famous. And here is a block equation:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Lists

Key findings:
- The first result was significant
- The second result needs more investigation
- The third result confirms our hypothesis

1. Start with the basics
2. Move to advanced topics
3. Review and summarize

## Emphasis and Formatting

This text is **bold**, this is *italic*, this is ~~strikethrough~~, and this is ==highlighted==.

> This is a blockquote that should be read aloud.

## Footnotes

This claim needs a source[^1].

[^1]: This is the footnote content that should be skipped.

## Comments

<!-- This HTML comment should be skipped -->

%% This Obsidian comment should also be skipped %%

## Conclusion

This concludes our test note. The plugin should read all the visible content naturally, skipping technical elements. #test #plugin
