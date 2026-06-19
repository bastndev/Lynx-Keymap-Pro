# Archived: Open Panel Below when the AI chat is on the side

> Removed on 2026-06-18 (experiment, kept for later). When the IDE's native AI
> chat is open on the side, `alt+w` (terminal) and `alt+e` (clihub) opened the
> panel **at the bottom** instead of beside the chat. Detection used the
> `auxiliaryBarVisible` context key; `alt+w` was further gated on `panelVisible`
> so closing didn't run a redundant reposition (which caused a multi-second
> close delay).

> Not included here (kept in the code): the `alt+capslock` exit no longer runs
> `positionPanelBottom` ("don't send the panel down when switching to chat").

## 1. Helper command — `src/keymaps/terminal/side-panel.ts`

Add inside `registerCommands`, before `this.register(...)`, and append
`panelBelowCmd` to the `this.register(...)` call.

```ts
// ─── Open Panel Below ──────────────────────────────────────────────────────
// Used by alt+w / alt+e / … when the IDE's AI chat occupies the side: drop
// the panel to the bottom first, so the view opens below the editor instead
// of beside the chat, then run the given focus/toggle command.
const panelBelowCmd = vscode.commands.registerCommand(
  'lynx-keymap.panelBelow',
  async (target?: string) => {
    try {
      await vscode.commands.executeCommand('workbench.action.positionPanelBottom');
      if (typeof target === 'string' && target.length > 0) {
        await vscode.commands.executeCommand(target);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Open panel below failed:`, error);
    }
  }
);
```

## 2. Skip-shell — `src/keymaps/terminal/skip-shell.ts`

Add to `COMMANDS_TO_SKIP_SHELL` (so it fires from inside the terminal):

```ts
// alt+w / alt+e when the AI chat is on the side — opens the panel below.
'lynx-keymap.panelBelow',
```

## 3. Keybindings — `package.json`

`alt+e` (clihub) — the open-half splits by `auxiliaryBarVisible`; the close-half
(`togglePanel` when active) is unchanged:

```jsonc
{ "key": "alt+e", "mac": "alt+e",
  "command": "lynx-keymap.panelBelow",
  "args": "workbench.view.extension.myCliContainer",
  "when": "activePanel != 'workbench.view.extension.myCliContainer' && auxiliaryBarVisible" },
{ "key": "alt+e", "mac": "alt+e",
  "command": "workbench.view.extension.myCliContainer",
  "when": "activePanel != 'workbench.view.extension.myCliContainer' && !auxiliaryBarVisible" },
{ "key": "alt+e", "mac": "alt+e",
  "command": "workbench.action.togglePanel",
  "when": "activePanel == 'workbench.view.extension.myCliContainer'" }
```

`alt+w` (terminal) — `panelBelow` only when opening (`!panelVisible`); otherwise
native toggle for an instant close:

```jsonc
{ "key": "alt+w", "mac": "alt+w",
  "command": "lynx-keymap.panelBelow",
  "args": "workbench.action.terminal.toggleTerminal",
  "when": "auxiliaryBarVisible && !panelVisible" },
{ "key": "alt+w", "mac": "alt+w",
  "command": "workbench.action.terminal.toggleTerminal",
  "when": "!auxiliaryBarVisible || panelVisible" }
```

## 4. Command contribution — `package.json`

```json
{ "command": "lynx-keymap.panelBelow", "title": "Open Panel Below" }
```

## Open questions if revived
- `auxiliaryBarVisible` assumes the AI chat lives in the far-right Secondary
  Side Bar. Confirm per editor (Antigravity / VS Code) — if the chat is
  elsewhere, use the matching context key.
- Replicate the same pattern to `alt+q` (debug console) and `alt+r` (gitlab).
