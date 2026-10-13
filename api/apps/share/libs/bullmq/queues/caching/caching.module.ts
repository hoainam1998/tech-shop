import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { redisClient, techShopPgProvider } from '@share/providers';
import { EVENT_SOURCE_BULLMQ } from '@share/di-token';
import { QUEUE_NAME } from '@share/enums';
import CachingConsumer from './caching.consumer';
import CategoryCachingService from './modules/category.service';

@Module({
  imports: [
    BullModule.registerQueue({
      configKey: EVENT_SOURCE_BULLMQ,
      name: QUEUE_NAME.CACHING,
    }),
  ],
  providers: [CategoryCachingService, CachingConsumer, redisClient, techShopPgProvider],
  exports: [CategoryCachingService],
})
export default class CachingQueueModule {}
