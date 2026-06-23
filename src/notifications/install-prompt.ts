import * as vscode from 'vscode';
import { LOG_PREFIX } from '../shared/constants';

export async function promptInstallExtension(
  extensionId: string,
  message:     string,
  action:      string,
): Promise<void> {
  const selection = await vscode.window.showInformationMessage(message, action);

  if (selection === action) {
    try {
      await vscode.commands.executeCommand('workbench.extensions.installExtension', extensionId);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to install extension "${extensionId}":`, error);
      vscode.window.showErrorMessage(`Extension install failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
