const vscode = require('vscode');
const { getCommandCache } = require('../core/command-cache');
const { getLogger } = require('../core/logger');
const { AI_COMMANDS, ERROR_MESSAGES } = require('../core/config');

class AICommandsManager {
  constructor() {
    this.disposables = [];
    this.commandCache = getCommandCache();
    this.logger = getLogger();
  }

  // Register all AI-related commands
  registerCommands(context) {
    this.logger.info('Registering AI commands');
    
    // Command for AI commit generation [alt+2]
    let commitDisposable = vscode.commands.registerCommand(
      'lynx-keymap.generateAICommit',
      () => this.commandCache.executeFirstAvailableCommand(
        AI_COMMANDS.COMMIT,
        ERROR_MESSAGES.NO_AI_COMMIT
      )
    );

    // Command for AI Popup [ctrl+`]
    let popupDisposable = vscode.commands.registerCommand(
      'lynx-keymap.executeAIPopup',
      () => this.commandCache.executeFirstAvailableCommand(
        AI_COMMANDS.POPUP,
        ERROR_MESSAGES.NO_AI_CHAT
      )
    );

    // Command to open AI chat [ctrl+tab]
    let chatDisposable = vscode.commands.registerCommand(
      'lynx-keymap.openAIChat',
      () => this.commandCache.executeFirstAvailableCommand(
        AI_COMMANDS.CHAT,
        ERROR_MESSAGES.NO_AI_CHAT
      )
    );

    // Command to create a new AI session [alt+a]
    let newSessionDisposable = vscode.commands.registerCommand(
      'lynx-keymap.createNewAISession',
      () => this.commandCache.executeFirstAvailableCommand(
        AI_COMMANDS.NEW_SESSION,
        ERROR_MESSAGES.NO_AI_SESSION
      )
    );

    // Command to show AI history [alt+s]
    let historyDisposable = vscode.commands.registerCommand(
      'lynx-keymap.showAIHistory',
      () => this.commandCache.executeFirstAvailableCommand(
        AI_COMMANDS.HISTORY,
        ERROR_MESSAGES.NO_AI_HISTORY
      )
    );

    // Command for AI attach context [alt+d]
    let attachContextDisposable = vscode.commands.registerCommand(
      'lynx-keymap.attachAIContext',
      () => this.commandCache.executeFirstAvailableCommand(
        AI_COMMANDS.ATTACH_CONTEXT,
        ERROR_MESSAGES.NO_AI_CONTEXT
      )
    );

    // Store all disposables
    this.disposables = [
      commitDisposable,
      popupDisposable,
      chatDisposable,
      newSessionDisposable,
      historyDisposable,
      attachContextDisposable,
    ];

    // Add to context subscriptions
    context.subscriptions.push(...this.disposables);

    this.logger.info(`Registered ${this.disposables.length} AI commands`);
    return this.disposables;
  }

  /**
   * Get available AI platforms based on installed commands
   */
  async getAvailableAIPlatforms() {
    const platforms = {
      windsurf: false,
      vscode: false,
      cursor: false,
      trae: false,
      firebase: false,
    };

    // Check for specific commands to determine platform availability
    const platformChecks = [
      { platform: 'windsurf', command: 'windsurf.generateCommitMessage' },
      { platform: 'vscode', command: 'github.copilot.git.generateCommitMessage' },
      { platform: 'cursor', command: 'cursor.generateGitCommitMessage' },
      { platform: 'trae', command: 'icube.gitGenerateCommitMessage' },
      { platform: 'firebase', command: 'workbench.action.terminal.chat.start' },
    ];

    for (const check of platformChecks) {
      platforms[check.platform] = await this.commandCache.isCommandAvailable(check.command);
    }

    return platforms;
  }

  /**
   * Get command cache statistics
   */
  getCacheStats() {
    return this.commandCache.getCacheStats();
  }

  // Cleanup method
  dispose() {
    this.logger.info('Disposing AI commands manager');
    
    this.disposables.forEach((disposable) => {
      if (disposable && typeof disposable.dispose === 'function') {
        disposable.dispose();
      }
    });
    
    this.disposables = [];
    this.logger.info('AI commands manager disposed');
  }
}

module.exports = AICommandsManager;