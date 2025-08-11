const vscode = require('vscode');

// Constants
const COLOR_CUSTOMIZATIONS_SECTION = 'workbench.colorCustomizations';
const STATE_MEMENTO_KEY = 'lynx-keymap.colorModeActive';
const CURRENT_COLOR_KEY = 'lynx-keymap.currentColor';
const COLOR_HISTORY_KEY = 'lynx-keymap.colorHistory';

const COLORS = {
  BLUE: '#253c52',
  PURPLE: '#3d2952',
  ORANGE: '#4a3c2b',
  LEMON: '#51641bff',
  RED: '#4a2b2f',
  GREEN: '#1e5739',
  WHITE: '#ffffff'
};

const COLOR_NAMES = {
  PURPLE: 'PURPLE',
  BLUE: 'BLUE',
  ORANGE: 'ORANGE',
  LEMON: 'LEMON',
  RED: 'RED',
  GREEN:'GREEN'
};

class StatusBarManager {
  constructor(context) {
    this.context = context;
    this.isInitialized = false;
    this.colorKeys = ['PURPLE', 'BLUE', 'ORANGE', 'LEMON', 'RED','GREEN'];
    this.maxHistorySize = 3; 
    this.initializeCleanState();
  }

  /**
   * Toggles color mode with smart color selection (no repetition)
   */
  async toggleColorMode() {
    if (!this.isInitialized) {
      await this.initializeCleanState();
    }

    const isActive = this.context.workspaceState.get(STATE_MEMENTO_KEY, false);

    if (isActive) {
      await this.deactivateColorMode();
    } else {
      await this.activateSmartColorMode();
    }
  }

  async toggleStatusBarColor() {
    await this.toggleColorMode();
  }

  /**
   * Initializes clean state every time VSCode is opened
   */
  async initializeCleanState() {
    try {
      await this.context.workspaceState.update(STATE_MEMENTO_KEY, false);
      await this.context.workspaceState.update(CURRENT_COLOR_KEY, null);
      // Initialize empty color history
      await this.context.workspaceState.update(COLOR_HISTORY_KEY, []);

      const config = vscode.workspace.getConfiguration();
      await config.update(
        COLOR_CUSTOMIZATIONS_SECTION,
        undefined,
        vscode.ConfigurationTarget.Workspace
      );

      this.isInitialized = true;
      console.log('Lynx Color Mode: State initialized cleanly');
    } catch (error) {
      console.error('Error initializing clean state:', error);
      this.isInitialized = true;
    }
  }

  getColorHistory() {
    return this.context.workspaceState.get(COLOR_HISTORY_KEY, []);
  }

  /**
   * Updates color history, maintaining max size
   */
  async updateColorHistory(colorKey) {
    let history = this.getColorHistory();
    // Add new color to the beginning of the history
    history.unshift(colorKey);
    // Keep only the last N colors
    if (history.length > this.maxHistorySize) {
      history = history.slice(0, this.maxHistorySize);
    }
    await this.context.workspaceState.update(COLOR_HISTORY_KEY, history);
  }

  /**
   * Gets available colors (excluding recent ones from history)
   */
  getAvailableColors() {
    const history = this.getColorHistory();
    const availableColors = this.colorKeys.filter(color => !history.includes(color));
    // If all colors are in history, use all except the last used
    if (availableColors.length === 0) {
      const lastUsedColor = history[0];
      return this.colorKeys.filter(color => color !== lastUsedColor);
    }
    return availableColors;
  }

  /**
   * Gets a smart color selection (avoids recent colors)
   */
  getSmartColor() {
    const availableColors = this.getAvailableColors();
    if (availableColors.length === 0) {
      // Fallback: select any color except the current one
      const currentColor = this.context.workspaceState.get(CURRENT_COLOR_KEY);
      const fallbackColors = this.colorKeys.filter(color => color !== currentColor);
      const randomIndex = Math.floor(Math.random() * fallbackColors.length);
      return fallbackColors[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  }

  /**
   * Applies smart color selection to workspace configuration
   */
  async activateSmartColorMode() {
    const colorKey = this.getSmartColor();
    const color = COLORS[colorKey];

    const colorCustomizations = {
      'statusBar.background': color,
      'statusBar.foreground': COLORS.WHITE,
      'statusBarItem.remoteBackground': color,
    };

    await this.updateWorkspaceColors(colorCustomizations, true, 'activate');
    await this.context.workspaceState.update(CURRENT_COLOR_KEY, colorKey);
    // Update color history
    await this.updateColorHistory(colorKey);

    console.log(`Lynx Color Mode: Activated with color ${colorKey}`);
    console.log(`Color history: ${JSON.stringify(this.getColorHistory())}`);
  }

  /**
   * Clears workspace colors, returning to original state
   */
  async deactivateColorMode() {
    await this.updateWorkspaceColors(undefined, false, 'deactivate');
    await this.context.workspaceState.update(CURRENT_COLOR_KEY, null);

    console.log('Lynx Color Mode: Deactivated');
  }

  /**
   * Helper method to update workspace colors and state
   */
  async updateWorkspaceColors(colorCustomizations, stateValue, action) {
    try {
      const config = vscode.workspace.getConfiguration();
      await config.update(
        COLOR_CUSTOMIZATIONS_SECTION,
        colorCustomizations,
        vscode.ConfigurationTarget.Workspace
      );
      await this.context.workspaceState.update(STATE_MEMENTO_KEY, stateValue);
    } catch (error) {
      console.error(`Failed to ${action} color mode:`, error);
    }
  }

  getDebugInfo() {
    return {
      isActive: this.context.workspaceState.get(STATE_MEMENTO_KEY, false),
      currentColor: this.context.workspaceState.get(CURRENT_COLOR_KEY, null),
      colorHistory: this.getColorHistory(),
      availableColors: this.getAvailableColors()
    };
  }
}

module.exports = StatusBarManager;
