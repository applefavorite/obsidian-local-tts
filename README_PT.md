🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Dê voz às suas notas

Um plugin de síntese de voz neural **offline** para o Obsidian. Sem API key, sem assinatura e sem internet depois do primeiro uso.

## O que o plugin faz

- 🔇 **100% offline** — depois do download inicial do modelo, tudo funciona localmente
- 🧠 **Voz neural** — baseado no Kokoro-82M (82 milhões de parâmetros), bem mais natural que TTS tradicional
- 📝 **Entende Markdown** — pula automaticamente blocos de código, frontmatter, URLs, tags, fórmulas e comentários
- ✨ **Destaque em tempo real** — a frase sendo lida fica marcada no editor
- 📍 **Scroll automático** — o editor acompanha a leitura sem você precisar rolar
- 🔖 **Favoritos automáticos** — sua posição é salva ao pausar ou parar; é só retomar quando quiser
- ⚡ **Reprodução imediata** — o áudio começa enquanto as próximas frases são geradas em segundo plano
- 🎛️ **Controle total** — play/pausa, pular frases, velocidade ajustável (0,5×–2,0×) direto na barra de status
- 🗣️ **7 vozes** — inglês americano e britânico, masculino e feminino
- 🖥️ **Somente desktop** — macOS, Windows e Linux (precisa de Node.js)

## Screenshots

### Leitura com destaque de frases
![Reading](screenshots/1.png)

### Configurações
![Settings](screenshots/2.png)

### Comandos disponíveis
![Commands](screenshots/3.png)

### Barra de controles
![Controls](screenshots/4.png)

### Gerenciador de favoritos
![Bookmarks](screenshots/5.png)

## Requisitos

