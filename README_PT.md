🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Leia suas notas em voz alta

Síntese de voz neuronal **offline** de alta qualidade para o Obsidian. Sem chave de API, sem internet (após o primeiro uso), sem assinaturas.

## Funcionalidades

- 🔇 **100% offline** — funciona inteiramente no seu dispositivo após o primeiro download do modelo
- 🧠 **Qualidade neural** — baseado no Kokoro-82M, um modelo TTS de ponta com 82 milhões de parâmetros
- 📝 **Análise inteligente de Markdown** — ignora automaticamente blocos de código, frontmatter, URLs, tags, fórmulas matemáticas e comentários
- ✨ **Destaque de frases** — o editor destaca a frase sendo lida em tempo real
- 📍 **Rolagem automática** — o editor rola automaticamente para manter a frase atual visível
- 🔖 **Favoritos e retomada** — salva automaticamente sua posição ao pausar ou parar
- ⚡ **Reprodução em streaming** — o áudio começa imediatamente enquanto as próximas frases são pré-geradas
- 🎛️ **Controles de reprodução** — play/pausa, pular frase, velocidade variável (0,5×–2,0×)
- 🗣️ **7 vozes** — inglês americano e britânico, masculino e feminino
- 🖥️ **Somente desktop** — macOS, Windows, Linux (requer Electron / Node.js)

## Capturas de tela

### Leitura com destaque de frases
![Reading](screenshots/1.png)

### Configurações
![Settings](screenshots/2.png)

### Comandos
![Commands](screenshots/3.png)

### Controles de reprodução
![Controls](screenshots/4.png)

### Favoritos
![Bookmarks](screenshots/5.png)

## Requisitos

