import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { BaseManager } from '../../shared/base-manager';
import { LOG_PREFIX } from '../../shared/constants';

const execFileAsync = promisify(execFile);

const GIT_HASH_DOTS = '~~~~~~~~~~~~~~~~~';

const formatGitHash = (hash: string): string => `${GIT_HASH_DOTS} (${hash})`;

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

          const raw = stdout.trim();
          let message = 'git reset --hard HEAD completed.';

          const headMatch = raw.match(/HEAD is now at ([0-9a-fA-F]{4,40})/);
          if (headMatch) {
            message = `HEAD is now at ${formatGitHash(headMatch[1])} ♻️`;
          } else if (raw) {
            // Fallback: first line, hard truncated so notification stays short
            const line = raw.split('\n')[0].slice(0, 60);
            const hashInLine = line.match(/([0-9a-fA-F]{4,40})/);
            message = hashInLine
              ? line.replace(hashInLine[0], formatGitHash(hashInLine[0]))
              : line;
          }

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
