import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { JOB_NAME, QUEUE_NAME } from '@share/enums';
import { EventSourceJobData } from '@share/interfaces';

@Injectable()
export default class CategoryEventSourceQueueService {
  constructor(@InjectQueue(QUEUE_NAME.EVENT_SOURCE) private queue: Queue) {}

  async addJob(categoryJobData: EventSourceJobData) {
    await this.queue.add(JOB_NAME.CATEGORY_MUTATION, categoryJobData);
  }
}
