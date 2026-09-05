import { Module } from '@nestjs/common';
import PrismaModule from '@share/libs/prisma/prisma.module';
import CategoryController from './category.controller';
import CategoryService from './category.service';
import ShareModule from '@share/share.module';
import CategoryEventSourceQueueModule from '@share/libs/bullmq/queues/event-source/modules/category/category.module';
import CachingQueueModule from '@share/libs/bullmq/queues/caching/caching.module';

@Module({
  imports: [ShareModule, PrismaModule, CategoryEventSourceQueueModule, CachingQueueModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export default class CategoryModule {}
