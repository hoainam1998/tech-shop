import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { category } from 'generated/prisma/tech-shop';
import { REDIS_CLIENT, TECH_SHOP_PG_CONNECTOR } from '@share/di-token';
import RedisClient from '@share/libs/redis-client/redis';
import CacheAsideStrategy from '@share/libs/bullmq/queues/caching/strategies/cache-aside';
import type { PrismaClientReplica } from '@share/interfaces';
import { ENTITY_SERVICE_NAME, JOB_NAME, QUEUE_NAME } from '@share/enums';

@Injectable()
export default class CategoryService extends CacheAsideStrategy {
  constructor(
    @Inject(REDIS_CLIENT) protected readonly redisClient: RedisClient,
    @Inject(TECH_SHOP_PG_CONNECTOR) protected readonly prismaClient: PrismaClientReplica,
    @InjectQueue(QUEUE_NAME.CACHING) private readonly queue: Queue,
  ) {
    super(ENTITY_SERVICE_NAME.CATEGORY);
  }

  setItems(payload: category[]): void {
    void this.redisClient.Client.multi()
      .json.set(this.Key, '$', payload)
      .expire(this.Key, 60 * 5)
      .exec();
  }

  addJob(payload: category[]): void {
    void this.queue.add(JOB_NAME.CATEGORY_CACHING, { name: this.Name, payload }, { attempts: 1 });
  }

  async getItems(): Promise<category[]> {
    if (await this.checkExist()) {
      return await this.redisClient.Client.json.get(this.Key).then((results) => (results as category[]) || []);
    }

    return await this.prismaClient.category.findMany().then((categories) => {
      this.addJob(categories);
      return categories;
    });
  }
}
