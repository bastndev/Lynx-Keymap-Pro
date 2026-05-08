import * as vscode from 'vscode';

// ─── Supported Languages ─────────────────────────────────────────────────────
// Add language IDs here to support word wrap toggle for more file types.
export const WORD_WRAP_LANGUAGES = new Set<string>([
  'markdown',
  'json',
  'plaintext',
  'yaml',
  'html',
  'typescript',
  'javascript',
  'log',
  'csv',
  'xml',
  'ini',
  'toml',
  'sql',
  'astro',
]);

// ─── Word Wrap Manager ───────────────────────────────────────────────────────
// Toggles word wrap globally across all open editors matching configured languages.
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

  /** Adds a language ID to the supported list at runtime. */
  addLanguage(languageId: string): void {
    WORD_WRAP_LANGUAGES.add(languageId);
  }

  /** Removes a language ID from the supported list at runtime. */
  removeLanguage(languageId: string): void {
    WORD_WRAP_LANGUAGES.delete(languageId);
  }

  /** Checks if a language ID is currently supported. */
  isLanguageSupported(languageId: string): boolean {
    return WORD_WRAP_LANGUAGES.has(languageId);
  }

  private toggleWordWrap(): void {
    this.isWrapOn = !this.isWrapOn;
    const value = this.isWrapOn ? 'on' : 'off';

    const editors = vscode.window.visibleTextEditors.filter((editor) =>
      WORD_WRAP_LANGUAGES.has(editor.document.languageId)
    );

    if (editors.length === 0) {
      return;
    }

    const updates: Promise<void>[] = [];

    for (const editor of editors) {
      const config = vscode.workspace.getConfiguration('editor', {
        languageId: editor.document.languageId,
        uri: editor.document.uri,
      });
      updates.push(
        Promise.resolve(config.update('wordWrap', value, vscode.ConfigurationTarget.Global))
      );
    }

    Promise.all(updates);
  }

  dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}
