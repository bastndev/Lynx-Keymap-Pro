import * as vscode from 'vscode';
import {
  STORAGE_KEYS,
  LOG_PREFIX,
  PANEL_POSITIONS,
  BaseTerminalManager,
} from '../terminal/shared';

export class DebugManager extends BaseTerminalManager {

  public registerCommands(context: vscode.ExtensionContext): void {

    // ─── Smart Debug Start ────────────────────────────────────────────────────
    // Intercepts alt+p (debug.start).
    // • Normal / BOTTOM state → positions panel at bottom first, then starts
    //   debug. This ensures the Debug Console opens in the bottom panel instead
    //   of the auxiliary bar (where the AI chat lives).
    // • LEFT state (terminal in side panel) → the panel is already positioned
    //   right; we leave layout untouched and just start debug normally.
    const smartDebugStartCmd = vscode.commands.registerCommand(
      'lynx-keymap.smartDebugStart',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current !== PANEL_POSITIONS.LEFT) {
            // Anchor the main panel to the bottom so the Debug Console
            // does not float into the auxiliary bar.
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
