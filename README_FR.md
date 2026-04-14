🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Lisez vos notes à voix haute

Synthèse vocale neuronale **hors ligne** de haute qualité pour Obsidian. Pas de clé API, pas d'internet (après le premier démarrage), pas d'abonnement.

## Fonctionnalités

- 🔇 **100 % hors ligne** — fonctionne entièrement en local après le premier téléchargement du modèle
- 🧠 **Qualité neuronale** — propulsé par Kokoro-82M, un modèle TTS de pointe à 82 millions de paramètres
- 📝 **Analyse Markdown intelligente** — ignore automatiquement les blocs de code, le frontmatter, les URLs, les tags, les formules mathématiques et les commentaires
- ✨ **Mise en évidence des phrases** — l'éditeur surligne la phrase en cours de lecture en temps réel
- 📍 **Défilement automatique** — l'éditeur fait défiler la page pour garder la phrase actuelle visible
- 🔖 **Signets et reprise** — sauvegarde automatiquement votre position lors d'une pause ou d'un arrêt
- ⚡ **Lecture en streaming** — l'audio commence immédiatement pendant la prégénération des phrases suivantes
- 🎛️ **Contrôles de lecture** — lecture/pause, passer une phrase, vitesse variable (0,5×–2,0×)
- 🗣️ **7 voix** — anglais américain et britannique, masculin et féminin
- 🖥️ **Ordinateur uniquement** — macOS, Windows, Linux (nécessite Electron / Node.js)

## Captures d'écran

### Lecture avec mise en évidence des phrases
![Reading](screenshots/1.png)

### Paramètres
![Settings](screenshots/2.png)

### Commandes
![Commands](screenshots/3.png)

### Contrôles de lecture
![Controls](screenshots/4.png)

### Signets
![Bookmarks](screenshots/5.png)

## Prérequis

