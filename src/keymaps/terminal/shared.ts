import * as vscode from 'vscode';
import { LOG_PREFIX, STORAGE_KEYS, PANEL_POSITIONS, PanelPosition } from '../../shared/constants';

export { LOG_PREFIX, STORAGE_KEYS, PANEL_POSITIONS };
export type { PanelPosition };

// ─── Panel Config ─────────────────────────────────────────────────────────────
export const TERMINAL_CONFIG  = 'terminal.integrated';
export const WORKBENCH_CONFIG = 'workbench';

// VS Code may briefly re-assert the auxiliary bar after panel commands;
// this delay lets the layout settle before a follow-up close takes effect.
export const LAYOUT_SETTLE_MS = 150;

export async function saveOriginalSettings(context: vscode.ExtensionContext): Promise<void> {
  const terminalConfig  = vscode.workspace.getConfiguration(TERMINAL_CONFIG);
  const workbenchConfig = vscode.workspace.getConfiguration(WORKBENCH_CONFIG);

  const tabsEnabled     = terminalConfig.get<boolean>('tabs.enabled', true);
  const tabsLocation    = terminalConfig.get<string>('tabs.location', 'left');
  const panelShowLabels = workbenchConfig.get<boolean>('panel.showLabels', true);

  const currentSavedTabs   = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_TABS_ENABLED);
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
  // Skip location in side-panel mode — tabs are hidden so location is irrelevant.
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

  await Promise.all([
    context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,      undefined),
    context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_LOCATION,      undefined),
    context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS, undefined),
  ]);
}

// ─── Base Manager ─────────────────────────────────────────────────────────────
export abstract class BaseTerminalManager {
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
