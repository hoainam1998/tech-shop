import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { QUEUE_NAME, JOB_NAME } from '@share/enums';
import { LoggingPayloadType, AsyncLoggingJobData } from '@share/interfaces';
import { LogType } from 'generated/prisma/event-source';
import LoggingConsumer from './logging.consumer';

@Injectable()
export default class LoggingService {
  private _id: string;
  constructor(
    @InjectQueue(QUEUE_NAME.LOGGING) private readonly queue: Queue,
    private readonly loggingConsumer: LoggingConsumer,
  ) {
    this._id = randomUUID();
  }

  create(context: string, file: URL): void {
    this.loggingConsumer.create(this._id, context, file);
  }

  /**
   * Convert job payload to json.
   * @param data - The logging payload.
   * @returns The job payload.
   */
  private convertJobPayload(data: AsyncLoggingJobData['payload']): LoggingPayloadType {
    if (Array.isArray(data)) {
      return data.reduce((obj, value, index) => {
        obj[index] = value;
        return obj;
      }, {});
    }
    return data;
  }

  private addJob(jobData: AsyncLoggingJobData): Promise<Job<any, any>> {
    const payload = this.convertJobPayload(jobData.payload);
    return this.queue.add(JOB_NAME.LOGGING, Object.assign(jobData, { payload, id: this._id }));
  }

  async log(jobData: AsyncLoggingJobData): Promise<void> {
    Object.assign(jobData, { type: LogType.INFO });
    await this.addJob(jobData);
  }

  async error(jobData: AsyncLoggingJobData): Promise<void> {
    Object.assign(jobData, { type: LogType.ERROR });
    await this.addJob(jobData);
  }

  async warn(jobData: AsyncLoggingJobData): Promise<void> {
    Object.assign(jobData, { type: LogType.WARN });
    await this.addJob(jobData);
  }
}
