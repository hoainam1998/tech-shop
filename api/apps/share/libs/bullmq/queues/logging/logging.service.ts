import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { QUEUE_NAME, JOB_NAME } from '@share/enums';
import { LoggingPayloadType, AsyncLoggingJobData } from '@share/interfaces';
import { LogType } from 'generated/prisma/event-source';

@Injectable()
export default class LoggingService {
  private _context!: string;
  private _file!: URL;

  constructor(@InjectQueue(QUEUE_NAME.LOGGING) private readonly queue: Queue) {}

  create(context: string, file: URL): void {
    this._context = context;
    this._file = file;
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
    return this.queue.add(
      JOB_NAME.LOGGING,
      Object.assign(jobData, { payload, context: this._context, file: this._file }),
    );
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
