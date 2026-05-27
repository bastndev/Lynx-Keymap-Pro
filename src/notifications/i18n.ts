import * as vscode from 'vscode';
import { LOG_PREFIX } from '../shared/constants';

let nlsData: Record<string, string> | null = null;
let nlsLoadError = false;

export async function getTranslation(key: string, ...args: string[]): Promise<string> {
  if (!nlsData && !nlsLoadError) {
    try {
      const ext = vscode.extensions.getExtension('bastndev.lynx-keymap-75');
      if (ext) {
        const lang    = vscode.env.language;
        const rootUri = ext.extensionUri;
        let nlsUri    = vscode.Uri.joinPath(rootUri, `package.nls.${lang}.json`);

        try {
          await vscode.workspace.fs.stat(nlsUri);
        } catch {
          nlsUri = vscode.Uri.joinPath(rootUri, 'package.nls.json');
        }

        const content = await vscode.workspace.fs.readFile(nlsUri);
        nlsData = JSON.parse(Buffer.from(content).toString('utf8'));
      }
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
