import { Provider } from '@nestjs/common';
import { PrismaClient as TechShopPrismaClient } from 'generated/prisma/tech-shop';
import { PrismaClient as EventSourcePrismaClient } from 'generated/prisma/event-source';
import { REDIS_CLIENT } from './di-token';
import RedisClient from './libs/redis-client/redis';
import { EVENT_SOURCE_PG_CONNECTOR, TECH_SHOP_PG_CONNECTOR } from '@share/di-token';
import { PrismaPg } from '@prisma/adapter-pg';
import ENVService from './environment-config/env-config.service';

export const redisClient: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (envService: ENVService) => {
    return RedisClient.Instance(envService);
  },
  inject: [ENVService],
};

export const techShopPgProvider = {
  provide: TECH_SHOP_PG_CONNECTOR,
  useFactory: (envService: ENVService) => {
    const adapter = new PrismaPg({
      connectionString: envService.Database.DATABASE_URL,
    });
    return new TechShopPrismaClient({ adapter });
  },
  inject: [ENVService],
};

export const eventSourcePgProvider = {
  provide: EVENT_SOURCE_PG_CONNECTOR,
  useFactory: (envService: ENVService) => {
    const adapter = new PrismaPg(
      {
        connectionString: envService.EventSource.EVENT_SOURCE_DATABASE_URL,
      },
      {
        schema: envService.EventSource.SCHEMA_NAME,
      },
    );
    return new EventSourcePrismaClient({ adapter });
  },
  inject: [ENVService],
};
