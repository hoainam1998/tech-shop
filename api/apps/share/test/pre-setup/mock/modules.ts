/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  CallHandler,
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
  Module,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import AlsModule from '@share/libs/als/als.module';
import CategoryEventSourceService from '@share/libs/event-source/modules/category/category.service';
import LoggingQueueService from '@share/libs/bullmq/queues/logging/logging.service';
import { PRISMA_CLIENT } from '@share/di-token';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import MockPrismaClient from './prisma';
import AbortService from '@share/helpers/abort.service';

@Injectable()
export class MockRateLimitingGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

@Injectable()
export class MockIdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle();
  }
}

@Injectable()
export class MockTimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle();
  }
}

@Global()
@Module({
  imports: [AlsModule],
  providers: [LoggingQueueService, AbortService],
  exports: [AlsModule, LoggingQueueService, AbortService],
})
export class GlobalTestingModule {}

@Module({
  providers: [
    {
      provide: CategoryEventSourceService,
      useValue: {
        addPublisher: jest.fn(),
      },
    },
  ],
  exports: [CategoryEventSourceService],
})
export class EventSourceModule {}

@Module({
  providers: [
    {
      provide: LoggingQueueService,
      useValue: new LoggingQueueService(queue),
    },
  ],
  exports: [LoggingQueueService],
})
export class LoggingModule {}

@Module({
  providers: [
    {
      provide: PRISMA_CLIENT,
      useValue: MockPrismaClient,
    },
  ],
  exports: [PRISMA_CLIENT],
})
export class PrismaModule {}

@Module({
  imports: [EventSourceModule, LoggingModule, AlsModule],
  exports: [EventSourceModule, LoggingModule, AlsModule],
})
export default class ShareModule {}
