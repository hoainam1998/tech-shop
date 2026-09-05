import { LogType, PrismaClient, Prisma } from 'generated/prisma/event-source';
import type { LoggingPayloadType } from '@share/interfaces';
import MailingService from '@share/libs/bullmq/queues/mailing/mailing.service';
import Logging from '../logging';
import ConsoleLogging from '../console-logging';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url as URL;

/**
 * Logging helper class.
 * @class
 */
export default class AsyncLogging extends Logging {
  private consoleLog?: ConsoleLogging;

  /**
   * Logging system message into a database.
   * @param {PrismaClient} db - The database instance.
   * @param {MailingService} mailingService - The bullmq mailing service.
   * @param {string} context - The message context.
   * @param {URL} file - A current file path.
   * @param {Record<string, any>} - The user requested.
   */
  constructor(
    private readonly db: PrismaClient,
    private readonly mailingService: MailingService,
    protected readonly context: string,
    protected readonly file: URL,
    private readonly userRequested: Record<string, any>,
  ) {
    super();
    this.consoleLog = new ConsoleLogging(this.constructor.name, currentFilePath);
  }

  protected get Info() {
    return {
      ...super.Info,
      user_requested: this.userRequested,
    };
  }

  /**
   * Insert log into to database.
   * @param data - The input data.
   * @param select - The select items.
   */
  private insertLogToDb(
    data: Pick<Prisma.logCreateInput, 'type' | 'payload' | 'func' | 'message'>,
    select?: Prisma.logSelect,
  ): void {
    select = Object.assign(select || {}, { at: true });
    this.db.log
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
   */
  log(message: string, func: string, payload: LoggingPayloadType): void {
    this.insertLogToDb({ type: LogType.INFO, payload, func, message });
  }

  /**
   * Insert error message to database table.
   * @param {string} message - A message.
   * @param {string} func - A function name.
   * @param {LoggingPayloadType} - A parameters of parent function.
   */
  error(message: string, func: string, payload: LoggingPayloadType): void {
    this.insertLogToDb({ type: LogType.ERROR, payload, func, message });
  }

  /**
   * Insert warning message to database table.
   * @param {string} message - A message.
   * @param {string} func - A function name.
   * @param {LoggingPayloadType} - A parameters of parent function.
   */
  warn(message: string, func: string, payload: LoggingPayloadType): void {
    this.insertLogToDb({ type: LogType.WARN, payload, func, message });
  }
}
