import * as vscode from 'vscode';
import { AICommandsManager, AIToggleManager, BottomTerminalManager, TerminalManager, STORAGE_KEYS, PANEL_POSITIONS } from './keymaps';

let aiManager:             AICommandsManager     | undefined;
let terminalManager:       TerminalManager       | undefined;
let bottomTerminalManager: BottomTerminalManager | undefined;
let aiToggleManager:       AIToggleManager       | undefined;

export async function activate(context: vscode.ExtensionContext) {
  aiManager             = new AICommandsManager();
  terminalManager       = new TerminalManager();
  bottomTerminalManager = new BottomTerminalManager();
  aiToggleManager       = new AIToggleManager(aiManager); // shares detectEditor() cache

  aiManager.registerCommands(context);
  terminalManager.registerCommands(context);
  bottomTerminalManager.registerCommands(context);
  aiToggleManager.registerCommands(context);

  // Read previous position BEFORE resetting — needed for startup cleanup below.
  const prevPosition = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

  // Reset all panel state — extension always starts fresh.
  await context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION,           undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,       undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS,  undefined);

  // If terminal was on the side, VS Code may restore both panels on startup.
  // Close the auxiliary bar after a short delay to let VS Code finish loading.
  if (prevPosition === PANEL_POSITIONS.LEFT) {
    setTimeout(async () => {
      try {
        await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
      } catch { /* ignore if not available */ }
    }, 1500);
  }
}

export async function deactivate() {
  aiManager?.dispose();
  terminalManager?.dispose();
  bottomTerminalManager?.dispose();
  aiToggleManager?.dispose();
}
