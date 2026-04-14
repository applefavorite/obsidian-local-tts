🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — 노트를 소리 내어 읽기

Obsidian을 위한 고품질 **오프라인** 신경망 텍스트 음성 변환 플러그인입니다. API 키 불필요, 인터넷 불필요(최초 실행 후), 구독 불필요.

## 기능

- 🔇 **100% 오프라인** — 최초 모델 다운로드 후 완전히 로컬에서 실행
- 🧠 **신경망 품질** — 최첨단 8,200만 파라미터 TTS 모델 Kokoro-82M 기반
- 📝 **스마트 Markdown 파싱** — 코드 블록, frontmatter, URL, 태그, 수식, 주석 자동 건너뜀
- ✨ **문장 하이라이트** — 에디터에서 현재 읽고 있는 문장을 실시간 강조
- 📍 **자동 스크롤** — 현재 문장이 항상 화면 안에 보이도록 자동 스크롤
- 🔖 **북마크 및 이어읽기** — 일시정지 또는 정지 시 위치를 자동 저장, 언제든 재개 가능
- ⚡ **스트리밍 재생** — 다음 문장을 미리 생성하면서 즉시 음성 재생 시작
- 🎛️ **재생 컨트롤** — 재생/일시정지, 문장 건너뜀, 가변 속도(0.5×–2.0×)
- 🗣️ **7가지 음성** — 미국식·영국식 영어, 남성·여성
- 🖥️ **데스크톱 전용** — macOS, Windows, Linux (Electron / Node.js 필요)

## 스크린샷

### 문장 하이라이트로 읽기
![Reading](screenshots/1.png)

### 설정
![Settings](screenshots/2.png)

### 명령어
![Commands](screenshots/3.png)

### 재생 컨트롤
![Controls](screenshots/4.png)

### 북마크
![Bookmarks](screenshots/5.png)

## 시스템 요구사항

