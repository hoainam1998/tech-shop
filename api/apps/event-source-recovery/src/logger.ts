import winston from 'winston';
import { recoverLog } from '@share/libs/logging/winston';

export class Logger {
  private _name: string;
  private _logger?: winston.Logger;

  constructor(name: string) {
    this._name = name;
  }

  createLogger(): void {
    this._logger = recoverLog(this._name);
  }

  info(message: string): void {
    if (this._logger) {
      this._logger.info(message);
    }
  }

  error(error: Error | string) {
    if (this._logger) {
      if (typeof error === 'string') {
        this._logger.error(error);
      } else {
        this._logger.error(error.message);
      }
    }
  }
}

export const CategoryLogger = new Logger('category');
