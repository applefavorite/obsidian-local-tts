🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Notizen vorlesen lassen

Hochwertiges **Offline**-TTS für Obsidian, direkt auf Ihrem Rechner. Kein API-Schlüssel, kein Abo, kein Internetzugang nach dem ersten Start.

## Was das Plugin kann

- 🔇 **Vollständig offline** — nach dem einmaligen Modell-Download läuft alles lokal
- 🧠 **Neuronale Sprachsynthese** — Kokoro-82M mit 82 Mio. Parametern, deutlich besser als klassische TTS-Systeme
- 📝 **Markdown-bewusst** — Code-Blöcke, Frontmatter, URLs, Tags, Formeln und Kommentare werden automatisch übersprungen
- ✨ **Satz-Hervorhebung** — der aktuelle Satz wird im Editor live markiert
- 📍 **Automatisches Scrollen** — der Cursor folgt der Wiedergabe
- 🔖 **Lesezeichen & Fortsetzen** — Position wird beim Pausieren/Stoppen automatisch gespeichert
- ⚡ **Streaming** — Wiedergabe beginnt sofort, nächste Sätze werden parallel erzeugt
- 🎛️ **Vollständige Steuerung** — Play/Pause, Satz vor/zurück, Geschwindigkeit 0,5×–2,0× über die Statusleiste
- 🗣️ **7 Stimmen** — amerikanisches und britisches Englisch, männlich/weiblich
- 🖥️ **Nur Desktop** — macOS, Windows, Linux (Node.js erforderlich)

## Screenshots

### Vorlesen mit Satz-Hervorhebung
![Reading](screenshots/1.png)

### Einstellungen
![Settings](screenshots/2.png)

### Befehle
![Commands](screenshots/3.png)

### Wiedergabe-Steuerleiste
![Controls](screenshots/4.png)

### Lesezeichen-Verwaltung
![Bookmarks](screenshots/5.png)

## Voraussetzungen

