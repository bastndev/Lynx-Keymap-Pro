export enum EditorType {
  ANTIGRAVITY = 'antigravity',
  VSCODE      = 'vscode',
  KIRO        = 'kiro',
  CURSOR      = 'cursor',
  WINDSURF    = 'windsurf',
  TRAE_AI     = 'trae-ai',
  FIREBASE    = 'firebase',
  UNKNOWN     = 'unknown'
}

// ─── Detection Signatures ────────────────────────────────────────────────────
export const EDITOR_SIGNATURES: Record<EditorType, string[]> = {
  [EditorType.ANTIGRAVITY]: ['antigravity.startNewConversation', 'antigravity.prioritized.command.open'],
  [EditorType.VSCODE]:      ['inlineChat.start',                 'workbench.action.chat.newEditSession'],
  [EditorType.KIRO]:        ['kiroAgent.newSession',             'kiroAgent.inlineChat.start'],
  [EditorType.CURSOR]:      ['composer.createNew',               'cursor.generateGitCommitMessage'],
  [EditorType.WINDSURF]:    ['windsurf.prioritized.chat.open',   'windsurf.generateCommitMessage'],
  [EditorType.TRAE_AI]:     ['icube.inlineChat.start',           'icube.gitGenerateCommitMessage'],
  [EditorType.FIREBASE]:    ['workbench.action.terminal.chat.start'],
  [EditorType.UNKNOWN]:     []
};

// ─── Primary Setting per Editor (for toggle state source of truth) ────────────
export const EDITOR_PRIMARY_SETTING: Record<EditorType, string> = {
  [EditorType.ANTIGRAVITY]: 'antigravity.tab.enabled',
  [EditorType.VSCODE]:      'editor.inlineSuggest.enabled',
  [EditorType.KIRO]:        'kiro.completions.enabled',
  [EditorType.CURSOR]:      'cursor.completions.enabled',
  [EditorType.WINDSURF]:    'editor.inlineSuggest.enabled',
  [EditorType.TRAE_AI]:     'trae.autocomplete.enabled',
  [EditorType.FIREBASE]:    'cloudcode.duetAI.completions.enabled',
  [EditorType.UNKNOWN]:     'editor.inlineSuggest.enabled',
};

// ─── Action Keys ─────────────────────────────────────────────────────────────
export type ActionKey =
  | 'generateAICommit'
  | 'openAndCloseAIChat'
  | 'createNewAISession'
  | 'showAIHistory'
  | 'selectModels'
  | 'toggleAgentMode'
  | 'selectCode'
  | 'toggleSuggestionAI';

// ─── Commands by Action → Editor ─────────────────────────────────────────────
export type EditorCommandMap = Partial<Record<EditorType, string>>;

