import * as vscode from 'vscode';
import { getTranslation } from './info';

export async function promptInstallAtmExtension(): Promise<void> {
  const installAction = await getTranslation('ATM.notification.install.action');
  const selection = await vscode.window.showInformationMessage(
    await getTranslation('ATM.notification.install.required'),
    installAction
  );

  if (selection === installAction) {
    void vscode.commands.executeCommand('workbench.extensions.installExtension', 'bastndev.atm');
  }
}
