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
            // ── Close path ── restore settings & state in parallel, then close UI
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
            ]);
            await vscode.commands.executeCommand('workbench.action.closePanel');

          } else {
            // ── Transition: another panel was open ──────────────────────────────
            if (current !== undefined) {
              if (current === PANEL_POSITIONS.LEFT) {
                // Close panel + restore settings in parallel, then re-open AI Chat
                await Promise.all([
                  vscode.commands.executeCommand('workbench.action.closePanel'),
                  restoreOriginalSettings(context),
                ]);
                await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');
              } else {
                await vscode.commands.executeCommand('workbench.action.closePanel');
              }
            }

            // ── Open path ── save settings, apply & persist state in parallel
            await Promise.all([
              saveOriginalSettings(context),
              applyTerminalSettings(true, true),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, PANEL_POSITIONS.BOTTOM),
            ]);
            await vscode.commands.executeCommand('workbench.action.positionPanelBottom');
            await vscode.commands.executeCommand('workbench.action.terminal.focus');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Terminal bottom toggle failed:`, error);
          vscode.window.showErrorMessage(`Terminal toggle failed: ${error}`);
        }
      }
    );

    this.register(context, toggleCmd);
  }
}
