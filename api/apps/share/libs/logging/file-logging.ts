import winston from 'winston';
import Logging from './logging';
import { recoverLog } from './winston';

/**
 * Log information to a file.
 * @class
 */
export default class FileLogging extends Logging {
  private logger!: winston.Logger;

  /**
   * Create file logging helper.
   * @param {string} context - The logger context.
   * @param {URL} file - The current file.
   */
  constructor(
    protected context: string,
    protected file: URL,
  ) {
    super();
    this.logger = recoverLog(super.Context);
  }

  /**
   * Write error message to log file.
   * @param {string} message - The logging message.
   */
  error(message: string): void {
    this.logger.error(message, this.Info);
  }

  /**
   * Write info message to log file.
   * @param {string} message - The logging message.
   */
  log(message: string): void {
    this.logger.log(message, this.Info);
  }

  /**
   * Write warning message to log file.
   * @param {string} message - The logging message.
   */
  warn(message: string): void {
    this.logger.warn(message, this.Info);
  }
}
