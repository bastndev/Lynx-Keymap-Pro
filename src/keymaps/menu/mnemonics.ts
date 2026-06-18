import * as vscode from 'vscode';
import { LOG_PREFIX } from '../../shared/constants';

// Window-level settings that free every alt+<letter> shortcut for Lynx keymaps.
// Without these, Alt mnemonics open the native menu bar (alt+r → Run, alt+g → Go…)
// on top of the user's command. Disabling them makes the menus click-only, so the
// Alt shortcuts work cleanly and the user never has to configure anything.
const MENU_BAR_SETTINGS: Record<string, boolean> = {
  'window.enableMenuBarMnemonics': false,
  'window.customMenuBarAltFocus':  false,
};

export async function ensureMenuBarMnemonicsDisabled(): Promise<void> {
  const config = vscode.workspace.getConfiguration();

  for (const [setting, desired] of Object.entries(MENU_BAR_SETTINGS)) {
    try {
      // Only touch the user's explicit value so we skip writes once it's set.
      const current = config.inspect<boolean>(setting)?.globalValue;
      if (current === desired) { continue; }

      await config.update(setting, desired, vscode.ConfigurationTarget.Global);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to update "${setting}":`, error);
    }
  }
}
