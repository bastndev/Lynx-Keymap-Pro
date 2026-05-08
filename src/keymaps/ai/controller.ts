import * as vscode from 'vscode';
import {
  AI_COMMANDS, KEYMAP_CONFIG, EDITOR_SIGNATURES,
  EditorType, ActionKey, EDITOR_PRIMARY_SETTING
} from './configs';
import { STORAGE_KEYS } from '../terminal/shared';
import { notifyToggle } from '../../notifications/info';
import { LOG_PREFIX } from '../../shared/constants';

const LOG = LOG_PREFIX;

export class AICommandsManager {
  private disposables: vscode.Disposable[]  = [];
  private detectedEditor: EditorType | null = null;
  private allCommandsCache: string[] | null = null;
  private cacheTimestamp: number            = 0;
  private readonly CACHE_EXPIRY             = 5 * 60 * 1000; // 5 min

  // ─── Public API ────────────────────────────────────────────────────────────

  public registerCommands(context: vscode.ExtensionContext): void {
    const disposables = KEYMAP_CONFIG.map(({ commandId, commandsKey, errorMessage }) =>
      vscode.commands.registerCommand(commandId, async () => {
        await this.executeForAction(commandsKey, errorMessage);
      })
    );

    this.disposables = disposables;
    context.subscriptions.push(...disposables);
  }

  /** Detect editor eagerly on activation so first keypress is instant */
  public async warmup(): Promise<EditorType> {
    return this.detectEditor();
  }

  /** Force re-detection (call this if user installs a new AI extension) */
  public resetDetection(): void {
    this.detectedEditor   = null;
    this.allCommandsCache = null;
  }

  public dispose(): void {
    this.disposables.forEach(d => d?.dispose?.());
    this.disposables = [];
  }

  // ─── Editor Detection ──────────────────────────────────────────────────────

  /**
   * Detects the active editor by checking unique command signatures.
   * Priority order: Antigravity → Windsurf → Cursor → Trae → Kiro → Firebase → VSCode
   */
  public async detectEditor(): Promise<EditorType> {
    if (this.detectedEditor) {return this.detectedEditor;}

    const allCommands = await this.getAllCommands();

    const DETECTION_ORDER: EditorType[] = [
      EditorType.ANTIGRAVITY,
      EditorType.WINDSURF,
      EditorType.CURSOR,
      EditorType.TRAE_AI,
      EditorType.KIRO,
      EditorType.FIREBASE,
      EditorType.VSCODE,
    ];

    for (const editor of DETECTION_ORDER) {
      const signatures = EDITOR_SIGNATURES[editor];
      const detected   = signatures.some(sig => allCommands.includes(sig));

      if (detected) {
        this.detectedEditor = editor;
        return editor;
      }
    }

    // Ultimate fallback
    this.detectedEditor = EditorType.VSCODE;
    console.warn(`${LOG} Editor not detected, defaulting to VSCode`);
    return this.detectedEditor;
  }

  // ─── Execution ─────────────────────────────────────────────────────────────

  private async executeForAction(actionKey: ActionKey, errorMessage: string): Promise<void> {
    const editor     = await this.detectEditor();
    const commandMap = AI_COMMANDS[actionKey];

    // 1. Try the exact command for detected editor
    const primaryCmd = commandMap[editor];
    if (primaryCmd) {
      const ok = await this.tryExecute(primaryCmd, editor);
      if (ok) {return;}

      // Primary failed → reset detection so next call re-detects
      console.warn(`${LOG} Primary command failed, resetting detection`);
      this.resetDetection();
    }

    // 2. Fallback: try all other editors in DETECTION_ORDER
    const DETECTION_ORDER: EditorType[] = [
      EditorType.ANTIGRAVITY,
      EditorType.WINDSURF,
      EditorType.CURSOR,
      EditorType.TRAE_AI,
      EditorType.KIRO,
      EditorType.FIREBASE,
      EditorType.VSCODE,
    ];

    for (const fallbackEditor of DETECTION_ORDER) {
      if (fallbackEditor === editor) {continue;} // already tried

      const cmd = commandMap[fallbackEditor];
      if (!cmd) {continue;} // no command for this editor

      const ok = await this.tryExecute(cmd, fallbackEditor);
      if (ok) {return;}
    }

    vscode.window.showWarningMessage(errorMessage);
  }

