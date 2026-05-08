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

            const cleanupPromises: unknown[] = [];
            if (current !== undefined) {
              cleanupPromises.push(vscode.commands.executeCommand('workbench.action.closePanel'));
              // If it's NOT a transition (i.e. it was something else or error), restore?
              // Actually, if it's BOTTOM, we don't restore yet to avoid flicker.
            }
            cleanupPromises.push(vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar'));

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
          vscode.window.showErrorMessage(`Terminal toggle failed: ${error instanceof Error ? error.message : String(error)}`);
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
          vscode.window.showErrorMessage(`Smart close failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // ─── Smart New Terminal: Context-aware terminal creation ─────────────────
    // Intercepts ctrl+backquote.
    // • BOTTOM state      → create terminal only, AI chat stays untouched.
    // • LEFT state        → close AI chat first to avoid side-panel layout conflicts.
    // • undefined (none)  → same as LEFT; safe default avoids orphaned AuxBar.
    //
    // NOTE: The check is intentionally inverted (isInBottomPanel) so that
    // unknown/undefined state falls into the closing branch — matching the
    // original safe behavior rather than accidentally leaving the AuxBar open.
    const smartNewTerminalCmd = vscode.commands.registerCommand(
      'lynx-keymap.smartNewTerminal',
      async () => {
        try {
          const current = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);
          const isInBottomPanel = current === PANEL_POSITIONS.BOTTOM;

          if (isInBottomPanel) {
            // Bottom panel: terminal.new is safe, AuxBar (AI chat) must not be touched.
            await vscode.commands.executeCommand('workbench.action.terminal.new');
          } else {
            // Side-panel (LEFT) or no tracked state:
            // Pre-close AuxBar so terminal.new finds a clean layout.
            await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
            await vscode.commands.executeCommand('workbench.action.terminal.new');
            // VS Code may briefly re-assert the AuxBar after terminal.new.
            // Wait for layout to settle, then close once more to catch that case.
            await new Promise<void>(resolve => setTimeout(resolve, LAYOUT_SETTLE_MS));
            await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
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
