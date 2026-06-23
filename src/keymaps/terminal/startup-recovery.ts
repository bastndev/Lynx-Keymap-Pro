import * as vscode from 'vscode';
import { STORAGE_KEYS, PANEL_POSITIONS, LOG_PREFIX } from '../../shared/constants';
import { restoreOriginalSettings } from './settings';

export async function recoverSidePanelState(context: vscode.ExtensionContext): Promise<void> {
  const prevPosition = context.workspaceState.get<string>(STORAGE_KEYS.PANEL_POSITION);
  const hasSavedOriginalSettings = [
    STORAGE_KEYS.ORIGINAL_TABS_ENABLED,
    STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS,
    STORAGE_KEYS.ORIGINAL_TABS_LOCATION,
  ].some(key => context.globalState.get(key) !== undefined);

  if (hasSavedOriginalSettings) {
    try {
      await restoreOriginalSettings(context);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to restore terminal settings on startup:`, error);
      return;
    }
  }

  await context.workspaceState.update(STORAGE_KEYS.PANEL_POSITION, undefined);

  // If the terminal was left in side-panel mode, close the auxiliary bar on startup.
  // Some editors restore it aggressively, so we retry at staggered intervals.
  // closeAuxiliaryBar is idempotent — safe to call even when already closed.
  if (prevPosition === PANEL_POSITIONS.LEFT) {
    const closeAuxBar = async () => {
      try {
        await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
      } catch (error) {
        console.debug(`${LOG_PREFIX} Auxiliary bar cleanup skipped:`, error);
      }
    };

    setTimeout(closeAuxBar, 300);
    setTimeout(closeAuxBar, 800);
    setTimeout(closeAuxBar, 1600);
    setTimeout(closeAuxBar, 3000);
    setTimeout(async () => {
      try {
        await closeAuxBar();
      } catch (error) {
        console.debug(`${LOG_PREFIX} Final auxiliary bar cleanup skipped:`, error);
      }
    }, 3000);
  }
}
