import * as vscode from 'vscode';
import {
  STORAGE_KEYS,
  LOG_PREFIX,
  PANEL_POSITIONS,
  BaseTerminalManager,
} from '../../terminal/shared';

export class DebugManager extends BaseTerminalManager {

  public registerCommands(context: vscode.ExtensionContext): void {

    // ─── Smart Debug Start ────────────────────────────────────────────────────
    // alt+p / F5 — anchors the main panel to bottom before starting debug
    // so the Debug Console never opens inside the auxiliary bar (AI chat area).
    // If the terminal is already in the side panel (LEFT), layout is fine as-is.
    const smartDebugStartCmd = vscode.commands.registerCommand(
      'lynx-keymap.smartDebugStart',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current !== PANEL_POSITIONS.LEFT && current !== PANEL_POSITIONS.BOTTOM) {
            await vscode.commands.executeCommand('workbench.action.positionPanelBottom');
          }

          await vscode.commands.executeCommand('workbench.action.debug.start');
        } catch (error) {
          console.error(`${LOG_PREFIX} Smart debug start failed:`, error);
          vscode.window.showErrorMessage(`Debug start failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    this.register(context, smartDebugStartCmd);
  }
}
