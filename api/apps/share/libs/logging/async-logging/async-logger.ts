import { LogType, PrismaClient, Prisma, log } from 'generated/prisma/event-source';
import type { LoggingPayloadType } from '@share/interfaces';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import Logging from '../logging';
import ConsoleLogging from '../console-logging';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url;

/**
 * Logging helper class.
 * @class
 */
export default class AsyncLogging extends Logging {
  private readonly consoleLog: ConsoleLogging = new ConsoleLogging(AsyncLogging.name, currentFilePath);

  /**
   * Logging system message into a database.
   * @param {PrismaClient} db - The database instance.
   * @param {MailingService} mailingService - The bullmq mailing service.
   * @param {string} context - The message context.
   * @param {string} file - A current file path.
   * @param {Record<string, any>} userRequested - The user requested.
   */
  constructor(
    private readonly db: PrismaClient,
    private readonly mailingService: MailingService,
    protected readonly context: string,
    protected readonly file: string,
    private readonly userRequested: Record<string, any>,
  ) {
    super();
  }

  /**
   * Return collected base information logging.
   * @protected
   */
  protected get Info() {
    return {
      ...super.Info,
      user_requested: this.userRequested,
    };
  }

  /**
   * Insert log into to database.
   * @private
   * @param data - The input data.
   * @param select - The select items.
   * @returns - The promise holding the log result.
   */
  private insertLogToDb(
    data: Pick<Prisma.logCreateInput, 'type' | 'payload' | 'func' | 'message'>,
    select?: Prisma.logSelect,
  ): Promise<log> {
    select = Object.assign(select || {}, { at: true });
    return this.db.log
      .create({
        data: {
          ...data,
          ...this.Info,
          at: new Date(),
        },
        select,
      })
      .then((result) => {
        this.mailingService.addJob({ ...data, ...this.Info, at: result.at });
        return result;
      })
      .catch((error: Error) => {
        this.consoleLog?.error(error.message);
        throw error;
      });
  }

  /**
   * Insert info message to database table.
   * @param {string} message - A message.
   * @param {string} func - A function name.
   * @param {LoggingPayloadType} payload - A parameters of parent function.
   * @returns - The promise holding the log result.
   */
  log(message: string, func: string, payload: LoggingPayloadType): Promise<log> {
    return this.insertLogToDb({ type: LogType.INFO, payload, func, message });
  }

  /**
   * Insert error message to database table.
   * @param {string} message - A message.
   * @param {string} func - A function name.
   * @param {LoggingPayloadType} payload - A parameters of parent function.
   * @returns - The promise holding the log result.
   */
  error(message: string, func: string, payload: LoggingPayloadType): Promise<log> {
    return this.insertLogToDb({ type: LogType.ERROR, payload, func, message });
  }

  /**
   * Insert warning message to database table.
   * @param {string} message - A message.
   * @param {string} func - A function name.
   * @param {LoggingPayloadType} payload - A parameters of parent function.
   * @returns - The promise holding the log result.
   */
  warn(message: string, func: string, payload: LoggingPayloadType): Promise<log> {
    return this.insertLogToDb({ type: LogType.WARN, payload, func, message });
  }
}
