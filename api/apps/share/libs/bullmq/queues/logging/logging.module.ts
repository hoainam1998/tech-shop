import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EVENT_SOURCE_BULLMQ } from '@share/di-token';
import { QUEUE_NAME } from '@share/enums';
import AsyncLoggingModule from '@share/libs/logging/async-logging/async-logging.module';
import LoggingConsumer from './logging.consumer';
import LoggingService from './logging.service';

@Module({
  imports: [
    BullModule.registerQueue({
      configKey: EVENT_SOURCE_BULLMQ,
      name: QUEUE_NAME.LOGGING,
    }),
    AsyncLoggingModule,
  ],
  providers: [LoggingService, LoggingConsumer],
  exports: [LoggingService],
})
export default class LoggingModule {}
