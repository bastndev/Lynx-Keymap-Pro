const vscode = require('vscode');
const ColorManager = require('./editor-ui/icons/icon-painter');
const MacroManager = require('./editor-ui/icons/macros');
const StatusBarManager = require('./editor-ui/status-bar');
const AICommandsManager = require('./keymaps/ai-keymap-handler');
const ExtensionChecker = require('./notifications/extension-checker');

// Global instances
let statusBarManagerInstance;
let aiCommandsManagerInstance;
let extensionCheckerInstance;

function activate(context) {
  // Initialize managers
  const colorManager = new ColorManager();
  const macroManager = new MacroManager();
  statusBarManagerInstance = new StatusBarManager(context);
  aiCommandsManagerInstance = new AICommandsManager();
  extensionCheckerInstance = new ExtensionChecker();

  // Register AI commands
  aiCommandsManagerInstance.registerCommands(context);
  // Register extension checker commands
  extensionCheckerInstance.registerCheckCommands(context);

  // Status bar - [ctrl+alt+pagedown]
  let toggleStatusBarColorDisposable = vscode.commands.registerCommand(
    'lynx-keymap.toggleStatusBarColor',
    () => statusBarManagerInstance.toggleStatusBarColor()
  );

  // Icon painter [Alt+z]
  let cycleIconColorDisposable = vscode.commands.registerCommand(
    'lynx-keymap.cycleIconColor',
    () => colorManager.cycleIconColor()
  );

  // Icon painter (Macros)
  let colorAndAgentMacroDisposable = vscode.commands.registerCommand(
    'lynx-keymap.executeColorAndAgentMacro',
    () => macroManager.executeColorAndAgentMacro()
  );

  // Command with extension check - F1 Toggles [ctrl+4]
  let checkF1TogglesDisposable = vscode.commands.registerCommand(
    'lynx-keymap.checkF1Toggles',
    () =>
      extensionCheckerInstance.checkAndExecuteCommand(
        'f1-toggles.focus',
        context
      )
  );

  // Command with extension check - GitLens Graph [alt+e]
  let checkGitLensDisposable = vscode.commands.registerCommand(
    'lynx-keymap.checkGitLens',
    () =>
      extensionCheckerInstance.checkAndExecuteCommand(
        'gitlens.showGraph',
        context
      )
  );

  // Register commands with VSCode
  context.subscriptions.push(
    toggleStatusBarColorDisposable,
    cycleIconColorDisposable,
    colorAndAgentMacroDisposable,
    checkF1TogglesDisposable,
    checkGitLensDisposable
  );
}

async function deactivate() {
  if (statusBarManagerInstance) {
    await statusBarManagerInstance.deactivateColorMode();
  }
  if (aiCommandsManagerInstance) {
    aiCommandsManagerInstance.dispose();
  }
}

module.exports = {
  activate,
  deactivate,
};
