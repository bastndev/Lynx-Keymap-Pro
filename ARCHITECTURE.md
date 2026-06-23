# ⌨️ Lynx Keymap Pro — Architecture

A VS Code extension that gives **one keyboard layout for every AI editor**. Press the same shortcut in VS Code, Cursor, Windsurf, Trae, Antigravity, Kiro or Firebase Studio — Lynx detects which editor you're in and runs the right native command underneath.

It's a **pure host extension**: no webviews, no UI bundles. Everything is a small set of managers wired up at startup behind a single keystroke map.

---

## 📁 Project Structure

```text
Lynx-Keymap-Pro/
├── src/
│   ├── extension.ts                 # Entry — builds managers, runs startup tasks
│   │
│   ├── keymaps/                     # ⌨️ The keymap brain
│   │   ├── index.ts                 # Barrel re-export of every manager
│   │   ├── ai/                      # 🤖 AI Controller
│   │   │   ├── configs.ts           # Editor signatures + command maps (data)
│   │   │   ├── rules.ts             # Detection order + fallback rules (logic)
│   │   │   ├── detector.ts          # Which editor am I in? (cached 5 min)
│   │   │   ├── commands-manager.ts  # One Lynx command → right native command
│   │   │   └── toggle-manager.ts    # Toggle AI suggestions on/off
│   │   ├── layout/manager.ts        # Switch Normal ⇄ 75% keymap (no reload)
│   │   ├── terminal/                # 📟 Terminal panel positioning
│   │   │   ├── side-panel.ts        # Dock terminal left/right vs bottom
│   │   │   ├── settings.ts          # Save/restore the user's layout settings
│   │   │   ├── startup-recovery.ts  # Heal a half-applied side layout on boot
│   │   │   ├── skip-shell.ts        # Let shortcuts fire from inside the terminal
│   │   │   └── constants.ts
│   │   └── menu/mnemonics.ts        # Free every Alt+<letter> from native menus
│   │
│   ├── editor/                      # ✏️ Small editor helpers
│   │   ├── git/reset-manager.ts     # Guarded `git reset --hard HEAD`
│   │   ├── debug/panel.ts           # Start debug, keep Debug Console hidden
│   │   └── wordwrap/manager.ts      # Per-language word-wrap toggle
│   │
│   ├── notifications/               # 🔔 User feedback
│   │   ├── toggle.ts                # AI-suggestion toggle messages
│   │   ├── install-prompt.ts        # "Install companion extension?" prompt
│   │   └── panels/commands.ts       # Open ATM / Skills / CLI panels
│   │
│   ├── shared/                      # Cross-cutting helpers
│   │   ├── base-manager.ts          # Disposable lifecycle base class
│   │   ├── commands.ts              # Safe `executeCommand` wrapper
│   │   └── constants.ts             # Storage keys, log prefix, positions
│   │
│   └── __test__/                    # Behavior notes per shortcut (.md)
│
├── l10n/bundle.l10n.{ar,…,zh-cn}.json   # 🌐 Runtime message bundles (12 locales)
├── package.json                          # Manifest — keybindings + commands
├── package.nls.{json,ar,…,zh-cn}.json    # Translated name/description (12 locales)
├── esbuild.js                            # Single host bundle → dist/extension.js
└── AGENTS.md · CLAUDE.md · README.md     # Docs
```

---

## 🎯 Key Systems

| System | Where | What it does |
| :----- | :---- | :----------- |
| 🤖 **AI Controller** | `keymaps/ai/` | Detects the editor, maps one Lynx command to its native equivalent, falls back if missing. |
| ⌨️ **Layout Switch** | `keymaps/layout/` | Flips between the **Normal** and **75%** keymaps instantly — no window reload. |
| 📟 **Terminal Manager** | `keymaps/terminal/` | Docks the panel to the side or bottom while preserving session state. |
| ✏️ **Editor Helpers** | `editor/` | Git reset, smart debug start, word-wrap toggle. |
| 🔔 **Notifications** | `notifications/` | Toggle feedback + prompts to install companion extensions. |

---

## 🤖 The AI Controller (the heart)

A single shortcut should "just work" in any editor. The controller makes that happen in three pieces:

```text
  Alt+2  (Generate AI Commit)
        │
        ▼
  ┌───────────────┐   "which editor?"   ┌──────────────────────────────┐
  │  Detector     │ ──────────────────▶ │ scan available commands for a │
  │ (5-min cache) │                     │ known signature → EditorType  │
  └───────┬───────┘                     └──────────────────────────────┘
          │  e.g. CURSOR
          ▼
  ┌────────────────────┐   look up AI_COMMANDS[action][editor]
  │ CommandsManager    │ ──▶ run `cursor.generateGitCommitMessage`
  │ (priority fallback)│        │ fails? → try the next editor in order
  └────────────────────┘        ▼ none left → friendly warning
```

- **`detector.ts`** — asks VS Code for all registered commands and matches them against `EDITOR_SIGNATURES`. The result is cached for 5 minutes so every keystroke isn't a full scan.
- **`configs.ts`** — pure data: each editor's detection signatures, its primary "AI on/off" setting, and the `action → editor → native command` table (`AI_COMMANDS`).
- **`rules.ts`** — the order editors are tried (most-specific fork first, plain **VSCode** last) and the fallback guard.
- **`commands-manager.ts`** — runs the primary command; on failure it resets detection and walks the fallback chain. **`toggle-manager.ts`** flips the editor's AI-suggestion setting and notifies the user.

