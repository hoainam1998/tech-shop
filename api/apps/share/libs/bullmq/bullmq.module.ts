import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { createNodeRedisClient } from 'bullmq';
import { createClient } from 'redis';
import { EVENT_SOURCE_BULLMQ } from '@share/di-token';
import ENVService from '@share/environment-config/env-config.service';

@Module({
  imports: [
    BullModule.forRootAsync(EVENT_SOURCE_BULLMQ, {
      inject: [ENVService],
      useFactory: (envService: ENVService) => {
        return {
          connection: createNodeRedisClient(
            createClient({
              socket: {
                host: envService.BullMqRedis.BULLMQ_SERVER_HOST,
                port: envService.BullMqRedis.BULLMQ_SERVER_PORT,
              },
            }),
          ),
          defaultJobOptions: {
            removeOnComplete: { age: 3600, count: 1000 },
            removeOnFail: { age: 7200, count: 1000 },
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        };
      },
    }),
  ],
})
export default class BullMq {}
