const vscode = require('vscode');

class ColorManager {
  constructor() {
    this.colors = [
      { value: '#008dfa', name: 'Blue' },
      { value: '#07cc4cff', name: 'Green' },
      { value: null, name: 'Default' },
    ];
    this.currentColorIndex = this.colors.length - 1; // Start with default color
    this.configKey = 'workbench.colorCustomizations';
    this.iconKey = 'icon.foreground';
  }

  /**
   * Cycles through available colors
   * @returns {Promise<boolean>} Success status
   */
  async cycleIconColor() {
    try {
      this.currentColorIndex =
        (this.currentColorIndex + 1) % this.colors.length;
      return await this._updateIconColor(this.getCurrentColor().value);
    } catch (error) {
      return this._handleError('Error cycling icon color', error);
    }
  }

  /**
   * Resets color to default value
   * @returns {Promise<boolean>} Success status
   */
  async resetToDefault() {
    try {
      this.currentColorIndex = this.colors.length - 1; // Default is last
      const config = vscode.workspace.getConfiguration();
      const customizations = { ...config.get(this.configKey, {}) };

      delete customizations[this.iconKey];

      await config.update(
        this.configKey,
        customizations,
        vscode.ConfigurationTarget.Global
      );

      return true;
    } catch (error) {
      return this._handleError('Error resetting icon color', error);
    }
  }

  /**
   * Sets a specific color by name
   * @param {string} colorName - Name of the color to set
   * @returns {Promise<boolean>} Success status
   */
  async setColorByName(colorName) {
    const colorIndex = this.colors.findIndex(
      (color) => color.name.toLowerCase() === colorName.toLowerCase()
    );

    if (colorIndex === -1) {
      return false;
    }

    this.currentColorIndex = colorIndex;
    return await this._updateIconColor(this.getCurrentColor().value);
  }

  /**
   * Gets current color object
   * @returns {Object} Current color object with value and name
   */
  getCurrentColor() {
    return this.colors[this.currentColorIndex];
  }

  /**
   * Gets current color name
   * @returns {string} Current color name
   */
  getCurrentColorName() {
    return this.getCurrentColor().name;
  }

  /**
   * Gets all available colors
   * @returns {Array} Array of color objects
   */
  getAvailableColors() {
    return [...this.colors];
  }

  /**
   * Private method to update icon color in VS Code settings
   * @param {string|null} colorValue - Hex color value or null for default
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async _updateIconColor(colorValue) {
    try {
      const config = vscode.workspace.getConfiguration();
      const customizations = { ...config.get(this.configKey, {}) };

      if (colorValue === null) {
        delete customizations[this.iconKey];
      } else {
        customizations[this.iconKey] = colorValue;
      }

      await config.update(
        this.configKey,
        customizations,
        vscode.ConfigurationTarget.Global
      );

      return true;
    } catch (error) {
      console.error('Error updating icon color:', error);
      return false;
    }
  }

  /**
   * Private method to handle errors consistently
   * @param {string} message - Error message
   * @param {Error} error - Error object
   * @returns {boolean} Always returns false
   * @private
   */
  _handleError(message, error) {
    console.error(message, error);
    return false;
  }
}

module.exports = ColorManager;
