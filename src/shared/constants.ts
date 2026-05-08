export const LOG_PREFIX = '[lynx-keymap]';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  LAST_ACTIVE_MODE:           'lynx-keymap:lastActiveMode',
  ORIGINAL_TABS_ENABLED:      'lynx-keymap:originalTabsEnabled',
  ORIGINAL_TABS_LOCATION:     'lynx-keymap:originalTabsLocation',
  ORIGINAL_PANEL_SHOW_LABELS: 'lynx-keymap:originalPanelShowLabels',
  PANEL_POSITION:             'lynx-keymap:terminalPanelPosition',
  SUGGESTIONS_ENABLED:        'lynx-keymap:suggestionsEnabled',
} as const;

// ─── Panel Positions ──────────────────────────────────────────────────────────
export type PanelPosition = 'left' | 'bottom';

export const PANEL_POSITIONS = {
  LEFT:   'left',
  BOTTOM: 'bottom',
} as const;
