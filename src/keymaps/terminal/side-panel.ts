import * as vscode from 'vscode';
import {
  STORAGE_KEYS,
  LOG_PREFIX,
  PANEL_POSITIONS,
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
            // ── Close path ──
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
              vscode.commands.executeCommand('workbench.action.closePanel'),
            ]);
            // Re-open AI when closing terminal (side effect, can be sequential or parallel depending on UX)
            await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');

          } else {
            // ── Open or Transition path ──
            const isTransition = current === PANEL_POSITIONS.BOTTOM;

            const cleanupPromises: Promise<any>[] = [];
            if (current !== undefined) {
              cleanupPromises.push(Promise.resolve(vscode.commands.executeCommand('workbench.action.closePanel')));
              // If it's NOT a transition (i.e. it was something else or error), restore?
              // Actually, if it's BOTTOM, we don't restore yet to avoid flicker.
            }
            cleanupPromises.push(Promise.resolve(vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar')));

            await Promise.all(cleanupPromises);

            const sideBarLocation = vscode.workspace
              .getConfiguration('workbench')
              .get<string>('sideBar.location', PANEL_POSITIONS.LEFT);

            // Save only if we aren't already in a special mode
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
          vscode.window.showErrorMessage(`Terminal toggle failed: ${error}`);
        }
      }
    );

    // ─── Smart Close: Terminal lateral OR AI Chat ──────────────────────────────
    // ctrl+capslock — if terminal is occupying the side panel, close it;
    // otherwise fall through to the normal AI Chat toggle.
    const smartCloseCmd = vscode.commands.registerCommand(
      'lynx-keymap.openAndCloseAIChatAndTerminal',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);

          if (current === PANEL_POSITIONS.LEFT) {
            // Terminal is in the side → close it and restore settings
            await Promise.all([
              restoreOriginalSettings(context),
              context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined),
            ]);
            await vscode.commands.executeCommand('workbench.action.closePanel');
          } else {
            // AI Chat is showing (or nothing is open) → delegate to AI Chat toggle
            await vscode.commands.executeCommand('lynx-keymap.openAndCloseAIChat');
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Smart close failed:`, error);
          vscode.window.showErrorMessage(`Smart close failed: ${error}`);
        }
      }
    );

    this.register(context, toggleCmd, smartCloseCmd);
  }
}
