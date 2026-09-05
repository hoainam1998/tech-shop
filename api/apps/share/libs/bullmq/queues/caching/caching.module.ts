import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { redisClient, techShopPgProvider } from '@share/providers';
import { EVENT_SOURCE_BULLMQ } from '@share/di-token';
import { QUEUE_NAME } from '@share/enums';
import CachingConsumer from './caching.consumer';
import CategoryService from './modules/category.service';

@Module({
  imports: [
    BullModule.registerQueue({
      configKey: EVENT_SOURCE_BULLMQ,
      name: QUEUE_NAME.CACHING,
    }),
  ],
  providers: [CategoryService, CachingConsumer, redisClient, techShopPgProvider],
  exports: [CategoryService],
})
export default class CachingQueueModule {}
