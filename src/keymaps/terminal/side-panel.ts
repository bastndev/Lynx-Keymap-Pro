import * as vscode from 'vscode';
import { STORAGE_KEYS, LOG_PREFIX, PANEL_POSITIONS } from '../../shared/constants';
import { BaseManager } from '../../shared/base-manager';
import { LAYOUT_SETTLE_MS } from './constants';
import { saveOriginalSettings, restoreOriginalSettings, applyTerminalSettings } from './settings';

export class TerminalManager extends BaseManager {

  public registerCommands(context: vscode.ExtensionContext): void {
    const toggleCmd = vscode.commands.registerCommand(
      'lynx-keymap.toggleTerminalLeftAndRight',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current === PANEL_POSITIONS.LEFT) {
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
              vscode.commands.executeCommand('workbench.action.closePanel'),
            ]);
            await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');

          } else {
            const isTransition = current === PANEL_POSITIONS.BOTTOM;

            const cleanupPromises: unknown[] = [];
            if (current !== undefined) {
              cleanupPromises.push(vscode.commands.executeCommand('workbench.action.closePanel'));
            }
            cleanupPromises.push(vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar'));
            await Promise.all(cleanupPromises);

            const sideBarLocation = vscode.workspace
              .getConfiguration('workbench')
              .get<string>('sideBar.location', PANEL_POSITIONS.LEFT);

            if (!isTransition) {
              await saveOriginalSettings(context);
            }

            await Promise.all([
              applyTerminalSettings(false, false),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, PANEL_POSITIONS.LEFT),
              vscode.commands.executeCommand(
                sideBarLocation === PANEL_POSITIONS.LEFT
                  ? 'workbench.action.positionPanelRight'
                  : 'workbench.action.positionPanelLeft'
              ),
            ]);

            await vscode.commands.executeCommand('workbench.action.terminal.focus');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Terminal left toggle failed:`, error);
          vscode.window.showErrorMessage(`Terminal toggle failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // ─── Smart Toggle: side panel OR AI Chat ───────────────────────────────────
    // ctrl+tab — in side mode, show/hide the side-docked panel (Terminal, Debug
    // Console, …) keeping its last active tab; otherwise toggle the AI Chat.
    const smartCloseCmd = vscode.commands.registerCommand(
      'lynx-keymap.openAndCloseAIChatAndTerminal',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current === PANEL_POSITIONS.LEFT) {
            // Panel is side-docked — just show/hide it and stay in side mode.
            // VS Code reopens the last active tab; exiting side mode is a
            // separate command's job, not this one's.
            await vscode.commands.executeCommand('workbench.action.togglePanel');
          } else {
            await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Smart toggle failed:`, error);
          vscode.window.showErrorMessage(`Smart toggle failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // ─── Smart New Terminal ────────────────────────────────────────────────────
    // ctrl+backquote — BOTTOM: create terminal only, AI chat untouched.
    // LEFT / undefined: close AuxBar first to avoid side-panel layout conflicts.
    // Unknown state intentionally falls into the closing branch (safe default).
    const smartNewTerminalCmd = vscode.commands.registerCommand(
      'lynx-keymap.smartNewTerminal',
      async () => {
        try {
          const current        = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);
          const isInSidePanel  = current === PANEL_POSITIONS.LEFT;

          if (isInSidePanel) {
            await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
            await vscode.commands.executeCommand('workbench.action.terminal.new');
            // VS Code may briefly re-assert the AuxBar after terminal.new;
            // wait for layout to settle then enforce the clean state.
            await new Promise<void>(resolve => setTimeout(resolve, LAYOUT_SETTLE_MS));
            await Promise.all([
              vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar'),
              applyTerminalSettings(false, false),
            ]);
          } else {
            await vscode.commands.executeCommand('workbench.action.terminal.new');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Smart new terminal failed:`, error);
          vscode.window.showErrorMessage(`New terminal failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    this.register(context, toggleCmd, smartCloseCmd, smartNewTerminalCmd);
  }
}
