/**
 * Enhanced logging system for Lynx Keymap Extension
 * Provides structured logging with different levels and performance metrics
 */

const vscode = require('vscode');
const { EXTENSION_NAME } = require('./config');

class Logger {
  constructor() {
    this.outputChannel = vscode.window.createOutputChannel(EXTENSION_NAME);
    this.isDebugMode = false;
    this.performanceMarks = new Map();
  }

  /**
   * Enable debug mode
   */
  enableDebug() {
    this.isDebugMode = true;
    this.info('Debug mode enabled');
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    this._log('INFO', message, data);
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    this._log('WARN', message, data);
    console.warn(`[${EXTENSION_NAME}] ${message}`, data || '');
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    this._log('ERROR', message, error);
    console.error(`[${EXTENSION_NAME}] ${message}`, error || '');
    
    if (error instanceof Error) {
      vscode.window.showErrorMessage(`${EXTENSION_NAME}: ${message}`);
    }
  }

  /**
   * Log debug message (only in debug mode)
   */
  debug(message, data = null) {
    if (this.isDebugMode) {
      this._log('DEBUG', message, data);
    }
  }

  /**
   * Start performance measurement
   */
  startPerformance(label) {
    this.performanceMarks.set(label, Date.now());
    this.debug(`Performance start: ${label}`);
  }

  /**
   * End performance measurement and log duration
   */
  endPerformance(label) {
    const startTime = this.performanceMarks.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.debug(`Performance end: ${label} - ${duration}ms`);
      this.performanceMarks.delete(label);
      return duration;
    }
    return 0;
  }

  /**
   * Log command execution
   */
  logCommand(commandName, success = true, duration = null) {
    const status = success ? 'SUCCESS' : 'FAILED';
    const durationText = duration ? ` (${duration}ms)` : '';
    this.info(`Command ${status}: ${commandName}${durationText}`);
  }

  /**
   * Internal logging method
   */
  _log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    this.outputChannel.appendLine(logMessage);
    
    if (data) {
      this.outputChannel.appendLine(`Data: ${JSON.stringify(data, null, 2)}`);
    }

    // Also log to console in development
    if (this.isDebugMode) {
      console.log(`[${EXTENSION_NAME}] ${logMessage}`, data || '');
    }
  }

  /**
   * Show output panel
   */
  show() {
    this.outputChannel.show();
  }

  /**
   * Clear output channel
   */
  clear() {
    this.outputChannel.clear();
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.outputChannel.dispose();
    this.performanceMarks.clear();
  }
}

// Singleton instance
let loggerInstance = null;

/**
 * Get logger instance (singleton)
 */
function getLogger() {
  if (!loggerInstance) {
    loggerInstance = new Logger();
  }
  return loggerInstance;
}

module.exports = {
  Logger,
  getLogger,
};