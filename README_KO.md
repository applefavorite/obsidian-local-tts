🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — 노트를 소리 내어 읽어드립니다

Obsidian을 위한 고품질 **오프라인** 신경망 TTS 플러그인입니다. API 키도, 구독도, 첫 실행 이후의 인터넷 연결도 필요하지 않습니다.

## 주요 기능

- 🔇 **완전 오프라인** — 모델을 한 번 받아두면 이후에는 인터넷 없이 동작합니다
- 🧠 **신경망 음성** — Kokoro-82M(8,200만 파라미터) 기반으로, 기존 TTS보다 훨씬 자연스러운 발음
- 📝 **Markdown 인식** — 코드 블록, frontmatter, URL, 태그, 수식, 주석을 자동으로 건너뜁니다
- ✨ **실시간 문장 강조** — 현재 읽고 있는 문장을 에디터에서 바로 확인할 수 있습니다
- 📍 **자동 스크롤** — 읽기 위치를 자동으로 따라가며 스크롤합니다
- 🔖 **자동 북마크** — 일시정지하거나 멈출 때 위치를 자동 저장합니다. 언제든 이어서 읽을 수 있습니다
- ⚡ **스트리밍 재생** — 다음 문장을 미리 생성하는 동안 현재 문장이 바로 재생됩니다
- 🎛️ **편리한 컨트롤** — 재생/일시정지, 문장 이동, 속도 조절(0.5×–2.0×)을 하단 상태 표시줄에서 바로 조작할 수 있습니다
- 🗣️ **7가지 음성** — 미국식 · 영국식 영어, 남성 · 여성
- 🖥️ **데스크톱 전용** — macOS, Windows, Linux (Node.js 필요)

## 스크린샷

### 문장 강조와 함께 읽기
![Reading](screenshots/1.png)

### 설정 화면
![Settings](screenshots/2.png)

### 명령어 목록
![Commands](screenshots/3.png)

### 재생 컨트롤 바
![Controls](screenshots/4.png)

### 북마크 관리
![Bookmarks](screenshots/5.png)

## 요구 사항

