# AGENTS.md — Lynx Keymap Pro

## Project type

VS Code extension (keymap + AI integration). No build step, no tests, no CI. Plain CommonJS (`require`).

## Commands

- **Debug**: `F5` opens a new VS Code window with the extension loaded
- **Reload after changes**: `Ctrl+R` / `Cmd+R` in the debug window, or use the Debug toolbar
- **Format**: `npx prettier --write .` (config: singleQuote, 2-space indent, semi, trailingComma es5, printWidth 80)
- **Package for marketplace**: `npx vsce package` (produces `.vsix`, already gitignored)

## Architecture

Entry point: `src/extension.js` — `activate()` instantiates all managers and registers commands.

| Manager | File | Responsibility |
|---------|------|----------------|
| `AICommandsManager` | `src/keymaps/ai-keymap-handler.js` | Priority-based fallback: tries editor-specific AI commands (Windsurf → VS Code → Cursor → Trae → Firebase → Kiro → Antigravity) until one succeeds. Caches available commands for 5 min. |
| `StatusBarManager` | `src/editor-ui/status-bar.js` | Toggles status bar color via `workbench.colorCustomizations` at **Workspace** target. Smart rotation (6 colors, avoids last 3 used). State stored in `workspaceState`. |
| `ColorManager` | `src/editor-ui/icons/icon-painter.js` | Cycles icon foreground color (Blue → Green → Default) via `workbench.colorCustomizations` at **Global** target. |
| `MacroManager` | `src/editor-ui/icons/macros.js` | Executes command sequences with delays. Has execution lock (`isExecuting`) to prevent concurrent runs. |
| `ExtensionChecker` | `src/notifications/extension-checker.js` | Checks for optional extensions (F1-Quick Switch `bastndev.f1`, GitLens `eamodio.gitlens`), prompts install if missing, auto-executes command after install. |
| `SmartWebviewExtension` | `src/notifications/smart-checker-webview.js` | Handles webview-based extensions (Compare Code `bastndev.compare-code`). Has fast-path for already-active extensions and duplicate-open prevention (500ms window). |

## Key gotchas

- **Two color systems write to the same config key** (`workbench.colorCustomizations`) but at different targets: `ColorManager` uses `Global`, `StatusBarManager` uses `Workspace`. They can conflict if both are active.
- **No test suite exists**. Verify changes manually by running F5 and testing the affected keybinding.
- **No linting or typechecking**. Prettier is the only code quality tool configured.
- **AI command fallback order matters**. New editor support is added by appending command IDs to the arrays in `src/keymaps/ai-keymap-config.js`. Antigravity commands are tried first regardless of array position.
- **Keybindings are defined entirely in `package.json`** under `contributes.keybindings`. No runtime registration of keybindings.
- **Commands registered in `extension.js` must match `package.json` commands array** for the Command Palette to show them.

## Directory structure

```
src/
  extension.js              # Entry point, activate/deactivate
  keymaps/
    ai-keymap-config.js     # AI command arrays per editor
    ai-keymap-handler.js    # AICommandsManager class
  editor-ui/
    status-bar.js           # StatusBarManager class
    icons/
      icon-painter.js       # ColorManager class
      macros.js             # MacroManager class
  notifications/
    extension-checker.js    # ExtensionChecker class
    smart-checker-webview.js # SmartWebviewExtension class
```

## Related files

- `ARCHITECTURE.md` — detailed architecture doc with diagrams
- `package.json` — all keybindings, commands, activation events, extension metadata
