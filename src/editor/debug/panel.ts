import * as vscode from 'vscode';
import { LOG_PREFIX } from '../../shared/constants';
import { BaseManager } from '../../shared/base-manager';

export class DebugManager extends BaseManager {

  public registerCommands(context: vscode.ExtensionContext): void {
    // Stop the Debug Console from auto-opening on a debug start. Global editor
    // setting, applied once at activation, so it works for every debug start —
    // native F5 and Lynx's own shortcuts alike.
    void this.hideDebugConsole();

    // ─── Smart Debug Start ────────────────────────────────────────────────────
    // alt+p / insert — starts debugging. The Debug Console stays hidden via the
    // global setting above, exactly like native F5.
    const smartDebugStartCmd = vscode.commands.registerCommand(
      'lynx-keymap.smartDebugStart',
      async () => {
        try {
          await vscode.commands.executeCommand('workbench.action.debug.start');
        } catch (error) {
          console.error(`${LOG_PREFIX} Smart debug start failed:`, error);
          vscode.window.showErrorMessage(`Debug start failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    this.register(context, smartDebugStartCmd);
  }

  private async hideDebugConsole(): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration('debug');
      if (config.get<string>('internalConsoleOptions') !== 'neverOpen') {
        await config.update('internalConsoleOptions', 'neverOpen', vscode.ConfigurationTarget.Global);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to set debug.internalConsoleOptions:`, error);
    }
  }
}
