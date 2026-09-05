import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EVENT_SOURCE_BULLMQ } from '@share/di-token';
import { QUEUE_NAME } from '@share/enums';
import EventSourceConsumer from './event-source.consumer';

const BullModuleRegister = BullModule.registerQueue({
  configKey: EVENT_SOURCE_BULLMQ,
  name: QUEUE_NAME.EVENT_SOURCE,
});

@Module({
  imports: [BullModuleRegister],
  providers: [EventSourceConsumer],
  exports: [BullModuleRegister],
})
export default class EventSourceQueueModule {}