- **Obsidian 데스크톱** (모바일 미지원)
- **Node.js 18 이상** — 음성 추론은 Electron 외부에서 별도 Node 프로세스로 실행됩니다
  - macOS / Linux: [nvm](https://github.com/nvm-sh/nvm) 또는 Homebrew 사용을 권장합니다
  - Windows: [nodejs.org](https://nodejs.org)에서 설치 파일 다운로드
- 기본 모델(q8) 기준 약 90 MB의 여유 공간
- 인터넷은 모델 최초 다운로드 시에만 필요합니다

## 설치 방법

### 방법 1: BRAT으로 설치 (권장)

1. Obsidian 커뮤니티 플러그인에서 [BRAT](https://github.com/TfTHacker/obsidian42-brat)을 설치합니다
2. 설정 → BRAT → Add Beta Plugin을 엽니다
3. `applefavorite/obsidian-local-tts`를 입력합니다
4. 커뮤니티 플러그인 설정에서 Local TTS를 활성화합니다
5. 이후 업데이트는 BRAT이 자동으로 처리합니다

### 방법 2: 수동 설치

1. [최신 릴리스](https://github.com/applefavorite/obsidian-local-tts/releases)에서 `main.js`, `styles.css`, `manifest.json`, `server/` 폴더를 다운로드합니다
2. `<vault>/.obsidian/plugins/obsidian-local-tts/` 경로에 모두 복사합니다
3. 설정 → 커뮤니티 플러그인에서 **Local TTS**를 활성화합니다

처음 로드될 때 `kokoro-js` 설치를 위한 `npm install`이 자동으로 실행됩니다.

### 방법 3: 커뮤니티 플러그인 (출시 예정)

설정 → 커뮤니티 플러그인 → 탐색에서 "Local TTS"를 검색하세요 (현재 심사 중입니다).

### 처음 사용하기

1. 설정 → Local TTS를 엽니다
2. **Server Dependencies**에 ✅가 표시되어야 합니다. ❌면 **Install Dependencies**를 클릭하세요
3. TTS 서버가 자동으로 시작됩니다 (Server Status: ✅ Running)
4. 최초 실행 시 HuggingFace에서 Kokoro 모델(~90 MB)을 다운로드합니다. 인터넷 속도에 따라 1~3분 정도 소요됩니다
5. **model ready**가 표시되면 준비 완료입니다. 노트를 열고 `Cmd/Ctrl + Shift + L`을 눌러보세요

## 사용 방법

1. 왼쪽 사이드바의 **🔊 아이콘**을 클릭하거나 `Cmd/Ctrl + Shift + L`을 누릅니다
2. 시작 위치를 선택합니다: **처음부터** / **커서 위치부터** / **북마크에서 이어서**
3. 하단 **상태 표시줄**에서 재생을 제어합니다

| 동작 | 방법 |
|------|------|
| 현재 노트 읽기 | `Cmd/Ctrl + Shift + L` 또는 사이드바 🔊 클릭 |
| 선택 텍스트 읽기 | 텍스트 선택 → 우클릭 → Read selection aloud |
| 일시정지 / 재개 | `Cmd/Ctrl + Shift + P` 또는 상태 표시줄 ⏸ |
| 정지 | `Cmd/Ctrl + Shift + S` 또는 상태 표시줄 ⏹ |
| 북마크에서 이어 읽기 | `Cmd/Ctrl + Shift + R` 또는 상태 표시줄 🔖 Resume |

## 단축키

| 기능 | 기본 단축키 |
|------|-----------|
| 현재 노트 읽기 | `Cmd/Ctrl + Shift + L` |
| 일시정지 / 재개 | `Cmd/Ctrl + Shift + P` |
| 정지 | `Cmd/Ctrl + Shift + S` |
| 북마크에서 이어 읽기 | `Cmd/Ctrl + Shift + R` |
| 다음 문장 | — (단축키 설정에서 지정 가능) |
| 이전 문장 | — |
| 속도 높이기 (+0.25×) | — |
| 속도 낮추기 (−0.25×) | — |
| 전체 북마크 보기 | — |
| 현재 북마크 삭제 | — |

## 읽기 시작 위치 선택

`Cmd/Ctrl + Shift + L`을 누르면 시작 위치를 고를 수 있는 창이 나타납니다.

- **From beginning** — 첫 번째 문장부터
- **From cursor** — 커서가 있는 문장부터
- **From bookmark** — 마지막으로 멈춘 위치부터 (북마크가 있을 때만 표시됩니다)

## 북마크 기능

- 일시정지하거나 정지할 때마다 **자동으로 북마크가 저장**됩니다
- 북마크가 있는 노트를 열면 상태 표시줄에 **🔖 Resume** 버튼이 나타납니다
- 재생 중 🔖 클릭 → 북마크 위치로 이동
- 🔖 우클릭 → 북마크 삭제
- 📋 클릭 → 볼트 전체 북마크 목록 보기

## 음성 목록

| 음성 | 설명 |
|------|------|
| af_sky *(기본값)* | 미국식 영어, 여성 — Sky |
| af_bella | 미국식 영어, 여성 — Bella |
| af_nicole | 미국식 영어, 여성 — Nicole |
| am_adam | 미국식 영어, 남성 — Adam |
| am_michael | 미국식 영어, 남성 — Michael |
| bf_emma | 영국식 영어, 여성 — Emma |
| bm_george | 영국식 영어, 남성 — George |

## 설정 안내

### TTS 서버

| 항목 | 기본값 | 설명 |
|------|--------|------|
| Server Dependencies | — | 의존성 설치 여부 + 설치 버튼 |
| Server Status | — | 실시간 서버 및 모델 상태 표시 |
| Auto-start server | 켜짐 | 플러그인 로드 시 서버 자동 시작 |
| Server Port | 19199 | 포트 충돌 시 변경 |
| Node.js Path | 자동 감지 | 감지 실패 시 직접 경로 입력 |
| Model Quantization | q8 (~90 MB) | q4: 빠르고 가벼움 / fp32: 최고 음질 |

### 음성 및 재생

| 항목 | 기본값 |
|------|--------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | 켜짐 |
| 현재 문장 강조 | 켜짐 |
| 강조 색상 | 노란색 30% |

### 콘텐츠 필터 (기본적으로 모두 켜짐)

건너뜀: 코드 블록 · frontmatter · 주석 · 각주 · URL · 해시태그 · 수식 블록

## 알려진 제한 사항

- **데스크톱 전용** — Obsidian 모바일에서는 ONNX Runtime에 필요한 Node.js 네이티브 바이너리를 사용할 수 없습니다
- **Node.js 필수** — 음성 추론은 Electron renderer 외부에서 독립적인 프로세스로 실행됩니다
- **최초 실행 시 인터넷 필요** — Kokoro 모델은 HuggingFace에서 단 한 번만 다운로드됩니다
- **macOS + nvm** — 로그인 셸을 통해 Node.js를 자동 감지합니다. 실패 시 경로를 직접 입력해 주세요
- **소스 에디터 전용** — 문장 강조는 미리보기(읽기 전용) 화면에서는 작동하지 않습니다

## 자주 묻는 질문

**상태 표시줄에 아무것도 안 보입니다.**
재생 컨트롤 바는 재생 중이거나 일시정지 상태일 때만 나타납니다. 🔖 Resume는 북마크가 저장된 노트를 보고 있을 때만 표시됩니다.

**서버가 계속 "미실행" 상태로 나옵니다.**
설정 → Local TTS → Start Server를 클릭하세요. Node.js Path 항목에서 Detect 버튼을 눌러 자동 감지를 시도해 보세요.

**"node를 찾을 수 없음" 오류가 납니다.**
Node.js(18 이상)를 설치한 후, 설정에서 **Detect** 버튼을 누르거나 경로를 직접 입력하세요.

**모델 다운로드가 멈춥니다.**
서버를 재시작하면 자동으로 이어받습니다.

**오디오가 끊겨서 들립니다.**
설정 고급 항목에서 동시 사전 생성 수를 줄이거나(기본값 3), q4 모델로 변경해 보세요.

**강조 표시가 첫 번째 문장에서 멈춥니다.**
소스 에디터 모드(미리보기 아님)인지 확인하세요. 그래도 안 된다면 플러그인을 비활성화했다가 다시 활성화해 보세요.

---

> 오프라인 TTS가 마음에 드셨나요? App Store의 **PaperVoice**도 확인해 보세요 — 학술 논문을 위한 AI 기반 PDF 리더입니다.

## 후원

이 플러그인이 도움이 됐다면, 커피 한 잔으로 응원해 주세요 ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## 라이선스

MIT © 2025 applefavorite
