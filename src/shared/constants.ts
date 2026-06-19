export const LOG_PREFIX = '[lynx-keymap]';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ORIGINAL_TABS_ENABLED:      'lynx-keymap:originalTabsEnabled',
  ORIGINAL_TABS_LOCATION:     'lynx-keymap:originalTabsLocation',
  ORIGINAL_PANEL_SHOW_LABELS: 'lynx-keymap:originalPanelShowLabels',
  PANEL_POSITION:             'lynx-keymap:terminalPanelPosition',
  LAYOUT_MODE:                'lynx-keymap:layoutMode',
} as const;

// ─── Panel Position ───────────────────────────────────────────────────────────
// The terminal panel is either side-docked ('left') or in its default bottom
// position (tracked as `undefined`).
export const PANEL_POSITIONS = {
  LEFT: 'left',
} as const;