- **Obsidian Desktop** (non compatible avec le mobile)
- **Node.js ≥ 18** installé sur votre système
  - macOS / Linux : installer via [nvm](https://github.com/nvm-sh/nvm) ou [Homebrew](https://brew.sh)
  - Windows : télécharger depuis [nodejs.org](https://nodejs.org)
- ~90 Mo d'espace disque pour le modèle par défaut
- Accès internet **uniquement** pour le premier téléchargement du modèle (mis en cache ensuite)

## Installation

### Manuelle (en attendant l'approbation comme plugin communautaire)

1. Téléchargez `main.js`, `styles.css`, `manifest.json` et le dossier `server/` depuis la [dernière version](https://github.com/applefavorite/obsidian-local-tts/releases).
2. Copiez tout dans `<vault>/.obsidian/plugins/obsidian-local-tts/`.
3. Activez **Local TTS** dans Paramètres → Plugins communautaires.

Le plugin installe automatiquement ses dépendances serveur (`kokoro-js`) au premier chargement.

### Liste de vérification pour la première utilisation

1. Ouvrez Paramètres → Local TTS.
2. Confirmez que **Server Dependencies** affiche ✅. Sinon, cliquez sur **Install Dependencies**.
3. Le serveur TTS démarre automatiquement (Server Status affiche ✅ Running).
4. Au premier démarrage, le modèle Kokoro (~90 Mo) est téléchargé depuis HuggingFace — 1 à 3 minutes selon votre connexion.
5. Une fois le statut **model ready** affiché, ouvrez une note et appuyez sur `Cmd/Ctrl + Shift + L`.

## Utilisation

| Action | Comment |
|--------|---------|
| Lire la note actuelle | `Cmd/Ctrl + Shift + L` ou cliquer sur 🔊 dans la barre latérale |
| Lire le texte sélectionné | Sélectionner le texte → clic droit → Read selection aloud |
| Pause / Reprendre | `Cmd/Ctrl + Shift + P` ou cliquer sur ⏸ dans la barre de statut |
| Arrêter | `Cmd/Ctrl + Shift + S` ou cliquer sur ⏹ dans la barre de statut |
| Reprendre depuis le signet | `Cmd/Ctrl + Shift + R` ou cliquer sur « 🔖 Resume » dans la barre de statut |

## Raccourcis clavier

| Commande | Raccourci par défaut |
|----------|---------------------|
| Lire la note actuelle | `Cmd/Ctrl + Shift + L` |
| Pause / Reprendre | `Cmd/Ctrl + Shift + P` |
| Arrêter la lecture | `Cmd/Ctrl + Shift + S` |
| Reprendre depuis le signet | `Cmd/Ctrl + Shift + R` |
| Phrase suivante | — (assignable dans les raccourcis) |
| Phrase précédente | — |
| Accélérer (+0,25×) | — |
| Ralentir (−0,25×) | — |
| Afficher tous les signets | — |
| Effacer le signet de la note actuelle | — |

## Options de démarrage de lecture

En appuyant sur `Cmd/Ctrl + Shift + L`, un sélecteur apparaît :

- **From beginning** — commencer à la phrase 1
- **From cursor** — commencer à la phrase où se trouve le curseur
- **From bookmark** *(si existant)* — reprendre depuis le dernier arrêt

## Système de signets

- Un signet est **sauvegardé automatiquement** à chaque pause ou arrêt.
- Il enregistre l'index de la phrase et un aperçu du texte.
- La capsule **🔖 Resume** dans la barre de statut apparaît quand la note active a un signet.
- Cliquer sur 🔖 pendant la lecture pour sauter au signet.
- Clic droit sur 🔖 pour supprimer le signet.
- Cliquer sur 📋 pour voir tous les signets du vault.

## Voix disponibles

| Voix | Description |
|------|-------------|
| af_sky *(par défaut)* | Anglais américain féminin — Sky |
| af_bella | Anglais américain féminin — Bella |
| af_nicole | Anglais américain féminin — Nicole |
| am_adam | Anglais américain masculin — Adam |
| am_michael | Anglais américain masculin — Michael |
| bf_emma | Anglais britannique féminin — Emma |
| bm_george | Anglais britannique masculin — George |

## Référence des paramètres

### Serveur TTS
| Paramètre | Défaut | Notes |
|-----------|--------|-------|
| Server Dependencies | — | Affiche l'état d'installation ; bouton pour installer |
| Server Status | — | Sondage en direct ; affiche la progression du chargement |
| Auto-start server | Activé | Démarre le serveur au chargement du plugin |
| Server Port | 19199 | Modifier en cas de conflit de port |
| Node.js Path | Auto-détection | Configurer manuellement si la détection échoue |
| Model Quantization | q8 (~90 Mo) | q4 = plus rapide/léger ; fp32 = meilleure qualité |

### Voix et lecture
| Paramètre | Défaut |
|-----------|--------|
| Voice | af_sky |
| Speed | 1,0× |
| Auto-scroll | Activé |
| Highlight current sentence | Activé |
| Highlight color | Jaune 30 % |

### Filtrage du contenu (tous activés par défaut)
Ignorer les blocs de code · frontmatter · commentaires · notes de bas de page · URLs · hashtags · blocs mathématiques

## Limitations connues

- **Ordinateur uniquement** — ONNX Runtime nécessite des binaires natifs Node.js non disponibles sur Obsidian Mobile.
- **Node.js requis** — le serveur d'inférence fonctionne comme processus Node.js indépendant.
- **Internet au premier démarrage** — le modèle Kokoro est téléchargé depuis HuggingFace uniquement la première fois.
- **macOS Gatekeeper** — si Node.js est installé via nvm, le plugin le détecte via le shell de connexion ; en cas d'échec, configurez le chemin manuellement.
- **Vue source uniquement** — la mise en évidence fonctionne uniquement dans l'éditeur Markdown source, pas dans la vue de lecture.

## FAQ

**La barre de statut n'affiche rien.**
La barre de lecture n'apparaît que pendant la lecture. La capsule 🔖 Resume n'apparaît que si la note active a un signet.

**Le serveur reste « non démarré ».**
Aller dans Paramètres → Local TTS → Start Server. Vérifier le chemin Node.js et cliquer sur Detect.

**Erreur « node introuvable ».**
Installer Node.js (≥ 18), puis cliquer sur **Detect** dans les paramètres ou saisir le chemin manuellement.

**Téléchargement du modèle lent ou en échec.**
Le modèle de ~90 Mo est téléchargé depuis HuggingFace. En cas d'expiration, redémarrer le serveur — il reprend automatiquement.

**L'audio semble saccadé.**
Réduire les générations parallèles dans Paramètres → Avancé (défaut : 3) ou essayer une quantification plus rapide (q4).

**La mise en évidence reste sur la première phrase.**
S'assurer d'utiliser l'éditeur source (pas la vue de lecture). Si le problème persiste, désactiver puis réactiver le plugin.

---

> Vous aimez la synthèse vocale hors ligne ? Découvrez **PaperVoice** sur l'App Store — un lecteur PDF alimenté par IA pour les articles académiques.

## Soutien

Si ce plugin vous est utile, vous pouvez m'offrir un café ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Licence

MIT © 2025 applefavorite
