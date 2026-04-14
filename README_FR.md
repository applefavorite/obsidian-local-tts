🌐 [English](README.md) | [中文](README_ZH.md) | [Deutsch](README_DE.md) | [日本語](README_JA.md) | [Español](README_ES.md) | [Français](README_FR.md) | [한국어](README_KO.md) | [Português](README_PT.md)

# Local TTS — Faites lire vos notes à voix haute

Un plugin de synthèse vocale neuronale **hors ligne** pour Obsidian. Pas de clé API, pas d'abonnement, et aucune connexion internet après le premier démarrage.

## Ce que fait ce plugin

- 🔇 **Entièrement hors ligne** — après le téléchargement initial du modèle, plus aucune connexion nécessaire
- 🧠 **Voix neuronale** — propulsé par Kokoro-82M (82 millions de paramètres), nettement plus naturel que les TTS classiques
- 📝 **Comprend le Markdown** — blocs de code, frontmatter, URLs, tags, formules et commentaires sont ignorés automatiquement
- ✨ **Surlignage en temps réel** — la phrase en cours de lecture est mise en évidence dans l'éditeur
- 📍 **Défilement automatique** — l'éditeur suit la lecture sans intervention de votre part
- 🔖 **Signets automatiques** — votre position est sauvegardée à chaque pause ou arrêt ; reprenez en un clic
- ⚡ **Lecture immédiate** — l'audio démarre pendant que les phrases suivantes sont générées en arrière-plan
- 🎛️ **Contrôle complet** — lecture/pause, phrase suivante/précédente, vitesse (0,5×–2,0×) depuis la barre de statut
- 🗣️ **7 voix** — anglais américain et britannique, masculin et féminin
- 🖥️ **Desktop uniquement** — macOS, Windows, Linux (Node.js requis)

## Captures d'écran

### Lecture avec surlignage des phrases
![Reading](screenshots/1.png)

### Paramètres
![Settings](screenshots/2.png)

### Commandes disponibles
![Commands](screenshots/3.png)

### Barre de contrôle
![Controls](screenshots/4.png)

### Gestion des signets
![Bookmarks](screenshots/5.png)

## Prérequis