- **Obsidian Desktop** (não funciona no mobile)
- **Node.js ≥ 18** — a inferência roda num processo Node separado, fora do Electron
  - macOS / Linux: recomendo instalar via [nvm](https://github.com/nvm-sh/nvm) ou Homebrew
  - Windows: baixa o instalador em [nodejs.org](https://nodejs.org)
- Cerca de 90 MB de espaço em disco para o modelo padrão (q8)
- Internet só no primeiro download do modelo

## Instalação

### Manual (enquanto aguarda aprovação no repositório comunitário)

1. Baixe `main.js`, `styles.css`, `manifest.json` e a pasta `server/` do [último release](https://github.com/applefavorite/obsidian-local-tts/releases)
2. Copie tudo para `<seu vault>/.obsidian/plugins/obsidian-local-tts/`
3. Ative o **Local TTS** em Configurações → Plugins da comunidade

No primeiro carregamento, o plugin roda `npm install` automaticamente para instalar o `kokoro-js`.

### Primeira vez

1. Abra Configurações → Local TTS
2. **Server Dependencies** precisa mostrar ✅ — se não mostrar, clique em **Install Dependencies**
3. O servidor TTS inicia sozinho (Server Status: ✅ Running)
4. No primeiro start, o modelo Kokoro (~90 MB) é baixado do HuggingFace — leva 1 a 3 minutos dependendo da sua conexão
5. Quando aparecer **model ready**, abra qualquer nota e pressione `Cmd/Ctrl + Shift + L`

## Como usar

1. Clique no **ícone 🔊** na barra lateral esquerda, ou pressione `Cmd/Ctrl + Shift + L`
2. Escolha de onde começar: **do início**, **da posição do cursor** ou **do último favorito**
3. Controle a reprodução pela **barra de status** na parte de baixo

| Ação | Como fazer |
|------|-----------|
| Ler a nota atual | `Cmd/Ctrl + Shift + L` ou clicar em 🔊 |
| Ler texto selecionado | Selecionar → botão direito → Read selection aloud |
| Pausar / Continuar | `Cmd/Ctrl + Shift + P` ou ⏸ na barra de status |
| Parar | `Cmd/Ctrl + Shift + S` ou ⏹ na barra de status |
| Continuar do favorito | `Cmd/Ctrl + Shift + R` ou 🔖 Resume na barra de status |

## Atalhos de teclado

| Função | Atalho padrão |
|--------|--------------|
| Ler nota atual | `Cmd/Ctrl + Shift + L` |
| Pausar / Continuar | `Cmd/Ctrl + Shift + P` |
| Parar | `Cmd/Ctrl + Shift + S` |
| Continuar do favorito | `Cmd/Ctrl + Shift + R` |
| Próxima frase | — (configurável em Hotkeys) |
| Frase anterior | — |
| Acelerar (+0,25×) | — |
| Desacelerar (−0,25×) | — |
| Ver todos os favoritos | — |
| Apagar favorito atual | — |

## De onde começar a leitura

Ao pressionar `Cmd/Ctrl + Shift + L`, aparece um seletor com as opções:

- **From beginning** — da primeira frase
- **From cursor** — da frase onde o cursor está
- **From bookmark** — de onde você parou (só aparece se tiver um favorito salvo)

## Sistema de favoritos

- Um favorito é **salvo automaticamente** toda vez que você pausa ou para
- Quando a nota ativa tem favorito e a reprodução está inativa, **🔖 Resume** aparece na barra de status
- Clique em 🔖 durante a leitura para ir até o favorito
- Clique direito em 🔖 para apagar o favorito
- Clique em 📋 para ver todos os favoritos do vault

## Vozes disponíveis

| Voz | Descrição |
|-----|-----------|
| af_sky *(padrão)* | Inglês americano, feminino — Sky |
| af_bella | Inglês americano, feminino — Bella |
| af_nicole | Inglês americano, feminino — Nicole |
| am_adam | Inglês americano, masculino — Adam |
| am_michael | Inglês americano, masculino — Michael |
| bf_emma | Inglês britânico, feminino — Emma |
| bm_george | Inglês britânico, masculino — George |

## Configurações

### Servidor TTS

| Configuração | Padrão | Descrição |
|-------------|--------|-----------|
| Server Dependencies | — | Status da instalação + botão para instalar |
| Server Status | — | Sondagem em tempo real; progresso do modelo |
| Auto-start server | Ativado | Inicia o servidor junto com o plugin |
| Server Port | 19199 | Mude se tiver conflito de porta |
| Node.js Path | Detecção automática | Configure manualmente se a detecção falhar |
| Model Quantization | q8 (~90 MB) | q4 = mais rápido/leve; fp32 = melhor qualidade |

### Voz e reprodução

| Configuração | Padrão |
|-------------|--------|
| Voice | af_sky |
| Speed | 1,0× |
| Auto-scroll | Ativado |
| Destacar frase atual | Ativado |
| Cor do destaque | Amarelo 30% |

### Filtro de conteúdo (todos ativados por padrão)

Pula: blocos de código · frontmatter · comentários · notas de rodapé · URLs · hashtags · blocos matemáticos

## Limitações conhecidas

- **Somente desktop** — o Obsidian Mobile não tem os binários nativos do Node.js que o ONNX Runtime precisa
- **Node.js obrigatório** — o servidor de inferência roda fora do renderer do Electron
- **Internet só na primeira vez** — o modelo Kokoro é baixado do HuggingFace uma única vez
- **macOS + nvm** — o Node.js é detectado via login shell; se falhar, coloque o caminho manualmente
- **Somente editor de fonte** — o destaque não funciona na visualização de leitura

## Perguntas frequentes

**A barra de status não mostra nada.**
A barra de reprodução só aparece durante a leitura. O botão 🔖 Resume só aparece quando há um favorito salvo e a leitura não está ativa.

**O servidor fica mostrando "não iniciado".**
Vá em Configurações → Local TTS → Start Server. Verifique o caminho do Node.js e clique em Detect.

**Erro "node não encontrado".**
Instale o Node.js (≥ 18), depois clique em **Detect** nas configurações ou insira o caminho manualmente.

**O download do modelo trava.**
Reinicie o servidor — ele vai continuar de onde parou.

**O áudio fica travando.**
Reduza as gerações paralelas nas configurações avançadas (padrão: 3) ou mude para o modelo q4.

**O destaque fica preso na primeira frase.**
Confirme que está no editor de fonte (não na visualização). Se o problema continuar, desative e reative o plugin.

---

> Curtiu o TTS offline? Dá uma olhada no **PaperVoice** na App Store — um leitor de PDF com IA feito para artigos acadêmicos.

## Apoio

Se o plugin te ajudou, que tal um cafezinho? ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Licença

MIT © 2025 applefavorite
