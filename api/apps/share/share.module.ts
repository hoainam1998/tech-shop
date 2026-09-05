import { Global, Module } from '@nestjs/common';
import EnvironmentConfigModule from './environment-config/environment-config.module';
import ENVService from './environment-config/env-config.service';
import EventSourceModule from './libs/event-source/event-source.module';
import BullMqModule from './libs/bullmq/bullmq.module';
import LoggingModule from './libs/bullmq/queues/logging/logging.module';

@Global()
@Module({
  imports: [EnvironmentConfigModule, EventSourceModule, BullMqModule, LoggingModule],
  providers: [ENVService],
  exports: [ENVService, EventSourceModule, BullMqModule, LoggingModule],
})
export default class ShareModule {}