- **Obsidian Desktop** (non compatible avec mobile)
- **Node.js ≥ 18** — l'inférence tourne dans un processus Node indépendant, hors du renderer Electron
  - macOS / Linux : installation recommandée via [nvm](https://github.com/nvm-sh/nvm) ou Homebrew
  - Windows : installeur disponible sur [nodejs.org](https://nodejs.org)
- Environ 90 Mo d'espace disque pour le modèle par défaut (q8)
- Connexion internet uniquement pour le premier téléchargement du modèle

## Installation

### Manuelle (en attendant la validation dans le store communautaire)

1. Téléchargez `main.js`, `styles.css`, `manifest.json` et le dossier `server/` depuis la [dernière version](https://github.com/applefavorite/obsidian-local-tts/releases)
2. Copiez tout dans `<votre vault>/.obsidian/plugins/obsidian-local-tts/`
3. Activez **Local TTS** dans Paramètres → Plugins communautaires

Au premier chargement, le plugin lance automatiquement `npm install` pour installer `kokoro-js`.

### Première utilisation

1. Ouvrez Paramètres → Local TTS
2. **Server Dependencies** doit afficher ✅ — sinon, cliquez sur **Install Dependencies**
3. Le serveur TTS démarre automatiquement (Server Status : ✅ Running)
4. Le modèle Kokoro (~90 Mo) est téléchargé depuis HuggingFace au premier démarrage — comptez 1 à 3 minutes selon votre connexion
5. Dès que **model ready** s'affiche, ouvrez une note et appuyez sur `Cmd/Ctrl + Shift + L`

## Utilisation

1. Cliquez sur l'**icône 🔊** dans la barre latérale gauche, ou appuyez sur `Cmd/Ctrl + Shift + L`
2. Choisissez où commencer : **depuis le début**, **depuis le curseur** ou **depuis le dernier signet**
3. Contrôlez la lecture depuis la **barre de statut** en bas de fenêtre

| Action | Comment |
|--------|---------|
| Lire la note actuelle | `Cmd/Ctrl + Shift + L` ou clic sur 🔊 |
| Lire le texte sélectionné | Sélectionner → clic droit → Read selection aloud |
| Pause / Reprendre | `Cmd/Ctrl + Shift + P` ou ⏸ dans la barre de statut |
| Arrêter | `Cmd/Ctrl + Shift + S` ou ⏹ dans la barre de statut |
| Reprendre depuis le signet | `Cmd/Ctrl + Shift + R` ou 🔖 Resume dans la barre de statut |

## Raccourcis clavier

| Fonction | Raccourci par défaut |
|----------|---------------------|
| Lire la note actuelle | `Cmd/Ctrl + Shift + L` |
| Pause / Reprendre | `Cmd/Ctrl + Shift + P` |
| Arrêter | `Cmd/Ctrl + Shift + S` |
| Reprendre depuis le signet | `Cmd/Ctrl + Shift + R` |
| Phrase suivante | — (assignable dans les raccourcis) |
| Phrase précédente | — |
| Accélérer (+0,25×) | — |
| Ralentir (−0,25×) | — |
| Voir tous les signets | — |
| Supprimer le signet actuel | — |

## Point de départ de la lecture

Après `Cmd/Ctrl + Shift + L`, un sélecteur vous propose :

- **From beginning** — depuis la première phrase
- **From cursor** — depuis la phrase où se trouve le curseur
- **From bookmark** — là où vous vous êtes arrêté la dernière fois (affiché uniquement si un signet existe)

## Système de signets

- Un signet est **sauvegardé automatiquement** à chaque pause ou arrêt
- Quand la note active a un signet et que la lecture est inactive, **🔖 Resume** apparaît dans la barre de statut
- Cliquez sur 🔖 pendant la lecture pour sauter au signet
- Clic droit sur 🔖 pour supprimer le signet
- Cliquez sur 📋 pour voir tous les signets du vault

## Voix disponibles

| Voix | Description |
|------|-------------|
| af_sky *(par défaut)* | Anglais américain, féminin — Sky |
| af_bella | Anglais américain, féminin — Bella |
| af_nicole | Anglais américain, féminin — Nicole |
| am_adam | Anglais américain, masculin — Adam |
| am_michael | Anglais américain, masculin — Michael |
| bf_emma | Anglais britannique, féminin — Emma |
| bm_george | Anglais britannique, masculin — George |

## Paramètres

### Serveur TTS

| Paramètre | Valeur par défaut | Notes |
|-----------|------------------|-------|
| Server Dependencies | — | Statut de l'installation + bouton pour installer |
| Server Status | — | Sondage en direct ; progression du chargement du modèle |
| Auto-start server | Activé | Le serveur démarre avec le plugin |
| Server Port | 19199 | À modifier en cas de conflit de port |
| Node.js Path | Détection auto | À renseigner manuellement si la détection échoue |
| Model Quantization | q8 (~90 Mo) | q4 = plus rapide/léger ; fp32 = meilleure qualité |

### Voix et lecture

| Paramètre | Par défaut |
|-----------|-----------|
| Voice | af_sky |
| Speed | 1,0× |
| Auto-scroll | Activé |
| Surligner la phrase en cours | Activé |
| Couleur du surlignage | Jaune 30 % |

### Filtrage de contenu (tous activés par défaut)

Ignorer : blocs de code · frontmatter · commentaires · notes de bas de page · URLs · hashtags · blocs mathématiques

## Limitations connues

- **Desktop uniquement** — Obsidian Mobile ne dispose pas des binaires natifs Node.js nécessaires à ONNX Runtime
- **Node.js obligatoire** — le serveur d'inférence tourne en dehors du renderer Electron
- **Connexion initiale requise** — le modèle Kokoro est téléchargé une seule fois depuis HuggingFace
- **macOS + nvm** — Node.js est détecté via le login shell ; en cas d'échec, renseignez le chemin manuellement
- **Éditeur source uniquement** — le surlignage ne fonctionne pas dans la vue de lecture

## Questions fréquentes

**Rien n'apparaît dans la barre de statut.**
La barre de lecture s'affiche uniquement en cours de lecture. 🔖 Resume n'apparaît que si la note a un signet et si la lecture est inactive.

**Le serveur reste "non démarré".**
Paramètres → Local TTS → Start Server. Vérifiez le chemin Node.js et cliquez sur Detect.

**Erreur "node introuvable".**
Installez Node.js (≥ 18), puis cliquez sur **Detect** dans les paramètres ou saisissez le chemin manuellement.

**Le téléchargement du modèle se bloque.**
Relancez le serveur — le téléchargement reprendra là où il s'est arrêté.

**L'audio est saccadé.**
Réduisez les générations parallèles dans les paramètres avancés (3 par défaut) ou passez au modèle q4.

**Le surlignage reste sur la première phrase.**
Vérifiez que vous êtes en mode édition source (pas en vue de lecture). Sinon, désactivez et réactivez le plugin.

---

> Vous aimez le TTS hors ligne ? Découvrez **PaperVoice** sur l'App Store — un lecteur de PDF propulsé par IA, conçu pour les articles de recherche.

## Soutenir le projet

Si ce plugin vous est utile, un café virtuel est toujours apprécié ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/applefavorite)

## Licence

MIT © 2025 applefavorite
