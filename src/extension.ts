import * as vscode from 'vscode';
import { AICommandsManager, AIToggleManager, BottomTerminalManager, DebugManager, TerminalManager, WordWrapManager } from './keymaps';
import { STORAGE_KEYS, PANEL_POSITIONS, LOG_PREFIX } from './shared/constants';
import { promptInstallAtmExtension } from './notifications/with-buttons';

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

  // Pre-detect the editor so the first keypress is instant.
  void aiManager.warmup().catch(error => {
    console.warn(`${LOG_PREFIX} AI detection warmup failed:`, error);
  });

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

  await context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION,           undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,       undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS,  undefined);
  await context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_LOCATION,      undefined);

  // If the terminal was left in side-panel mode, close the auxiliary bar on startup.
  // Some editors restore it aggressively, so we retry at staggered intervals.
  // closeAuxiliaryBar is idempotent — safe to call even when already closed.
  if (prevPosition === PANEL_POSITIONS.LEFT) {
    const closeAuxBar = async () => {
      try {
        await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
      } catch (error) {
        console.debug(`${LOG_PREFIX} Auxiliary bar cleanup skipped:`, error);
      }
    };

    setTimeout(closeAuxBar, 300);
    setTimeout(closeAuxBar, 800);
    setTimeout(closeAuxBar, 1600);
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
  if (startupTimeoutId) {
    clearTimeout(startupTimeoutId);
    startupTimeoutId = undefined;
  }

  const managers: Array<{ name: string; ref: vscode.Disposable | undefined }> = [
    { name: 'aiManager',             ref: aiManager             },
    { name: 'terminalManager',       ref: terminalManager       },
    { name: 'bottomTerminalManager', ref: bottomTerminalManager },
    { name: 'aiToggleManager',       ref: aiToggleManager       },
    { name: 'wordWrapManager',       ref: wordWrapManager       },
    { name: 'debugManager',          ref: debugManager          },
  ];

  for (const { name, ref } of managers) {
    try {
      ref?.dispose();
    } catch (error) {
      console.error(`${LOG_PREFIX} Error disposing ${name}:`, error);
    }
  }
}
