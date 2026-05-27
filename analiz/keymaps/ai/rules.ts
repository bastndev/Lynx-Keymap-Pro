import { EDITOR_SIGNATURES, EditorType } from './configs';

// Most-specific forks first; plain VSCode is the final fallback.
export const AI_DETECTION_ORDER: readonly EditorType[] = [
  EditorType.ANTIGRAVITY,
  EditorType.WINDSURF,
  EditorType.CURSOR,
  EditorType.TRAE_AI,
  EditorType.KIRO,
  EditorType.FIREBASE,
  EditorType.VSCODE,
];

const EDITOR_TOGGLE_SETTINGS: Record<EditorType, readonly string[]> = {
  [EditorType.ANTIGRAVITY]: ['antigravity.tab.enabled'],
  [EditorType.VSCODE]:      ['editor.inlineSuggest.enabled', 'github.copilot.editor.enableAutoCompletions'],
  [EditorType.KIRO]:        ['kiro.completions.enabled'],
  [EditorType.CURSOR]:      ['cursor.completions.enabled'],
  [EditorType.WINDSURF]:    ['editor.inlineSuggest.enabled'],
  [EditorType.TRAE_AI]:     ['trae.autocomplete.enabled'],
  [EditorType.FIREBASE]:    ['cloudcode.duetAI.completions.enabled'],
};

export function isDetectionCacheFresh(
  cachedEditor: EditorType | null,
  cacheTimestamp: number,
  now: number,
  cacheExpiry: number,
): cachedEditor is EditorType {
  return cachedEditor !== null && now - cacheTimestamp < cacheExpiry;
}

export function hasEditorSignature(
  editor: EditorType,
  commands: ReadonlySet<string>,
): boolean {
  return EDITOR_SIGNATURES[editor].some(signature => commands.has(signature));
}

export function findEditorFromCommands(commands: ReadonlySet<string>): EditorType | undefined {
  return AI_DETECTION_ORDER.find(editor => hasEditorSignature(editor, commands));
}

export function shouldTryFallbackEditor(
  primaryEditor: EditorType,
  fallbackEditor: EditorType,
  fallbackAvailable: boolean,
): boolean {
  if (fallbackEditor === primaryEditor) {
    return false;
  }

  if (fallbackEditor === EditorType.VSCODE && primaryEditor !== EditorType.VSCODE) {
    return false;
  }

  return fallbackAvailable;
}

export function getEditorToggleSettings(editor: EditorType): readonly string[] {
  return EDITOR_TOGGLE_SETTINGS[editor];
}
