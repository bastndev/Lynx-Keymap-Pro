const vscode = require('vscode');

class MacroManager {
  constructor() {
    this.isExecuting = false;
  }

  /**
   * Executes a sequence of commands with delays
   * @param {Array} commandSequence - Array of objects {command: string, delay?: number}
   */
  async executeSequence(commandSequence) {
    if (this.isExecuting) {
      vscode.window.showWarningMessage(
        'Macro already executing, please wait...'
      );
      return;
    }

    this.isExecuting = true;

    try {
      for (let i = 0; i < commandSequence.length; i++) {
        const step = commandSequence[i];

        await vscode.commands.executeCommand(step.command);

        if (step.delay && i < commandSequence.length - 1) {
          await this.delay(step.delay);
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Macro execution failed: ${error.message}`
      );
    } finally {
      this.isExecuting = false;
    }
  }

  /**
   * Toggle Agent Mode + Change icon color macro
   */
  async executeColorAndAgentMacro() {
    const sequence = [
      {
        command: 'workbench.action.chat.toggleAgentMode',
        delay: 10,
      },
      {
        command: 'lynx-keymap.cycleIconColor',
      },
    ];

    await this.executeSequence(sequence);
  }

  /**
   * Custom macro example
   */
  async executeCustomMacro() {
    const sequence = [
      { command: 'workbench.view.explorer', delay: 10 },
      { command: 'workbench.view.scm', delay: 10 },
      { command: 'workbench.view.extensions' },
    ];

    await this.executeSequence(sequence);
  }

  /**
   * Creates a delay
   * @param {number} ms - Milliseconds to wait
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Cancels macro execution
   */
  cancelExecution() {
    if (this.isExecuting) {
      this.isExecuting = false;
      vscode.window.showInformationMessage('Macro execution cancelled');
    }
  }
}

module.exports = MacroManager;