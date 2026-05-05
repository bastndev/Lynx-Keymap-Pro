import * as vscode from 'vscode';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  LAST_ACTIVE_MODE:          'lynx-keymap:lastActiveMode',
  ORIGINAL_TABS_ENABLED:     'lynx-keymap:originalTabsEnabled',
  ORIGINAL_PANEL_SHOW_LABELS:'lynx-keymap:originalPanelShowLabels',
  PANEL_POSITION:            'lynx-keymap:terminalPanelPosition',
} as const;

// ─── Log Prefix ───────────────────────────────────────────────────────────────
export const LOG_PREFIX = '[lynx-keymap]';

// ─── Panel Config ─────────────────────────────────────────────────────────────
export const TERMINAL_CONFIG  = 'terminal.integrated';
export const WORKBENCH_CONFIG = 'workbench';

export type PanelPosition = 'left' | 'bottom';

export const PANEL_POSITIONS = {
  LEFT:   'left',
  BOTTOM: 'bottom',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export async function saveOriginalSettings(context: vscode.ExtensionContext): Promise<void> {
  const terminalConfig  = vscode.workspace.getConfiguration(TERMINAL_CONFIG);
  const workbenchConfig = vscode.workspace.getConfiguration(WORKBENCH_CONFIG);

  const tabsEnabled     = terminalConfig.inspect<boolean>('tabs.enabled')?.globalValue    ?? true;
  const panelShowLabels = workbenchConfig.inspect<boolean>('panel.showLabels')?.globalValue ?? true;

  await Promise.all([
    context.globalState.update(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,      tabsEnabled),
    context.globalState.update(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS, panelShowLabels),
  ]);
}

export async function applyTerminalSettings(
  tabsEnabled:     boolean,
  panelShowLabels: boolean,
): Promise<void> {
  const terminalConfig  = vscode.workspace.getConfiguration(TERMINAL_CONFIG);
  const workbenchConfig = vscode.workspace.getConfiguration(WORKBENCH_CONFIG);

  await Promise.all([
    terminalConfig.update( 'tabs.enabled',    tabsEnabled,     vscode.ConfigurationTarget.Global),
    workbenchConfig.update('panel.showLabels', panelShowLabels, vscode.ConfigurationTarget.Global),
  ]);
}

export async function restoreOriginalSettings(context: vscode.ExtensionContext): Promise<void> {
  const tabsEnabled     = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_TABS_ENABLED,      true);
  const panelShowLabels = context.globalState.get<boolean>(STORAGE_KEYS.ORIGINAL_PANEL_SHOW_LABELS, true);

  await applyTerminalSettings(tabsEnabled, panelShowLabels);
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
