import { PrismaClient, LogType } from 'generated/prisma/event-source';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import { LoggingJobData } from '@share/interfaces';
import AsyncLogger from './async-logger';

/**
 * Logging helper class.
 * @class
 */
export default class AsyncLoggingService {
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
   * @param {string} context - The logging context.
   * @param {URL} file - The current file.
   * @returns {AsyncLogger} The async logger.
   */
  create(context: string, file: URL): AsyncLogger | undefined {
    return new AsyncLogger(this.eventSourceDatabase, this.mailingService, context, file, {});
  }

  /**
   * Write log to database.
   * @param {LoggingJobData} job - A job data.
   */
  write(job: LoggingJobData): void {
    const logger = this.create(job.context!, job.file!);
    switch (job.type) {
      case LogType.INFO:
        logger?.log(job.message, job.func, job.payload);
        break;
      case LogType.ERROR:
        logger?.error(job.message, job.func, job.payload);
        break;
      case LogType.WARN:
        logger?.warn(job.message, job.func, job.payload);
        break;
      default:
        break;
    }
  }
}
