const vscode = require('vscode');

class ColorManager {
  static CONFIG = {
    WORKBENCH_KEY: 'workbench.colorCustomizations',
    ICON_KEY: 'icon.foreground',
    TARGET: vscode.ConfigurationTarget.Global
  };

  static COLORS = [
    { value: '#008dfa', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: null, name: 'Default' }
  ];

  constructor() {
    this.colors = [...ColorManager.COLORS];
    this.currentColorIndex = this.colors.length - 1; // Default fallback
    this._syncWithCurrentState();
  }

  /**
   * Synchronizes the manager with the current VS Code color state
   * @private
   */
  _syncWithCurrentState() {
    try {
      const config = vscode.workspace.getConfiguration();
      const customizations = config.get(ColorManager.CONFIG.WORKBENCH_KEY, {});
      const currentIconColor = customizations[ColorManager.CONFIG.ICON_KEY];

      // Find the index of the current color
      const foundIndex = this.colors.findIndex(color => color.value === currentIconColor);
      
      if (foundIndex !== -1) {
        this.currentColorIndex = foundIndex;
      } else {
        // If current color is not in predefined colors, assume default
        this.currentColorIndex = this.colors.length - 1;
      }
    } catch (error) {
      console.error('Error syncing color state:', error);
      // Fallback to default
      this.currentColorIndex = this.colors.length - 1;
    }
  }

  /**
   * Manually refresh/sync the current state (useful after external changes)
   */
  async refreshState() {
    this._syncWithCurrentState();
    return this.getStatus();
  }

  /**
   * Cycles through available colors
   */
  async cycleIconColor() {
    try {
      // Always sync before cycling to ensure we're starting from the correct state
      this._syncWithCurrentState();
      
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      const currentColor = this.getCurrentColor();
      
      await this._updateIconColor(currentColor.value);
      
      return { 
        success: true, 
        color: currentColor 
      };
    } catch (error) {
      return this._createErrorResult('Error cycling icon color', error);
    }
  }

  /**
   * Resets color to default value
   */
  async resetToDefault() {
    try {
      this.currentColorIndex = this.colors.length - 1;
      
      const config = vscode.workspace.getConfiguration();
      const customizations = { ...config.get(ColorManager.CONFIG.WORKBENCH_KEY, {}) };
      
      delete customizations[ColorManager.CONFIG.ICON_KEY];
      
      await config.update(
        ColorManager.CONFIG.WORKBENCH_KEY,
        Object.keys(customizations).length ? customizations : undefined,
        ColorManager.CONFIG.TARGET
      );

      return { success: true };
    } catch (error) {
      return this._createErrorResult('Error resetting icon color', error);
    }
  }

  /**
   * Sets a specific color by name
   */
  async setColorByName(colorName) {
    if (!colorName || typeof colorName !== 'string') {
      return { success: false, error: 'Invalid color name provided' };
    }

    const colorIndex = this.colors.findIndex(
      color => color.name.toLowerCase() === colorName.toLowerCase().trim()
    );

    if (colorIndex === -1) {
      return { 
        success: false, 
        error: `Color '${colorName}' not found. Available colors: ${this.getAvailableColorNames().join(', ')}` 
      };
    }

    try {
      this.currentColorIndex = colorIndex;
      const currentColor = this.getCurrentColor();
      
      await this._updateIconColor(currentColor.value);
      
      return { 
        success: true, 
        color: currentColor 
      };
    } catch (error) {
      return this._createErrorResult('Error setting color by name', error);
    }
  }

  /**
   * Sets a custom color
   */
  async setCustomColor(hexColor, name = 'Custom') {
    if (!this._isValidHexColor(hexColor)) {
      return { success: false, error: 'Invalid hex color format' };
    }

    try {
      await this._updateIconColor(hexColor);
      
      const customColor = { value: hexColor, name };
      return { success: true, color: customColor };
    } catch (error) {
      return this._createErrorResult('Error setting custom color', error);
    }
  }

  /**
   * Gets current color object
   */
  getCurrentColor() {
    return { ...this.colors[this.currentColorIndex] };
  }

  /**
   * Gets current color name
   */
  getCurrentColorName() {
    return this.getCurrentColor().name;
  }

  /**
   * Gets all available colors
   */
  getAvailableColors() {
    return this.colors.map(color => ({ ...color }));
  }

  /**
   * Gets all available color names
   */
  getAvailableColorNames() {
    return this.colors.map(color => color.name);
  }

  /**
   * Checks if a color exists by name
   */
  hasColor(colorName) {
    return this.colors.some(
      color => color.name.toLowerCase() === colorName.toLowerCase().trim()
    );
  }

  /**
   * Gets current manager status information
   */
  getStatus() {
    const currentColor = this.getCurrentColor();
    return {
      currentColor: currentColor.name,
      currentValue: currentColor.value,
      totalColors: this.colors.length,
      availableColors: this.getAvailableColorNames(),
      currentIndex: this.currentColorIndex
    };
  }

  /**
   * Gets the actual color from VS Code settings (for debugging/verification)
   */
  getActualVSCodeColor() {
    try {
      const config = vscode.workspace.getConfiguration();
      const customizations = config.get(ColorManager.CONFIG.WORKBENCH_KEY, {});
      return customizations[ColorManager.CONFIG.ICON_KEY] || null;
    } catch (error) {
      console.error('Error getting actual VS Code color:', error);
      return null;
    }
  }

  /**
   * Updates icon color in VS Code settings
   * @private
   */
  async _updateIconColor(colorValue) {
    const config = vscode.workspace.getConfiguration();
    const customizations = { ...config.get(ColorManager.CONFIG.WORKBENCH_KEY, {}) };

    if (colorValue === null) {
      delete customizations[ColorManager.CONFIG.ICON_KEY];
    } else {
      customizations[ColorManager.CONFIG.ICON_KEY] = colorValue;
    }

    await config.update(
      ColorManager.CONFIG.WORKBENCH_KEY,
      Object.keys(customizations).length ? customizations : undefined,
      ColorManager.CONFIG.TARGET
    );
  }

  /**
   * Creates consistent error results
   * @private
   */
  _createErrorResult(message, error) {
    const errorMessage = `${message}: ${error.message}`;
    console.error(errorMessage, error);
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }

  /**
   * Validates hexadecimal color format
   * @private
   */
  _isValidHexColor(color) {
    return typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }
}

module.exports = ColorManager;
