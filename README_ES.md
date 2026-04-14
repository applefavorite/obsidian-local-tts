🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Lee tus notas en voz alta

Síntesis de voz neuronal **offline** de alta calidad para Obsidian. Sin clave de API, sin internet (después del primer uso), sin suscripciones.

## Características

- 🔇 **100 % offline** — funciona completamente en tu máquina tras la descarga inicial del modelo
- 🧠 **Calidad neuronal** — basado en Kokoro-82M, un modelo TTS de vanguardia con 82 millones de parámetros
- 📝 **Análisis inteligente de Markdown** — omite automáticamente bloques de código, frontmatter, URLs, etiquetas, fórmulas matemáticas y comentarios
- ✨ **Resaltado de frases** — el editor resalta la frase que se está leyendo en tiempo real
- 📍 **Desplazamiento automático** — el editor hace scroll para mantener la frase actual visible
- 🔖 **Marcadores y reanudación** — guarda tu posición automáticamente al pausar o detener
- ⚡ **Reproducción en streaming** — el audio comienza de inmediato mientras se pregeneran las siguientes frases
- 🎛️ **Controles de reproducción** — play/pausa, saltar frase, velocidad variable (0,5×–2,0×)
- 🗣️ **7 voces** — inglés americano y británico, masculino y femenino
- 🖥️ **Solo escritorio** — macOS, Windows, Linux (requiere Electron / Node.js)

## Capturas de pantalla

### Lectura con resaltado de frases
![Reading](screenshots/1.png)

### Configuración
![Settings](screenshots/2.png)

### Comandos
![Commands](screenshots/3.png)

### Controles de reproducción
![Controls](screenshots/4.png)

### Marcadores
![Bookmarks](screenshots/5.png)

## Requisitos

