import * as vscode from 'vscode';
import { EDITOR_PRIMARY_SETTING, EditorType } from './configs';
import { EditorDetector } from './detector';
import { getEditorToggleSettings } from './rules';
import { LOG_PREFIX } from '../../shared/constants';
import { BaseManager } from '../../shared/base-manager';
import { notifyToggle } from '../../notifications/toggle';

export class AIToggleManager extends BaseManager {
  constructor(private readonly detector: EditorDetector) {
    super();
  }

  public registerCommands(context: vscode.ExtensionContext): void {
    const toggleCmd = vscode.commands.registerCommand('lynx.toggleSuggestionAI', async () => {
      await this.toggleAI();
    });
    this.register(context, toggleCmd);
  }

  private async toggleAI(): Promise<void> {
    const editor = await this.detector.detect();

    const config       = vscode.workspace.getConfiguration();
    const currentState = config.get<boolean>(EDITOR_PRIMARY_SETTING[editor], true);
    const newState     = !currentState;

    await this.applyEditorSettings(editor, newState);

    void notifyToggle(editor, newState);
  }

  private async applyEditorSettings(editor: EditorType, newState: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    const primarySetting = EDITOR_PRIMARY_SETTING[editor];

    for (const setting of getEditorToggleSettings(editor)) {
      try {
        if (config.has(setting) || setting === primarySetting || setting === 'editor.inlineSuggest.enabled') {
          await config.update(setting, newState, vscode.ConfigurationTarget.Global);
        }
      } catch (e) {
        console.error(`${LOG_PREFIX} Failed to update "${setting}":`, e);
      }
    }
  }
}
