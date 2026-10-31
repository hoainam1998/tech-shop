import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import request from 'supertest';
import { App } from 'supertest/types';
import { randomUUID } from 'crypto';
import { CATEGORY_SERVICE } from '@share/di-token';
import RateLimitingGuard from '@share/guards/rate-limiting.guard';
import IdempotencyInterceptor from '@share/interceptors/idempotency.interceptor';
import LoggingQueueService from '@share/libs/bullmq/queues/logging/logging.service';
import { GlobalValidatePipe } from '@share/pipes';
import { HttpExceptionFilter } from '@share/exception-filter';
import { GlobalTestingModule, MockIdempotencyInterceptor, MockRateLimitingGuard } from '@share/test/pre-setup/mock/modules';

export default async (module) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [module, GlobalTestingModule],
  })
    .overrideProvider(CATEGORY_SERVICE)
    .useValue({
      send: jest.fn(),
    })
    .overrideGuard(RateLimitingGuard)
    .useClass(MockRateLimitingGuard)
    .overrideInterceptor(IdempotencyInterceptor)
    .useClass(MockIdempotencyInterceptor)
    .overrideProvider(LoggingQueueService)
    .useValue({
      create: jest.fn().mockImplementation(() => randomUUID()),
      destroy: jest.fn(),
      addJob: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    })
    .compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(GlobalValidatePipe.getInstance());
  await app.listen(0);
  const clientProxy = app.get<ClientProxy>(CATEGORY_SERVICE);

  return {
    clientProxy,
    api: request(app.getHttpServer() as App),
    app,
  };
};