  /**
   * Attempts to execute a command. Returns true on success, false on failure.
   * Does NOT check the cache — executeCommand itself is the source of truth.
   */
  private async tryExecute(cmd: string, _editor: EditorType | string): Promise<boolean> {
    try {
      await vscode.commands.executeCommand(cmd);
      return true;
    } catch {
      console.debug(`${LOG} Command failed: ${cmd}`);
      return false;
    }
  }

  // ─── Cache ─────────────────────────────────────────────────────────────────

  private async getAllCommands(): Promise<string[]> {
    const now = Date.now();
    if (this.allCommandsCache && now - this.cacheTimestamp < this.CACHE_EXPIRY) {
      return this.allCommandsCache;
    }
    try {
      this.allCommandsCache = await vscode.commands.getCommands(true);
      this.cacheTimestamp   = now;
      return this.allCommandsCache;
    } catch (error) {
      console.error(`${LOG} Failed to get commands:`, error);
      return this.allCommandsCache ?? [];
    }
  }
}

// ─── AI Toggle Manager ────────────────────────────────────────────────────────
// Reuses AICommandsManager.detectEditor() so both share the same 5-min cache.

export class AIToggleManager {
  private disposables: vscode.Disposable[] = [];

  constructor(private readonly aiManager: AICommandsManager) {}

  public registerCommands(context: vscode.ExtensionContext): void {
    const toggleCmd = vscode.commands.registerCommand('lynx.toggleSuggestionAI', async () => {
      await this.toggleAI(context);
    });
    this.disposables.push(toggleCmd);
    context.subscriptions.push(toggleCmd);
  }

  private async toggleAI(context: vscode.ExtensionContext): Promise<void> {
    const editor = await this.aiManager.detectEditor();

    const storedState  = context.globalState.get<boolean>(STORAGE_KEYS.SUGGESTIONS_ENABLED);
    const config       = vscode.workspace.getConfiguration();
    const currentState = storedState ?? config.get<boolean>(EDITOR_PRIMARY_SETTING[editor], true);
    const newState     = !currentState;

    await context.globalState.update(STORAGE_KEYS.SUGGESTIONS_ENABLED, newState);
    await this.applyAllSettings(newState);
    await this.applyEditorCommands(editor, newState);

    void notifyToggle(editor, newState);
  }

  /** Updates all known AI suggestion settings across editors. Skips absent settings. */
  private async applyAllSettings(newState: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    const booleanSettings = [
      'antigravity.tab.enabled',
      'editor.inlineSuggest.enabled',
      'github.copilot.editor.enableAutoCompletions',
      'kiro.completions.enabled',
      'cursor.completions.enabled',
      'trae.autocomplete.enabled',
      'cloudcode.duetAI.completions.enabled',
    ];

    for (const setting of booleanSettings) {
      try {
        if (config.has(setting) || setting === 'editor.inlineSuggest.enabled') {
          await config.update(setting, newState, vscode.ConfigurationTarget.Global);
        }
      } catch (e) {
        console.error(`${LOG} Failed to update "${setting}":`, e);
      }
    }
  }

  /** Fires editor-specific commands where settings alone are insufficient. */
  private async applyEditorCommands(editor: EditorType, _newState: boolean): Promise<void> {
    const cmd = AI_COMMANDS.toggleSuggestionAI[editor];
    if (cmd) { 
      void this.safeExecute(cmd); 
    }
  }

  private async safeExecute(command: string): Promise<boolean> {
    try { await vscode.commands.executeCommand(command); return true; }
    catch { return false; }
  }

  public dispose(): void {
    this.disposables.forEach(d => d.dispose());
  }
}