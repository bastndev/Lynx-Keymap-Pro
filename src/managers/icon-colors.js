const vscode = require('vscode');
const { getLogger } = require('../core/logger');
const { COLORS, CONFIG_KEYS, ERROR_MESSAGES } = require('../core/config');

class ColorManager {
  constructor() {
    this.colors = COLORS.ICON_COLORS;
    this.currentColorIndex = 2; // Start with default color
    this.logger = getLogger();
  }

  /**
   * Cycles through available colors
   * @returns {Promise<void>}
   */
  async cycleIconColor() {
    this.logger.startPerformance('cycle-icon-color');
    
    try {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      const newColor = this.colors[this.currentColorIndex];
      const colorName = this.getCurrentColorName();

      const config = vscode.workspace.getConfiguration();
      const currentCustomizations = config.get(CONFIG_KEYS.COLOR_CUSTOMIZATIONS, {});

      await config.update(
        CONFIG_KEYS.COLOR_CUSTOMIZATIONS,
        {
          ...currentCustomizations,
          [CONFIG_KEYS.ICON_FOREGROUND]: newColor,
        },
        vscode.ConfigurationTarget.Global
      );

      const duration = this.logger.endPerformance('cycle-icon-color');
      this.logger.info(`Icon color changed to ${colorName} in ${duration}ms`);

    } catch (error) {
      const duration = this.logger.endPerformance('cycle-icon-color');
      this.logger.error(`Failed to cycle icon color after ${duration}ms`, error);
      
      vscode.window.showErrorMessage(ERROR_MESSAGES.ICON_COLOR_FAILED);
      throw error;
    }
  }

  /**
   * Resets color to default value
   * @returns {Promise<void>}
   */
  async resetToDefault() {
    this.logger.startPerformance('reset-icon-color');
    
    try {
      this.currentColorIndex = 2; // Default color index
      const config = vscode.workspace.getConfiguration();
      const customizations = { ...config.get(CONFIG_KEYS.COLOR_CUSTOMIZATIONS, {}) };

      delete customizations[CONFIG_KEYS.ICON_FOREGROUND];

      await config.update(
        CONFIG_KEYS.COLOR_CUSTOMIZATIONS,
        customizations,
        vscode.ConfigurationTarget.Global
      );

      const duration = this.logger.endPerformance('reset-icon-color');
      this.logger.info(`Icon color reset to default in ${duration}ms`);

      vscode.window.showInformationMessage('Icon color reset to default');

    } catch (error) {
      const duration = this.logger.endPerformance('reset-icon-color');
      this.logger.error(`Failed to reset icon color after ${duration}ms`, error);
      
      vscode.window.showErrorMessage('Failed to reset icon color.');
      throw error;
    }
  }

  /**
   * Sets specific color by index
   * @param {number} colorIndex - Index in colors array
   * @returns {Promise<void>}
   */
  async setColorByIndex(colorIndex) {
    if (colorIndex < 0 || colorIndex >= this.colors.length) {
      throw new Error(`Invalid color index: ${colorIndex}`);
    }

    this.currentColorIndex = colorIndex;
    await this.cycleIconColor();
  }

  /**
   * Gets current color
   * @returns {string|null} Current hex color or null for default
   */
  getCurrentColor() {
    return this.colors[this.currentColorIndex];
  }

  /**
   * Gets current color name
   * @returns {string} Current color name
   */
  getCurrentColorName() {
    const colorNames = ['Blue', 'Green', 'Default'];
    return colorNames[this.currentColorIndex] || 'Unknown';
  }

  /**
   * Gets all available colors
   * @returns {Array} Array of color objects with name and value
   */
  getAvailableColors() {
    return this.colors.map((color, index) => ({
      index,
      value: color,
      name: this.getCurrentColorName.call({ currentColorIndex: index }),
      isCurrent: index === this.currentColorIndex,
    }));
  }

  /**
   * Gets color manager statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      currentColor: this.getCurrentColor(),
      currentColorName: this.getCurrentColorName(),
      currentIndex: this.currentColorIndex,
      totalColors: this.colors.length,
      availableColors: this.getAvailableColors(),
    };
  }
}

module.exports = ColorManager;