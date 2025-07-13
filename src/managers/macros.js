const vscode = require('vscode');
const { getLogger } = require('../core/logger');
const { MACRO_SEQUENCES, ERROR_MESSAGES, PERFORMANCE } = require('../core/config');

class MacroManager {
  constructor() {
    this.isExecuting = false;
    this.logger = getLogger();
    this.executionQueue = [];
  }

  /**
   * Executes a sequence of commands with delays
   * @param {Array} commandSequence - Array of objects {command: string, delay?: number}
   */
  async executeSequence(commandSequence) {
    if (this.isExecuting) {
      vscode.window.showWarningMessage(ERROR_MESSAGES.MACRO_ALREADY_RUNNING);
      return false;
    }

    if (!Array.isArray(commandSequence) || commandSequence.length === 0) {
      throw new Error('Invalid command sequence provided');
    }

    this.isExecuting = true;
    const executionId = `macro-sequence-${Date.now()}`;
    this.logger.startPerformance(executionId);

    try {
      this.logger.info(`Starting macro execution with ${commandSequence.length} commands`);

      for (let i = 0; i < commandSequence.length; i++) {
        const step = commandSequence[i];

        if (!step.command) {
          this.logger.warn(`Skipping empty command at step ${i + 1}`);
          continue;
        }

        this.logger.debug(`Executing step ${i + 1}: ${step.command}`);
        
        await vscode.commands.executeCommand(step.command);

        // Add delay if specified and not the last command
        if (step.delay && i < commandSequence.length - 1) {
          await this.delay(step.delay);
        }
      }

      const duration = this.logger.endPerformance(executionId);
      this.logger.info(`Macro sequence completed successfully in ${duration}ms`);

      return true;

    } catch (error) {
      const duration = this.logger.endPerformance(executionId);
      this.logger.error(`Macro execution failed after ${duration}ms`, error);
      
      vscode.window.showErrorMessage(
        `${ERROR_MESSAGES.MACRO_FAILED}: ${error.message}`
      );
      
      return false;

    } finally {
      this.isExecuting = false;
    }
  }

  /**
   * Toggle Agent Mode + Change icon color macro
   */
  async executeColorAndAgentMacro() {
    return this.executeSequence(MACRO_SEQUENCES.COLOR_AND_AGENT);
  }

  /**
   * Custom workspace tour macro
   */
  async executeCustomMacro() {
    return this.executeSequence(MACRO_SEQUENCES.CUSTOM_WORKSPACE_TOUR);
  }

  /**
   * Execute macro by name from predefined sequences
   * @param {string} macroName - Name of the macro to execute
   */
  async executePredefinedMacro(macroName) {
    const sequence = MACRO_SEQUENCES[macroName.toUpperCase()];
    
    if (!sequence) {
      throw new Error(`Unknown macro: ${macroName}`);
    }

    return this.executeSequence(sequence);
  }

  /**
   * Add macro to execution queue
   * @param {Array} commandSequence - Command sequence to queue
   */
  queueMacro(commandSequence) {
    this.executionQueue.push(commandSequence);
    this.logger.info(`Macro queued. Queue length: ${this.executionQueue.length}`);
  }

  /**
   * Execute all queued macros
   */
  async executeQueue() {
    if (this.isExecuting) {
      vscode.window.showWarningMessage('Cannot execute queue: macro already running');
      return false;
    }

    if (this.executionQueue.length === 0) {
      this.logger.debug('No macros in queue');
      return true;
    }

    const queueLength = this.executionQueue.length;
    let successCount = 0;

    this.logger.info(`Executing macro queue with ${queueLength} macros`);

    while (this.executionQueue.length > 0) {
      const sequence = this.executionQueue.shift();
      const success = await this.executeSequence(sequence);
      
      if (success) {
        successCount++;
      }

      // Small delay between macros
      await this.delay(PERFORMANCE.MACRO_DEFAULT_DELAY);
    }

    this.logger.info(`Queue execution completed: ${successCount}/${queueLength} successful`);

    return successCount === queueLength;
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
      this.logger.info('Macro execution cancelled by user');
      return true;
    }
    return false;
  }

  /**
   * Clear execution queue
   */
  clearQueue() {
    const clearedCount = this.executionQueue.length;
    this.executionQueue = [];
    this.logger.info(`Cleared ${clearedCount} macros from queue`);
  }

  /**
   * Get available predefined macros
   */
  getAvailableMacros() {
    return Object.keys(MACRO_SEQUENCES).map(key => ({
      name: key,
      commands: MACRO_SEQUENCES[key].length,
      sequence: MACRO_SEQUENCES[key],
    }));
  }

  /**
   * Get macro manager statistics
   */
  getStats() {
    return {
      isExecuting: this.isExecuting,
      queueLength: this.executionQueue.length,
      availableMacros: this.getAvailableMacros(),
    };
  }

  /**
   * Dispose macro manager resources
   */
  dispose() {
    this.cancelExecution();
    this.clearQueue();
    this.logger.info('Macro manager disposed');
  }
}

module.exports = MacroManager;