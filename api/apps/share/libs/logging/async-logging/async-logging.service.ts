import { PrismaClient, LogType } from 'generated/prisma/event-source';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import { LoggingJobData } from '@share/interfaces';
import { logTypeInvalidError, loggerNotDefinedError } from '@share/helpers/errors';
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
   * @private
   * @param {string} context - The logging context.
   * @param {URL} file - The current file.
   * @returns {AsyncLogger} The async logger.
   */
  private create(context: string, file: string): AsyncLogger {
    return new AsyncLogger(this.eventSourceDatabase, this.mailingService, context, file, {});
  }

  /**
   * Write log to database.
   * @param job - A job data.
   * @return The result process logging.
   */
  write(job: LoggingJobData): Promise<any> {
    const logger = this.create(job.context!, job.file!);
    if (logger) {
      switch (job.type) {
        case LogType.INFO:
          return logger.log(job.message, job.func, job.payload);
        case LogType.ERROR:
          return logger.error(job.message, job.func, job.payload);
        case LogType.WARN:
          return logger.warn(job.message, job.func, job.payload);
        default:
          return Promise.reject(logTypeInvalidError);
      }
    }
    return Promise.reject(loggerNotDefinedError);
  }
}