- **Obsidian 데스크톱** (모바일 미지원)
- **Node.js ≥ 18** 설치 필요
  - macOS / Linux: [nvm](https://github.com/nvm-sh/nvm) 또는 [Homebrew](https://brew.sh)로 설치
  - Windows: [nodejs.org](https://nodejs.org)에서 다운로드
- 기본 모델용 약 90 MB 디스크 공간
- 인터넷 연결은 **최초 모델 다운로드 시에만** 필요 (이후 완전 오프라인)

## 설치

### 수동 설치 (커뮤니티 플러그인 승인 전)

1. [최신 릴리스](https://github.com/applefavorite/obsidian-local-tts/releases)에서 `main.js`, `styles.css`, `manifest.json`, `server/` 폴더를 다운로드.
2. 모든 파일을 `<vault>/.obsidian/plugins/obsidian-local-tts/`에 복사.
3. 설정 → 커뮤니티 플러그인에서 **Local TTS** 활성화.

플러그인은 첫 로드 시 서버 종속성(`kokoro-js`)을 자동으로 설치합니다.

### 첫 사용 체크리스트

1. 설정 → Local TTS 열기.
2. **Server Dependencies**에 ✅가 표시되는지 확인. 표시되지 않으면 **Install Dependencies** 클릭.
3. TTS 서버가 자동 시작됩니다 (Server Status에 ✅ Running 표시).
4. 첫 시작 시 Kokoro 모델(~90 MB)이 HuggingFace에서 다운로드됩니다 — 연결 속도에 따라 1~3분 소요.
5. 상태가 **model ready**로 표시되면, 아무 노트나 열고 `Cmd/Ctrl + Shift + L`을 누르세요.

## 사용 방법

| 동작 | 방법 |
|------|------|
| 현재 노트 읽기 | `Cmd/Ctrl + Shift + L` 또는 사이드바의 🔊 클릭 |
| 선택한 텍스트 읽기 | 텍스트 선택 → 우클릭 → Read selection aloud |
| 일시정지 / 재개 | `Cmd/Ctrl + Shift + P` 또는 상태 표시줄의 ⏸ 클릭 |
| 정지 | `Cmd/Ctrl + Shift + S` 또는 상태 표시줄의 ⏹ 클릭 |
| 북마크에서 재개 | `Cmd/Ctrl + Shift + R` 또는 상태 표시줄의 "🔖 Resume" 클릭 |

## 키보드 단축키

| 명령어 | 기본 단축키 |
|--------|-----------|
| 현재 노트 읽기 | `Cmd/Ctrl + Shift + L` |
| 일시정지 / 재개 | `Cmd/Ctrl + Shift + P` |
| 읽기 정지 | `Cmd/Ctrl + Shift + S` |
| 북마크에서 재개 | `Cmd/Ctrl + Shift + R` |
| 다음 문장 | — (단축키 설정에서 할당 가능) |
| 이전 문장 | — |
| 속도 높이기 (+0.25×) | — |
| 속도 낮추기 (−0.25×) | — |
| 모든 북마크 보기 | — |
| 현재 노트 북마크 삭제 | — |

## 읽기 시작 위치 선택

`Cmd/Ctrl + Shift + L`을 누르면 선택 창이 나타납니다:

- **From beginning** — 첫 번째 문장부터 시작
- **From cursor** — 커서가 있는 문장부터 시작
- **From bookmark** *(있는 경우)* — 마지막으로 멈춘 위치에서 재개

## 북마크 시스템

- 일시정지하거나 정지할 때마다 북마크가 **자동 저장**됩니다.
- 문장 인덱스와 미리보기 텍스트를 저장합니다.
- 활성 노트에 북마크가 있으면 상태 표시줄에 **🔖 Resume** 캡슐이 표시됩니다.
- 재생 중 🔖를 클릭하면 북마크 위치로 이동합니다.
- 🔖를 우클릭하면 북마크가 삭제됩니다.
- 📋을 클릭하면 볼트의 모든 북마크를 볼 수 있습니다.

## 음성 목록

| 음성 | 설명 |
|------|------|
| af_sky *(기본)* | 미국 영어 여성 — Sky |
| af_bella | 미국 영어 여성 — Bella |
| af_nicole | 미국 영어 여성 — Nicole |
| am_adam | 미국 영어 남성 — Adam |
| am_michael | 미국 영어 남성 — Michael |
| bf_emma | 영국 영어 여성 — Emma |
| bm_george | 영국 영어 남성 — George |

## 설정 참조

### TTS 서버
| 설정 | 기본값 | 설명 |
|------|--------|------|
| Server Dependencies | — | 설치 상태 표시; 설치 버튼 제공 |
| Server Status | — | 실시간 폴링; 모델 로딩 진행률 표시 |
| Auto-start server | 켜짐 | 플러그인 로드 시 서버 자동 시작 |
| Server Port | 19199 | 포트 충돌 시 변경 |
| Node.js Path | 자동 감지 | 자동 감지 실패 시 수동 설정 |
| Model Quantization | q8 (~90 MB) | q4 = 빠름/작음; fp32 = 최고 품질 |

### 음성 및 재생
| 설정 | 기본값 |
|------|--------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | 켜짐 |
| Highlight current sentence | 켜짐 |
| Highlight color | 노란색 30% |

### 콘텐츠 필터링 (기본적으로 모두 켜짐)
코드 블록 · frontmatter · 주석 · 각주 · URL · 해시태그 · 수식 블록 건너뜀

## 알려진 제한 사항

- **데스크톱 전용** — ONNX Runtime은 Obsidian 모바일에서 사용할 수 없는 Node.js 네이티브 바이너리가 필요합니다.
- **Node.js 필수** — 추론 서버가 별도의 Node.js 프로세스로 실행됩니다.
- **최초 인터넷 연결** — Kokoro 모델은 첫 사용 시에만 HuggingFace에서 다운로드됩니다.
- **macOS Gatekeeper** — Node.js가 nvm으로 설치된 경우, 플러그인이 로그인 셸을 통해 자동 감지합니다. 실패 시 설정에서 경로를 수동으로 설정하세요.
- **소스 뷰 전용** — 문장 하이라이트는 Markdown 소스 에디터에서만 작동하며, 읽기 뷰에서는 작동하지 않습니다.

## 자주 묻는 질문

**상태 표시줄에 아무것도 표시되지 않습니다.**
재생 컨트롤 바는 읽기 중에만 나타납니다. 🔖 Resume 캡슐은 활성 노트에 북마크가 있을 때만 나타납니다.

**서버가 계속 "미실행"으로 표시됩니다.**
설정 → Local TTS → Start Server로 이동하세요. Node.js Path 설정을 확인하고 Detect를 클릭하세요.

**"node를 찾을 수 없습니다" 오류.**
Node.js(≥ 18)를 설치한 후, 설정에서 **Detect**를 클릭하거나 경로를 수동으로 입력하세요.

**모델 다운로드가 느리거나 실패합니다.**
약 90 MB 모델이 HuggingFace에서 다운로드됩니다. 시간 초과 시 서버를 재시작하면 자동으로 재개됩니다.

**오디오가 끊깁니다.**
설정 → 고급에서 병렬 사전 생성 수를 줄이세요(기본값: 3). 또는 더 빠른 양자화(q4)를 시도해 보세요.

**하이라이트가 첫 번째 문장에 멈춥니다.**
소스 에디터를 사용하고 있는지 확인하세요(읽기 뷰 아님). 문제가 계속되면 플러그인을 비활성화했다가 다시 활성화하세요.

---

> 오프라인 TTS가 마음에 드시나요? App Store에서 **PaperVoice**를 확인해 보세요 — 학술 논문을 위한 AI 기반 PDF 리더입니다.

## 지원

이 플러그인이 유용하다면 커피 한 잔 사주시면 감사하겠습니다 ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## 라이선스

MIT © 2025 applefavorite
