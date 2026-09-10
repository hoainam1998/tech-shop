import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/event-source';
import { EVENT_SOURCE_PG_CONNECTOR } from '@share/di-token';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import AsyncLoggingService from './async-logging.service';

@Injectable()
export default class AsyncLoggingManager implements OnModuleDestroy {
  private readonly _loggers: Map<string, AsyncLoggingService> = new Map();

  constructor(
    @Inject(EVENT_SOURCE_PG_CONNECTOR) private readonly eventSourceDatabase: PrismaClient,
    private readonly mailingService: MailingService,
  ) {}

  /**
   * Get existed child logger or create one if it not exist.
   * @param {string} requestId - The logger id.
   * @returns {AsyncLoggingService} - The parent logger.
   */
  getLogger(requestId: string): AsyncLoggingService {
    if (this._loggers.has(requestId)) {
      return this._loggers.get(requestId)!;
    }

    const logger = new AsyncLoggingService(this.eventSourceDatabase, this.mailingService);
    this._loggers.set(requestId, logger);
    return logger;
  }

  onModuleDestroy() {
    this._loggers.clear();
  }
}
