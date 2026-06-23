# AGENTS.md

## What This Is

Lynx Keymap Pro is a VS Code extension (also works in Cursor, Windsurf, Trae, Kiro, Firebase Studio, Antigravity) that unifies keyboard shortcuts across AI-powered editors. It detects which editor is running and maps a single Lynx command to the correct native command via a priority-based fallback system.

## Build & Dev Commands

```bash
bun install              # install dependencies (uses bun, not npm)
bun run compile          # one-shot dev build (esbuild, outputs dist/extension.js)
bun run watch            # dev build with file watching
bun run package          # production build (minified, no sourcemaps)
bun run lint             # eslint
bun run check-types      # tsc --noEmit
```

Testing: press F5 in VS Code to launch the Extension Development Host. There is no test suite — verification is manual via the debug host.

## Architecture

The extension activates on `onStartupFinished` and instantiates a set of **Manager** classes, each extending `BaseManager` (`src/shared/base-manager.ts`). Every manager registers its VS Code commands in `registerCommands()` and is disposable.

### AI Command System (the core abstraction)

`EditorDetector` (`src/keymaps/ai/detector.ts`) queries `vscode.commands.getCommands()` and matches against signature commands defined in `EDITOR_SIGNATURES` (`src/keymaps/ai/configs.ts`) to determine the active editor. Detection results are cached for 5 minutes.

Detection order is defined in `AI_DETECTION_ORDER` (`src/keymaps/ai/rules.ts`) — most-specific forks first, plain VS Code last.

`AICommandsManager` uses the detected editor to dispatch commands. If the primary editor's command fails, it resets detection and walks the fallback chain (`shouldTryFallbackEditor` in `rules.ts`).

To add a new editor: add its `EditorType` enum value in `configs.ts`, add signature commands to `EDITOR_SIGNATURES`, add its entry to `AI_DETECTION_ORDER` in `rules.ts`, and map its commands in `AI_COMMANDS`.

### Terminal Panel Management

`TerminalManager` (side-panel) and `BottomTerminalManager` toggle terminal position between left/right side panel and bottom. They save/restore user settings (`terminal.integrated.tabs.*`, `workbench.panel.showLabels`) via `src/keymaps/terminal/settings.ts` so toggling doesn't permanently alter the user's config.

`startup-recovery.ts` runs on activation to clean up stale panel state from previous sessions (e.g., auxiliary bar left open).

### Panel position state

Panel position (`left` | `bottom` | `undefined`) is tracked in `workspaceState` under `STORAGE_KEYS.PANEL_POSITION`. Original user settings are stored in `globalState`. The transition between left and bottom modes preserves the saved originals rather than re-saving.

## Conventions

- All commands use the `lynx-keymap.*` prefix (except `lynx.toggleSuggestionAI`).
- Keybindings always define both `key` (Win/Linux) and `mac` variants with appropriate `when` clauses.
- Shared utilities live in `src/shared/` — `tryExecuteCommand` for safe command execution, `LOG_PREFIX` for consistent logging.
- The i18n system (`src/notifications/i18n.ts`) loads `package.nls.{locale}.json` files at runtime with lazy caching.
- ESLint enforces `no-floating-promises` and `await-thenable` — all promise chains must be awaited or explicitly voided.
- PR contributions target the `dev` branch, not `main`.

## Extension ID

The publisher is `bastndev` and the extension name is `lynx-keymap`. The i18n loader references `bastndev.lynx-keymap-75` as the extension ID — this must match the marketplace identifier.
