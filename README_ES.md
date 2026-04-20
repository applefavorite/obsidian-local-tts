🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Dale voz a tus notas

TTS neuronal de alta calidad para Obsidian, completamente **offline**. Sin API keys, sin suscripciones y sin internet después del primer uso.

## Qué hace este plugin

- 🔇 **100% offline** — tras la descarga inicial del modelo, funciona sin conexión
- 🧠 **Voz neuronal** — basado en Kokoro-82M (82 millones de parámetros), suena mucho más natural que los TTS clásicos
- 📝 **Entiende Markdown** — omite automáticamente bloques de código, frontmatter, URLs, etiquetas, fórmulas y comentarios
- ✨ **Resaltado en tiempo real** — el editor marca la frase que se está leyendo
- 📍 **Scroll automático** — el texto sigue la lectura sin que tengas que hacer nada
- 🔖 **Marcadores automáticos** — guarda tu posición al pausar o detener; retoma con un clic
- ⚡ **Reproducción inmediata** — el audio empieza a la vez que se generan las siguientes frases en segundo plano
- 🎛️ **Control total** — play/pausa, saltar frases, velocidad ajustable (0.5×–2.0×) desde la barra de estado
- 🗣️ **7 voces** — inglés americano y británico, masculino y femenino
- 🖥️ **Solo escritorio** — macOS, Windows y Linux (requiere Node.js)

## Capturas de pantalla

### Lectura con resaltado de frases
![Reading](screenshots/1.png)

### Configuración
![Settings](screenshots/2.png)

### Comandos disponibles
![Commands](screenshots/3.png)

### Barra de controles
![Controls](screenshots/4.png)

### Gestor de marcadores
![Bookmarks](screenshots/5.png)

## Requisitos

