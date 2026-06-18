import * as vscode from 'vscode';
import { BaseManager } from '../../shared/base-manager';
import { STORAGE_KEYS } from '../../shared/constants';

type LayoutMode = 'normal' | 'compact';

const CONTEXT_KEY = 'lynx.keymap';

/**
 * Switches the active keyboard layout between `normal` and `compact` (75%).
 *
 * Both layouts live in package.json; each layout-specific keybinding is gated by
 * a `when` clause that reads the `lynx.keymap` context key. Flipping that context
 * key swaps the active layout instantly — no window reload required.
 *
 * The chosen mode is stored per-machine in globalState (not synced), so a 75%
 * keyboard and a laptop each remember their own layout.
 */
export class KeymapLayoutManager extends BaseManager {
  private statusItem: vscode.StatusBarItem | undefined;

  registerCommands(context: vscode.ExtensionContext): void {
    this.statusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      -1000,
    );
    this.statusItem.command = 'lynx-keymap.toggleLayout';
    this.statusItem.tooltip = 'Switch Lynx keyboard layout (Normal / 75%)';
    this.statusItem.show();

    // Apply the saved layout on startup (defaults to 'normal').
    void this.applyMode(context, this.getMode(context), false);

    this.register(
      context,
      this.statusItem,
      vscode.commands.registerCommand('lynx-keymap.toggleLayout', () => {
        const next: LayoutMode =
          this.getMode(context) === 'compact' ? 'normal' : 'compact';
        return this.applyMode(context, next, true);
      }),
    );
  }

  private getMode(context: vscode.ExtensionContext): LayoutMode {
    return context.globalState.get<LayoutMode>(STORAGE_KEYS.LAYOUT_MODE, 'normal');
  }

  private async applyMode(
    context: vscode.ExtensionContext,
    mode: LayoutMode,
    notify: boolean,
  ): Promise<void> {
    await context.globalState.update(STORAGE_KEYS.LAYOUT_MODE, mode);
    await vscode.commands.executeCommand('setContext', CONTEXT_KEY, mode);
    this.updateStatusItem(mode);

    if (notify) {
      void vscode.window.showInformationMessage(
        mode === 'compact' ? '⌨️  75% mode' : '⌨️  Normal mode',
      );
    }
  }

  private updateStatusItem(mode: LayoutMode): void {
    if (!this.statusItem) {
      return;
    }
    this.statusItem.text =
      mode === 'compact' ? '$(keyboard): 75%' : '$(keyboard): Pro';
  }
}