export const AI_COMMANDS: Record<ActionKey, EditorCommandMap> = {

  // MARK:[Alt+2]
  generateAICommit: {
    [EditorType.ANTIGRAVITY]: 'antigravity.generateCommitMessage',
    [EditorType.VSCODE]:      'github.copilot.git.generateCommitMessage',
    [EditorType.KIRO]:        'kiroAgent.generateCommitMessage',
    [EditorType.CURSOR]:      'cursor.generateGitCommitMessage',
    [EditorType.WINDSURF]:    'windsurf.generateCommitMessage',
    [EditorType.TRAE_AI]:     'icube.gitGenerateCommitMessage',
    // [EditorType.FIREBASE]: [no support]
  },

  // MARK:[ctrl+capslock]
  openAndCloseAIChat: {
    [EditorType.ANTIGRAVITY]: 'antigravity.openAgent',
    [EditorType.VSCODE]:      'workbench.action.chat.toggle',
    [EditorType.KIRO]:        'workbench.action.toggleAuxiliaryBar',
    [EditorType.CURSOR]:      'workbench.action.toggleAuxiliaryBar',
    [EditorType.WINDSURF]:    'windsurf.prioritized.chat.open',
    [EditorType.TRAE_AI]:     'workbench.action.chat.icube.open',
    [EditorType.FIREBASE]:    'aichat.prompt',
  },

  // MARK:[Alt+A]   (AI)
  createNewAISession: {
    [EditorType.ANTIGRAVITY]: 'antigravity.startNewConversation',
    [EditorType.VSCODE]:      'workbench.action.chat.newEditSession',
    [EditorType.KIRO]:        'kiroAgent.newSession',
    [EditorType.CURSOR]:      'composer.createNew',
    [EditorType.WINDSURF]:    'windsurf.prioritized.chat.openNewConversation',
    [EditorType.TRAE_AI]:     'workbench.action.icube.aiChatSidebar.createNewSession',
    // [EditorType.FIREBASE]: [no support]
  },

  // MARK:[Alt+S]
  selectModels: {
    [EditorType.ANTIGRAVITY]: 'antigravity.toggleModelSelector',
    [EditorType.VSCODE]:      'workbench.action.chat.openModelPicker',
    // [EditorType.KIRO]:     [no support]
    [EditorType.CURSOR]:      'composer.openAddContextMenu',
    // [EditorType.WINDSURF]: [no support]
    // [EditorType.TRAE_AI]:  [no support]
    // [EditorType.FIREBASE]: [no support]
  },
  
  // MARK:[Alt+D]
  selectCode: {
    [EditorType.ANTIGRAVITY]: 'antigravity.toggleChatFocus',
    // [EditorType.VSCODE]:   [no support]   
    [EditorType.KIRO]:        'kiroAgent.focusContinueInputWithoutNewSession',
    [EditorType.CURSOR]:      'aichat.newchataction',
    // [EditorType.WINDSURF]: [no support]
    // [EditorType.TRAE_AI]:  [no support]
    // [EditorType.FIREBASE]: [no support]
  },

  // MARK:[Shift+Alt+A] ---
  toggleAgentMode: {
    [EditorType.ANTIGRAVITY]: 'workbench.action.chat.toggleAgentMode',
    [EditorType.VSCODE]:      'workbench.action.chat.toggleAgentMode',
    // [EditorType.KIRO]:     [no support]
    [EditorType.CURSOR]:      'workbench.action.toggleAuxiliaryBart',
    [EditorType.WINDSURF]:    'windsurf.toggleAgentMode',
    // [EditorType.TRAE_AI]:  [no support]
    // [EditorType.FIREBASE]: [no support]
  },

  // MARK:[Shift+Alt+S]
  showAIHistory: {
    [EditorType.ANTIGRAVITY]: 'antigravity.openConversationPicker',
    [EditorType.VSCODE]:      'workbench.action.chat.history',
    [EditorType.KIRO]:        'kiroAgent.viewHistoryChats',
    [EditorType.CURSOR]:      'composer.showComposerHistory',
    // [EditorType.WINDSURF]: [no support]
    [EditorType.TRAE_AI]:     'workbench.action.icube.aiChatSidebar.showHistory',
    // [EditorType.FIREBASE]: [no support]
  },

  // MARK:[Shift+Alt+D] — per-editor toggle command (fired after settings update)
  toggleSuggestionAI: {
    // [EditorType.ANTIGRAVITY]: only settings, no extra command needed
    [EditorType.VSCODE]:   'github.copilot.chat.completions.toggle',
    [EditorType.CURSOR]:   'cursor.toggleCopilot',
    // [EditorType.KIRO]:        only settings, no extra command needed
    [EditorType.WINDSURF]: 'codeium.toggleEnable',
    [EditorType.TRAE_AI]:  'trae.toggleAutocomplete',
    [EditorType.FIREBASE]: 'cloudcode.duetAI.toggleInlineCompletion',
  },

};

// ─── Keymap Config ────────────────────────────────────────────────────────────
export interface KeymapConfig {
  commandId: string;
  commandsKey: ActionKey;
  errorMessage: string;
}

export const KEYMAP_CONFIG: KeymapConfig[] = [
  {
    commandId:    'lynx-keymap.generateAICommit',
    commandsKey:  'generateAICommit',
    errorMessage: 'No AI commit generators available'
  },
  {
    commandId:    'lynx-keymap.openAndCloseAIChat',
    commandsKey:  'openAndCloseAIChat',
    errorMessage: 'No AI chat providers available'
  },
  {
    commandId:    'lynx-keymap.createNewAISession',
    commandsKey:  'createNewAISession',
    errorMessage: 'No AI providers available to create a new session'
  },
  {
    commandId:    'lynx-keymap.showAIHistory',
    commandsKey:  'showAIHistory',
    errorMessage: 'No AI history available'
  },
  {
    commandId:    'lynx-keymap.selectModels',
    commandsKey:  'selectModels',
    errorMessage: 'No AI model selector available'
  },
  {
    commandId:    'lynx-keymap.toggleAgentMode',
    commandsKey:  'toggleAgentMode',
    errorMessage: 'No AI agent toggle available'
  },
  {
    commandId:    'lynx-keymap.selectCode',
    commandsKey:  'selectCode',
    errorMessage: 'No AI select code available'
  }
];