- **Obsidian Desktop** (no compatible con móvil)
- **Node.js ≥ 18** — la inferencia corre en un proceso Node separado fuera de Electron
  - macOS / Linux: recomendado instalar con [nvm](https://github.com/nvm-sh/nvm) o Homebrew
  - Windows: descarga el instalador de [nodejs.org](https://nodejs.org)
- Unos 90 MB de espacio para el modelo por defecto (q8)
- Internet solo para la primera descarga del modelo

## Instalación

### Método 1: BRAT (Recomendado)

1. Instala el plugin [BRAT](https://github.com/TfTHacker/obsidian42-brat) desde los plugins de la comunidad de Obsidian
2. Ve a Ajustes → BRAT → Add Beta Plugin
3. Introduce `applefavorite/obsidian-local-tts`
4. Activa el plugin en Ajustes → Plugins de la comunidad
5. BRAT se encargará de las actualizaciones automáticamente

### Método 2: Instalación manual

1. Descarga `main.js`, `styles.css`, `manifest.json` y la carpeta `server/` desde el [último release](https://github.com/applefavorite/obsidian-local-tts/releases)
2. Copia todo a `<tu vault>/.obsidian/plugins/obsidian-local-tts/`
3. Activa **Local TTS** en Ajustes → Plugins de la comunidad

Al cargar por primera vez, el plugin ejecuta `npm install` automáticamente para instalar `kokoro-js`.

### Método 3: Plugins de la comunidad (Próximamente)

Busca "Local TTS" en Ajustes → Plugins de la comunidad (pendiente de revisión).

### Primer arranque

1. Abre Ajustes → Local TTS
2. Comprueba que **Server Dependencies** muestre ✅; si no, pulsa **Install Dependencies**
3. El servidor TTS arranca solo (verás ✅ Running en Server Status)
4. La primera vez descarga el modelo Kokoro (~90 MB) desde HuggingFace — puede tardar 1–3 minutos
5. Cuando aparezca **model ready**, abre cualquier nota y pulsa `Cmd/Ctrl + Shift + L`

## Cómo usarlo

1. Haz clic en el **icono 🔊** de la barra lateral izquierda, o pulsa `Cmd/Ctrl + Shift + L`
2. Elige dónde empezar: **desde el principio**, **desde el cursor** o **desde el último marcador**
3. Controla la reproducción desde la **barra de estado** en la parte inferior

| Acción | Cómo |
|--------|------|
| Leer la nota actual | `Cmd/Ctrl + Shift + L` o clic en 🔊 |
| Leer texto seleccionado | Selecciona → clic derecho → Read selection aloud |
| Pausar / Reanudar | `Cmd/Ctrl + Shift + P` o ⏸ en la barra de estado |
| Detener | `Cmd/Ctrl + Shift + S` o ⏹ en la barra de estado |
| Retomar desde marcador | `Cmd/Ctrl + Shift + R` o 🔖 Resume en la barra de estado |

## Atajos de teclado

| Función | Atajo por defecto |
|---------|------------------|
| Leer nota actual | `Cmd/Ctrl + Shift + L` |
| Pausar / Reanudar | `Cmd/Ctrl + Shift + P` |
| Detener | `Cmd/Ctrl + Shift + S` |
| Retomar desde marcador | `Cmd/Ctrl + Shift + R` |
| Frase siguiente | — (configurable en Hotkeys) |
| Frase anterior | — |
| Acelerar (+0.25×) | — |
| Reducir velocidad (−0.25×) | — |
| Ver todos los marcadores | — |
| Borrar marcador actual | — |

## Dónde empezar a leer

Al pulsar `Cmd/Ctrl + Shift + L` aparece un selector con estas opciones:

- **From beginning** — desde la primera frase
- **From cursor** — desde donde está el cursor
- **From bookmark** — donde lo dejaste la última vez (solo si hay marcador guardado)

## Sistema de marcadores

- Se guarda un marcador **automáticamente** cada vez que pausas o paras
- Cuando la nota activa tiene marcador y no estás reproduciendo, aparece **🔖 Resume** en la barra de estado
- Durante la reproducción, clic en 🔖 → salta al marcador
- Clic derecho en 🔖 → borra el marcador
- Clic en 📋 → lista todos los marcadores del vault

## Voces disponibles

| Voz | Descripción |
|-----|-------------|
| af_sky *(por defecto)* | Inglés americano, femenina — Sky |
| af_bella | Inglés americano, femenina — Bella |
| af_nicole | Inglés americano, femenina — Nicole |
| am_adam | Inglés americano, masculina — Adam |
| am_michael | Inglés americano, masculina — Michael |
| bf_emma | Inglés británico, femenina — Emma |
| bm_george | Inglés británico, masculina — George |

## Configuración

### Servidor TTS

| Ajuste | Valor por defecto | Notas |
|--------|------------------|-------|
| Server Dependencies | — | Estado de la instalación + botón para instalar |
| Server Status | — | Sondeo en vivo; muestra progreso del modelo |
| Auto-start server | Activado | Inicia el servidor al cargar el plugin |
| Server Port | 19199 | Cambia si hay conflicto de puertos |
| Node.js Path | Autodetectar | Configura manualmente si falla la detección |
| Model Quantization | q8 (~90 MB) | q4 = más rápido/ligero; fp32 = mejor calidad |

### Voz y reproducción

| Ajuste | Por defecto |
|--------|------------|
| Voice | af_sky |
| Speed | 1.0× |
| Auto-scroll | Activado |
| Resaltar frase actual | Activado |
| Color de resaltado | Amarillo 30% |

### Filtro de contenido (todos activados por defecto)

Omite: bloques de código · frontmatter · comentarios · notas al pie · URLs · hashtags · bloques matemáticos

## Limitaciones conocidas

- **Solo escritorio** — Obsidian Mobile no soporta los binarios nativos de Node.js que necesita ONNX Runtime
- **Node.js obligatorio** — el servidor de inferencia corre como proceso independiente
- **Primera vez necesita internet** — el modelo Kokoro se descarga de HuggingFace solo una vez
- **macOS + nvm** — el plugin detecta Node.js a través del login shell; si falla, pon la ruta manualmente
- **Solo editor de código fuente** — el resaltado no funciona en la vista de lectura

## Preguntas frecuentes

**No aparece nada en la barra de estado.**
La barra de reproducción solo aparece mientras se está leyendo. El botón 🔖 Resume solo se muestra cuando hay un marcador guardado y no se está reproduciendo.

**El servidor aparece siempre como "no iniciado".**
Ve a Ajustes → Local TTS → Start Server. Revisa la ruta de Node.js y prueba con el botón Detect.

**Error: "no se encuentra node".**
Instala Node.js (≥ 18) y pulsa **Detect** en los ajustes, o introduce la ruta completa manualmente.

**La descarga del modelo se cuelga.**
Reinicia el servidor — continuará desde donde se quedó.

**El audio suena entrecortado.**
Baja las generaciones paralelas en los ajustes avanzados (por defecto 3) o prueba el modelo q4.

**El resaltado se queda en la primera frase.**
Asegúrate de estar en el editor de fuente, no en la vista de lectura. Si sigue pasando, desactiva y vuelve a activar el plugin.

---

> ¿Te gusta el TTS offline? Échale un ojo a **PaperVoice** en la App Store — un lector de PDF con IA pensado para artículos académicos.

## Apoya el proyecto

Si el plugin te resulta útil, puedes invitarme a un café ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Licencia

MIT © 2025 applefavorite
