# Archived: Bottom Terminal Manager

> Removed from the active extension on 2026-06-18. Preserved here in case the
> "terminal at the bottom" toggle logic is needed again. Git history also holds
> the original at `src/keymaps/terminal/bottom-panel.ts`.

## What it did

Command `lynx-keymap.toggleTerminalBottom` (was bound to `ctrl+capslock`).

Toggled the integrated terminal into a **bottom panel** layout and back:

- If panel position was already `bottom` → restore the user's original terminal
  settings and close the panel (returns to `undefined`).
- Otherwise → move the panel to the bottom, enabling terminal tabs + panel
  labels (`applyTerminalSettings(true, true, originalTabsLocation)`), and store
  position `bottom` in `workspaceState`.
- The `left → bottom` transition (`isTransition`) reused the already-saved
  original settings instead of re-saving, and re-opened the AI chat that the
  side-panel mode had displaced.

It paired with `TerminalManager` (side-panel / left-right mode) and shared the
`saveOriginalSettings` / `restoreOriginalSettings` / `applyTerminalSettings`
helpers in `src/keymaps/terminal/settings.ts`, plus `STORAGE_KEYS.PANEL_POSITION`
and `PANEL_POSITIONS` from `src/shared/constants.ts`.

## Original source

```ts
import * as vscode from 'vscode';
import { STORAGE_KEYS, LOG_PREFIX, PANEL_POSITIONS } from '../../shared/constants';
import { BaseManager } from '../../shared/base-manager';
import { saveOriginalSettings, restoreOriginalSettings, applyTerminalSettings } from './settings';

export class BottomTerminalManager extends BaseManager {

  public registerCommands(context: vscode.ExtensionContext): void {
    const toggleCmd = vscode.commands.registerCommand(
      'lynx-keymap.toggleTerminalBottom',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current === PANEL_POSITIONS.BOTTOM) {
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
              vscode.commands.executeCommand('workbench.action.closePanel'),
            ]);

          } else {
            const isTransition = current === PANEL_POSITIONS.LEFT;

            if (current !== undefined) {
              await vscode.commands.executeCommand('workbench.action.closePanel');
              if (isTransition) {
                await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');
              }
            }

            if (!isTransition) {
              await saveOriginalSettings(context);
            }

            const originalTabsLocation = context.globalState.get<string>(
              STORAGE_KEYS.ORIGINAL_TABS_LOCATION, 'left'
            );

            await Promise.all([
              applyTerminalSettings(true, true, originalTabsLocation),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, PANEL_POSITIONS.BOTTOM),
              vscode.commands.executeCommand('workbench.action.positionPanelBottom'),
            ]);
            await vscode.commands.executeCommand('workbench.action.terminal.focus');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Terminal bottom toggle failed:`, error);
          vscode.window.showErrorMessage(`Terminal toggle failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    this.register(context, toggleCmd);
  }
}
```

## To restore

1. Recreate `src/keymaps/terminal/bottom-panel.ts` with the source above.
2. Re-export it in `src/keymaps/index.ts`.
3. In `src/extension.ts`: import it, instantiate `bottomTerminalMgr`, add it to
   the `managers` array, and call `bottomTerminalMgr.registerCommands(context)`.
4. Re-add the `commands` contribution and a keybinding in `package.json`.
