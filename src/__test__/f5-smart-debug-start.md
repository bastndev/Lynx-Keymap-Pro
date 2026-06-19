# Archived: f5 → smartDebugStart

> Removed from `package.json` on 2026-06-18. F5 is now left **native**
> (`workbench.action.debug.start`). The "don't open the Debug Console"
> improvement is applied globally at activation (`DebugManager.hideDebugConsole`,
> setting `debug.internalConsoleOptions: "neverOpen"`), so native F5 still gets
> it. The panel-anchoring half of `smartDebugStart` stays on `alt+p` / `insert`.

## What was removed

```json
{
  "key"    : "f5",
  "mac"    : "f5",
  "command": "lynx-keymap.smartDebugStart"
}
```

## To restore

Re-add the JSON block above to `contributes.keybindings` in `package.json`.
The `lynx-keymap.smartDebugStart` command still exists (bound to `alt+p` and
`insert`), so no source changes are needed.
