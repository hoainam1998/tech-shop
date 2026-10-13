import { Module } from '@nestjs/common';
import CategoryEventSourceQueueService from './category.service';
import EventSourceQueueModule from '@share/libs/bullmq/queues/event-source/event-source.module';

@Module({
  imports: [EventSourceQueueModule],
  providers: [CategoryEventSourceQueueService],
  exports: [CategoryEventSourceQueueService],
})
export default class CategoryEventSourceQueueModule {}
