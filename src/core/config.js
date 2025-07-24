/**
 * Centralized configuration for Lynx Keymap Extension
 * Contains all constants, command mappings, and configuration options
 */

// Extension Metadata
const EXTENSION_NAME = 'lynx-keymap';
const EXTENSION_DISPLAY_NAME = 'Lynx Keymap 75% Keyboard';

// Command Prefixes
const COMMAND_PREFIX = 'lynx-keymap';

// AI Platform Command Mappings
const AI_COMMANDS = {
  // [Alt+2]
  COMMIT: [
    'windsurf.generateCommitMessage',                     // Windsurf
    'github.copilot.git.generateCommitMessage',           // VSCode
    'cursor.generateGitCommitMessage',                    // Cursor AI
    'icube.gitGenerateCommitMessage',                     // Trae AI
  ],
  
  // [Ctrl+`]
  POPUP: [
    'windsurf.prioritized.command.open',                  // Windsurf
    'inlineChat.start',                                   // VSCode
    'aipopup.action.modal.generate',                      // Cursor AI
    'icube.inlineChat.start',                             // Trae AI
    'workbench.action.terminal.chat.start',               // Firebase Studio
    'kiroAgent.inlineChat.start',                         // Kiro
  ],
  
  // [Shift+Tab]
  CHAT: [
    'kiroAgent.continueGUIView.focus',                    // Kiro
    'windsurf.prioritized.chat.open',                     // Windsurf
    'workbench.panel.chat',                               // VSCode
    'aichat.newchataction',                               // Cursor AI
    'workbench.action.chat.icube.open',                   // Trae AI
    'aichat.prompt',                                      // Firebase Studio
  ],

  // [Shift+Esc] --- Future

  // [Alt+A]
  NEW_SESSION: [
    'windsurf.prioritized.chat.openNewConversation',      // Windsurf
    'workbench.action.chat.newEditSession',               // VSCode
    'composer.createNew',                                 // Cursor AI
    'workbench.action.icube.aiChatSidebar.createNewSession', // Trae AI
    'kiroAgent.newSession'                                // Kiro
  ],
  
  // [Alt+S]
  HISTORY: [
    'kiroAgent.viewHistoryChats',                         // Kiro
    'workbench.action.chat.history',                      // VSCode
    'composer.showComposerHistory',                       // Cursor AI
    'workbench.action.icube.aiChatSidebar.showHistory',   // Trae AI
  ],
  
  // [Alt+D]
  ATTACH_CONTEXT: [
    'workbench.action.chat.attachContext',                // VSCode
    'composer.openAddContextMenu',                        // Cursor AI
  ],
};

// Color Themes
const COLORS = {
  ICON_COLORS: [
    '#008dfa',    // Blue
    '#07cc4cff',  // Green
    null,         // Default (theme)
  ],
  
  PEACOCK_COLORS: {
    BLUE: '#0070bb',
    GREEN: '#1e5739',
    ORANGE: '#b85609',
    LEMON: '#6c8a01ff',
    RED: '#8b1538',
    WHITE: '#ffffff',
  },
};

// Configuration Keys
const CONFIG_KEYS = {
  INLINE_SUGGEST: 'editor.inlineSuggest.enabled',
  COLOR_CUSTOMIZATIONS: 'workbench.colorCustomizations',
  ICON_FOREGROUND: 'icon.foreground',
};

// State Keys
const STATE_KEYS = {
  COLOR_MODE_ACTIVE: 'lynx-keymap.colorModeActive',
  CURRENT_COLOR: 'lynx-keymap.currentColor',
  LAST_USED_COLOR: 'lynx-keymap.lastUsedColor',
  MANAGERS_CACHE: 'lynx-keymap.managersCache',
};

// Command Sequences for Macros
const MACRO_SEQUENCES = {
  COLOR_AND_AGENT: [
    { command: 'workbench.action.chat.toggleAgentMode', delay: 10 },
    { command: 'lynx-keymap.cycleIconColor' },
  ],
  
  CUSTOM_WORKSPACE_TOUR: [
    { command: 'workbench.view.explorer', delay: 10 },
    { command: 'workbench.view.scm', delay: 10 },
    { command: 'workbench.view.extensions' },
  ],
};

// Error Messages
const ERROR_MESSAGES = {
  NO_AI_COMMIT: 'No AI commit generators available',
  NO_AI_CHAT: 'No AI chat providers available',
  NO_AI_SESSION: 'No AI providers available to create a new session',
  NO_AI_HISTORY: 'No AI history available',
  NO_AI_CONTEXT: 'No AI context attachment available',
  INLINE_SUGGEST_FAILED: 'Failed to toggle Inline Suggestions setting',
  ICON_COLOR_FAILED: 'Failed to change icon color. Please try again.',
  MACRO_FAILED: 'Macro execution failed',
  MACRO_ALREADY_RUNNING: 'Macro already executing, please wait...',
};

// Performance Settings
const PERFORMANCE = {
  COMMAND_CACHE_TTL: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  MACRO_DEFAULT_DELAY: 10,
  DEBOUNCE_DELAY: 100,
};

module.exports = {
  EXTENSION_NAME,
  EXTENSION_DISPLAY_NAME,
  COMMAND_PREFIX,
  AI_COMMANDS,
  COLORS,
  CONFIG_KEYS,
  STATE_KEYS,
  MACRO_SEQUENCES,
  ERROR_MESSAGES,
  PERFORMANCE,
};
