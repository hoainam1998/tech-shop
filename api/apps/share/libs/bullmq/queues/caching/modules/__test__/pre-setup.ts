import { Test } from '@nestjs/testing';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import RedisClient from '@share/libs/redis-client/redis';
import CategoryCachingService from '@share/libs/bullmq/queues/caching/modules/category.service';
import { techShopPrisma } from '@share/test/pre-setup/mock/prisma';

const redisClientMock = RedisClient.Instance({
  Redis: {
    REDIS_SERVER_HOST: '',
    REDIS_SERVER_PORT: 0,
  },
} as any);

export default async () => {
  return Test.createTestingModule({
    providers: [CategoryCachingService],
  })
    .overrideProvider(CategoryCachingService)
    .useValue(new CategoryCachingService(redisClientMock, techShopPrisma, queue))
    .compile();
};
