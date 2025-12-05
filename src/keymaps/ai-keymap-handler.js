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
   * @param {Array} commands - Array of command strings to try
   * @param {string} errorMessage - Message to show if no commands work
   */
  async executeFirstAvailableCommand(commands, errorMessage) {
    // Validate parameters
    if (!Array.isArray(commands) || commands.length === 0) {
      console.error('Invalid commands array provided:', commands);
      vscode.window.showWarningMessage(errorMessage || 'No commands available');
      return;
    }

    if (!errorMessage || typeof errorMessage !== 'string') {
      errorMessage = 'Command execution failed';
    }

    // Get available commands with caching
    const allCommands = await this.getAvailableCommands();

    // 1. Prioritize Antigravity commands
    // Find any command that starts with 'antigravity.' in the input list
    const antigravityCmd = commands.find(cmd => cmd.startsWith('antigravity.'));
    
    if (antigravityCmd && allCommands.includes(antigravityCmd)) {
      try {
        await vscode.commands.executeCommand(antigravityCmd);
        console.log(`Successfully executed prioritized command: ${antigravityCmd}`);
        return;
      } catch (error) {
        console.error(`Failed to execute prioritized command ${antigravityCmd}:`, error);
        // If it fails, fall through to the normal loop
      }
    }

    // 2. Try each command until one succeeds
    for (const cmd of commands) {
      // Skip if we already tried this antigravity command and it failed
      if (cmd === antigravityCmd) continue;

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
   * @returns {Promise<Array>} Array of available command strings
   */
  async getAvailableCommands() {
    const now = Date.now();
    if (
      this.availableCommandsCache &&
      now - this.cacheTimestamp < this.cacheExpiry
    ) {
      return this.availableCommandsCache;
    }

    try {
      this.availableCommandsCache = await vscode.commands.getCommands(true);
      this.cacheTimestamp = now;
      return this.availableCommandsCache;
    } catch (error) {
      console.error('Failed to get available commands:', error);
      // Return cached commands if available, otherwise empty array
      return this.availableCommandsCache || [];
    }
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