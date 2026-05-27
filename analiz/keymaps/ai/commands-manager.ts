import * as vscode from 'vscode';
import { AI_COMMANDS, KEYMAP_CONFIG, ActionKey } from './configs';
import { EditorDetector } from './detector';
import { AI_DETECTION_ORDER, shouldTryFallbackEditor } from './rules';
import { LOG_PREFIX } from '../../shared/constants';
import { BaseManager } from '../../shared/base-manager';
import { tryExecuteCommand } from '../../shared/commands';

export class AICommandsManager extends BaseManager {
  constructor(private readonly detector: EditorDetector) {
    super();
  }

  public registerCommands(context: vscode.ExtensionContext): void {
    const disposables = KEYMAP_CONFIG.map(({ commandId, commandsKey, errorMessage }) =>
      vscode.commands.registerCommand(commandId, async () => {
        await this.executeForAction(commandsKey, errorMessage);
      })
    );
    this.register(context, ...disposables);
  }

  public resetDetection(): void {
    this.detector.reset();
  }

  private async executeForAction(actionKey: ActionKey, errorMessage: string): Promise<void> {
    const editor     = await this.detector.detect();
    const commandMap = AI_COMMANDS[actionKey];

    const primaryCmd = commandMap[editor];
    if (primaryCmd) {
      const ok = await tryExecuteCommand(primaryCmd);
      if (ok) { return; }

      console.warn(`${LOG_PREFIX} Primary command failed, resetting detection`);
      this.detector.reset();
    }

    for (const fallbackEditor of AI_DETECTION_ORDER) {
      const cmd = commandMap[fallbackEditor];
      if (!cmd) { continue; }

      const fallbackAvailable = await this.detector.isAvailable(fallbackEditor);
      if (!shouldTryFallbackEditor(editor, fallbackEditor, fallbackAvailable)) {
        continue;
      }

      const ok = await tryExecuteCommand(cmd);
      if (ok) { return; }
    }

    vscode.window.showWarningMessage(errorMessage);
  }
}
