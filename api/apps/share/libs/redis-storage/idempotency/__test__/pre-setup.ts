import { Test } from '@nestjs/testing';
import { redisClient } from '@share/providers';
import ENVService from '@share/environment-config/env-config.service';
import IdempotencyRepository from '../idempotency.service';

const envService = {
  provide: ENVService,
  useValue: {
    Redis: { REDIS_SERVER_HOST: '', REDIS_SERVER_PORT: 0 },
  },
};

export default async () => {
  return Test.createTestingModule({
    providers: [IdempotencyRepository, redisClient, envService],
  })
    .compile();
};