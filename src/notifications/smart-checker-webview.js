const vscode = require('vscode');

/**
 * Smart Webview Extension Handler
 * Manages webview-based extensions with keybinding conflict resolution
 */
class SmartWebviewExtension {
  constructor() {
    this.webviewExtensions = {
      'compare-code.openWebview': {
        extensionId: 'bastndev.compare-code',
        displayName: 'Compare Code',
        marketplaceSearch: 'bastndev.compare-code',
        originalKeybinding: 'shift+alt+\\',
        webviewCommand: 'compare-code.compareFiles', // Real command from the images
        originalCommand: 'Compare Code', // Original command name
      },
    };

    this.activeTimeouts = new Set();
    this.installationInProgress = new Set();
    this.webviewInstances = new Map(); // Track active webviews to prevent duplicates
  }

  /**
   * Checks extension and handles webview opening with conflict resolution
   */
  async checkAndOpenWebview(commandId, context) {
    const dependency = this.webviewExtensions[commandId];
    if (!dependency) {
      console.error(`Unknown webview command: ${commandId}`);
      return;
    }

    const extension = vscode.extensions.getExtension(dependency.extensionId);

    if (!extension) {
      this.showWebviewExtensionRequiredNotification(dependency, commandId);
      return;
    }

    try {
      // Ensure extension is activated
      if (!extension.isActive) {
        await extension.activate();
        // Wait a bit for activation to complete
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Check if webview is already open to prevent duplicates
      if (this.isWebviewAlreadyOpen(dependency.extensionId)) {
        console.log(`Webview for ${dependency.displayName} is already open`);
        return;
      }

      // Execute the webview command
      await this.executeWebviewCommand(dependency, commandId);
    } catch (error) {
      console.error(`Error executing webview command:`, error);
      this.showWebviewActivationError(dependency, commandId, error);
    }
  }

  /**
   * Executes webview command with duplicate prevention
   */
  async executeWebviewCommand(dependency, commandId) {
    try {
      // Mark webview as opening
      this.webviewInstances.set(dependency.extensionId, Date.now());

      await vscode.commands.executeCommand(dependency.webviewCommand);
      console.log(`Successfully opened webview: ${dependency.displayName}`);

      // Clean up tracking after a delay
      this.createTimeout(() => {
        this.webviewInstances.delete(dependency.extensionId);
      }, 2000);
    } catch (error) {
      this.webviewInstances.delete(dependency.extensionId);
      throw error;
    }
  }

  /**
   * Checks if webview is already open (basic duplicate prevention)
   */
  isWebviewAlreadyOpen(extensionId) {
    const lastOpened = this.webviewInstances.get(extensionId);
    if (!lastOpened) return false;

    // Consider webview "open" if opened within last 2 seconds
    const timeDiff = Date.now() - lastOpened;
    return timeDiff < 2000;
  }

  /**
   * Shows notification for missing webview extension
   */
  showWebviewExtensionRequiredNotification(dependency, commandId) {
    const message = `🔍 The extension "${dependency.displayName}" is required to open this webview`;

    vscode.window
      .showInformationMessage(message, 'Install Extension', 'Cancel')
      .then((selection) => {
        if (selection === 'Install Extension') {
          this.installWebviewExtension(dependency, commandId);
        }
      });
  }

  /**
   * Installs webview extension with enhanced feedback
   */
  async installWebviewExtension(dependency, commandId) {
    // Prevent multiple installations
    if (this.installationInProgress.has(dependency.extensionId)) {
      return;
    }

    this.installationInProgress.add(dependency.extensionId);

    try {
      // Show downloading message
      vscode.window.showInformationMessage(
        `📥 Downloading ${dependency.displayName}...`
      );

      // Simulate download time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Install extension
      await vscode.commands.executeCommand(
        'workbench.extensions.installExtension',
        dependency.extensionId
      );

      // Wait for extension to be available
      let attempts = 0;
      const maxAttempts = 15; // More attempts for webview extensions

      while (attempts < maxAttempts) {
        const extension = vscode.extensions.getExtension(
          dependency.extensionId
        );
        if (extension) break;

        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      // Show success message
      vscode.window.showInformationMessage(
        `✅ ${dependency.displayName} installed successfully! Opening webview...`
      );

      // Execute the webview command after installation
      this.createTimeout(() => {
        this.checkAndOpenWebview(commandId);
      }, 1500);
    } catch (error) {
      const selection = await vscode.window.showErrorMessage(
        `❌ Failed to install ${dependency.displayName}: ${error.message}`,
        'Open Marketplace',
        'Retry'
      );

      if (selection === 'Open Marketplace') {
        vscode.commands.executeCommand(
          'workbench.extensions.search',
          dependency.marketplaceSearch
        );
      } else if (selection === 'Retry') {
        this.createTimeout(() => {
          this.installWebviewExtension(dependency, commandId);
        }, 1000);
      }
    } finally {
      this.installationInProgress.delete(dependency.extensionId);
    }
  }

  /**
   * Shows webview activation error with recovery options
   */
  async showWebviewActivationError(dependency, commandId, error) {
    const selection = await vscode.window.showErrorMessage(
      `❌ Failed to open "${dependency.displayName}" webview: ${
        error?.message || 'Unknown error'
      }`,
      'Retry',
      'Open Marketplace',
      'Check Extension'
    );

    if (selection === 'Retry') {
      this.createTimeout(() => {
        this.checkAndOpenWebview(commandId);
      }, 1000);
    } else if (selection === 'Open Marketplace') {
      vscode.commands.executeCommand(
        'workbench.extensions.search',
        dependency.marketplaceSearch
      );
    } else if (selection === 'Check Extension') {
      vscode.commands.executeCommand('workbench.view.extensions');
    }
  }

  /**
   * Registers webview check commands
   */
  registerWebviewCommands(context) {
    // Manual registration for specific commands to match extension.js
    const commandMappings = {
      'compare-code.openWebview': 'lynx-keymap.checkCompareCode',
    };

    const disposables = Object.keys(this.webviewExtensions).map((commandId) => {
      const checkCommandId =
        commandMappings[commandId] ||
        `lynx-keymap.check-${commandId.replace(/\./g, '-')}`;

      const disposable = vscode.commands.registerCommand(checkCommandId, () => {
        this.checkAndOpenWebview(commandId, context);
      });

      console.log(
        `Registered webview command: ${checkCommandId} -> ${commandId}`
      );
      return disposable;
    });

    context.subscriptions.push(...disposables);
    return disposables;
  }

  /**
   * Timeout management utilities
   */
  clearAllTimeouts() {
    this.activeTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.activeTimeouts.clear();
  }

  createTimeout(callback, delay) {
    const timeout = setTimeout(() => {
      this.activeTimeouts.delete(timeout);
      callback();
    }, delay);
    this.activeTimeouts.add(timeout);
    return timeout;
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.clearAllTimeouts();
    this.installationInProgress.clear();
    this.webviewInstances.clear();
  }
}

module.exports = SmartWebviewExtension;
