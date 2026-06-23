import * as vscode from 'vscode';

export async function notifyToggle(editor: string, enabled: boolean): Promise<void> {
  const name    = editor.charAt(0).toUpperCase() + editor.slice(1);
  const message = enabled
    ? vscode.l10n.t("({0}) AI Suggestions: ENABLED ✅",  name)
    : vscode.l10n.t("({0}) AI Suggestions: DISABLED ❌", name);

  vscode.window.showInformationMessage(message);
}
