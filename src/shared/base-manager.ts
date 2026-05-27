import * as vscode from 'vscode';

export abstract class BaseManager {
  protected disposables: vscode.Disposable[] = [];

  abstract registerCommands(context: vscode.ExtensionContext): void;

  protected register(context: vscode.ExtensionContext, ...cmds: vscode.Disposable[]): void {
    this.disposables.push(...cmds);
    context.subscriptions.push(...cmds);
  }

  public dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}
