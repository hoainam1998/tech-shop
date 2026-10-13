import { Test } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import ShareModule, { PrismaModule } from '@share/test/pre-setup/mock/modules';
import CategoryEventSourceQueueService from '@share/libs/bullmq/queues/event-source/modules/category/category.service';
import CategoryCachingService from '@share/libs/bullmq/queues/caching/modules/category.service';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import MockPrismaClient from '@share/test/pre-setup/mock/prisma';
import RedisClient from '@share/libs/redis-client/redis';
import CategoryController from '@modules/category/src/category.controller';
import CategoryService from '@modules/category/src/category.service';

const techShopMockPrismaClient = MockPrismaClient as any;
const redisClientMock = RedisClient.Instance({
  Redis: {
    REDIS_SERVER_HOST: '',
    REDIS_SERVER_PORT: 0,
  },
} as any);

@Module({
  providers: [CategoryEventSourceQueueService],
  exports: [CategoryEventSourceQueueService],
})
export class CategoryEventSourceQueueModule {}

@Module({
  providers: [CategoryCachingService],
  exports: [CategoryCachingService],
})
export class CachingQueueModule {}

export default () => {
  return Test.createTestingModule({
    imports: [ShareModule, PrismaModule, CategoryEventSourceQueueModule, CachingQueueModule],
    controllers: [CategoryController],
    providers: [CategoryService],
  })
    .overrideProvider(CategoryEventSourceQueueService)
    .useValue({
      addJob: jest.fn(),
    })
    .overrideProvider(CategoryCachingService)
    .useValue(new CategoryCachingService(redisClientMock, techShopMockPrismaClient, queue as any))
    .compile();
};
