import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { category } from 'generated/prisma/tech-shop';
import { REDIS_CLIENT, TECH_SHOP_PG_CONNECTOR } from '@share/di-token';
import RedisClient from '@share/libs/redis-client/redis';
import CacheAsideStrategy from '@share/libs/cache-strategies/cache-aside';
import type { PrismaClientReplica } from '@share/interfaces';
import { ENTITY_SERVICE_NAME, JOB_NAME, QUEUE_NAME } from '@share/enums';
import ConsoleLogging from '@share/libs/logging/console-logging';

// Type "current_file + Enter"
// @ts-expect-error: "import.meta.url" is not allow in CommonJS.
// So, I need put a comment to explain that, I write that code to reference to current file path.
// Using __filename only reference file complied!
const currentFilePath = import.meta.url;

@Injectable()
export default class CategoryCachingService extends CacheAsideStrategy implements OnModuleDestroy {
  private readonly consoleLog = new ConsoleLogging(CategoryCachingService.name, currentFilePath);

  constructor(
    @Inject(REDIS_CLIENT) protected readonly redisClient: RedisClient,
    @Inject(TECH_SHOP_PG_CONNECTOR) protected readonly prismaClient: PrismaClientReplica,
    @InjectQueue(QUEUE_NAME.CACHING) private readonly queue: Queue,
  ) {
    super(ENTITY_SERVICE_NAME.CATEGORY);
  }

  /**
   * Stored the categories to redis stored.
   * @param payload - The input categories.
   * @returns The redis result.
   */
  setItems(payload: category[]) {
    return this.redisClient.Client.multi()
      .json.set(this.Key, '$', payload)
      .expire(this.Key, 60 * 5)
      .exec()
      .catch((error: Error) => {
        this.consoleLog.error(error.message);
        throw error;
      });
  }

  /**
   * Add the category caching process to queue.
   * @param payload - The input categories.
   */
  addJob(payload: category[]): void {
    void this.queue.add(JOB_NAME.CATEGORY_CACHING, { name: this.Name, payload }, { attempts: 1 });
  }

  /**
   * Get all the categories have stored.
   * @returns Return the categories.
   */
  async getItems(): Promise<category[]> {
    try {
      if (await this.checkExist()) {
        return this.redisClient.Client.json.get(this.Key).then((results) => (results as category[]) || []);
      }

      return this.prismaClient.category
        .findMany({
          select: {
            category_id: true,
            name: true,
            icon: true,
          },
        })
        .then((categories) => {
          this.addJob(categories);
          return categories;
        });
    } catch (error) {
      this.consoleLog.error((error as Error).message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.queue.close();
  }
}
