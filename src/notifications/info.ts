import * as vscode from 'vscode';
import { LOG_PREFIX } from '../shared/constants';

/**
 * Shows a simple informational toggle notification.
 * Used by AIToggleManager after toggling AI suggestions.
 */

let nlsData: Record<string, string> | null = null;
let nlsLoadError = false;

export async function getTranslation(key: string, ...args: string[]): Promise<string> {
  if (!nlsData && !nlsLoadError) {
    try {
      const ext = vscode.extensions.getExtension('bastndev.lynx-keymap');
      if (ext) {
        const lang = vscode.env.language;
        const rootUri = ext.extensionUri;
        
        let nlsUri = vscode.Uri.joinPath(rootUri, `package.nls.${lang}.json`);
        
        // Check if language-specific file exists, fallback to default
        try {
          await vscode.workspace.fs.stat(nlsUri);
        } catch {
          nlsUri = vscode.Uri.joinPath(rootUri, 'package.nls.json');
        }
        
        const content = await vscode.workspace.fs.readFile(nlsUri);
        const textContent = Buffer.from(content).toString('utf8');
        nlsData = JSON.parse(textContent);
      }
    } catch (e) {
      nlsLoadError = true;
      nlsData = {};
      console.warn(`${LOG_PREFIX} Failed to load translations:`, e);
    }
  }

  let text = nlsData?.[key] || key;
  args.forEach((arg, i) => {
    text = text.replace(`{${i}}`, arg);
  });
  return text;
}

// ─── AI Disable and enable notifications ─────────────────────────────────────────────
export async function notifyToggle(editor: string, enabled: boolean): Promise<void> {
  const name  = editor.charAt(0).toUpperCase() + editor.slice(1);
  const message = enabled 
    ? await getTranslation('lynx.notification.ai.enabled', name) 
    : await getTranslation('lynx.notification.ai.disabled', name);
    
  vscode.window.showInformationMessage(message);
}

// ─── TODO: Add more notifications ────────────────────────────────────────────────────