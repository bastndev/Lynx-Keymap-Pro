import * as vscode from 'vscode';
import { getTranslation } from './i18n';
import { LOG_PREFIX } from '../shared/constants';

export async function promptInstallExtension(
  extensionId: string,
  messageKey:  string,
  actionKey:   string,
): Promise<void> {
  const installAction = await getTranslation(actionKey);
  const selection = await vscode.window.showInformationMessage(
    await getTranslation(messageKey),
    installAction
  );

  if (selection === installAction) {
    try {
      await vscode.commands.executeCommand('workbench.extensions.installExtension', extensionId);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to install extension "${extensionId}":`, error);
      vscode.window.showErrorMessage(`Extension install failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
