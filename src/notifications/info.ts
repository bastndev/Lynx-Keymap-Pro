import * as vscode from 'vscode';

/**
 * Shows a simple informational toggle notification.
 * Used by AIToggleManager after toggling AI suggestions.
 */

import * as fs from 'fs';
import * as path from 'path';

let nlsData: Record<string, string> | null = null;

function getTranslation(key: string, ...args: string[]): string {
  if (!nlsData) {
    try {
      const ext = vscode.extensions.getExtension('bastndev.lynx-keymap-75');
      if (ext) {
        const lang = vscode.env.language;
        const rootPath = ext.extensionPath;
        let nlsPath = path.join(rootPath, `package.nls.${lang}.json`);
        if (!fs.existsSync(nlsPath)) {
          nlsPath = path.join(rootPath, 'package.nls.json');
        }
        const content = fs.readFileSync(nlsPath, 'utf8');
        nlsData = JSON.parse(content);
      }
    } catch (e) {
      nlsData = {};
    }
  }

  let text = nlsData?.[key] || key;
  args.forEach((arg, i) => {
    text = text.replace(`{${i}}`, arg);
  });
  return text;
}

// ─── AI Disable and enable notifications ─────────────────────────────────────────────
export function notifyToggle(editor: string, enabled: boolean): void {
  const name  = editor.charAt(0).toUpperCase() + editor.slice(1);
  const message = enabled 
    ? getTranslation('lynx.notification.ai.enabled', name) 
    : getTranslation('lynx.notification.ai.disabled', name);
    
  vscode.window.showInformationMessage(message);
}

// ─── TODO: Add more notifications ────────────────────────────────────────────────────