import winston from 'winston';
import Logging from './logging';
import { consoleLog } from './winston';

export enum CONSOLE_TYPE {
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
}

/**
 * Console log.
 * @class
 */
export default class ConsoleLogging extends Logging {
  private logger: winston.Logger;

  /**
   * Create console logging helper.
   * @param {string} context - The logger context.
   * @param {string} file - The current file.
   */
  constructor(
    protected context: string,
    protected file: string,
  ) {
    super();
    this.logger = consoleLog;
  }

  /**
   * Console log error message.
   * @param {string} message - The logging message.
   */
  error(message: string): void {
    this.logger.error(message, this.Info);
  }

  /**
   * Console log info message.
   * @param {string} message - The logging message.
   */
  log(message: string): void {
    this.logger.log(CONSOLE_TYPE.INFO, message, this.Info);
  }

  /**
   * Console log warning message.
   * @param {string} message - The logging message.
   */
  warn(message: string): void {
    this.logger.warn(message, this.Info);
  }
}
