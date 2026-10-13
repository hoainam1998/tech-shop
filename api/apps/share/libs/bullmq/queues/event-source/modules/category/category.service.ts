import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { JOB_NAME, QUEUE_NAME } from '@share/enums';
import { EventSourceJobData } from '@share/interfaces';

@Injectable()
export default class CategoryEventSourceQueueService implements OnModuleDestroy {
  constructor(@InjectQueue(QUEUE_NAME.EVENT_SOURCE) private queue: Queue) {}

  addJob(categoryJobData: EventSourceJobData): void {
    void this.queue.add(JOB_NAME.CATEGORY_MUTATION, categoryJobData);
  }

  async onModuleDestroy() {
    await this.queue.close();
  }
}
