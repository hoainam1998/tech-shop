/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import CategoryEventSourceService from '@share/libs/event-source/modules/category/category.service';
import LoggingService from '@share/libs/bullmq/queues/logging/logging.service';
import { PRISMA_CLIENT } from '@share/di-token';
import { queue } from '@share/test/pre-setup/mock/bullmq';
import MockPrismaClient from './prisma';

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
      provide: LoggingService,
      useValue: new LoggingService(queue),
    },
  ],
  exports: [LoggingService],
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
  imports: [EventSourceModule, LoggingModule],
  exports: [EventSourceModule, LoggingModule],
})
export default class ShareModule {}
