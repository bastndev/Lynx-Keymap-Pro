const vscode = require('vscode');

class ExtensionChecker {
  constructor() {
    this.extensionDependencies = {
      'workbench.view.extension.f1-functions': {
        extensionId: 'bastndev.f1',
        displayName: 'F1-Quick Switch',
        marketplaceSearch: 'bastndev.f1',
      },
      'gitlens.showGraph': {
        extensionId: 'eamodio.gitlens',
        displayName: 'GitLens',
        marketplaceSearch: 'eamodio.gitlens',
      },
    };
    this.activeTimeouts = new Set();
    this.installationInProgress = new Set();
  }

  async checkAndExecuteCommand(commandId, context) {
    const dependency = this.extensionDependencies[commandId];
    if (!dependency) {
      return vscode.commands.executeCommand(commandId);
    }

    const extension = vscode.extensions.getExtension(dependency.extensionId);
    if (!extension) {
      this.showExtensionRequiredNotification(dependency, commandId);
      return;
    }

    try {
      if (!extension.isActive) {
        await extension.activate();
      }
      await vscode.commands.executeCommand(commandId);
    } catch (error) {
      this.showExtensionActivationError(dependency, commandId, error);
    }
  }

  showExtensionRequiredNotification(dependency, commandId) {
    const message = `📥 The extension "${dependency.displayName}" is required for this command`;
    vscode.window
      .showInformationMessage(message, 'Install Extension', 'Cancel')
      .then((selection) => {
        if (selection === 'Install Extension') {
          this.installExtension(dependency, commandId);
        }
      });
  }

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

  showTemporaryNotification(message, duration = 2000) {
    // Clear any existing timeouts to prevent overlapping notifications
    this.clearAllTimeouts();

    // Show the notification
    vscode.window.showInformationMessage(message);

    // The timeout is just for internal tracking, notifications auto-dismiss
    this.createTimeout(() => {
      // Notification will disappear naturally after VSCode's default duration
    }, duration);
  }

  async installExtension(dependency, commandId) {
    // Prevent multiple installations of the same extension
    if (this.installationInProgress.has(dependency.extensionId)) {
      return;
    }

    this.installationInProgress.add(dependency.extensionId);

    try {
      // Show downloading message
      vscode.window.showInformationMessage(
        `📥 Downloading ${dependency.displayName}...`
      );

      // Simulate download time (like original)
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // Install extension
      await vscode.commands.executeCommand(
        'workbench.extensions.installExtension',
        dependency.extensionId
      );

      // Wait for extension to be available
      let attempts = 0;
      const maxAttempts = 10;
      while (attempts < maxAttempts) {
        const extension = vscode.extensions.getExtension(
          dependency.extensionId
        );
        if (extension) break;

        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      // Show success message (this will replace the downloading message visually)
      vscode.window.showInformationMessage(
        `✅ ${dependency.displayName} installed successfully`
      );

      // Execute the original command after success message shows
      this.createTimeout(() => {
        this.checkAndExecuteCommand(commandId);
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
          this.installExtension(dependency, commandId);
        }, 1000);
      }
    } finally {
      this.installationInProgress.delete(dependency.extensionId);
    }
  }

  async showExtensionActivationError(dependency, commandId, error) {
    const selection = await vscode.window.showErrorMessage(
      `❌ Failed to activate "${dependency.displayName}": ${
        error?.message || 'Unknown error'
      }`,
      'Retry',
      'Open Marketplace'
    );

    if (selection === 'Retry') {
      this.createTimeout(() => {
        this.checkAndExecuteCommand(commandId);
      }, 1000);
    } else if (selection === 'Open Marketplace') {
      vscode.commands.executeCommand(
        'workbench.extensions.search',
        dependency.marketplaceSearch
      );
    }
  }

  registerCheckCommands(context) {
    Object.keys(this.extensionDependencies).forEach((commandId) => {
      const checkCommandId = `lynx-keymap.check-${commandId.replace(/\./g,'-')}`;
      const disposable = vscode.commands.registerCommand(checkCommandId, () => {
        this.checkAndExecuteCommand(commandId, context);
      });
      context.subscriptions.push(disposable);
    });
  }

  dispose() {
    this.clearAllTimeouts();
    this.installationInProgress.clear();
  }
}

module.exports = ExtensionChecker;
