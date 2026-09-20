import { Module } from '@nestjs/common';
import { redisClient } from '@share/providers';
import IdempotencyRepository from './idempotency.service';

@Module({
  providers: [redisClient, IdempotencyRepository],
  exports: [IdempotencyRepository],
})
export default class IdempotencyModule {}
