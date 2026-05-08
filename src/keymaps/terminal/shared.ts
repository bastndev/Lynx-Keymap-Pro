import * as vscode from 'vscode';
import { LOG_PREFIX } from '../../shared/constants';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  LAST_ACTIVE_MODE:           'lynx-keymap:lastActiveMode',
  ORIGINAL_TABS_ENABLED:      'lynx-keymap:originalTabsEnabled',
  ORIGINAL_TABS_LOCATION:     'lynx-keymap:originalTabsLocation',
  ORIGINAL_PANEL_SHOW_LABELS: 'lynx-keymap:originalPanelShowLabels',
  PANEL_POSITION:             'lynx-keymap:terminalPanelPosition',
  SUGGESTIONS_ENABLED:        'lynx-keymap:suggestionsEnabled',
} as const;

// Re-export LOG_PREFIX for backward compatibility
export { LOG_PREFIX };

// ─── Panel Config ─────────────────────────────────────────────────────────────
export const TERMINAL_CONFIG  = 'terminal.integrated';
export const WORKBENCH_CONFIG = 'workbench';

export type PanelPosition = 'left' | 'bottom';

export const PANEL_POSITIONS = {
  LEFT:   'left',
  BOTTOM: 'bottom',
} as const;

/**
 * Milliseconds to wait for the VS Code workbench layout to settle after
 * a panel command (e.g. `terminal.new`). VS Code can briefly re-assert
 * the auxiliary bar after certain commands; this delay lets that happen
 * so a follow-up close is meaningful.
 */
export const LAYOUT_SETTLE_MS = 150;

export async function saveOriginalSettings(context: vscode.ExtensionContext): Promise<void> {
  const terminalConfig  = vscode.workspace.getConfiguration(TERMINAL_CONFIG);
  const workbenchConfig = vscode.workspace.getConfiguration(WORKBENCH_CONFIG);

  // Get effective value (respects workspace > global hierarchy)
  const tabsEnabled     = terminalConfig.get<boolean>('tabs.enabled', true);
  const tabsLocation    = terminalConfig.get<string>('tabs.location', 'left');
  const panelShowLabels = workbenchConfig.get<boolean>('panel.showLabels', true);

  // Only update if not already set to avoid unnecessary writes
  const currentSavedTabs = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_TABS_ENABLED);
  const currentSavedLabels = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS);

  if (currentSavedTabs === undefined || currentSavedLabels === undefined) {
    await Promise.all([
      context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,      tabsEnabled),
      context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_LOCATION,      tabsLocation),
      context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS, panelShowLabels),
    ]);
  }
}

export async function applyTerminalSettings(
  tabsEnabled:     boolean,
  panelShowLabels: boolean,
  tabsLocation?:   string,
): Promise<void> {
  const terminalConfig  = vscode.workspace.getConfiguration(TERMINAL_CONFIG);
  const workbenchConfig = vscode.workspace.getConfiguration(WORKBENCH_CONFIG);

  const currentTabs     = terminalConfig.get<boolean>('tabs.enabled');
  const currentLocation = terminalConfig.get<string>('tabs.location');
  const currentLabels   = workbenchConfig.get<boolean>('panel.showLabels');

  const updates = [];

  if (currentTabs !== tabsEnabled) {
    updates.push(terminalConfig.update('tabs.enabled', tabsEnabled, vscode.ConfigurationTarget.Global));
  }
  // Only touch location when explicitly requested (e.g. restoring bottom mode).
  // In side-panel mode we skip it — tabs are hidden so location is irrelevant.
  if (tabsLocation !== undefined && currentLocation !== tabsLocation) {
    updates.push(terminalConfig.update('tabs.location', tabsLocation, vscode.ConfigurationTarget.Global));
  }
  if (currentLabels !== panelShowLabels) {
    updates.push(workbenchConfig.update('panel.showLabels', panelShowLabels, vscode.ConfigurationTarget.Global));
  }

  if (updates.length > 0) {
    await Promise.all(updates);
  }
}

export async function restoreOriginalSettings(context: vscode.ExtensionContext): Promise<void> {
  const tabsEnabled     = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,      true);
  const tabsLocation    = context.globalState.get<string>(STORAGE_KEYS.ORIGINAL_TABS_LOCATION,       'left');
  const panelShowLabels = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS, true);

  await applyTerminalSettings(tabsEnabled, panelShowLabels, tabsLocation);

  // Clean up state after restoration
  await Promise.all([
    context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,      undefined),
    context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_LOCATION,      undefined),
    context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS, undefined),
  ]);
}

// ─── Base Manager ─────────────────────────────────────────────────────────────
// Shared foundation for TerminalManager and BottomTerminalManager.
// Centralizes disposable tracking, registration, and cleanup.
export abstract class BaseTerminalManager {
  protected disposables: vscode.Disposable[] = [];

  abstract registerCommands(context: vscode.ExtensionContext): void;

  /** Registers commands in both the internal list and extension context. */
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
