/**
 * Command Cache for AI Commands
 * Optimizes command execution by caching available commands and reducing VSCode API calls
 */

const vscode = require('vscode');
const { getLogger } = require('./logger');
const { PERFORMANCE } = require('./config');

class CommandCache {
  constructor() {
    this.cache = new Map();
    this.lastRefresh = 0;
    this.logger = getLogger();
  }

  /**
   * Get available commands from cache or refresh if needed
   */
  async getAvailableCommands() {
    const now = Date.now();
    const cacheAge = now - this.lastRefresh;

    if (cacheAge > PERFORMANCE.COMMAND_CACHE_TTL || this.cache.size === 0) {
      await this.refreshCache();
    }

    return this.cache;
  }

  /**
   * Refresh command cache
   */
  async refreshCache() {
    this.logger.startPerformance('refresh-command-cache');
    
    try {
      const allCommands = await vscode.commands.getCommands(true);
      
      // Clear old cache
      this.cache.clear();
      
      // Populate cache with Set for O(1) lookup
      const commandSet = new Set(allCommands);
      this.cache.set('commands', commandSet);
      
      this.lastRefresh = Date.now();
      
      const duration = this.logger.endPerformance('refresh-command-cache');
      this.logger.debug(`Command cache refreshed with ${allCommands.length} commands in ${duration}ms`);
      
    } catch (error) {
      this.logger.error('Failed to refresh command cache', error);
      throw error;
    }
  }

  /**
   * Check if a command is available (optimized lookup)
   */
  async isCommandAvailable(commandName) {
    const commands = await this.getAvailableCommands();
    const commandSet = commands.get('commands');
    return commandSet ? commandSet.has(commandName) : false;
  }

  /**
   * Find first available command from a list
   */
  async findFirstAvailableCommand(commandList) {
    if (!Array.isArray(commandList) || commandList.length === 0) {
      return null;
    }

    const commands = await this.getAvailableCommands();
    const commandSet = commands.get('commands');
    
    if (!commandSet) {
      return null;
    }

    for (const command of commandList) {
      if (commandSet.has(command)) {
        this.logger.debug(`Found available command: ${command}`);
        return command;
      }
    }

    this.logger.debug(`No available commands found from list: ${commandList.join(', ')}`);
    return null;
  }

  /**
   * Execute command with retry logic and performance tracking
   */
  async executeCommand(commandName, retryCount = 0) {
    if (!commandName) {
      throw new Error('Command name is required');
    }

    this.logger.startPerformance(`execute-${commandName}`);
    
    try {
      await vscode.commands.executeCommand(commandName);
      
      const duration = this.logger.endPerformance(`execute-${commandName}`);
      this.logger.logCommand(commandName, true, duration);
      
      return true;
      
    } catch (error) {
      const duration = this.logger.endPerformance(`execute-${commandName}`);
      this.logger.logCommand(commandName, false, duration);
      
      // Retry logic
      if (retryCount < PERFORMANCE.MAX_RETRY_ATTEMPTS) {
        this.logger.warn(`Retrying command: ${commandName} (attempt ${retryCount + 1})`);
        await this.delay(100 * (retryCount + 1)); // Exponential backoff
        return this.executeCommand(commandName, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Execute first available command from list with fallback
   */
  async executeFirstAvailableCommand(commandList, errorMessage = 'No commands available') {
    try {
      const availableCommand = await this.findFirstAvailableCommand(commandList);
      
      if (!availableCommand) {
        vscode.window.showWarningMessage(errorMessage);
        return false;
      }

      await this.executeCommand(availableCommand);
      return true;
      
    } catch (error) {
      this.logger.error(`Failed to execute command from list: ${commandList.join(', ')}`, error);
      vscode.window.showErrorMessage(`Command execution failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const commands = this.cache.get('commands');
    return {
      cachedCommands: commands ? commands.size : 0,
      lastRefresh: new Date(this.lastRefresh).toISOString(),
      cacheAge: Date.now() - this.lastRefresh,
      cacheValid: (Date.now() - this.lastRefresh) < PERFORMANCE.COMMAND_CACHE_TTL,
    };
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear cache and force refresh on next access
   */
  invalidateCache() {
    this.cache.clear();
    this.lastRefresh = 0;
    this.logger.info('Command cache invalidated');
  }

  /**
   * Dispose cache resources
   */
  dispose() {
    this.cache.clear();
    this.lastRefresh = 0;
    this.logger.info('Command cache disposed');
  }
}

// Singleton instance
let cacheInstance = null;

/**
 * Get command cache instance (singleton)
 */
function getCommandCache() {
  if (!cacheInstance) {
    cacheInstance = new CommandCache();
  }
  return cacheInstance;
}

module.exports = {
  CommandCache,
  getCommandCache,
};