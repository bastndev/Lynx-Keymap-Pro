import * as vscode from 'vscode';
import {
  AI_COMMANDS, KEYMAP_CONFIG, EDITOR_SIGNATURES,
  EditorType, ActionKey, EDITOR_PRIMARY_SETTING
} from './configs';
import { STORAGE_KEYS, LOG_PREFIX } from '../../shared/constants';
import { notifyToggle } from '../../notifications/info';

// Most-specific forks first; plain VSCode is the final fallback.
const DETECTION_ORDER: EditorType[] = [
  EditorType.ANTIGRAVITY,
  EditorType.WINDSURF,
  EditorType.CURSOR,
  EditorType.TRAE_AI,
  EditorType.KIRO,
  EditorType.FIREBASE,
  EditorType.VSCODE,
];

export class AICommandsManager {
  private disposables: vscode.Disposable[]    = [];
  private detectedEditor: EditorType | null   = null;
  private allCommandsCache: Set<string> | null = null; // Set for O(1) .has() lookups
  private cacheTimestamp: number              = 0;
  private readonly CACHE_EXPIRY              = 5 * 60 * 1000; // 5 min

  public registerCommands(context: vscode.ExtensionContext): void {
    const disposables = KEYMAP_CONFIG.map(({ commandId, commandsKey, errorMessage }) =>
      vscode.commands.registerCommand(commandId, async () => {
        await this.executeForAction(commandsKey, errorMessage);
      })
    );
    this.disposables = disposables;
    context.subscriptions.push(...disposables);
  }

  /** Pre-detects the editor on activation so the first keypress is instant. */
  public async warmup(): Promise<EditorType> {
    return this.detectEditor();
  }

  /** Forces re-detection (useful when the user installs a new AI extension). */
  public resetDetection(): void {
    this.detectedEditor   = null;
    this.allCommandsCache = null;
  }

  public dispose(): void {
    this.disposables.forEach(d => d?.dispose?.());
    this.disposables = [];
  }

  // ─── Editor Detection ──────────────────────────────────────────────────────

  public async detectEditor(): Promise<EditorType> {
    if (this.detectedEditor) { return this.detectedEditor; }

    const allCommands = await this.getAllCommands();

    for (const editor of DETECTION_ORDER) {
      const signatures = EDITOR_SIGNATURES[editor];
      if (signatures.some(sig => allCommands.has(sig))) {
        this.detectedEditor = editor;
        return editor;
      }
    }

    this.detectedEditor = EditorType.VSCODE;
    console.warn(`${LOG_PREFIX} Editor not detected, defaulting to VSCode`);
    return this.detectedEditor;
  }

  // ─── Execution ─────────────────────────────────────────────────────────────

  private async executeForAction(actionKey: ActionKey, errorMessage: string): Promise<void> {
    const editor     = await this.detectEditor();
    const commandMap = AI_COMMANDS[actionKey];

    const primaryCmd = commandMap[editor];
    if (primaryCmd) {
      const ok = await this.tryExecute(primaryCmd);
      if (ok) { return; }

      console.warn(`${LOG_PREFIX} Primary command failed, resetting detection`);
      this.resetDetection();
    }

    // Fallback: try remaining editors in priority order
    for (const fallbackEditor of DETECTION_ORDER) {
      if (fallbackEditor === editor) { continue; }
      const cmd = commandMap[fallbackEditor];
      if (!cmd) { continue; }
      const ok = await this.tryExecute(cmd);
      if (ok) { return; }
    }

    vscode.window.showWarningMessage(errorMessage);
  }

  private async tryExecute(cmd: string): Promise<boolean> {
    try {
      await vscode.commands.executeCommand(cmd);
      return true;
    } catch {
      console.debug(`${LOG_PREFIX} Command failed: ${cmd}`);
      return false;
    }
  }

  // ─── Cache ─────────────────────────────────────────────────────────────────

  private async getAllCommands(): Promise<Set<string>> {
    const now = Date.now();
    if (this.allCommandsCache && now - this.cacheTimestamp < this.CACHE_EXPIRY) {
      return this.allCommandsCache;
    }
    try {
      this.allCommandsCache = new Set(await vscode.commands.getCommands(true));
      this.cacheTimestamp   = now;
      return this.allCommandsCache;
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to get commands:`, error);
      return this.allCommandsCache ?? new Set();
    }
  }
}

// ─── AI Toggle Manager ────────────────────────────────────────────────────────

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
    await this.applyEditorCommands(editor);

    void notifyToggle(editor, newState);
  }

  private async applyAllSettings(newState: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    const settings = [
      'antigravity.tab.enabled',
      'editor.inlineSuggest.enabled',
      'github.copilot.editor.enableAutoCompletions',
      'kiro.completions.enabled',
      'cursor.completions.enabled',
      'trae.autocomplete.enabled',
      'cloudcode.duetAI.completions.enabled',
    ];

    for (const setting of settings) {
      try {
        if (config.has(setting) || setting === 'editor.inlineSuggest.enabled') {
          await config.update(setting, newState, vscode.ConfigurationTarget.Global);
        }
      } catch (e) {
        console.error(`${LOG_PREFIX} Failed to update "${setting}":`, e);
      }
    }
  }

  private async applyEditorCommands(editor: EditorType): Promise<void> {
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