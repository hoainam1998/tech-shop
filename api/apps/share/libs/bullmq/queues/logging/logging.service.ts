import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { randomUUID, UUID } from 'crypto';
import { LogType } from 'generated/prisma/event-source';
import { QUEUE_NAME, JOB_NAME } from '@share/enums';
import { LoggingPayloadType, AsyncLoggingJobData } from '@share/interfaces';

/**
 * Convert job payload to json.
 * @param data - The logging payload.
 * @returns The job payload.
 */
export const convertJobPayload = (data: AsyncLoggingJobData['payload']): LoggingPayloadType => {
  if (Array.isArray(data)) {
    return data.reduce((obj, value, index) => {
      obj[index] = value;
      return obj;
    }, {});
  }
  return data;
};

@Injectable()
export default class LoggingQueueService implements OnModuleDestroy {
  private readonly _loggers = new Map<string, any>();

  constructor(@InjectQueue(QUEUE_NAME.LOGGING) private readonly queue: Queue) {}

  /**
   * Collect pre logging information.
   * @param context - The context name.
   * @param file - The file address.
   */
  create(context: string, file: URL): UUID {
    const id = randomUUID();
    this._loggers.set(id, { context, file });
    return id;
  }

  /**
   * Remove basement logger information in store.
   * @param id - The logger id.
   */
  destroy(id: UUID): void {
    this._loggers.delete(id);
  }

  /**
   * Regis a logging process to consumer.
   * @param jobData - The input data.
   * @returns - The job register.
   */
  private addJob(jobData: AsyncLoggingJobData): Promise<Job<any, any>> | undefined {
    if (jobData.id) {
      const payload = convertJobPayload(jobData.payload);
      const { context, file } = this._loggers.get(jobData.id);
      return this.queue.add(JOB_NAME.LOGGING, Object.assign(jobData, { payload, context, file }));
    }
  }

  /**
   * Write an information record to log database.
   * @param jobData - The input data.
   */
  async log(jobData: AsyncLoggingJobData): Promise<void> {
    Object.assign(jobData, { type: LogType.INFO });
    await this.addJob(jobData);
  }

  /**
   * Write an error record to log database.
   * @param jobData - The input data.
   */
  async error(jobData: AsyncLoggingJobData): Promise<void> {
    Object.assign(jobData, { type: LogType.ERROR });
    await this.addJob(jobData);
  }

  /**
   * Write a warn record to log database.
   * @param jobData - The input data.
   */
  async warn(jobData: AsyncLoggingJobData): Promise<void> {
    Object.assign(jobData, { type: LogType.WARN });
    await this.addJob(jobData);
  }

  async onModuleDestroy() {
    await this.queue.close();
    this._loggers.clear();
  }
}
