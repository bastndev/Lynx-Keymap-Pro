# Archived: Shift+Alt AI shortcuts

> Removed from `package.json` on 2026-06-18. Only the **keybindings** were
> removed — the commands still exist in the extension and remain available from
> the Command Palette. They can be re-bound at any time.

## What was removed

```json
{
  "key"    : "shift+alt+d",
  "mac"    : "shift+alt+d",
  "command": "lynx.toggleSuggestionAI"
},{
  "key"    : "shift+alt+s",
  "mac"    : "shift+alt+s",
  "command": "lynx-keymap.selectModels"
},{
  "key"    : "shift+alt+a",
  "mac"    : "shift+alt+a",
  "command": "lynx-keymap.toggleAgentMode"
}
```

## Context (key swap that happened alongside this)

`showAIHistory` was moved to **`alt+s`** (previously `shift+alt+s`). After this
cleanup:

| Command                       | Keybinding |
| ----------------------------- | ---------- |
| `lynx-keymap.showAIHistory`   | `alt+s`    |
| `lynx-keymap.selectCode`      | `alt+d`    |
| `lynx-keymap.createNewAISession` | `alt+a` |
| `lynx-keymap.selectModels`    | *(unbound)* |
| `lynx-keymap.toggleAgentMode` | *(unbound)* |
| `lynx.toggleSuggestionAI`     | *(unbound)* |

## To restore

Re-add the JSON block above to `contributes.keybindings` in `package.json`.
No source changes are needed — the commands are still registered.
