import * as vscode from 'vscode';
import { AICommandsManager, AIToggleManager, BottomTerminalManager, TerminalManager, STORAGE_KEYS, PANEL_POSITIONS, WordWrapManager } from './keymaps';
import { promptInstallAtmExtension } from './notifications/with-buttons';
import { LOG_PREFIX } from './shared/constants';

let aiManager:             AICommandsManager     | undefined;
let terminalManager:       TerminalManager       | undefined;
let bottomTerminalManager: BottomTerminalManager | undefined;
let aiToggleManager:       AIToggleManager       | undefined;
let wordWrapManager:       WordWrapManager       | undefined;
let startupTimeoutId:      NodeJS.Timeout        | undefined;

export async function activate(context: vscode.ExtensionContext) {
  aiManager             = new AICommandsManager();
  terminalManager       = new TerminalManager();
  bottomTerminalManager = new BottomTerminalManager();
  aiToggleManager       = new AIToggleManager(aiManager);
  wordWrapManager       = new WordWrapManager();

  aiManager.registerCommands(context);
  terminalManager.registerCommands(context);
  bottomTerminalManager.registerCommands(context);
  aiToggleManager.registerCommands(context);
  wordWrapManager.registerCommands(context);

  // Register GitLab panel wrapper command
  const gitlabPanelCommand = vscode.commands.registerCommand('lynx-keymap.openGitlabPanel', async () => {
    const atmExtension = vscode.extensions.getExtension('bastndev.atm');

    if (atmExtension) {
      if (!atmExtension.isActive) {
        await atmExtension.activate();
      }
      vscode.commands.executeCommand('workbench.view.extension.gitlab-panel');
    } else {
      promptInstallAtmExtension();
    }
  });
  context.subscriptions.push(gitlabPanelCommand);

  // Read previous position BEFORE resetting — needed for startup cleanup below.
  const prevPosition = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

  // Reset all panel state — extension always starts fresh.
  await context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION,           undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,       undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS,  undefined);

  // If terminal was on the side, VS Code may restore both panels on startup.
  // Close the auxiliary bar after a delay to let VS Code finish loading.
  // Use a longer delay to ensure VS Code workspace is fully initialized.
  if (prevPosition === PANEL_POSITIONS.LEFT) {
    startupTimeoutId = setTimeout(async () => {
      try {
        // Verify VS Code is ready before executing command
        if (vscode.window.state.focused !== undefined) {
          await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
        }
      } catch (error) {
        // Silently ignore - auxiliary bar may not be available or already closed
        console.debug(`${LOG_PREFIX} Auxiliary bar cleanup skipped:`, error);
      } finally {
        startupTimeoutId = undefined;
      }
    }, 2000); // Increased from 1500ms to 2000ms for better reliability
  }
}

export async function deactivate() {
  // Clear pending timeout to prevent execution after deactivation
  if (startupTimeoutId) {
    clearTimeout(startupTimeoutId);
    startupTimeoutId = undefined;
  }

  // Dispose all managers with error handling
  try {
    aiManager?.dispose();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error disposing aiManager:`, error);
  }

  try {
    terminalManager?.dispose();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error disposing terminalManager:`, error);
  }

  try {
    bottomTerminalManager?.dispose();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error disposing bottomTerminalManager:`, error);
  }

  try {
    aiToggleManager?.dispose();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error disposing aiToggleManager:`, error);
  }

  try {
    wordWrapManager?.dispose();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error disposing wordWrapManager:`, error);
  }
}
