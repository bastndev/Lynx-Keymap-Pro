import * as vscode from 'vscode';
import { getTranslation } from './i18n';

export async function notifyToggle(editor: string, enabled: boolean): Promise<void> {
  const name    = editor.charAt(0).toUpperCase() + editor.slice(1);
  const message = enabled
    ? await getTranslation('lynx.notification.ai.enabled',  name)
    : await getTranslation('lynx.notification.ai.disabled', name);

  vscode.window.showInformationMessage(message);
}