- **Obsidian Desktop** (no compatible con móvil)
- **Node.js ≥ 18** instalado en el sistema
  - macOS / Linux: instalar con [nvm](https://github.com/nvm-sh/nvm) o [Homebrew](https://brew.sh)
  - Windows: descargar desde [nodejs.org](https://nodejs.org)
- ~90 MB de espacio en disco para el modelo predeterminado
- Acceso a internet **solo** para la descarga inicial del modelo (luego funciona offline)

## Instalación

### Manual (hasta la aprobación como plugin comunitario)

1. Descarga `main.js`, `styles.css`, `manifest.json` y la carpeta `server/` desde la [última versión](https://github.com/applefavorite/obsidian-local-tts/releases).
2. Copia todo a `<vault>/.obsidian/plugins/obsidian-local-tts/`.
3. Activa **Local TTS** en Ajustes → Plugins de la comunidad.

El plugin instala automáticamente sus dependencias del servidor (`kokoro-js`) en la primera carga.

### Lista de verificación para el primer uso

1. Abre Ajustes → Local TTS.
2. Confirma que **Server Dependencies** muestra ✅. Si no, haz clic en **Install Dependencies**.
3. El servidor TTS se inicia automáticamente (Server Status muestra ✅ Running).
4. En el primer inicio, el modelo Kokoro (~90 MB) se descarga desde HuggingFace — tarda 1–3 minutos según tu conexión.
5. Una vez que el estado muestre **model ready**, abre cualquier nota y pulsa `Cmd/Ctrl + Shift + L`.

## Uso

| Acción | Cómo |
|--------|------|
| Leer nota actual | `Cmd/Ctrl + Shift + L` o clic en 🔊 de la barra lateral |
| Leer texto seleccionado | Selecciona texto → clic derecho → Read selection aloud |
| Pausar / Reanudar | `Cmd/Ctrl + Shift + P` o clic en ⏸ de la barra de estado |
| Detener | `Cmd/Ctrl + Shift + S` o clic en ⏹ de la barra de estado |
| Reanudar desde marcador | `Cmd/Ctrl + Shift + R` o clic en "🔖 Resume" en la barra de estado |

## Atajos de teclado

| Comando | Atajo predeterminado |
|---------|---------------------|
| Leer nota actual | `Cmd/Ctrl + Shift + L` |
| Pausar / Reanudar | `Cmd/Ctrl + Shift + P` |
| Detener lectura | `Cmd/Ctrl + Shift + S` |
| Reanudar desde marcador | `Cmd/Ctrl + Shift + R` |
| Siguiente frase | — (asignable en Hotkeys) |
| Frase anterior | — |
| Acelerar (+0,25×) | — |
| Reducir velocidad (−0,25×) | — |
| Mostrar todos los marcadores | — |
| Borrar marcador de la nota actual | — |

## Opciones de inicio de lectura

Al pulsar `Cmd/Ctrl + Shift + L` aparece un selector:

- **From beginning** — comenzar desde la frase 1
- **From cursor** — comenzar desde la frase donde está el cursor
- **From bookmark** *(si existe)* — reanudar desde donde se detuvo

## Sistema de marcadores

- Un marcador se **guarda automáticamente** cada vez que pausas o detienes la lectura.
- Almacena el índice de la frase y un fragmento de vista previa.
- La cápsula **🔖 Resume** en la barra de estado aparece cuando la nota activa tiene un marcador.
- Haz clic en 🔖 durante la reproducción para saltar al marcador.
- Clic derecho en 🔖 para borrar el marcador.
- Clic en 📋 para ver todos los marcadores del vault.

## Voces disponibles

| Voz | Descripción |
|-----|-------------|
| af_sky *(predeterminada)* | Inglés americano femenino — Sky |
| af_bella | Inglés americano femenino — Bella |
| af_nicole | Inglés americano femenino — Nicole |
| am_adam | Inglés americano masculino — Adam |
| am_michael | Inglés americano masculino — Michael |
| bf_emma | Inglés británico femenino — Emma |
| bm_george | Inglés británico masculino — George |

## Referencia de ajustes

### Servidor TTS
| Ajuste | Predeterminado | Notas |
|--------|----------------|-------|
| Server Dependencies | — | Muestra estado de instalación; botón para instalar |
| Server Status | — | Sondeo en vivo; muestra progreso de carga del modelo |
| Auto-start server | Activado | Inicia el servidor al cargar el plugin |
| Server Port | 19199 | Cambiar si hay conflicto de puertos |
| Node.js Path | Auto-detectar | Configurar manualmente si la detección falla |
| Model Quantization | q8 (~90 MB) | q4 = más rápido/pequeño; fp32 = mejor calidad |

### Voz y reproducción
| Ajuste | Predeterminado |
|--------|----------------|
| Voice | af_sky |
| Speed | 1,0× |
| Auto-scroll | Activado |
| Highlight current sentence | Activado |
| Highlight color | Amarillo 30% |

### Filtrado de contenido (todos activados por defecto)
Omitir bloques de código · frontmatter · comentarios · notas al pie · URLs · hashtags · bloques matemáticos

## Limitaciones conocidas

- **Solo escritorio** — ONNX Runtime requiere binarios nativos de Node.js no disponibles en Obsidian móvil.
- **Node.js requerido** — el servidor de inferencia se ejecuta como proceso Node.js independiente.
- **Internet en primer uso** — el modelo Kokoro se descarga desde HuggingFace únicamente la primera vez.
- **macOS Gatekeeper** — si Node.js se instaló con nvm, el plugin lo detecta mediante el shell de inicio; si falla, configura la ruta manualmente.
- **Solo vista de fuente** — el resaltado de frases funciona únicamente en el editor de fuente Markdown, no en la vista de lectura.

## Preguntas frecuentes

**La barra de estado no muestra nada.**
La barra de reproducción solo aparece durante la lectura. La cápsula 🔖 Resume aparece cuando la nota activa tiene un marcador.

**El servidor sigue mostrando "no iniciado".**
Ve a Ajustes → Local TTS → Start Server. Comprueba la ruta de Node.js y haz clic en Detect.

**Error "no se encuentra node".**
Instala Node.js (≥ 18), luego haz clic en **Detect** en los ajustes o introduce la ruta manualmente.

**La descarga del modelo es lenta o falla.**
El modelo de ~90 MB se descarga desde HuggingFace. Si se agota el tiempo, reinicia el servidor — continuará automáticamente.

**El audio suena entrecortado.**
Reduce las generaciones paralelas en Ajustes → Avanzado (predeterminado: 3) o prueba una cuantización más rápida (q4).

**El resaltado se queda en la primera frase.**
Asegúrate de estar en el editor de fuente (no en la vista de lectura). Si el problema persiste, desactiva y vuelve a activar el plugin.

---

> ¿Te gusta el TTS offline? Echa un vistazo a **PaperVoice** en la App Store — lector de PDF con IA para artículos académicos.

## Apoyo

Si este plugin te resulta útil, considera invitarme a un café ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Licencia

MIT © 2025 applefavorite
