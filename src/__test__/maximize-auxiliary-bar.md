# Archived: Maximize Auxiliary Bar shortcut

> Removed from `package.json` on 2026-06-18. Preserved here in case the
> "maximize the auxiliary bar" toggle is wanted again.

## What it did

A plain keybinding to the native VS Code command — no extension code, no
`commands` contribution. It toggled the auxiliary bar (secondary side bar,
where AI chat usually lives) between maximized and normal size.

```json
{
  "key"    : "shift+escape",
  "mac"    : "shift+escape",
  "command": "workbench.action.toggleMaximizedAuxiliaryBar"
}
```

## To restore

Re-add the JSON object above to the `contributes.keybindings` array in
`package.json`. Nothing else is required.
