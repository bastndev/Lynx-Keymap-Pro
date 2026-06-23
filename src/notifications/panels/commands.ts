import * as vscode from 'vscode';
import { BaseManager } from '../../shared/base-manager';
import { LOG_PREFIX } from '../../shared/constants';
import { promptInstallExtension } from '../install-prompt';

interface PanelConfig {
  commandId: string;
  extensionId: string;
  focusCommand: string;
  message: string;
  action: string;
}

const PANEL_CONFIGS: PanelConfig[] = [
  {
    commandId:    'lynx-keymap.openGitlabPanel',
    extensionId:  'bastndev.atm',
    focusCommand: 'workbench.view.extension.gitlab-panel',
    message:      vscode.l10n.t("To use the GitLab panel, you need to install the \"ATM\" extension by(@gohitx)."),
    action:       vscode.l10n.t("📥 Download ATM"),
  },
  {
    commandId:    'lynx-keymap.openMySkillsPanel',
    extensionId:  'bastndev.f1',
    focusCommand: 'myskills-panel.focus',
    message:      vscode.l10n.t("To use the Skills panel, you need to install the \"My Skills\" extension by(@gohitx)."),
    action:       vscode.l10n.t("📥 Download My Skills"),
  },
  {
    commandId:    'lynx-keymap.openMyCliPanel',
    extensionId:  'bastndev.f1',
    focusCommand: 'workbench.view.extension.myCliContainer',
    message:      vscode.l10n.t("To use the CLI panel, you need to install the \"My Skills\" extension by(@gohitx)."),
    action:       vscode.l10n.t("📥 Download CLI Hub"),
  },
];

export class PanelCommandsManager extends BaseManager {

  public registerCommands(context: vscode.ExtensionContext): void {
    for (const panel of PANEL_CONFIGS) {
      const disposable = vscode.commands.registerCommand(panel.commandId, async () => {
        try {
          const ext = vscode.extensions.getExtension(panel.extensionId);
          if (ext) {
            if (!ext.isActive) { await ext.activate(); }
            await vscode.commands.executeCommand(panel.focusCommand);
          } else {
            await promptInstallExtension(panel.extensionId, panel.message, panel.action);
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Failed to open panel "${panel.commandId}":`, error);
          vscode.window.showErrorMessage(`Panel command failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      });
      this.register(context, disposable);
    }
  }
}
