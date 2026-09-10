import { OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/event-source';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import AsyncLogger from './async-logger';

/**
 * Logging helper class.
 * @class
 */
export default class AsyncLoggingService implements OnModuleDestroy {
  private readonly _loggers: Map<string, AsyncLogger> = new Map();

  /**
   * Logging system message.
   * @param {PrismaClient} eventSourceDatabase - The database instance.
   * @param {MailingService} mailingService - The mailing service.
   */
  constructor(
    private readonly eventSourceDatabase: PrismaClient,
    private readonly mailingService: MailingService,
  ) {}

  /**
   * Create an async logger (child logger).
   * @param {string} id - The logger id.
   * @param {string} context - The logging context.
   * @param {URL} file - The current file.
   * @returns {AsyncLogger} The async logger.
   */
  create(id: string, context: string, file: URL): void {
    if (!this._loggers.has(id)) {
      const logger = new AsyncLogger(this.eventSourceDatabase, this.mailingService, context, file, {});
      this._loggers.set(id, logger);
    }
  }

  getLogger(id: string): AsyncLogger | undefined {
    return this._loggers.get(id);
  }

  onModuleDestroy() {
    this._loggers.clear();
  }
}