- **Obsidian Desktop** (Mobile wird nicht unterstützt)
- **Node.js ≥ 18** — das Plugin startet einen eigenen Node-Prozess für die Inferenz
  - macOS / Linux: empfohlen über [nvm](https://github.com/nvm-sh/nvm) oder Homebrew
  - Windows: Installer von [nodejs.org](https://nodejs.org)
- Ca. 90 MB Speicherplatz für das Standardmodell (q8)
- Internetzugang nur beim ersten Modell-Download erforderlich

## Installation

### Manuell (bis zur Aufnahme in den Community-Plugin-Store)

1. `main.js`, `styles.css`, `manifest.json` und den Ordner `server/` aus dem [neuesten Release](https://github.com/applefavorite/obsidian-local-tts/releases) herunterladen
2. Alles nach `<Vault>/.obsidian/plugins/obsidian-local-tts/` kopieren
3. In Einstellungen → Community-Plugins **Local TTS** aktivieren

Beim ersten Start führt das Plugin automatisch `npm install` für `kokoro-js` aus.

### Erste Schritte

1. Einstellungen → Local TTS öffnen
2. **Server Dependencies** muss ✅ zeigen — falls nicht, **Install Dependencies** klicken
3. Der TTS-Server startet automatisch (Statusanzeige: ✅ Running)
4. Beim ersten Start lädt Kokoro (~90 MB) von HuggingFace — je nach Verbindung 1–3 Minuten
5. Sobald **model ready** erscheint: eine Notiz öffnen und `Cmd/Ctrl + Shift + L` drücken

## Bedienung

1. Das **🔊-Symbol** in der linken Seitenleiste anklicken oder `Cmd/Ctrl + Shift + L` drücken
2. Startposition wählen: **Anfang**, **Cursor-Position** oder **letztes Lesezeichen**
3. Wiedergabe über die **Statusleiste** unten steuern

| Aktion | Wie |
|--------|-----|
| Aktuelle Notiz vorlesen | `Cmd/Ctrl + Shift + L` oder 🔊 in der Seitenleiste |
| Markierten Text vorlesen | Text markieren → Rechtsklick → Read selection aloud |
| Pause / Fortsetzen | `Cmd/Ctrl + Shift + P` oder ⏸ in der Statusleiste |
| Stopp | `Cmd/Ctrl + Shift + S` oder ⏹ in der Statusleiste |
| Ab Lesezeichen fortsetzen | `Cmd/Ctrl + Shift + R` oder 🔖 Resume in der Statusleiste |

## Tastenkürzel

| Funktion | Standard |
|----------|----------|
| Notiz vorlesen | `Cmd/Ctrl + Shift + L` |
| Pause / Fortsetzen | `Cmd/Ctrl + Shift + P` |
| Stopp | `Cmd/Ctrl + Shift + S` |
| Ab Lesezeichen fortsetzen | `Cmd/Ctrl + Shift + R` |
| Nächster Satz | — (in Hotkeys belegbar) |
| Vorheriger Satz | — |
| Schneller (+0,25×) | — |
| Langsamer (−0,25×) | — |
| Alle Lesezeichen anzeigen | — |
| Lesezeichen löschen | — |

## Startposition wählen

Nach `Cmd/Ctrl + Shift + L` erscheint ein Auswahlmenü:

- **From beginning** — von vorne starten
- **From cursor** — ab der aktuellen Cursor-Position
- **From bookmark** — an der zuletzt gespeicherten Stelle weiterlesen (nur wenn ein Lesezeichen gesetzt ist)

## Lesezeichen

- Werden beim Pausieren oder Stoppen **automatisch gespeichert**
- Die Kapsel **🔖 Resume** in der Statusleiste erscheint, wenn die aktive Notiz ein Lesezeichen hat
- Klick auf 🔖 während der Wiedergabe → springt zum Lesezeichen
- Rechtsklick auf 🔖 → Lesezeichen löschen
- Klick auf 📋 → alle Lesezeichen im Vault anzeigen

## Verfügbare Stimmen

| Stimme | Beschreibung |
|--------|-------------|
| af_sky *(Standard)* | Amerikanisch-Englisch, weiblich — Sky |
| af_bella | Amerikanisch-Englisch, weiblich — Bella |
| af_nicole | Amerikanisch-Englisch, weiblich — Nicole |
| am_adam | Amerikanisch-Englisch, männlich — Adam |
| am_michael | Amerikanisch-Englisch, männlich — Michael |
| bf_emma | Britisch-Englisch, weiblich — Emma |
| bm_george | Britisch-Englisch, männlich — George |

## Einstellungen

### TTS-Server

| Einstellung | Standard | Hinweis |
|-------------|----------|---------|
| Server Dependencies | — | Installationsstatus + Schaltfläche |
| Server Status | — | Live-Abfrage; zeigt Modell-Ladefortschritt |
| Auto-start server | Ein | Server startet automatisch beim Plugin-Load |
| Server Port | 19199 | Bei Portkonflikten ändern |
| Node.js Path | Auto-Erkennung | Manuell setzen, falls Erkennung scheitert |
| Model Quantization | q8 (~90 MB) | q4 = schneller/kleiner; fp32 = beste Qualität |

### Stimme & Wiedergabe

| Einstellung | Standard |
|-------------|----------|
| Voice | af_sky |
| Speed | 1,0× |
| Auto-scroll | Ein |
| Satz hervorheben | Ein |
| Hervorhebungsfarbe | Gelb 30 % |

### Inhaltsfilter (alle standardmäßig aktiv)

Code-Blöcke · Frontmatter · Kommentare · Fußnoten · URLs · Hashtags · Mathe-Blöcke überspringen

## Bekannte Einschränkungen

- **Nur Desktop** — Obsidian Mobile wird nicht unterstützt (Node.js-Binärdateien fehlen)
- **Node.js erforderlich** — Inferenz läuft in einem separaten Prozess außerhalb von Electron
- **Einmalige Internetverbindung** — Kokoro-Modell wird nur beim ersten Start heruntergeladen
- **nvm unter macOS** — wird über Login-Shell erkannt; bei Problemen Pfad manuell eintragen
- **Nur Quell-Editor** — Hervorhebung funktioniert nicht in der Leseansicht

## Häufige Fragen

**Die Statusleiste zeigt nichts.**
Die Wiedergabeleiste erscheint nur bei aktiver Wiedergabe. 🔖 Resume wird nur bei gesetztem Lesezeichen angezeigt.

**Server startet nicht.**
Einstellungen → Local TTS → Start Server. Node.js Path prüfen und Detect klicken.

**Fehler: „node nicht gefunden".**
Node.js (≥ 18) installieren, dann in den Einstellungen auf **Detect** klicken oder den Pfad manuell eintragen.

**Modell-Download hängt.**
Bei Timeout einfach Server neu starten — der Download wird fortgesetzt.

**Ton ruckelt.**
Parallele Vorberechnungen auf 1–2 reduzieren oder Quantisierung q4 wählen.

---

> Gefällt Ihnen Offline-TTS? Schauen Sie sich **PaperVoice** im App Store an — KI-gestützter PDF-Vorleser für wissenschaftliche Texte.

## Unterstützung

Wenn das Plugin nützlich ist, freue ich mich über einen virtuellen Kaffee ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Lizenz

MIT © 2025 applefavorite
