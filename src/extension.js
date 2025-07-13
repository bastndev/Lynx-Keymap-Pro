const vscode = require('vscode');
const { getManagerFactory } = require('./core/manager-factory');
const { getLogger } = require('./core/logger');
const { getCommandCache } = require('./core/command-cache');
const { EXTENSION_DISPLAY_NAME } = require('./core/config');

// Global instances for cleanup
let managerFactory;
let logger;
let commandCache;

async function activate(context) {
  // Initialize core systems
  logger = getLogger();
  commandCache = getCommandCache();
  managerFactory = getManagerFactory();
  
  logger.info(`${EXTENSION_DISPLAY_NAME} is now activating...`);
  logger.startPerformance('extension-activation');

  try {
    // Initialize factory with context
    managerFactory.initialize(context);
    
    // Preload critical managers for better performance
    await managerFactory.preloadCriticalManagers();
    
    // Initialize command cache
    await commandCache.getAvailableCommands();
    
    // Register AI commands (lazy loaded)
    const aiManager = managerFactory.getManager('ai-commands');
    if (aiManager) {
      aiManager.registerCommands(context);
    }

    // [alt+escape] - VSCode editor behavior modifications
    // ======================================================
    let toggleSuggestDisposable = vscode.commands.registerCommand(
      'lynx-keymap.toggleInlineSuggest',
      createCommandWrapper(async () => {
        const config = vscode.workspace.getConfiguration();
        const currentValue = config.get('editor.inlineSuggest.enabled', true);
        const newValue = !currentValue;

        await config.update(
          'editor.inlineSuggest.enabled',
          newValue,
          vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage(
          `Inline Suggestions ${newValue ? 'Enabled' : 'Disabled'}.`
        );
      }, 'toggleInlineSuggest')
    );

    // [ctrl+shift+alt+11] - Color and appearance management
    // =========================================================
    let cycleIconColorDisposable = vscode.commands.registerCommand(
      'lynx-keymap.cycleIconColor',
      createCommandWrapper(async () => {
        const colorManager = managerFactory.getManager('icon-colors');
        await colorManager.cycleIconColor();
      }, 'cycleIconColor')
    );

    // Command to toggle green mode [alt+insert]
    let toggleGreenModeDisposable = vscode.commands.registerCommand(
      'lynx-keymap.toggleGreenMode',
      createCommandWrapper(async () => {
        const peacockManager = managerFactory.getManager('peacock');
        await peacockManager.toggleGreenMode();
      }, 'toggleGreenMode')
    );

    // [alt+z] - Complex multi-action commands
    // ==============================================
    let colorAndAgentMacroDisposable = vscode.commands.registerCommand(
      'lynx-keymap.executeColorAndAgentMacro',
      createCommandWrapper(async () => {
        const macroManager = managerFactory.getManager('macros');
        await macroManager.executeColorAndAgentMacro();
      }, 'executeColorAndAgentMacro')
    );

    // SUBSCRIPTION MANAGEMENT - Register all commands with VSCode
    // ===========================================================
    context.subscriptions.push(
      toggleSuggestDisposable,
      cycleIconColorDisposable,
      colorAndAgentMacroDisposable,
      toggleGreenModeDisposable
    );

    const duration = logger.endPerformance('extension-activation');
    logger.info(`${EXTENSION_DISPLAY_NAME} activated successfully in ${duration}ms`);

  } catch (error) {
    const duration = logger.endPerformance('extension-activation');
    logger.error(`Failed to activate ${EXTENSION_DISPLAY_NAME} after ${duration}ms`, error);
    throw error;
  }
}

/**
 * Creates a wrapper for command functions to add error handling and logging
 */
function createCommandWrapper(commandFunction, commandName) {
  return async (...args) => {
    logger.startPerformance(`command-${commandName}`);
    
    try {
      await commandFunction(...args);
      const duration = logger.endPerformance(`command-${commandName}`);
      logger.logCommand(commandName, true, duration);
      
    } catch (error) {
      const duration = logger.endPerformance(`command-${commandName}`);
      logger.logCommand(commandName, false, duration);
      logger.error(`Command '${commandName}' failed`, error);
      
      vscode.window.showErrorMessage(
        `Command failed: ${error.message || 'Unknown error'}`
      );
    }
  };
}

// EXTENSION LIFECYCLE
// ===================
async function deactivate() {
  logger.info(`${EXTENSION_DISPLAY_NAME} is deactivating...`);
  logger.startPerformance('extension-deactivation');

  try {
    // Deactivate peacock manager if loaded
    if (managerFactory && managerFactory.isManagerLoaded('peacock')) {
      const peacockManager = managerFactory.getManager('peacock');
      if (peacockManager && typeof peacockManager.deactivateGreenMode === 'function') {
        logger.info('Deactivating Lynx Green Mode on exit...');
        await peacockManager.deactivateGreenMode();
      }
    }
    
    // Dispose all managers
    if (managerFactory) {
      managerFactory.dispose();
    }

    // Dispose core systems
    if (commandCache) {
      commandCache.dispose();
    }

    if (logger) {
      const duration = logger.endPerformance('extension-deactivation');
      logger.info(`${EXTENSION_DISPLAY_NAME} deactivated successfully in ${duration}ms`);
      logger.dispose();
    }

  } catch (error) {
    console.error(`Error during ${EXTENSION_DISPLAY_NAME} deactivation:`, error);
  }
}

module.exports = {
  activate,
  deactivate,
};