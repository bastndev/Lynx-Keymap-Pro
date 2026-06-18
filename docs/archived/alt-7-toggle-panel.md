# Archived: alt+7 toggle panel

> Removed from `package.json` on 2026-06-18. Its job (toggle the bottom panel)
> was superseded by the smarter `ctrl+tab` (`openAndCloseAIChatAndTerminal`,
> which toggles the panel in side mode) and the new `ctrl+alt+capslock`
> (`restoreDefaultLayout`, which docks the panel back at the bottom).

## What was removed

```json
{
  "key"    : "alt+7",
  "mac"    : "alt+7",
  "command": "workbench.action.togglePanel"
}
```

| Key     | Command                          | What it did                    |
| ------- | -------------------------------- | ------------------------------ |
| `alt+7` | `workbench.action.togglePanel`   | Show/hide the bottom panel     |

## To restore

Re-add the JSON block above to `contributes.keybindings` in `package.json`.
Nothing else is required.
