import * as vscode from 'vscode';
import { TERMINAL_CONFIG } from './constants';
import { LOG_PREFIX } from '../../shared/constants';

// Commands that must run even when the integrated terminal has focus.
// VS Code forwards keystrokes to the shell unless the command is in
// `commandsToSkipShell`, which is why alt+r / alt+e / alt+q did nothing
// from inside the terminal (alt+w already works — toggleTerminal is a
// VS Code default skip command).
const COMMANDS_TO_SKIP_SHELL = [
  'workbench.view.extension.gitlab-panel',
  'workbench.view.extension.myCliContainer',
  'workbench.debug.action.toggleRepl',
];

export async function ensureCommandsSkipShell(): Promise<void> {
  try {
    const config = vscode.workspace.getConfiguration(TERMINAL_CONFIG);
    // Only touch the user's explicit value — VS Code already merges this
    // with its large default list, so we must NOT write the defaults back.
    const userValue = config.inspect<string[]>('commandsToSkipShell')?.globalValue ?? [];
    const missing   = COMMANDS_TO_SKIP_SHELL.filter(c => !userValue.includes(c));

    if (missing.length === 0) { return; }

    await config.update(
      'commandsToSkipShell',
      [...userValue, ...missing],
      vscode.ConfigurationTarget.Global,
    );
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to update commandsToSkipShell:`, error);
  }
}
