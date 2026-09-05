import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/event-source';
import { EVENT_SOURCE_PG_CONNECTOR } from '@share/di-token';
import AsyncLoggingService from './async-logging.service';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';

@Injectable()
export default class AsyncLoggingManager implements OnModuleDestroy {
  private readonly loggers: Map<string, AsyncLoggingService> = new Map();

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
    if (this.loggers.has(requestId)) {
      return this.loggers.get(requestId)!;
    }

    const logger = new AsyncLoggingService(this.eventSourceDatabase, this.mailingService);
    this.loggers.set(requestId, logger);
    return logger;
  }

  onModuleDestroy() {
    this.loggers.clear();
  }
}
