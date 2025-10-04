const vscode = require('vscode');
const ColorManager = require('./editor-ui/icons/icon-painter');
const MacroManager = require('./editor-ui/icons/macros');
const StatusBarManager = require('./editor-ui/status-bar');
const AICommandsManager = require('./keymaps/ai-keymap-handler');
const ExtensionChecker = require('./notifications/extension-checker');
const SmartWebviewExtension = require('./notifications/smart-checker-webview');

// Global instances
let statusBarManagerInstance;
let aiCommandsManagerInstance;
let extensionCheckerInstance;
let smartWebviewExtensionInstance;

function activate(context) {
  // Initialize managers
  const colorManager = new ColorManager();
  const macroManager = new MacroManager();
  statusBarManagerInstance = new StatusBarManager(context);
  aiCommandsManagerInstance = new AICommandsManager();
  extensionCheckerInstance = new ExtensionChecker();
  smartWebviewExtensionInstance = new SmartWebviewExtension();

  // Register AI commands
  aiCommandsManagerInstance.registerCommands(context);
  // Register extension checker commands
  extensionCheckerInstance.registerCheckCommands(context);
  // Register webview extension commands
  smartWebviewExtensionInstance.registerWebviewCommands(context);

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

  // Command with extension check - F1 QuickSwitch [ctrl+4]
  let checkF1QuickSwitchDisposable = vscode.commands.registerCommand(
    'lynx-keymap.checkF1QuickSwitch',
    () =>
      extensionCheckerInstance.checkAndExecuteCommand(
        'workbench.view.extension.f1-functions',
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

  // Command with webview extension check - Compare Code [shift+alt+\]
  // Note: This command is now registered automatically by smartWebviewExtensionInstance.registerWebviewCommands()

  // Register commands with VSCode
  context.subscriptions.push(
    toggleStatusBarColorDisposable,
    cycleIconColorDisposable,
    colorAndAgentMacroDisposable,
    checkF1QuickSwitchDisposable,
    checkGitLensDisposable
    // checkCompareCodeDisposable is now registered automatically by smartWebviewExtensionInstance
  );
}

async function deactivate() {
  if (statusBarManagerInstance) {
    await statusBarManagerInstance.deactivateColorMode();
  }
  if (aiCommandsManagerInstance) {
    aiCommandsManagerInstance.dispose();
  }
  if (smartWebviewExtensionInstance) {
    smartWebviewExtensionInstance.dispose();
  }
}

module.exports = {
  activate,
  deactivate,
};