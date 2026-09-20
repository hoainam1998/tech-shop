import { Global, Module } from '@nestjs/common';
import EnvironmentConfigModule from './environment-config/environment-config.module';
import ENVService from './environment-config/env-config.service';
import EventSourceModule from './libs/event-source/event-source.module';
import BullMqModule from './libs/bullmq/bullmq.module';
import LoggingModule from './libs/bullmq/queues/logging/logging.module';
import AlsModule from './libs/als/als.module';
import IdempotencyModule from './libs/redis-storage/idempotency/idempotency.module';
import RateLimitingModule from './libs/redis-storage/rate-limiting/rate-limiting.module';

@Global()
@Module({
  imports: [
    EnvironmentConfigModule,
    EventSourceModule,
    BullMqModule,
    LoggingModule,
    AlsModule,
    IdempotencyModule,
    RateLimitingModule,
  ],
  providers: [ENVService],
  exports: [
    ENVService,
    EventSourceModule,
    BullMqModule,
    LoggingModule,
    AlsModule,
    IdempotencyModule,
    RateLimitingModule,
  ],
})
export default class ShareModule {}
