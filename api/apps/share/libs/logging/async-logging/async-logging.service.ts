import { PrismaClient } from 'generated/prisma/event-source';
import AsyncLogger from './async-logger';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import { OnModuleDestroy } from '@nestjs/common';

/**
 * Logging helper class.
 * @class
 */
export default class AsyncLoggingService implements OnModuleDestroy {
  private readonly loggers: Map<string, AsyncLogger> = new Map();

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
    if (!this.loggers.has(id)) {
      const logger = new AsyncLogger(this.eventSourceDatabase, this.mailingService, context, file, {});
      this.loggers.set(id, logger);
    }
  }

  getLogger(id: string): AsyncLogger | undefined {
    return this.loggers.get(id);
  }

  onModuleDestroy() {
    this.loggers.clear();
  }
}
