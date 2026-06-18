import * as vscode from 'vscode';
import { EditorDetector }              from './keymaps/ai/detector';
import { AICommandsManager }           from './keymaps/ai/commands-manager';
import { AIToggleManager }             from './keymaps/ai/toggle-manager';
import { TerminalManager }             from './keymaps/terminal/side-panel';
import { KeymapLayoutManager }         from './keymaps/layout/manager';
import { GitResetManager }             from './editor/git/reset-manager';
import { DebugManager }                from './editor/debug/panel';
import { WordWrapManager }             from './editor/wordwrap/manager';
import { PanelCommandsManager }        from './notifications/panels/commands';
import { recoverSidePanelState }       from './keymaps/terminal/startup-recovery';
import { ensureCommandsSkipShell }      from './keymaps/terminal/skip-shell';
import { ensureMenuBarMnemonicsDisabled } from './keymaps/menu/mnemonics';

const managers: Array<{ name: string; ref: vscode.Disposable | undefined }> = [];

export async function activate(context: vscode.ExtensionContext) {
  const detector           = new EditorDetector();
  const aiManager          = new AICommandsManager(detector);
  const aiToggleManager    = new AIToggleManager(detector);
  const terminalManager    = new TerminalManager();
  const gitResetManager    = new GitResetManager();
  const wordWrapManager    = new WordWrapManager();
  const debugManager       = new DebugManager();
  const panelCommandsMgr   = new PanelCommandsManager();
  const layoutManager      = new KeymapLayoutManager();

  managers.push(
    { name: 'aiManager',         ref: aiManager         },
    { name: 'aiToggleManager',   ref: aiToggleManager   },
    { name: 'terminalManager',   ref: terminalManager   },
    { name: 'gitResetManager',   ref: gitResetManager   },
    { name: 'wordWrapManager',   ref: wordWrapManager   },
    { name: 'debugManager',      ref: debugManager      },
    { name: 'panelCommandsMgr',  ref: panelCommandsMgr  },
    { name: 'layoutManager',     ref: layoutManager     },
  );

  aiManager.registerCommands(context);
  aiToggleManager.registerCommands(context);
  terminalManager.registerCommands(context);
  gitResetManager.registerCommands(context);
  wordWrapManager.registerCommands(context);
  debugManager.registerCommands(context);
  panelCommandsMgr.registerCommands(context);
  layoutManager.registerCommands(context);

  await recoverSidePanelState(context);
  await ensureCommandsSkipShell();
  await ensureMenuBarMnemonicsDisabled();
}

export function deactivate(): void {
  for (const { name, ref } of managers) {
    try {
      ref?.dispose();
    } catch (error) {
      console.error(`[lynx-keymap] Error disposing ${name}:`, error);
    }
  }
}
