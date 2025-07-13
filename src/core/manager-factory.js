/**
 * Manager Factory for Lynx Keymap Extension
 * Implements lazy loading and caching for better performance
 */

const { getLogger } = require('./logger');

class ManagerFactory {
  constructor() {
    this.managers = new Map();
    this.context = null;
    this.logger = getLogger();
  }

  /**
   * Initialize factory with VSCode context
   */
  initialize(context) {
    this.context = context;
    this.logger.info('ManagerFactory initialized');
  }

  /**
   * Get or create a manager instance (lazy loading)
   */
  getManager(managerType) {
    if (!this.context) {
      throw new Error('ManagerFactory not initialized. Call initialize() first.');
    }

    // Return cached instance if exists
    if (this.managers.has(managerType)) {
      this.logger.debug(`Retrieved cached manager: ${managerType}`);
      return this.managers.get(managerType);
    }

    // Create new instance
    const manager = this._createManager(managerType);
    if (manager) {
      this.managers.set(managerType, manager);
      this.logger.info(`Created new manager: ${managerType}`);
    }

    return manager;
  }

  /**
   * Create manager instance based on type
   */
  _createManager(managerType) {
    try {
      switch (managerType) {
        case 'ai-commands':
          const AICommandsManager = require('../managers/ai-commands');
          return new AICommandsManager();

        case 'icon-colors':
          const ColorManager = require('../managers/icon-colors');
          return new ColorManager();

        case 'macros':
          const MacroManager = require('../managers/macros');
          return new MacroManager();

        case 'peacock':
          const PeacockManager = require('../managers/peacock');
          return new PeacockManager(this.context);

        default:
          this.logger.error(`Unknown manager type: ${managerType}`);
          return null;
      }
    } catch (error) {
      this.logger.error(`Failed to create manager: ${managerType}`, error);
      return null;
    }
  }

  /**
   * Preload critical managers for better performance
   */
  async preloadCriticalManagers() {
    const criticalManagers = ['icon-colors', 'macros'];
    
    this.logger.startPerformance('preload-managers');
    
    for (const managerType of criticalManagers) {
      try {
        this.getManager(managerType);
      } catch (error) {
        this.logger.error(`Failed to preload manager: ${managerType}`, error);
      }
    }
    
    const duration = this.logger.endPerformance('preload-managers');
    this.logger.info(`Preloaded ${criticalManagers.length} managers in ${duration}ms`);
  }

  /**
   * Get all loaded managers
   */
  getLoadedManagers() {
    return Array.from(this.managers.keys());
  }

  /**
   * Check if manager is loaded
   */
  isManagerLoaded(managerType) {
    return this.managers.has(managerType);
  }

  /**
   * Dispose all managers and clear cache
   */
  dispose() {
    this.logger.info('Disposing all managers');
    
    for (const [managerType, manager] of this.managers) {
      try {
        if (manager && typeof manager.dispose === 'function') {
          manager.dispose();
          this.logger.debug(`Disposed manager: ${managerType}`);
        }
      } catch (error) {
        this.logger.error(`Error disposing manager: ${managerType}`, error);
      }
    }

    this.managers.clear();
    this.context = null;
    this.logger.info('All managers disposed');
  }

  /**
   * Get memory usage statistics
   */
  getStats() {
    return {
      loadedManagersCount: this.managers.size,
      loadedManagers: this.getLoadedManagers(),
      memoryUsage: process.memoryUsage(),
    };
  }
}

// Singleton instance
let factoryInstance = null;

/**
 * Get factory instance (singleton)
 */
function getManagerFactory() {
  if (!factoryInstance) {
    factoryInstance = new ManagerFactory();
  }
  return factoryInstance;
}

module.exports = {
  ManagerFactory,
  getManagerFactory,
};