- **Obsidian Desktop** (não compatível com mobile)
- **Node.js ≥ 18** instalado no sistema
  - macOS / Linux: instalar via [nvm](https://github.com/nvm-sh/nvm) ou [Homebrew](https://brew.sh)
  - Windows: baixar em [nodejs.org](https://nodejs.org)
- ~90 MB de espaço em disco para o modelo padrão
- Acesso à internet **apenas** para o primeiro download do modelo (armazenado em cache depois)

## Instalação

### Manual (até aprovação como plugin da comunidade)

1. Baixe `main.js`, `styles.css`, `manifest.json` e a pasta `server/` na [última versão](https://github.com/applefavorite/obsidian-local-tts/releases).
2. Copie tudo para `<vault>/.obsidian/plugins/obsidian-local-tts/`.
3. Ative o **Local TTS** em Configurações → Plugins da Comunidade.

O plugin instala automaticamente suas dependências do servidor (`kokoro-js`) no primeiro carregamento.

### Lista de verificação para o primeiro uso

1. Abra Configurações → Local TTS.
2. Confirme que **Server Dependencies** mostra ✅. Se não, clique em **Install Dependencies**.
3. O servidor TTS inicia automaticamente (Server Status mostra ✅ Running).
4. No primeiro início, o modelo Kokoro (~90 MB) é baixado do HuggingFace — 1 a 3 minutos dependendo da sua conexão.
5. Quando o status mostrar **model ready**, abra qualquer nota e pressione `Cmd/Ctrl + Shift + L`.

## Uso

| Ação | Como |
|------|------|
| Ler nota atual | `Cmd/Ctrl + Shift + L` ou clicar em 🔊 na barra lateral |
| Ler texto selecionado | Selecionar texto → botão direito → Read selection aloud |
| Pausar / Retomar | `Cmd/Ctrl + Shift + P` ou clicar em ⏸ na barra de status |
| Parar | `Cmd/Ctrl + Shift + S` ou clicar em ⏹ na barra de status |
| Retomar do favorito | `Cmd/Ctrl + Shift + R` ou clicar em "🔖 Resume" na barra de status |

## Atalhos de teclado

| Comando | Atalho padrão |
|---------|--------------|
| Ler nota atual | `Cmd/Ctrl + Shift + L` |
| Pausar / Retomar | `Cmd/Ctrl + Shift + P` |
| Parar leitura | `Cmd/Ctrl + Shift + S` |
| Retomar do favorito | `Cmd/Ctrl + Shift + R` |
| Próxima frase | — (configurável em Hotkeys) |
| Frase anterior | — |
| Acelerar (+0,25×) | — |
| Desacelerar (−0,25×) | — |
| Mostrar todos os favoritos | — |
| Limpar favorito da nota atual | — |

## Opções de início de leitura

Ao pressionar `Cmd/Ctrl + Shift + L`, um seletor aparece:

- **From beginning** — começar na frase 1
- **From cursor** — começar na frase onde está o cursor
- **From bookmark** *(se existir)* — retomar de onde parou

## Sistema de favoritos

- Um favorito é **salvo automaticamente** sempre que você pausa ou para.
- Armazena o índice da frase e um trecho de visualização.
- A cápsula **🔖 Resume** na barra de status aparece quando a nota ativa tem um favorito.
- Clique em 🔖 durante a reprodução para ir até o favorito.
- Clique direito em 🔖 para remover o favorito.
- Clique em 📋 para ver todos os favoritos do vault.

## Vozes disponíveis

| Voz | Descrição |
|-----|-----------|
| af_sky *(padrão)* | Inglês americano feminino — Sky |
| af_bella | Inglês americano feminino — Bella |
| af_nicole | Inglês americano feminino — Nicole |
| am_adam | Inglês americano masculino — Adam |
| am_michael | Inglês americano masculino — Michael |
| bf_emma | Inglês britânico feminino — Emma |
| bm_george | Inglês britânico masculino — George |

## Referência de configurações

### Servidor TTS
| Configuração | Padrão | Notas |
|-------------|--------|-------|
| Server Dependencies | — | Mostra status de instalação; botão para instalar |
| Server Status | — | Sondagem ao vivo; mostra progresso de carregamento |
| Auto-start server | Ativado | Inicia o servidor ao carregar o plugin |
| Server Port | 19199 | Alterar em caso de conflito de porta |
| Node.js Path | Auto-detectar | Configurar manualmente se a detecção falhar |
| Model Quantization | q8 (~90 MB) | q4 = mais rápido/menor; fp32 = melhor qualidade |

### Voz e reprodução
| Configuração | Padrão |
|-------------|--------|
| Voice | af_sky |
| Speed | 1,0× |
| Auto-scroll | Ativado |
| Highlight current sentence | Ativado |
| Highlight color | Amarelo 30% |

### Filtragem de conteúdo (todos ativados por padrão)
Ignorar blocos de código · frontmatter · comentários · notas de rodapé · URLs · hashtags · blocos matemáticos

## Limitações conhecidas

- **Somente desktop** — ONNX Runtime requer binários nativos do Node.js não disponíveis no Obsidian Mobile.
- **Node.js obrigatório** — o servidor de inferência é executado como processo Node.js separado.
- **Internet no primeiro uso** — o modelo Kokoro é baixado do HuggingFace apenas na primeira vez.
- **macOS Gatekeeper** — se o Node.js foi instalado via nvm, o plugin o detecta via shell de login; se falhar, configure o caminho manualmente.
- **Somente visão de fonte** — o destaque funciona apenas no editor de fonte Markdown, não na visão de leitura.

## Perguntas frequentes

**A barra de status não mostra nada.**
A barra de reprodução aparece apenas durante a leitura. A cápsula 🔖 Resume aparece apenas quando a nota ativa tem um favorito.

**O servidor continua mostrando "não iniciado".**
Vá para Configurações → Local TTS → Start Server. Verifique o caminho do Node.js e clique em Detect.

**Erro "node não encontrado".**
Instale o Node.js (≥ 18), depois clique em **Detect** nas configurações ou insira o caminho manualmente.

**Download do modelo lento ou com falha.**
O modelo de ~90 MB é baixado do HuggingFace. Se expirar, reinicie o servidor — ele retoma automaticamente.

**Áudio com falhas.**
Reduza as gerações paralelas em Configurações → Avançado (padrão: 3) ou tente uma quantização mais rápida (q4).

**Destaque fica na primeira frase.**
Certifique-se de estar no editor de fonte (não na visão de leitura). Se o problema persistir, desative e reative o plugin.

---

> Gostou do TTS offline? Confira o **PaperVoice** na App Store — leitor de PDF com IA para artigos acadêmicos.

## Suporte

Se este plugin for útil, considere me pagar um café ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Licença

MIT © 2025 applefavorite