### Supported editors

| Editor | Detected by (example) | Editor | Detected by (example) |
| :----- | :-------------------- | :----- | :-------------------- |
| **VS Code** | `inlineChat.start` | **Trae AI** | `icube.inlineChat.start` |
| **Cursor** | `composer.createNew` | **Kiro** | `kiroAgent.newSession` |
| **Windsurf** | `windsurf.prioritized.chat.open` | **Firebase** | `aichat.prompt` |
| **Antigravity** | `antigravity.startNewConversation` | | |

> [!NOTE]
> Not every editor supports every action. When the active editor lacks a command, the fallback chain finds the closest match; if nothing fits, the user sees a clear message instead of a silent no-op.

---

## ⌨️ Two Keymap Layouts

Lynx ships **two layouts in one `package.json`**. Every layout-specific binding has a `when` clause reading the `lynx.keymap` context key:

```jsonc
{ "key": "insert", "command": "lynx-keymap.smartDebugStart", "when": "lynx.keymap == 'compact'" }
{ "key": "alt+p",  "command": "lynx-keymap.smartDebugStart", "when": "lynx.keymap != 'compact'" }
```

Pressing **`Alt+0`** (or clicking the status-bar item) flips that context key between `normal` and `compact` (75%) — **instantly, no reload**. The choice is saved per machine in `globalState`, so a 75% keyboard and a laptop each remember their own.

| Mode | For | Status bar |
| :--- | :-- | :--------- |
| **Normal** | Full-size keyboards | `⌨ : Pro` |
| **Compact (75%)** | 75% / tenkeyless boards (no Insert/PageUp cluster) | `⌨ : 75%` |

---

## 🧱 The Manager Pattern

Every feature is a small class that extends **`BaseManager`** — it registers its commands and tracks its own disposables. `extension.ts` builds them all, registers them, then deactivation disposes them in order.

```text
        activate()
            │
   ┌────────┴─────────────────────────────────────────┐
   │  new …Manager()  →  manager.registerCommands(ctx) │   (8 managers)
   └────────┬──────────────────────────────────────────┘
            │ then, in parallel — independent startup tasks:
            ├─ recoverSidePanelState()        # undo a half-applied side layout
            ├─ ensureCommandsSkipShell()       # shortcuts work inside the terminal
            └─ ensureMenuBarMnemonicsDisabled()# free Alt+<letter> from native menus
```

> [!TIP]
> The three startup tasks make the keymap feel "native": Alt shortcuts stop opening menu bars, panel toggles fire even with terminal focus, and a side-docked terminal left over from last session is cleaned up on boot.

---

## ⚙️ The Build

Because there are no webviews, the build is one esbuild context — far simpler than a multi-bundle extension.

| Step | Command | Output |
| :--- | :------ | :----- |
| Type-check | `tsc --noEmit` | — |
| Lint | `eslint .` | — |
| Bundle | `node esbuild.js` | `dist/extension.js` (CJS, `vscode` external) |

`bun compile` is the usual full gate. `--watch` rebuilds on save; `--production` minifies and drops sourcemaps.

---

## 🌐 Localization

Like all VS Code extensions, i18n is split into two stores — Lynx ships **12 locales** (`en` + `ar · de · es · fr · hi · ja · ko · pt-br · ru · vi · zh-cn`):

| File | Covers | Read |
| :--- | :----- | :--- |
| `package.nls.*.json` | `displayName` + `description` | Before activation |
| `l10n/bundle.l10n.*.json` | Runtime notifications (`vscode.l10n.t(...)`) | At the call site |

---

## ⌨️ Essential Shortcuts

| Shortcut | Action |
| :------- | :----- |
| `Ctrl+1/2/3` | Explorer · Source Control · Skills panel |
| `Alt+1/2/3` | Git stage · AI commit · unstage |
| `Alt+W` / `Alt+Q` | Toggle terminal · Debug Console |
| `Alt+E` / `Alt+R` | CLI panel · GitLab panel |
| `Alt+D / S / A` | AI: select code · history · new session |
| `Alt+CapsLock` | Dock terminal to the side |
| `Alt+0` | Switch layout (Normal ⇄ 75%) |

---

## 🧩 Companion Extensions

Lynx focuses on shortcuts; these provide the panels some bindings open (it prompts to install if one is missing):

| Extension | Used for |
| :-------- | :------- |
| [ATM](https://github.com/bastndev/atm) | GitLab panel, Error Lens, Git Blame |
| [F1 (CLI Hub + Skills)](https://github.com/bastndev) | `Alt+E` CLI panel · `Ctrl+3` Skills panel |
| [Lynx Theme Pro](https://github.com/bastndev/Lynx-Theme) | Matching themes + icons |

---

<sub>Maintained by [Gohit (X) Bastian](https://www.gohit.xyz) · Extension ID: `bastndev.lynx-keymap` · MIT</sub>
