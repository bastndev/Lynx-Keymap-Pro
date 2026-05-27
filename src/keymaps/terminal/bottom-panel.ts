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
