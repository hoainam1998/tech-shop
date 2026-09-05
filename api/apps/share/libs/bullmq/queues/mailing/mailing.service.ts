import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JOB_NAME, QUEUE_NAME } from '@share/enums';
import { MailingJobData } from '@share/interfaces';

@Injectable()
export default class MailingService {
  constructor(@InjectQueue(QUEUE_NAME.MAILING) private readonly queue: Queue) {}

  addJob(data: MailingJobData): void {
    void this.queue.add(JOB_NAME.MAILING, data, { attempts: 1 });
  }
}
