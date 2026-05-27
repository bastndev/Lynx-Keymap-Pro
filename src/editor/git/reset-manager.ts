import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { BaseManager } from '../../shared/base-manager';
import { LOG_PREFIX } from '../../shared/constants';

const execFileAsync = promisify(execFile);

export class GitResetManager extends BaseManager {

  public registerCommands(context: vscode.ExtensionContext): void {
    const resetHardHeadCmd = vscode.commands.registerCommand(
      'lynx-keymap.gitResetHardHead',
      async () => {
        try {
          const folder = await this.pickWorkspaceFolder();
          if (!folder) {
            vscode.window.showWarningMessage('Open a workspace folder before running git reset.');
            return;
          }

          const confirmed = await vscode.window.showWarningMessage(
            `Discard all tracked changes in ${folder.name}?`,
            { modal: true, detail: 'This runs: git reset --hard HEAD' },
            'Reset'
          );

          if (confirmed !== 'Reset') {
            return;
          }

          const { stdout } = await execFileAsync('git', ['reset', '--hard', 'HEAD'], {
            cwd: folder.uri.fsPath,
            maxBuffer: 1024 * 1024,
          });

          const message = stdout.trim() || 'git reset --hard HEAD completed.';
          vscode.window.showInformationMessage(message);
        } catch (error) {
          console.error(`${LOG_PREFIX} Git reset --hard HEAD failed:`, error);
          vscode.window.showErrorMessage(`Git reset failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    this.register(context, resetHardHeadCmd);
  }

  private async pickWorkspaceFolder(): Promise<vscode.WorkspaceFolder | undefined> {
    const folders = vscode.workspace.workspaceFolders;

    if (!folders?.length) {
      return undefined;
    }

    if (folders.length === 1) {
      return folders[0];
    }

    const selected = await vscode.window.showQuickPick(
      folders.map(folder => ({
        label: folder.name,
        description: folder.uri.fsPath,
        folder,
      })),
      { placeHolder: 'Select workspace folder to reset' }
    );

    return selected?.folder;
  }
}
