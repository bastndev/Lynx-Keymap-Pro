import * as vscode from 'vscode';
import { getTranslation } from './info';

export async function promptInstallAtmExtension() {
    const installAction = getTranslation('ATM.notification.install.action');

    const selection = await vscode.window.showInformationMessage(
        getTranslation('ATM.notification.install.required'),
        installAction
    );

    if (selection === installAction) {
        vscode.commands.executeCommand('workbench.extensions.installExtension', 'bastndev.atm');
    }
}
