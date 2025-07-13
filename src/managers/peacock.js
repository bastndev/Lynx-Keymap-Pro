const vscode = require('vscode');
const { getLogger } = require('../core/logger');
const { COLORS, STATE_KEYS, CONFIG_KEYS } = require('../core/config');

// Constants
const PEACOCK_SECTION = CONFIG_KEYS.COLOR_CUSTOMIZATIONS;

class PeacockManager {
  constructor(context) {
    this.context = context;
    this.isInitialized = false;
    this.logger = getLogger();
    this.colorKeys = Object.keys(COLORS.PEACOCK_COLORS).filter(key => key !== 'WHITE');
    this.initializeCleanState();
  }

  // Public Methods

  /**
   * Toggles color mode with random color selection
   */
  async toggleColorMode() {
    if (!this.isInitialized) {
      await this.initializeCleanState();
    }

    const isActive = this.context.workspaceState.get(STATE_KEYS.COLOR_MODE_ACTIVE, false);

    if (isActive) {
      await this.deactivateColorMode();
    } else {
      await this.activateRandomColorMode();
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  async toggleGreenMode() {
    await this.toggleColorMode();
  }

  /**
   * Deactivate color mode (for extension cleanup)
   */
  async deactivateGreenMode() {
    await this.deactivateColorMode();
  }

  // Private Methods

  /**
   * Initializes clean state every time VSCode is opened
   */
  async initializeCleanState() {
    this.logger.startPerformance('peacock-init');
    
    try {
      await this.context.workspaceState.update(STATE_KEYS.COLOR_MODE_ACTIVE, false);
      await this.context.workspaceState.update(STATE_KEYS.CURRENT_COLOR, null);

      const config = vscode.workspace.getConfiguration();
      await config.update(
        PEACOCK_SECTION,
        undefined,
        vscode.ConfigurationTarget.Workspace
      );

      this.isInitialized = true;
      
      const duration = this.logger.endPerformance('peacock-init');
      this.logger.info(`Peacock manager initialized cleanly in ${duration}ms`);

    } catch (error) {
      const duration = this.logger.endPerformance('peacock-init');
      this.logger.error(`Failed to initialize Peacock manager after ${duration}ms`, error);
      this.isInitialized = true;
    }
  }

  /**
   * Gets a random color key, avoiding the last used color to prevent repetition
   * This works across activate/deactivate cycles
   */
  getRandomColor() {
    // Get the last used color (persists even when mode is deactivated)
    const lastUsedColor = this.context.workspaceState.get(STATE_KEYS.LAST_USED_COLOR);
    
    // If there's only one color or no previous color, return any random color
    if (this.colorKeys.length <= 1 || !lastUsedColor) {
      const randomIndex = Math.floor(Math.random() * this.colorKeys.length);
      const colorKey = this.colorKeys[randomIndex];
      this.logger.debug(`Selected random color: ${colorKey} (no previous restriction)`);
      return colorKey;
    }
    
    // Filter out the last used color to avoid repetition
    const availableColors = this.colorKeys.filter(key => key !== lastUsedColor);
    
    // Select random color from remaining options
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const colorKey = availableColors[randomIndex];
    
    this.logger.debug(`Selected random color: ${colorKey} (avoiding last used: ${lastUsedColor})`);
    return colorKey;
  }

  /**
   * Applies random color to workspace configuration
   */
  async activateRandomColorMode() {
    this.logger.startPerformance('activate-color-mode');
    
    try {
      const colorKey = this.getRandomColor();
      const color = COLORS.PEACOCK_COLORS[colorKey];

      const colorCustomizations = {
        'statusBar.background': color,
        'statusBar.foreground': COLORS.PEACOCK_COLORS.WHITE,
        'statusBarItem.remoteBackground': color,
      };

      await this.updateWorkspaceColors(colorCustomizations, true, 'activate');
      await this.context.workspaceState.update(STATE_KEYS.CURRENT_COLOR, colorKey);
      await this.context.workspaceState.update(STATE_KEYS.LAST_USED_COLOR, colorKey);

      const duration = this.logger.endPerformance('activate-color-mode');
      this.logger.info(`Activated ${colorKey} color mode in ${duration}ms`);

    } catch (error) {
      const duration = this.logger.endPerformance('activate-color-mode');
      this.logger.error(`Failed to activate color mode after ${duration}ms`, error);
      throw error;
    }
  }

  /**
   * Clears workspace colors, returning to original state
   */
  async deactivateColorMode() {
    this.logger.startPerformance('deactivate-color-mode');
    
    try {
      const currentColor = this.context.workspaceState.get(STATE_KEYS.CURRENT_COLOR);
      
      await this.updateWorkspaceColors(undefined, false, 'deactivate');
      await this.context.workspaceState.update(STATE_KEYS.CURRENT_COLOR, null);

      const duration = this.logger.endPerformance('deactivate-color-mode');
      this.logger.info(`Deactivated color mode (was ${currentColor || 'unknown'}) in ${duration}ms`);

    } catch (error) {
      const duration = this.logger.endPerformance('deactivate-color-mode');
      this.logger.error(`Failed to deactivate color mode after ${duration}ms`, error);
      throw error;
    }
  }

  /**
   * Set specific color mode
   * @param {string} colorKey - Color key from COLORS.PEACOCK_COLORS
   */
  async setSpecificColorMode(colorKey) {
    if (!COLORS.PEACOCK_COLORS[colorKey]) {
      throw new Error(`Invalid color key: ${colorKey}`);
    }

    const color = COLORS.PEACOCK_COLORS[colorKey];
    const colorCustomizations = {
      'statusBar.background': color,
      'statusBar.foreground': COLORS.PEACOCK_COLORS.WHITE,
      'statusBarItem.remoteBackground': color,
    };

    await this.updateWorkspaceColors(colorCustomizations, true, 'activate');
    await this.context.workspaceState.update(STATE_KEYS.CURRENT_COLOR, colorKey);

    this.logger.info(`Set specific color mode: ${colorKey}`);
  }

  /**
   * Helper method to update workspace colors and state
   */
  async updateWorkspaceColors(colorCustomizations, stateValue, action) {
    try {
      const config = vscode.workspace.getConfiguration();
      await config.update(
        PEACOCK_SECTION,
        colorCustomizations,
        vscode.ConfigurationTarget.Workspace
      );
      await this.context.workspaceState.update(STATE_KEYS.COLOR_MODE_ACTIVE, stateValue);
      
      this.logger.debug(`Updated workspace colors for action: ${action}`);

    } catch (error) {
      this.logger.error(`Failed to ${action} color mode`, error);
      throw error;
    }
  }

  /**
   * Get current color mode status
   */
  getColorModeStatus() {
    return {
      isActive: this.context.workspaceState.get(STATE_KEYS.COLOR_MODE_ACTIVE, false),
      currentColor: this.context.workspaceState.get(STATE_KEYS.CURRENT_COLOR, null),
      lastUsedColor: this.context.workspaceState.get(STATE_KEYS.LAST_USED_COLOR, null),
      availableColors: this.colorKeys,
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Get available colors
   */
  getAvailableColors() {
    return this.colorKeys.map(key => ({
      key,
      value: COLORS.PEACOCK_COLORS[key],
      name: key.toLowerCase(),
    }));
  }

  /**
   * Dispose peacock manager resources
   */
  dispose() {
    this.logger.info('Disposing Peacock manager');
    // No specific cleanup needed as VSCode handles workspace state
  }
}

module.exports = PeacockManager;