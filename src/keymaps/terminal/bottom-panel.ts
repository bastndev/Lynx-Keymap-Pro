import * as vscode from 'vscode';
import {
  STORAGE_KEYS,
  LOG_PREFIX,
  PANEL_POSITIONS,
  saveOriginalSettings,
  restoreOriginalSettings,
  applyTerminalSettings,
  BaseTerminalManager,
} from './shared';

export class BottomTerminalManager extends BaseTerminalManager {

  public registerCommands(context: vscode.ExtensionContext): void {
    const toggleCmd = vscode.commands.registerCommand(
      'lynx-keymap.toggleTerminalBottom',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current === PANEL_POSITIONS.BOTTOM) {
            // ── Close path ──
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
              vscode.commands.executeCommand('workbench.action.closePanel'),
            ]);

          } else {
            // ── Open or Transition path ──
            const isTransition = current === PANEL_POSITIONS.LEFT;

            if (current !== undefined) {
              await vscode.commands.executeCommand('workbench.action.closePanel');
              // If it was LEFT, we might want to re-open AI Chat later or now.
              // But we don't restore settings yet to avoid flicker.
              if (isTransition) {
                await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');
              }
            }

            // Save only if we aren't already in a special mode
            if (!isTransition) {
              await saveOriginalSettings(context);
            }

            // Restore the user's original tab location when switching to bottom mode.
            // Falls back to 'left' (VS Code default) if no saved value exists.
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
