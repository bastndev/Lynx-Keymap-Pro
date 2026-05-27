import * as vscode from 'vscode';
import { LOG_PREFIX } from '../../shared/constants';
import { BaseManager } from '../../shared/base-manager';

// Add language IDs here to extend word-wrap toggle support.
export const WORD_WRAP_LANGUAGES = new Set<string>([
  'markdown', 'json',    'plaintext', 'yaml',
  'html',     'typescript', 'javascript', 'log',
  'csv',      'xml',     'ini',       'toml',
  'sql',      'astro',
]);

export class WordWrapManager extends BaseManager {

  registerCommands(context: vscode.ExtensionContext): void {
    const cmd = vscode.commands.registerCommand('lynx-keymap.toggleWordWrap', () =>
      this.toggleWordWrap()
    );
    this.register(context, cmd);
  }

  addLanguage(languageId: string): void    { WORD_WRAP_LANGUAGES.add(languageId); }
  removeLanguage(languageId: string): void { WORD_WRAP_LANGUAGES.delete(languageId); }
  isLanguageSupported(languageId: string): boolean { return WORD_WRAP_LANGUAGES.has(languageId); }

  private async toggleWordWrap(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !WORD_WRAP_LANGUAGES.has(editor.document.languageId)) { return; }

    const config = vscode.workspace.getConfiguration('editor', {
      languageId: editor.document.languageId,
      uri: editor.document.uri,
    });

    const current = config.get<string>('wordWrap', 'off');
    const next = current === 'on' ? 'off' : 'on';

    try {
      await config.update('wordWrap', next, vscode.ConfigurationTarget.Global, true);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to toggle word wrap:`, error);
      vscode.window.showErrorMessage(`Word wrap toggle failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
