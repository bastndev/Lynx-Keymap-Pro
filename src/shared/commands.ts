import * as vscode from 'vscode';
import { LOG_PREFIX } from './constants';

export async function tryExecuteCommand(cmd: string, logFailures = true): Promise<boolean> {
  try {
    await vscode.commands.executeCommand(cmd);
    return true;
  } catch {
    if (logFailures) {
      console.debug(`${LOG_PREFIX} Command failed: ${cmd}`);
    }
    return false;
  }
}
