import { Module } from '@nestjs/common';
import { redisClient } from '@share/providers';
import RateLimitingRepository from './rate-limiting.service';

@Module({
  providers: [redisClient, RateLimitingRepository],
  exports: [RateLimitingRepository],
})
export default class RateLimitingModule {}
