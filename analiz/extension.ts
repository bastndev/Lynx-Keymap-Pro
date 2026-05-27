import * as vscode from 'vscode';
import { EditorDetector }              from './keymaps/ai/detector';
import { AICommandsManager }           from './keymaps/ai/commands-manager';
import { AIToggleManager }             from './keymaps/ai/toggle-manager';
import { TerminalManager }             from './keymaps/terminal/side-panel';
import { BottomTerminalManager }       from './keymaps/terminal/bottom-panel';
import { GitResetManager }             from './editor/git/reset-manager';
import { DebugManager }                from './editor/debug/panel';
import { WordWrapManager }             from './editor/wordwrap/manager';
import { PanelCommandsManager }        from './notifications/panels/commands';
import { recoverSidePanelState }       from './keymaps/terminal/startup-recovery';

const managers: Array<{ name: string; ref: vscode.Disposable | undefined }> = [];

export async function activate(context: vscode.ExtensionContext) {
  const detector           = new EditorDetector();
  const aiManager          = new AICommandsManager(detector);
  const aiToggleManager    = new AIToggleManager(detector);
  const terminalManager    = new TerminalManager();
  const bottomTerminalMgr  = new BottomTerminalManager();
  const gitResetManager    = new GitResetManager();
  const wordWrapManager    = new WordWrapManager();
  const debugManager       = new DebugManager();
  const panelCommandsMgr   = new PanelCommandsManager();

  managers.push(
    { name: 'aiManager',         ref: aiManager         },
    { name: 'aiToggleManager',   ref: aiToggleManager   },
    { name: 'terminalManager',   ref: terminalManager   },
    { name: 'bottomTerminalMgr', ref: bottomTerminalMgr },
    { name: 'gitResetManager',   ref: gitResetManager   },
    { name: 'wordWrapManager',   ref: wordWrapManager   },
    { name: 'debugManager',      ref: debugManager      },
    { name: 'panelCommandsMgr',  ref: panelCommandsMgr  },
  );

  aiManager.registerCommands(context);
  aiToggleManager.registerCommands(context);
  terminalManager.registerCommands(context);
  bottomTerminalMgr.registerCommands(context);
  gitResetManager.registerCommands(context);
  wordWrapManager.registerCommands(context);
  debugManager.registerCommands(context);
  panelCommandsMgr.registerCommands(context);

  await recoverSidePanelState(context);
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
