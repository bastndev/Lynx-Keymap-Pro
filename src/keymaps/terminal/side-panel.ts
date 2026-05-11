import * as vscode from 'vscode';
import {
  STORAGE_KEYS,
  LOG_PREFIX,
  PANEL_POSITIONS,
  LAYOUT_SETTLE_MS,
  saveOriginalSettings,
  restoreOriginalSettings,
  applyTerminalSettings,
  BaseTerminalManager,
} from './shared';

export class TerminalManager extends BaseTerminalManager {

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

    // ─── Smart Close: Terminal lateral OR AI Chat ──────────────────────────────
    // ctrl+capslock — if terminal is in the side panel, close it;
    // otherwise delegate to the AI Chat toggle.
    const smartCloseCmd = vscode.commands.registerCommand(
      'lynx-keymap.openAndCloseAIChatAndTerminal',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current === PANEL_POSITIONS.LEFT) {
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
            ]);
            await vscode.commands.executeCommand('workbench.action.closePanel');
          } else {
            await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Smart close failed:`, error);
          vscode.window.showErrorMessage(`Smart close failed: ${error instanceof Error ? error.message : String(error)}`);
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
