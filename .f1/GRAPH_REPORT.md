# Graph Report - Lynx-Keymap-Pro  (2026-06-18)

## Corpus Check
- 67 files · ~71,753 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 490 nodes · 617 edges · 50 communities (47 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6f8e3391`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `Communities (49 total, 2 thin omitted)` - 47 edges
2. `Lynx Keymap` - 32 edges
3. `BaseManager` - 21 edges
4. `EditorDetector` - 13 edges
5. `compilerOptions` - 11 edges
6. `Graph Report - Lynx-Keymap-Pro  (2026-06-18)` - 11 edges
7. `WordWrapManager` - 9 edges
8. `EditorType` - 9 edges
9. `AICommandsManager` - 8 edges
10. `AIToggleManager` - 8 edges

## Surprising Connections (you probably didn't know these)
- `AICommandsManager` --inherits--> `BaseManager`  [EXTRACTED]
  src/keymaps/ai/commands-manager.ts → src/shared/base-manager.ts
- `KeymapLayoutManager` --inherits--> `BaseManager`  [EXTRACTED]
  src/keymaps/layout/manager.ts → src/shared/base-manager.ts
- `DebugManager` --inherits--> `BaseManager`  [EXTRACTED]
  src/editor/debug/panel.ts → src/shared/base-manager.ts
- `GitResetManager` --inherits--> `BaseManager`  [EXTRACTED]
  src/editor/git/reset-manager.ts → src/shared/base-manager.ts
- `WordWrapManager` --inherits--> `BaseManager`  [EXTRACTED]
  src/editor/wordwrap/manager.ts → src/shared/base-manager.ts

## Import Cycles
- 1-file cycle: `esbuild.js -> esbuild.js`

## Communities (50 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (24): AIToggleManager, DebugManager, execFileAsync, GitResetManager, LayoutMode, PANEL_CONFIGS, PanelCommandsManager, PanelConfig (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): AICommandsManager, ActionKey, AI_COMMANDS, EDITOR_PRIMARY_SETTING, EDITOR_SIGNATURES, EditorCommandMap, EditorType, KEYMAP_CONFIG (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (38): activationEvents, author, email, name, url, bugs, url, categories (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): [0.0.1] - 2025-04-26, [0.1.0] - 2025-06-20, [1.0.0] - 2025-07-11, [2.0.8] - 2025-07-24, [2.1.3] - 2025-08-03, [2.2.8] - 2026-05-08, [2.4.2] - 2026-05-27, Added (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (13): esbuild, esbuildProblemMatcherPlugin, main(), production, watch, devDependencies, esbuild, eslint (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (11): compilerOptions, esModuleInterop, lib, module, resolveJsonModule, rootDir, skipLibCheck, sourceMap (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (10): 🔀 Git, ⌨️ اختصارات عامة Pro, 🛠️ الإعدادات والنافذة, التثبيت, الطريقة 1 — الفتح السريع, الطريقة 2 — عرض الإضافات, 🧩 المحطة الطرفية [+], 🧪 تجريبي — `جديد` (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (10): ⌨️ Allgemeine Tastenkombinationen Pro, ▶️ Debugging, 🛠️ Einstellungen & Fenster, 🧪 Experimentelle Funktionen — `Neu`, 🔀 Git, Installation, Methode 1 — Schnelles Öffnen, Methode 2 — Erweiterungsansicht (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (10): ⌨️ Atajos Generales Pro, 🛠️ Configuración y Ventana, ▶️ Depuración, 🧪 Funciones Experimentales — `Nuevo`, 🔀 Git, Instalación, Método 1 — Apertura Rápida, Método 2 — Vista de Extensiones (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (10): ▶️ Débogage, 🧪 Fonctions Expérimentales — `Nouveau`, 🔀 Git, Installation, Méthode 1 — Ouverture Rapide, Méthode 2 — Vue des Extensions, 🛠️ Paramètres & Fenêtre, ⌨️ Raccourcis Généraux Pro (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): 🔀 Git, 🧩 टर्मिनल [+], ▶️ डिबगिंग, तरीका 1 — त्वरित ओपन, तरीका 2 — एक्सटेंशन व्यू, 🧪 प्रायोगिक — `नया`, मेरे बारे में, 🛠️ सेटिंग्स और विंडो (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (10): 🔀 Git, インストール, 🧩 ターミナル [+], ▶️ デバッグ, ⌨️ 一般キーバインド Pro, 🧪 実験的機能 — `新機能`, 方法 1 — クイックオープン, 方法 2 — 拡張機能ビュー (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (10): 🔀 Git, 나에 대해, ▶️ 디버깅, 방법 1 — 빠른 열기, 방법 2 — 확장 프로그램 보기, 🛠️ 설정 및 창, 설치, 🧪 실험적 기능 — `New` (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): ⌨️ Atalhos Gerais Pro, 🛠️ Configurações e Janela, ▶️ Depuração, 🔀 Git, Instalação, Método 1 — Abertura Rápida, Método 2 — Visualização de Extensões, 🧪 Recursos Experimentais — `Novo` (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (10): 🔀 Git, 🛠️ Настройки и Окно, Обо мне, ⌨️ Общие сочетания клавиш Pro, ▶️ Отладка, Способ 1 — Быстрое открытие, Способ 2 — Представление расширений, 🧩 Терминал [+] (+2 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): Cài đặt, 🛠️ Cài đặt & Cửa sổ, Cách 1 — Mở nhanh, Cách 2 — Chế độ xem Tiện ích mở rộng, 🔀 Git, ▶️ Gỡ lỗi, ⌨️ Phím tắt chung Pro, 🧩 Terminal [+] (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (10): 🔀 Git, 关于我, 安装, 🧪 实验性功能 — `新`, 方法 1 — 快速打开, 方法 2 — 扩展视图, 🧩 终端 [+], 🛠️ 设置与窗口 (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (9): AI Command System (the core abstraction), Architecture, Build & Dev Commands, Conventions, Extension ID, Panel position state, Project context (F1 My Memory), Terminal Panel Management (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (9): 🤖 AI Controller, Core Architecture, Essential Shortcuts, Key Systems, Lynx Keymap Pro Architecture, Overview, Project Structure, 🔔 Smart Notifications (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (9): About Me, ▶️ Debugging, ⌨️ General Keybindings Pro, 🔀 Git, Installation, Method 1 — Quick Open, Method 2 — Extensions View, 🛠️ Settings & Window (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): Code of Conduct, Contributions, Enforcement, Our Commitment, Scope, Standards

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): Contributing to Lynx Keymap Pro, Need Help?, Quick Start, Submitting a PR, What You Can Contribute

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (5): Get up and running straight away, Install your extension, Make changes, Welcome to your VS Code Extension, What's in the folder

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (5): [2.2.5] - 2026-05-05, Added, Changed, Improved, Removed

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (5): [2.2.9] - 2026-05-08, Added, Changed, Fixed, Improved

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (4): [2.0.0] - 2025-07-20, Added, Changed, Fixed

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (4): [2.0.1] - 2025-07-23, Added, Changed, Fixed

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (4): [2.0.6] - 2025-07-23, Added, Changed, Fixed

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (4): [2.2.0] - 2025-10-04, Added, Changed, Improved

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (3): [0.3.0] - 2025-06-25, Added, Changed

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (3): [0.6.0] - 2025-07-01, Added, Changed

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (3): [0.6.9] - 2025-07-05, Added, Fixed

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (3): [0.8.0] - 2025-07-08, Added, Changed

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (3): [0.9.1] - 2025-07-10, Added, Fixed

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (3): [1.1.1] - 2025-07-12, Added, Changed

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (3): [1.1.2] - 2025-07-15, Added, Fixed

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (3): [1.1.3] - 2025-07-18, Added, Changed

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (3): [2.1.0] - 2025-08-02, Added, Improved

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (3): [2.1.5] - 2025-08-11, Added, Changed

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (3): [2.1.8] - 2025-09-03, Added, Improved

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (3): [2.3.0] - 2026-05-08, Added, Improved

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): [2.3.1] - 2026-05-11, Fixed, Improved

### Community 43 - "Community 43"
Cohesion: 0.04
Nodes (47): Communities (49 total, 2 thin omitted), Community 0 - "Community 0", Community 10 - "Community 10", Community 11 - "Community 11", Community 12 - "Community 12", Community 13 - "Community 13", Community 14 - "Community 14", Community 15 - "Community 15" (+39 more)

### Community 46 - "Community 46"
Cohesion: 0.18
Nodes (10): Community Hubs (Navigation), Corpus Check, God Nodes (most connected - your core abstractions), Graph Freshness, Graph Report - Lynx-Keymap-Pro  (2026-06-18), Import Cycles, Knowledge Gaps, Suggested Questions (+2 more)

### Community 47 - "Community 47"
Cohesion: 0.60
Nodes (3): getTranslation(), promptInstallExtension(), notifyToggle()

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (4): Dependency graph, Package, Project map, Top-level folders

## Knowledge Gaps
- **312 isolated node(s):** `esbuild`, `production`, `esbuildProblemMatcherPlugin`, `name`, `displayName` (+307 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lynx Keymap` connect `Community 3` to `Community 23`, `Community 24`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 49`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Communities (49 total, 2 thin omitted)` connect `Community 43` to `Community 46`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `BaseManager` connect `Community 0` to `Community 1`, `Community 25`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `esbuild`, `production`, `esbuildProblemMatcherPlugin` to the rest of the system?**
  _312 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08583959899749373 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._