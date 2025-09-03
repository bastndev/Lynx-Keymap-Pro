const vscode = require('vscode');
const { AI_COMMANDS_CONFIG, KEYMAP_CONFIG } = require('./ai-keymap-config');

/**
 * Manages AI command registration and execution
 */
class AICommandsManager {
  constructor() {
    this.disposables = [];
    this.availableCommandsCache = null;
    this.cacheTimestamp = 0;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Registers AI commands from config
   */
  registerCommands(context) {
    // Create command registrations from KEYMAP_CONFIG
    const disposables = KEYMAP_CONFIG.map((config) => {
      return vscode.commands.registerCommand(config.commandId, async () => {
        const commands = AI_COMMANDS_CONFIG[config.commandsKey];
        await this.executeFirstAvailableCommand(commands, config.errorMessage);
      });
    });

    // Store for cleanup
    this.disposables = disposables;

    // Register with context
    context.subscriptions.push(...this.disposables);

    return this.disposables;
  }

  /**
   * Executes first available command from list
   */
  async executeFirstAvailableCommand(commands, errorMessage) {
    // Get available commands with caching
    const allCommands = await this.getAvailableCommands();

    // Try each command until one succeeds
    for (const cmd of commands) {
      if (allCommands.includes(cmd)) {
        try {
          await vscode.commands.executeCommand(cmd);
          console.log(`Successfully executed command: ${cmd}`);
          return;
        } catch (error) {
          console.error(`Failed to execute command ${cmd}:`, error);
        }
      } else {
        console.log(`Command not available: ${cmd}`);
      }
    }

    // Show warning if no commands worked
    vscode.window.showWarningMessage(errorMessage);
  }

  /**
   * Gets available commands with caching
   */
  async getAvailableCommands() {
    const now = Date.now();
    if (this.availableCommandsCache && (now - this.cacheTimestamp) < this.cacheExpiry) {
      return this.availableCommandsCache;
    }

    this.availableCommandsCache = await vscode.commands.getCommands(true);
    this.cacheTimestamp = now;
    return this.availableCommandsCache;
  }

  /**
   * Cleans up disposables
   */
  dispose() {
    this.disposables.forEach((disposable) => {
      if (disposable && typeof disposable.dispose === 'function') {
        disposable.dispose();
      }
    });
    this.disposables = [];
  }
}

module.exports = AICommandsManager;