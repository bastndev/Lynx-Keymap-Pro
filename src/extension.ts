import * as vscode from 'vscode';
import { AICommandsManager, AIToggleManager, BottomTerminalManager, DebugManager, TerminalManager, STORAGE_KEYS, PANEL_POSITIONS, WordWrapManager } from './keymaps';
import { promptInstallAtmExtension } from './notifications/with-buttons';
import { LOG_PREFIX } from './shared/constants';

let aiManager:             AICommandsManager     | undefined;
let terminalManager:       TerminalManager       | undefined;
let bottomTerminalManager: BottomTerminalManager | undefined;
let aiToggleManager:       AIToggleManager       | undefined;
let wordWrapManager:       WordWrapManager       | undefined;
let debugManager:          DebugManager          | undefined;
let startupTimeoutId:      NodeJS.Timeout        | undefined;

export async function activate(context: vscode.ExtensionContext) {
  aiManager             = new AICommandsManager();
  terminalManager       = new TerminalManager();
  bottomTerminalManager = new BottomTerminalManager();
  aiToggleManager       = new AIToggleManager(aiManager);
  wordWrapManager       = new WordWrapManager();
  debugManager          = new DebugManager();

  aiManager.registerCommands(context);
  terminalManager.registerCommands(context);
  bottomTerminalManager.registerCommands(context);
  aiToggleManager.registerCommands(context);
  wordWrapManager.registerCommands(context);
  debugManager.registerCommands(context);

  // Warm up AI detection cache for instant first keypress
  void aiManager.warmup().catch(error => {
    console.warn(`${LOG_PREFIX} AI detection warmup failed:`, error);
  });

  // Register GitLab panel wrapper command
  const gitlabPanelCommand = vscode.commands.registerCommand('lynx-keymap.openGitlabPanel', async () => {
    const atmExtension = vscode.extensions.getExtension('bastndev.atm');

    if (atmExtension) {
      if (!atmExtension.isActive) {
        await atmExtension.activate();
      }
      void vscode.commands.executeCommand('workbench.view.extension.gitlab-panel');
    } else {
      void promptInstallAtmExtension();
    }
  });
  context.subscriptions.push(gitlabPanelCommand);

  // Read previous position BEFORE resetting — needed for startup cleanup below.
  const prevPosition = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

  // Reset all panel state — extension always starts fresh.
  await context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION,           undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,       undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS,  undefined);

  // Some editors (e.g. Antigravity) aggressively restore the auxiliary bar
  // at unpredictable points during startup, racing against our cleanup.
  // Strategy: staggered retries up to 3 s — closeAuxiliaryBar is idempotent
  // so multiple calls when already closed are always safe (no-ops).
  //
  // Only run cleanup when the terminal was explicitly left open in side mode.
  // If prevPosition is undefined the user never used the side terminal this
  // session, so we must NOT touch the auxiliary bar.
  if (prevPosition === PANEL_POSITIONS.LEFT) {
    const closeAuxBar = async () => {
      try {
        await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
      } catch (error) {
        console.debug(`${LOG_PREFIX} Auxiliary bar cleanup skipped:`, error);
      }
    };

    // Attempt 1 — instant, covers VSCode & fast editors
    setTimeout(closeAuxBar, 300);

    // Attempt 2 — catches editors that restore the panel slightly later
    setTimeout(closeAuxBar, 800);

    // Attempt 3 — mid-range safety net
    setTimeout(closeAuxBar, 1600);

    // Attempt 4 — final safety net for slow editors (e.g. Antigravity)
    startupTimeoutId = setTimeout(async () => {
      try {
        await closeAuxBar();
      } finally {
        startupTimeoutId = undefined;
      }
    }, 3000);
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

  try {
    debugManager?.dispose();
  } catch (error) {
    console.error(`${LOG_PREFIX} Error disposing debugManager:`, error);
  }
}
