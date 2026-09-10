import winston from 'winston';
import Logging from './logging';
import { consoleLog } from './winston';

/**
 * Console log.
 * @class
 */
export default class ConsoleLogging extends Logging {
  private logger!: winston.Logger;

  /**
   * Create console logging helper.
   * @param {string} context - The logger context.
   * @param {URL} file - The current file.
   */
  constructor(
    protected context: string,
    protected file: URL,
  ) {
    super();
    this.logger = consoleLog;
  }

  /**
   * Console log error message.
   * @param {string} message - The logging message.
   */
  error(message: string): void {
    this.logger.error('error', message, this.Info);
  }

  /**
   * Console log info message.
   * @param {string} message - The logging message.
   */
  log(message: string): void {
    this.logger.log('info', message, this.Info);
  }

  /**
   * Console log warning message.
   * @param {string} message - The logging message.
   */
  warn(message: string): void {
    this.logger.warn('warn', message, this.Info);
  }
}
