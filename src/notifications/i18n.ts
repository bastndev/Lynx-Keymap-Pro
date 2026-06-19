import * as vscode from 'vscode';
import { LOG_PREFIX } from '../shared/constants';

let nlsData: Record<string, string> | null = null;
let nlsLoadError = false;
let extensionRootUri: vscode.Uri | undefined;

// Called once from activate() so translations resolve from the real extension
// path. Avoids a hardcoded extension id that can drift from the published one.
export function initI18n(rootUri: vscode.Uri): void {
  extensionRootUri = rootUri;
}

export async function getTranslation(key: string, ...args: string[]): Promise<string> {
  if (!nlsData && !nlsLoadError && extensionRootUri) {
    try {
      const lang = vscode.env.language;
      let nlsUri = vscode.Uri.joinPath(extensionRootUri, `package.nls.${lang}.json`);

      try {
        await vscode.workspace.fs.stat(nlsUri);
      } catch {
        nlsUri = vscode.Uri.joinPath(extensionRootUri, 'package.nls.json');
      }

      const content = await vscode.workspace.fs.readFile(nlsUri);
      nlsData = JSON.parse(Buffer.from(content).toString('utf8'));
    } catch (e) {
      nlsLoadError = true;
      nlsData = {};
      console.warn(`${LOG_PREFIX} Failed to load translations:`, e);
    }
  }

  let text = nlsData?.[key] || key;
  args.forEach((arg, i) => { text = text.replace(`{${i}}`, arg); });
  return text;
}
