import * as vscode from 'vscode';
import { LOG_PREFIX } from '../../shared/constants';

// Add language IDs here to extend word-wrap toggle support.
export const WORD_WRAP_LANGUAGES = new Set<string>([
  'markdown', 'json',    'plaintext', 'yaml',
  'html',     'typescript', 'javascript', 'log',
  'csv',      'xml',     'ini',       'toml',
  'sql',      'astro',
]);

export class WordWrapManager {
  private disposables: vscode.Disposable[] = [];
  private isWrapOn = false;

  registerCommands(context: vscode.ExtensionContext): void {
    const cmd = vscode.commands.registerCommand('lynx-keymap.toggleWordWrap', () =>
      this.toggleWordWrap()
    );
    this.disposables.push(cmd);
    context.subscriptions.push(cmd);
  }

  addLanguage(languageId: string): void    { WORD_WRAP_LANGUAGES.add(languageId); }
  removeLanguage(languageId: string): void { WORD_WRAP_LANGUAGES.delete(languageId); }
  isLanguageSupported(languageId: string): boolean { return WORD_WRAP_LANGUAGES.has(languageId); }

  private async toggleWordWrap(): Promise<void> {
    this.isWrapOn = !this.isWrapOn;
    const value   = this.isWrapOn ? 'on' : 'off';

    const editors = vscode.window.visibleTextEditors.filter(e =>
      WORD_WRAP_LANGUAGES.has(e.document.languageId)
    );
    if (editors.length === 0) { return; }

    const updates = editors.map(editor => {
      const config = vscode.workspace.getConfiguration('editor', {
        languageId: editor.document.languageId,
        uri: editor.document.uri,
      });
      return config.update('wordWrap', value, vscode.ConfigurationTarget.Global);
    });

    try {
      await Promise.all(updates);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to toggle word wrap:`, error);
      vscode.window.showErrorMessage(`Word wrap toggle failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  dispose(): void {
    for (const d of this.disposables) { d.dispose(); }
    this.disposables = [];
  }
}
