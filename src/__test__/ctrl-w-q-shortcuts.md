# Archived: ctrl+w / ctrl+q shortcuts

> Removed from `package.json` on 2026-06-18. Plain keybindings to native VS Code
> commands — no extension code involved.

## What was removed

```json
{
  "key"    : "ctrl+w",
  "mac"    : "ctrl+w",
  "command": "workbench.action.quickOpenTerm"
},{
  "key"    : "ctrl+q",
  "mac"    : "ctrl+q",
  "command": "workbench.action.focusFirstEditorGroup"
}
```

| Key      | Command                                  | What it did                               |
| -------- | ---------------------------------------- | ----------------------------------------- |
| `ctrl+w` | `workbench.action.quickOpenTerm`         | Quick-pick to switch open terminals       |
| `ctrl+q` | `workbench.action.focusFirstEditorGroup` | Move focus to the first editor group      |

## To restore

Re-add the JSON block above to `contributes.keybindings` in `package.json`.
Nothing else is required.
